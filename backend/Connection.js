const MONGODB_URI = 'mongodb://0.0.0.0:27017/university';
const mongoose=require('mongoose');

const connection=mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));