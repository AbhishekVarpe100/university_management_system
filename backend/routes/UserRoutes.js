const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const cache=require('node-cache')
const User = require('../models/User');
const Notice = require('../models/Announcement');
const Staff=require('../models/Staff');
const Contact=require('../models/Contact');
const Blog = require('../models/Blog')
const jwt=require('jsonwebtoken');
const path=require('path')
const fs=require('fs');
const Placement = require("../models/Placements");
const Video = require("../models/Video");
const Course = require("../models/Course");
const Admission =require("../models/Admission");
const { isDate } = require("util/types");
const Subject = require("../models/Subjects");
const Exam = require("../models/Exam");
const Hall_tickets=require('../models/Hall_tickets');
const PDFDocument=require('pdfkit');
const Result = require("../models/Result");
const Messages = require("../models/Messages");
const nodeCache=new cache({stdTTL:60,checkperiod:120})

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
    jwt.sign({userName,email},secretKey,{expiresIn:'1h'},(err,token)=>{
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
  if(type=='student'){
    const user=await User.findOne({username,email})
    res.json(user);
  }
  else if(type=='staff'){
    const user=await Staff.findOne({username,email})
    res.json(user);
  }
})  



router.post('/change_theme', async (req, res) => {
  const { theme, username, email } = req.body;
  try {
    const result = await User.updateOne({ username, email }, { $set: { theme } });

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'User not found or theme already set to the same value.' });
    }

    res.status(200).json({ message: 'Theme updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating theme.', error });
  }
});


router.get('/get_theme',async(req,res)=>{
  try{
    const user=await User.findOne({username:req.query.username,email:req.query.email});
    res.json(user.theme)
  }
  catch(err){
    console.log(err);
  }
})



router.post('/delete_photo',async (req,res)=>{
  const {id,type,photo}=req.body;
  if(type=='student'){
    fs.unlink(`Public/Profile_Images/${photo}`,(err)=>{
      if(err){
        console.log(err)
      }
    })
    await User.updateOne({_id:id},{$unset:{photo:"",}})
    res.json("deleted student");
  }
  else if(type=='staff'){
    fs.unlink(`Public/Profile_Images/${photo}`,(err)=>{
      if(err){
        console.log(err)
      }
    })
    await Staff.updateOne({_id:id},{$unset:{photo:"",}})
    res.json("deleted staff");
  }
})

router.get('/delete_info',async(req,res)=>{
  const {id,type}=req.query;
  if(type=='student'){
    await User.findByIdAndDelete(id);
    res.json("deleted")
  }
  else if(type=='staff'){
    await Staff.findOneAndDelete(id);
    res.json("deleted")
  }
})

router.post('/edit_info',async(req,res)=>{
  const {id,username,email,type}=req.body;
  if(type=='student'){
    await User.updateOne({_id:id},{$set:{username:username,email:email}})
    res.json("Edited student")
  }
  else if(type=='staff'){
    await Staff.updateOne({_id:id},{$set:{username:username,email:email}})
    res.json("Edited staff")

  }

})



router.post('/create_notice',async(req,res)=>{
  const notice=req.body.notice;
  nodeCache.del('data');
  const newNotice=new Notice({notice});
  newNotice.save();
  res.json("response");
})

router.get('/get_notices',async(req,res)=>{
  const data=await Notice.find();
  if(nodeCache.get('data')){
    res.json(JSON.parse(nodeCache.get('data'))).status(200)
    console.log("Cache data")
  }
  else {
    res.json(data).status(200)
    nodeCache.set('data',JSON.stringify(data));
    console.log("Real data")
  }
})

router.post('/delete_notice',async(req,res)=>{
  const id=req.body.id;
  nodeCache.del('data');
  await Notice.findByIdAndDelete(id);
  res.json("deleted");
})


router.post('/get_placements_data',async(req,res)=>{
  const data=await Placement.find();
  res.json(data)
})

router.post('/delete_placement_info',async(req,res)=>{
  const id=req.body.id;
  const photo=await Placement.findOne({ _id: id }, { photo: 1 });
  await fs.unlinkSync(`Public/Placement_Images/${photo.photo}`)
  await Placement.findByIdAndDelete(id);
  res.json("deleted");
 
})

router.post('/get_blogs_data',async(req,res)=>{
  const data=await Blog.find();
  res.json(data)
})

router.post('/delete_blog_info',async(req,res)=>{
  const id=req.body.id;
  const photo=await Blog.findOne({ _id: id }, { image: 1 });
  await fs.unlinkSync(`Public/Blog_Images/${photo.image}`)
  await Blog.findByIdAndDelete(id);
  res.json("deleted");
 
})

router.post('/get_videos',async(req,res)=>{
  let data= await Video.find();
  res.json(data)
})


