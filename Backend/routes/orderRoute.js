const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { requireAuth, ownerOnly } = require('../middleware/auth');

const ORDER_STATUSES = Order.schema.path('status').enumValues;

const releaseStock = async (reserved) => {
  const toRelease = reserved.splice(0);
  await Promise.all(
    toRelease.map((r) =>
      Product.updateOne({ _id: r.product }, { $inc: { stock: r.quantity } })
    )
  );
};

router.post('/orders', requireAuth, async (req, res) => {
  const reserved = [];

  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart empty!, order can't be placed." });
    }

    const quantities = new Map();
    for (const item of items) {
      const qty = Number(item.quantity);
      if (!mongoose.isValidObjectId(item.product) || !Number.isInteger(qty) || qty <= 0) {
        return res.status(400).json({ message: "Invalid item in cart." });
      }
      const key = String(item.product);
      quantities.set(key, (quantities.get(key) || 0) + qty);
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const [productId, qty] of quantities) {
      const product = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      ).select('-image');

      if (!product) {
        const existing = await Product.findById(productId).select('name stock');
        await releaseStock(reserved);

        if (!existing) {
          return res.status(404).json({ message: "Product not found." });
        }
        return res.status(400).json({
          success: false,
          isOutOfStockError: true,
          message: `Sorry!, '${existing.name}' is out of stock! (Available stock: ${existing.stock})`
        });
      }

      reserved.push({ product: product._id, quantity: qty });
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: qty
      });
      totalAmount += product.price * qty;
    }

    const newOrder = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount: Math.round(totalAmount * 100) / 100,
      status: "Pending"
    });

    res.status(201).json({
      success: true,
      message: "Order successfully placed and stock updated!",
      order: newOrder
    });

  } catch (error) {
    await releaseStock(reserved).catch(() => {});
    res.status(500).json({ message: error.message || "Server error, order failed." });
  }
});

router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    if (req.user.role !== 'owner' && String(req.user.id) !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const userOrders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders: userOrders
    });

  } catch (error) {
    res.status(500).json({ message: "error to bring order." });
  }
});

router.get('/admin/stats', ownerOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email role isAdmin')
      .sort({ createdAt: -1 });

    const totalSales = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
    const completedOrders = orders.filter((o) => o.status === 'Delivered').length;

    res.status(200).json({
      success: true,
      stats: {
        totalSales: totalSales,
        totalOrders: orders.length,
        pendingOrders: pendingOrders,
        completedOrders: completedOrders
      },
      recentOrders: orders
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch('/status/:id', ownerOnly, async (req, res) => {
  try {
    const { status } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${ORDER_STATUSES.join(', ')}`
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid order id" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found!" });
    }

    if (order.status === 'Cancelled' && status !== 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: "Cancelled orders can't be reopened."
      });
    }

    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      await Promise.all(
        order.items.map((item) =>
          Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })
        )
      );
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status successfully updated!",
      order: order
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;