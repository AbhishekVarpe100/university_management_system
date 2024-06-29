const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../models/User');
const jwt=require('jsonwebtoken');
const path=require('path')

require("../Connection");

const secretKey='mysecretkey';

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



router.post('/login',async (req,res)=>{
 const {type,username,password}=req.body;
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
        res.json({token:token,message:'login_success',userName,email
        });
      }
    })
  }
  else{
    res.json('incorrect password');
  }
 }
 else{
  res.json('user not found')
 }

})


router.post('/profile',verifyToken, (req,res)=>{
  jwt.verify(req.token,secretKey,(err,authData)=>{ //req.token is passed from the verifyToken middleware
    if(err){
      res.json({result:"invalid token"})
    }
    else{
      res.json({message:"profile_accessed",authData});
    }
  })

})


function verifyToken(req,res,next){            //middleware function
  const bearerHeader=req.body.token_header;
  if(typeof bearerHeader!=='undefined'){
    const bearer=bearerHeader.split(" ");
    // console.log(bearer[0]);
    const token=bearer[1];
    req.token=token;
    next();
  }
  else{
    res.json({
      result:"token is not valid"  // it will show when the token is not available i.e empty
    })
  }

}




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
