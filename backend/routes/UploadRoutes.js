const express = require("express");
const router = express.Router();
const path=require('path');
const multer=require('multer');
const User = require('../models/User');
const fs=require('fs');
const Staff=require('../models/Staff');
const connection=require('../Connection');
const Placement = require("../models/Placements");
const Blog = require('../models/Blog')

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


const placement_storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "Public/Placement_Images")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const placement_upload=multer({
    storage:placement_storage
})

router.post('/create_placement',placement_upload.single('file'),async(req,res)=>{
    const {name,package_,company}=req.body;
    const file=req.file.filename;
    const newPlacement=new Placement({name,package_,photo:file,company});
    newPlacement.save();
    res.json("created");
})


const blog_storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "Public/Blog_Images")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const blog_upload=multer({
    storage:blog_storage
})

router.post('/add_blog',blog_upload.single('file'),async(req,res)=>{
    const {title,description}=req.body;
    const file=req.file.filename;
    const blog= new Blog({title,description,image:file});
    blog.save();
    res.json("blog created");
})

module.exports=router;

