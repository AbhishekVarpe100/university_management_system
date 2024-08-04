import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux';
import axios from 'axios';
function Examinations() {


  const username=useSelector((state)=>state.username);
  const email=useSelector((state)=>state.email);
  const [adData,setData]=useState([]);
  const [subData,setSubData]=useState([]);
  const [data, setData_] = useState([]);
  const [formData,setFormData]=useState({
    course:'',
    sub1:'',
    sub2:'',
    sub3:'',
    sub4:'',
    sub5:'',
    sub6:'',
    sub7:''
  })

  const handleFormData=(e)=>{
    const {name,value}=e.target;
    setFormData({...formData,[name]:value});
    console.log(formData)
  }


  const getData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/get_courses');
      setData_(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const get_ad_data=async()=>{
    const res=await axios.get('http://localhost:3000/get_admission_data',{params:{username,email}});
    setData(res.data.admission_data);
  }
  const get_sub_data=async()=>{
    const res=await axios.get('http://localhost:3000/get_sub_data');
    setSubData(res.data);
  }

  const handleSubmit=(e)=>{
    e.preventDefault();
    console.log(formData)
  }

  useEffect(()=>{
    get_ad_data();
    get_sub_data();
    getData();
  })

  return (  
    <div>

      {
        adData.length>0 ? (!adData[0].status?<div className='bg-red-100 m-6 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert'><strong>Your application is pending for admission. After approval you can apply for the exam.</strong></div>:(adData[0].status=='not_approve'?<div className='bg-red-100 border m-6 border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert'><strong>You can't apply for the exam as your application is not processed for some reason.</strong></div>:
        
        <div>


<div className='m-4'>Apply for Examination</div>

<form onSubmit={handleSubmit} className="space-y-6 p-6 m-6 bg-gray-200 shadow-md rounded-lg">
<div className='flex flex-col'>
<b>Select your course</b>
<select className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required name='course' onChange={handleFormData}>
      <option value="">--- Select course ---</option>
      {data.length > 0 ? (
        data.map((course) => (
          <option key={course._id} value={course.course_name}>
            {course.course_name}
          </option>
        ))
      ) : (
        <option disabled>No courses available</option>
      )}
    </select>


<center className='font-bold text-red-500'>Theory subjects</center>
<b>Select subject 1 (Theory)</b>
<select required name='sub1' onChange={handleFormData} className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
<option value="">--- Select subject 1 (Theory) ---</option>
{subData.length>0 ? <>

  {subData.map((sub)=>(
    <option key={sub._id} value={sub.sub_name}> {sub.sub_name}</option>
  ))}
    
</>:<option disabled>No data found</option>}
</select>

<b>Select subject 2 (Theory)</b>
<select required name='sub2' onChange={handleFormData} className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
<option value="">--- Select subject 2 (Theory) ---</option>
{subData.length>0 ? <>
  {subData.map((sub)=>(
    <option key={sub._id} value={sub.sub_name}> {sub.sub_name}</option>
  ))}
  
</>:<option disabled>No data found</option>}  
</select>





<b>Select subject 3 (Theory)</b>
<select className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required name='sub3' onChange={handleFormData}>
<option value="">--- Select subject 3 (Theory) ---</option>
{subData.length>0 ? <>

  {subData.map((sub)=>(
    <option key={sub._id} value={sub.sub_name}> {sub.sub_name}</option>
  ))}
  
</>:<option disabled>No data found</option>}
</select>



<b>Select subject 4 (Theory)</b>
<select className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required name='sub4' onChange={handleFormData}> 
  <option value="">--- Select subject 4 (Theory) ---</option>
{subData.length>0 ? <>

  {subData.map((sub)=>(
    <option key={sub._id} value={sub.sub_name}> {sub.sub_name}</option>
  ))}
  
</>:<option disabled>No data found</option>}
</select>



<b>Select subject 5 (Theory)</b>
<select className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required name='sub5' onChange={handleFormData}>
  <option value="">--- Select subject 5 (Theory) ---</option>
{subData.length>0 ? <>

  {subData.map((sub)=>(
    <option key={sub._id} value={sub.sub_name}> {sub.sub_name}</option>
  ))}
  
</>:<option disabled>No data found</option>}

</select>


<center className='font-bold text-red-500'>Practicals</center>

<b>Select subject 6 (Practical 1)</b>
<select className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required name='sub6' onChange={handleFormData}>
  <option value="">--- Select subject 6 (Practical 1) ---</option>
{subData.length>0 ? <>

  {subData.map((sub)=>(
    <option key={sub._id} value={sub.sub_name}> {sub.sub_name}</option>
  ))}

</>:<option disabled>No data found</option>}
</select>

<b>Select subject 7 (Practical 2)</b>
<select className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required name='sub7' onChange={handleFormData}>
  <option value="">--- Select subject 7 (Practical 2) ---</option>
{subData.length>0 ? <>

  {subData.map((sub)=>(
    <option key={sub._id} value={sub.sub_name}> {sub.sub_name}</option>
  ))}

</>:<option disabled>No data found</option>}
</select>


<div className="flex justify-center">
    <input
      type="submit"
      value="Submit"
      className="bg-indigo-500 m-6 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-indigo-600 transition duration-200"
    />
  </div>

</div>

</form>
















        </div>
        
      )) :<div className='bg-red-100 m-6 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert'>  <strong>No data found of your admission apply for admission first.</strong></div> 
      }

  


    </div>
  )
}

export default Examinations;