router.delete('/delete_video',async(req,res)=>{
  const id=req.body.id;
  const videoFile=await Video.findOne({_id:id},{video:1});
  await fs.unlinkSync(`Public/Videos/${videoFile.video}`);
  await Video.findByIdAndDelete(id);
  res.json('deleted')
})



router.post('/users_query',async (req,res)=>{   
  const {name,email,phone,course,message,username,user_email}=req.body;
  function formatISTDate(date) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    };
  
    const formattedDate = date.toLocaleString('en-IN', options);
    
    // Split date and time
    const [datePart, timePart] = formattedDate.split(', ');
  
    // Replace month name to lower case and combine
    return `${datePart.toLowerCase()}`;
  }
  
  const istDate = new Date(new Date().getTime() + (5 * 60 + 30) * 60000);
  const formattedISTDate = formatISTDate(istDate);

console.log(formattedISTDate)
  const newQuery =await  new Contact({name:name,email:email,phone:phone,course:course,message:message,
    username:username,user_email:user_email, timestamp:formattedISTDate});
  newQuery.save();
  res.json('Send');
})


router.get('/get_queries',async(req,res)=>{
  let data=await Contact.find({username:req.query.username,user_email:req.query.email})
  res.json(data)
})

router.get('/get_queries_all',async(req,res)=>{
  let data=await Contact.find();
  res.json(data)
})

router.post('/reply',async (req,res)=>{
  const {id,reply}=req.body;
  await Contact.findByIdAndUpdate({_id:id},{$set:{admin_reply:reply}});
  res.json("Reply send");
})


router.delete('/delete_query/:id',async (req,res)=>{
  const id=req.params.id;
  await Contact.findByIdAndDelete(id);
  res.json("Deleted")
})



router.post('/add_course',async(req,res)=>{
  let {courseName,fees,perYearFees}=req.body;
  const newCourse =await  new Course({course_name:courseName,fees,perYearFees})
  newCourse.save();
  res.json('Course added');
})

router.get('/get_courses',async(req,res)=>{
  const data=await Course.find();
  res.json(data);
})


router.delete('/delete_course/:id',async(req,res)=>{
  const id=req.params.id;
  await Course.findByIdAndDelete(id);
  res.json("Course deleted");
})

router.post('/add_admission',async(req,res)=>{
  const {course,name,marks_10,marks_12,username,email}=req.body;
  const new_admission=await Admission({username,email,course,name,percent_10th:marks_10,percent_12th:marks_12});

  new_admission.save();
  res.json({msg:'Submitted'})
  
})

router.get('/get_admission_data',async (req,res)=>{
  let ad_data=await Admission.find({username:req.query.username,email:req.query.email});
  res.json({admission_data:ad_data})
})

router.get('/get_admission_data_all',async (req,res)=>{
  let ad_data=await Admission.find();
  res.json({admission_data:ad_data})
})

router.delete('/delete_admission/:id',async (req,res)=>{
    await Admission.findByIdAndDelete({_id:req.params.id});
    res.json("delete");
})

router.put('/approve',async(req,res)=>{
  const id=req.body.id;
  await Admission.findByIdAndUpdate({_id:id},{$set:{status:'approve'}});
  res.json('updated');
})

router.put('/not_approve',async(req,res)=>{
  const id=req.body.id;
  await Admission.findByIdAndUpdate({_id:id},{$set:{status:'not_approve'}});
  res.json('updated');
})

router.post('/add_sub',async(req,res)=>{
  const {sub,marks}=req.body;
  const sub_to_add=await new Subject({sub_name:sub,marks});
  sub_to_add.save();
  res.json('added')
})

router.get('/get_sub_data',async(req,res)=>{
  const data=await Subject.find();
  res.json(data);
  console.log("He")
})

router.delete('/delete_sub/:id',async(req,res)=>{
  await Subject.findByIdAndDelete({_id:req.params.id});
  res.json("deleted");
})

router.post('/apply_exam',async(req,res)=>{
  const {username,email,name,course,prn,sub1,sub2,sub3,sub4,sub5,sub6,sub7}=req.body;
  const new_application=await Exam({username,email,name,course,prn,sub1,sub2,sub3,sub4,sub5,sub6,sub7});
  new_application.save();
  res.json("applied");
})

router.get('/get_exam_data/:username/:email',async(req,res)=>{
  const {username,email}=req.params;
  const data=await Exam.find({username,email});
  res.json(data)
})

router.delete('/delete_exam_application/:id',async (req,res)=>{
  const id=req.params.id;
  await Exam.findByIdAndDelete(id)
  res.json("deleted")

})

router.get('/get_exam_data',async(req,res)=>{
  const data=await Exam.find();
  res.json(data);
})

