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

        {data.length > 0 ? (
  <div className="overflow-x-auto p-4">
    <div> <b>Total courses : {data.length}</b> </div>
    <table className="table-auto w-full bg-white shadow-lg rounded-lg">
      <thead>
        <tr className="bg-indigo-600 text-white">
          <th className="px-6 py-3 text-left">Course Name</th>
          <th className="px-6 py-3 text-left">Total Course Fees</th>
          <th className="px-6 py-3 text-left">Per Year Fees</th>
          <th className="px-6 py-3 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id}  className="even:bg-gray-200 odd:bg-gray-50">
            <td className="px-6 py-4 border-t border-gray-200">{item.course_name}</td>
            <td className="px-6 py-4 border-t border-gray-200">{item.fees}</td>
            <td className="px-6 py-4 border-t border-gray-200">{item.perYearFees}</td>
            <td className="px-6 py-4 border-t border-gray-200">
              <button 
                onClick={() => handleDelete(item._id)} 
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <div className="flex items-center justify-center h-48">
    <p className="text-gray-500 text-lg">No courses available</p>
  </div>
)}

    </>
  )
}

export default New_course;