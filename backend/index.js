const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');
const status=require('express-status-monitor')



app.use(status())
app.use(cors())
require('dotenv').config()
app.use(bodyParser.json());
app.use(express.static('Public'));


// app.use((req,res,next)=>{
//     console.log("Request URL"+ req.url)
//     next()
// })




require('./Connection')

const userRoutes=require('./routes/UserRoutes');
// const staffRoutes=require('./routes/StaffRoutes');
const uploadRoutes=require('./routes/UploadRoutes');

app.use(userRoutes)
// app.use(staffRoutes)
app.use(uploadRoutes);

app.listen(3000,()=>{
    console.log(`App listening on port 3000`)
})
