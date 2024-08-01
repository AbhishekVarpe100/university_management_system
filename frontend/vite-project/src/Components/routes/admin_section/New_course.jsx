import React, { useEffect, useState } from 'react'
import axios from 'axios';
function New_course() {

  const [courseName,setCourseName]=useState('');
  const [fees,setFees]=useState('');
  const [perYearFees,setPerYearFees]=useState('');
  const [data,setData]=useState([]);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const res= await axios.post('http://localhost:3000/add_course',{courseName,fees,perYearFees})
    alert(res.data);
    setCourseName("");
    setFees("");
    setPerYearFees("");
  }

  const handleDelete=async (id)=>{
    const res=await axios.delete(`http://localhost:3000/delete_course/${id}`)
    alert(res.data)
  }

  const getData=async ()=>{
    let res=await axios('http://localhost:3000/get_courses');
    setData(res.data)
  }
  useEffect(()=>{
    getData();
  })

  return (
    <>
    <div className='p-10 max-w-md mx-auto'>
            <form onSubmit={handleSubmit} className="space-y-4">
      <header className='text-slate-500'>Add new course</header>
                <input required value={courseName}
                    onChange={(e) => setCourseName(e.target.value)} 
                    type="text" 
                    placeholder="Enter course name" 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
                <input required value={fees}
                    onChange={(e) => setFees(e.target.value)} 
                    type="text" 
                    placeholder="Enter total course fees" 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
                <input required value={perYearFees}
                    onChange={(e) => setPerYearFees(e.target.value)} 
                    type="text" 
                    placeholder="Enter per year fees" 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
                <input 
                    type="submit" 
                    value="Add course" 
                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 cursor-pointer" 
                />
            </form>
        </div>

    {data.length>0?  data.map((item)=>{

      return (
        <ul className='mb-4 hover:shadow-lg transi duration-500 hover:shadow-orange-300'>
            <div className='bg-blue-100 p-4 rounded-lg shadow-md'>
                <li className='mb-2'>
                    <span className='font-semibold'>Course Name:</span> {item.course_name}
                </li>
                <li className='mb-2'>
                    <span className='font-semibold'>Total Course Fees:</span> {item.fees} Rs.
                </li>
                <li className='mb-2'>
                    <span className='font-semibold'>Per Year Fees:</span> {item.perYearFees} Rs.
                </li>
                <button 
                    onClick={() => handleDelete(item._id)} 
                    className='mt-2 py-2 px-4 bg-red-700 text-white rounded hover:bg-red-800 transition duration-300'
                >
                    Delete
                </button>
            </div>
        </ul>
      ) 
    }) :<><center>No courses available</center></>
  }
    </>
  )
}

export default New_course;