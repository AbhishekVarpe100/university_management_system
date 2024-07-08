const express = require("express");
const router = express.Router();
const path=require('path');
const multer=require('multer');
const User = require('../models/User');
const fs=require('fs');
const Staff=require('../models/Staff');
const connection=require('../Connection');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "Public/Profile_Images")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload=multer({
    storage:storage
})


router.post('/upload_photo',upload.single('file'),async (req,res)=>{
    if(req.body.type=='student'){
        await User.updateOne({_id:req.body.id},{$set:{photo:req.file.filename}});
        res.json('uploaded');
        console.log(req.body)
    }
    else if(req.body.type=='staff'){
        await Staff.updateOne({_id:req.body.id},{$set:{photo:req.file.filename}});
        res.json('uploaded');
    }
    
})

router.post('/edit_photo',upload.single('file'),async (req,res)=>{
    if(req.body.type=='student'){

       const file= await User.findOne({_id:req.body.id},{photo:1,_id:0})

        fs.unlink(`Public/Profile_Images/${file.photo}`,(err)=>{
            if(err){
                console.log("Something wrong");
            }
            console.log("File deleted");
        });
        await User.updateOne({_id:req.body.id},{$set:{photo:req.file.filename}});
        // console.log(file.photo);
        res.json('uploaded');

    }
    else if(req.body.type=='staff'){
        const file= await Staff.findOne({_id:req.body.id},{photo:1,_id:0})

        fs.unlink(`Public/Profile_Images/${file.photo}`,(err)=>{
            if(err){
                console.log("Something wrong");
            }
            console.log("File deleted");
        });
        await Staff.updateOne({_id:req.body.id},{$set:{photo:req.file.filename}});
        // console.log(file.photo);
        res.json('uploaded');
    }
    
})

module.exports=router;

