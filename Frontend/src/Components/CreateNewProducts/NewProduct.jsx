import React from "react";
import { ImagePlus, Tag, DollarSign, Plus } from "lucide-react";

const NewProduct = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">

        {/* Form Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

          {/* Header */}
          <div className="border-b border-slate-100 px-6 py-7 sm:px-9">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                <ImagePlus size={28} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                  Create New Product
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Add a new product to your store.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            className="space-y-6 px-6 py-8 sm:px-9"
            action="/products"
            method="POST"
            encType="multipart/form-data"
          >

            {/* Product Image */}
            <div>
              <label
                htmlFor="productImage"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Product Image <span className="text-red-500">*</span>
              </label>

              <label
                htmlFor="productImage"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 transition hover:border-blue-400 hover:bg-blue-50/50"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <ImagePlus size={28} />
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  Click to upload image
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  PNG, JPG or JPEG
                </span>

                <input
                  type="file"
                  id="productImage"
                  name="productImage"
                  accept="image/*"
                  required
                  className="sr-only"
                />
              </label>
            </div>

            {/* Product Name */}
            <div>
              <label
                htmlFor="productName"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Product Name <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <Tag
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  id="productName"
                  name="productName"
                  placeholder="Enter product name"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Product Price */}
            <div>
              <label
                htmlFor="productPrice"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Product Price <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <DollarSign
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  id="productPrice"
                  name="productPrice"
                  placeholder="Enter product price"
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl active:scale-95"
            >
              <Plus size={21} />
              Create Product
            </button>

          </form>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Fill in the product details carefully before submitting.
        </p>

      </div>
    </div>
  );
};

export default NewProduct;
