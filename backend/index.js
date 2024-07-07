const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');
app.use(cors())
require('dotenv').config()
app.use(bodyParser.json());

require('./Connection')

const userRoutes=require('./routes/UserRoutes');
// const staffRoutes=require('./routes/StaffRoutes');

app.use(userRoutes)
// app.use(staffRoutes)

app.listen(3000,()=>{
    console.log(`App listening on port 3000`)
})
