const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../models/User');
const jwt=require('jsonwebtoken');
const path=require('path')

require("../Connection");

const secretKey='mysecretkey';

module.exports=router;




router.post("/register", async (req, res) => {
    const { username, email, password } = await req.body;
  
    const existingUser=await User.findOne({$or:[{username},{email}]});
    if(existingUser){
      res.json('user_exist');
    }
    else{
  
      const hashPassword=await bcrypt.hash(password,10);
      const newUser=await new User({username,email,password:hashPassword});
      newUser.save();
      res.json('user_saved');
    }  
  });