router.post('/release_hallticket',async(req,res)=>{
  const id=req.body.id;
  const data=await Exam.find({_id:id});
  await Exam.findByIdAndUpdate({_id:id},{$set:{hallticket_status:true}})
  const student = {
    username: data[0].username,
    email: data[0].email,
    name: data[0].name,
    course: data[0].course,
    prn: data[0].prn,
    subjects: [
      data[0].sub1,
      data[0].sub2,
      data[0].sub3,
      data[0].sub4,
      data[0].sub5,
      data[0].sub6,
      data[0].sub7
    ]
};

// Create a PDF document
const doc = new PDFDocument();

// Pipe the PDF into a writable stream
const file=`${data[0].prn}_hall_ticket.pdf`;
doc.pipe(fs.createWriteStream(file));
const hallTicket=await Hall_tickets({username:data[0].username,email:data[0].email,pdfFile:file});
hallTicket.save();

let borderWidth = 2;
let borderColor='black';
let margin = 20;

doc.lineWidth(borderWidth)
   .strokeColor(borderColor)
   .rect(margin, margin, doc.page.width - 2 * margin, doc.page.height - 2 * margin)
   .stroke();

// Add document title
doc.fontSize(30).fillColor('red').text('AcademiaHub University',{align:'center'})
doc.fontSize(20).fillColor('blue').text('Student Hall Ticket', { align: 'center'});

// Add some spaces
doc.moveDown(2);

// Add student details
doc.fontSize(14);
doc.text(`Name: ${student.name}`);
doc.text(`Course: ${student.course}`);
doc.text(`PRN: ${student.prn}`);
doc.text(`Email: ${student.email}`);

// Add some space
doc.moveDown(2);

// Add subject list
doc.text('Subjects:', { underline: true });
student.subjects.forEach((subject, index) => {
    doc.text(`${index + 1}. ${subject}`);
});

doc.moveDown(4);
doc.text('Principle sign :')
doc.moveDown(2)
doc.text('HOD sign :')
doc.moveDown(2)
doc.text('Student sign :')

// Finalize the PDF and end the stream
doc.end();

console.log('PDF generated successfully!');
  
})

router.post('/set_status',async(req,res)=>{
  const id=req.body.id;
  await Exam.findByIdAndUpdate({_id:id},{$set:{hallticket_status:true}})
  console.log(id)
})

router.get('/confirm_hallticket',async(req,res)=>{
  const {username,email}=req.query;
  const data=await Hall_tickets.find({username,email});
  if(data.length==0){
    res.json({msg:'not present'});
  }
  else{
    res.json({msg:'present'});
  }
})

router.get('/download_hallticket', async(req, res) => {
  const {username,email}=req.query;
  const data=await Hall_tickets.find({username,email});
  // console.log(data[0].pdfFile);
  const filePath = path.join(__dirname, `../${data[0].pdfFile}`);
  res.download(filePath, `${data[0].pdfFile}`, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error occurred while downloading the file');
    }
  });
});


router.get('/stud_exam_data',async(req,res)=>{
  const id=req.query.id;
  const data=await Exam.findById(id);
  res.json(data);
})


