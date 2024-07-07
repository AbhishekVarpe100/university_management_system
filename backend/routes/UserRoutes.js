const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../models/User');
const Staff=require('../models/Staff');
const jwt=require('jsonwebtoken');
const path=require('path')

require("../Connection");

const secretKey='mysecretkey';

router.post("/register", async (req, res) => {
  const { username, email, password,type} = await req.body;

  if(type=='staff'){          //

    const existingStaff=await Staff.findOne({$or:[{username},{email}]});
    if(existingStaff){
      res.json('user_exist').status(409);
    }
    else{
  
      const hashPassword=await bcrypt.hash(password,10);
      const newStaff=await new Staff({username,email,password:hashPassword});
      newStaff.save();
      res.json('user_saved').status(201);
    } 

  }


  else if(type=='student'){
    const existingUser=await User.findOne({$or:[{username},{email}]});
      if(existingUser){
    res.json('user_exist').status(409);
  }
      else{

    const hashPassword=await bcrypt.hash(password,10);
    const newUser=await new User({username,email,password:hashPassword});
    newUser.save();
    res.json('user_saved').status(201);
  }  
  }
  

  
});



router.post('/login',async (req,res)=>{


 const {type,username,password}=req.body;

 if(type=='staff'){
  const staff=await Staff.findOne({username})
 if(staff){
  const isMatch=await bcrypt.compare(password,staff.password);
  if(isMatch){
    const userName=staff.username;
    const email=staff.email;
    jwt.sign({userName,email},secretKey,{expiresIn:'1m'},(err,token)=>{
      if(err){
        console.log(err)
      }
      else{
        res.json({token:token,message:'login_success_staff',userName,email,type
      }).status(200);
      }
    })
  }
  else{
    res.json('incorrect password').status(401);
  }
 }
 else{
  res.json('user not found').status(404);
 }

 }

 else if(type=='student'){


  const user=await User.findOne({username})
  if(user){
   const isMatch=await bcrypt.compare(password,user.password);
   if(isMatch){
     const userName=user.username;
     const email=user.email;
     jwt.sign({userName,email},secretKey,{expiresIn:'1h'},(err,token)=>{
       if(err){
         console.log(err)
       }
       else{
         res.json({token:token,message:'login_success_user',userName,email,type
         }).status(200);
       }
     })
   }
   else{
     res.json('incorrect password').status(401);
   }
  }
  else{
   res.json('user not found').status(409); 
  }
 }

 else if(type=='admin'){

  const email='admin@academiahub@gmail.com';

  if(username=='admin@academiahub_uni'){

    if(password=='admin_1200'){
      jwt.sign({username,email},secretKey,{expiresIn:'1h'},(err,token)=>{
        if(err){
          console.log(err)
        }
        else{
          res.json({token:token,message:'login_success_admin',userName:username,email,type}).status(200)
        }
      })
      
    }
    else{
      res.json('incorrect password');
    }
  }
  else{
    res.json('user not found');
  }  

 }
})

router.post('/getprofile',verifyToken, (req,res)=>{
  jwt.verify(req.token,secretKey,(err,authData)=>{ //req.token is passed from the verifyToken middleware
    if(err){
      res.json({result:"invalid token"}).status(401)
    }
    else{
      res.json({message:"profile_accessed",authData}).status(200);
    }
  })

})

router.post('/staff',verifyToken, (req,res)=>{
  jwt.verify(req.token,secretKey,(err,authData)=>{ //req.token is passed from the verifyToken middleware
    if(err){
      res.json({result:"invalid token"}).status(401);
    }
    else{
      res.json({message:"profile_accessed",authData}).status(200);
    }
  })
})

router.post('/admin',verifyToken, (req,res)=>{
  jwt.verify(req.token,secretKey,(err,authData)=>{ //req.token is passed from the verifyToken middleware
    if(err){
      res.json({result:"invalid token"}).status(401);
    }
    else{
      res.json({message:"profile_accessed",authData}).status(200);
    }
  })
})

function verifyToken(req,res,next){            //middleware function
  const bearerHeader=req.body.token_header;
  if(typeof bearerHeader!=='undefined'){
    const bearer=bearerHeader.split(" ");
    const token=bearer[1];
    req.token=token;
    next();
  }
  else{
    res.json({
      result:"token is not valid"  // it will show when the token is not available i.e empty
    }).status(401);
  }
}



router.post('/getprofile_data',async (req,res)=>{
  const {username,email,type}=req.body;
  console.log(username,email,type);
  if(type=='student'){
    const user=await User.findOne({username,email})
    res.json(user);
  }
  else if(type=='staff'){
    const user=await Staff.findOne({username,email})
    res.json(user);
  }
  else if(type=='admin'){
  }
})

// router.get('/download_res', (req, res) => {
//   const filePath = path.join(__dirname, '../models/User.js');
//   res.download(filePath, 'index.js', (err) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error occurred while downloading the file');
//     }
//   });
// });

// const handleDownload = async () => {
//   try {
//     const response = await axios({
//       url: 'http://localhost:3000/download_res',
//       method: 'GET',
//       responseType: 'blob', // Important
//     });

//     // Create a link element, set its href to the blob URL, and trigger a download
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'index.js'); // Set the desired file name
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   } catch (error) {
//     console.error('Error downloading the file:', error);
//   }
// };







module.exports = router;
