const express = require('express');
const router = express.Router();
const userModel=require('../models/userModel')
const bcrypt=require('bcrypt')

router.post('/Create', async(req, res) => {
   
   try{
     let {name,email,password}=req.body;
     const existingUser=await userModel.findOne({email:email})
    if(existingUser){
        return res.status(404).json({message:"something went wrong"})
    }
    const salt=await bcrypt.genSalt(10)
    const hashedPassword= await bcrypt.hash(password,salt);

    const CreatedUser= await userModel.create({
        name,
        email,
        password:hashedPassword
    })
    res.send("succes")
   }catch(err){
    res.status(403).json({message:"something went wrong"})
   }
});

module.exports = router;