router.post('/create_result',async(req,res)=>{
  const studentData = req.body;
  await Exam.findByIdAndUpdate({_id:studentData._id},{$set:{result_status:true}});

  

  const generateStudentResultPDF = (studentData, outputPath) => {
    const doc = new PDFDocument();
  
    // Pipe the PDF to a writable stream
    doc.pipe(fs.createWriteStream(outputPath));
  
    // Add a border to the entire page
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();
  
    // Title
    doc.fontSize(25).text('AcademiaHub University', {
      align: 'center',
    });
    doc.moveDown();
    doc.fontSize(20).text('Student Result', {
      align: 'center',
    });
  
    doc.moveDown();
  
    // Student Information
    doc.fontSize(12).text(`Name: ${studentData.name}`);
    doc.text(`PRN: ${studentData.prn}`);
    doc.text(`Course: ${studentData.course}`);
    doc.text(`Email: ${studentData.email}`);
    doc.moveDown();
  
    // Draw Table Header
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Subject', 100, doc.y, { continued: true });
    doc.text('Marks', 350, doc.y);
    doc.moveDown();

    // Draw a line under the header
    doc.moveTo(80, doc.y).lineTo(doc.page.width - 80, doc.y).stroke();
    doc.moveDown(0.5);
  
    // Table Content
    doc.font('Helvetica');
    const subjects = [
      { name: studentData.sub1, marks: studentData.sub1m },
      { name: studentData.sub2, marks: studentData.sub2m },
      { name: studentData.sub3, marks: studentData.sub3m },
      { name: studentData.sub4, marks: studentData.sub4m },
      { name: studentData.sub5, marks: studentData.sub5m },
      { name: studentData.sub6, marks: studentData.sub6m },
      { name: studentData.sub7, marks: studentData.sub7m },
    ];
  
    subjects.forEach((subject) => {
      doc.text(subject.name, 100, doc.y + 10, { continued: true });
      doc.text(subject.marks, 350, doc.y);
      doc.moveDown(0.5);

      // Draw a line after each row
      doc.moveTo(80, doc.y).lineTo(doc.page.width - 80, doc.y).stroke();
      doc.moveDown(0.5);
    });
  
    // Footer
    doc.moveDown(2);
    // doc.fontSize(12).text('Hall Ticket Status: ' + (studentData.hallticket_status ? 'Issued' : 'Not Issued'), {
    //   align: 'right',
    // });

    var totalMarks=Number.parseInt(studentData.sub1m)+Number.parseInt(studentData.sub2m)+Number.parseInt(studentData.sub3m)+Number.parseInt(studentData.sub4m)+Number.parseInt(studentData.sub5m)+Number.parseInt(studentData.sub6m)+Number.parseInt(studentData.sub7m);

    doc.text(`Total marks : ${totalMarks} / 700`);
    // doc.text(`Percentage : ${String(totalMarks/7).slice(0,5)}`);

    doc.text(`Percentage : ${(totalMarks/7)<35 ? '_': (((studentData.sub1m<35 || studentData.sub2m<35 ||studentData.sub3m<35 ||studentData.sub4m<35 ||studentData.sub5m<35 ||studentData.sub6m<35 ||studentData.sub7m<35)?'_':`${String(totalMarks/7).slice(0,5)}`))}`)
    doc.text(`Result : ${(totalMarks/7)<35 ? 'Fail': (((studentData.sub1m<35 || studentData.sub2m<35 ||studentData.sub3m<35 ||studentData.sub4m<35 ||studentData.sub5m<35 ||studentData.sub6m<35 ||studentData.sub7m<35)?'Fail':'Pass'))}`)

    doc.text(`${(totalMarks/7)<35?'Better luck next time !':(((studentData.sub1m <35 || studentData.sub2m<35 ||studentData.sub3m<35 ||studentData.sub4m<35 ||studentData.sub5m<35 ||studentData.sub6m<35 ||studentData.sub7m<35)?'Better luck next time !':'Congratulations! you are passed.'))}`,{align:"center"});

    const addResult=Result({username:studentData.username,email:studentData.email,name:studentData.name,course:studentData.course,prn:studentData.prn,sub1:studentData.sub1,sub1m:studentData.sub1m,sub2:studentData.sub2,sub2m:studentData.sub2m,sub3:studentData.sub3,sub3m:studentData.sub3m,sub4:studentData.sub4,sub4m:studentData.sub4m,sub5:studentData.sub5,sub5m:studentData.sub5m,sub6:studentData.sub6,sub6m:studentData.sub6m,sub7:studentData.sub7,sub7m:studentData.sub7m,total:totalMarks,percent:(totalMarks/7)<35 ? '_': (((studentData.sub1m<35 || studentData.sub2m<35 ||studentData.sub3m<35 ||studentData.sub4m<35 ||studentData.sub5m<35 ||studentData.sub6m<35 ||studentData.sub7m<35)?'_':`${String(totalMarks/7).slice(0,5)}`)),result:(totalMarks/7)<35 ? 'Fail': (((studentData.sub1m<35 || studentData.sub2m<35 ||studentData.sub3m<35 ||studentData.sub4m<35 ||studentData.sub5m<35 ||studentData.sub6m<35 ||studentData.sub7m<35)?'Fail':'Pass')),result_file:outputPath})
  
    addResult.save();
  
    // Finalize the PDF and end the stream
    doc.end();
  };


 

  // Output PDF path
  const outputPath = `${studentData.prn}_result.pdf`;
  
  // Generate the PDF
  generateStudentResultPDF(studentData, outputPath);
  
  console.log('PDF generated successfully.');
  res.json("Hello")
})

router.get('/get_result',async(req,res)=>{
  const prn=req.query.prn;
  const data=await Result.find({prn})
  res.json({data:data});
  console.log("He")
})




router.get('/download_result', async(req, res) => {
  const {file}=req.query;
  const filePath = path.join(__dirname, `../${file}`);
  res.download(filePath, `${file}`, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error occurred while downloading the file');
    }
  });
});


router.get('/admission_data',async(req,res)=>{
  const data=await Admission.find();
  res.json(data);
})


router.get('/getMsg',async(req,res)=>{
  const data=await Messages.find({username:req.query.username});
  res.json(data)
})

router.get('/getMsgs',async(req,res)=>{
  const data=await Messages.find();
  res.json(data);
})





// const handleDownload = async () => {
//   try {
//     const response = await axios({
//       url: 'http://localhost:3000/download_hallticket',
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
