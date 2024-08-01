import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Admissions() {
  const [data, setData] = useState([]);
  const [change, setChange] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [name,setName]=useState('');
  const [marks10,setMarks10]=useState('');
  const [marks12,setMarks12]=useState('');

  

  const getData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/get_courses');
      setData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const dataObj={
    course:change,
    name:name,
    marks_10:marks10,
    marks_12:marks12
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    await axios.post('http://localhost:3000/add_admission',dataObj)
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (change) {
      const selectedCourse = data.find((course) => course.course_name === change);
      setSelectedCourse(selectedCourse || null);
    }
  }, [change, data]);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
    <h1 className="text-xl font-bold">Select course</h1>

    <form onSubmit={handleSubmit}>

    
    <select required
      className="block w-full p-2 border border-gray-300 rounded-md"
      onChange={(e) => setChange(e.target.value)}
    >
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
    {selectedCourse ? (
      <div className="space-y-2">
        <div>
          <label className="block font-medium">Total course fees</label>
          <input
            type="text"
            value={selectedCourse.fees || ''}
            placeholder="Course fees total"
            readOnly
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium">Per year course fees</label>
          <input
            type="text"
            value={selectedCourse.perYearFees || ''}
            placeholder="Course fees per year"
            readOnly
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    ) : null}
   <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input required
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="marks10" className="block text-sm font-medium text-gray-700">
            10th Percentage
          </label>
          <input required
            id="marks10"
            type="text"
            placeholder="Enter your 10th percentage"
            value={marks10}
            onChange={(e) => setMarks10(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="marks12" className="block text-sm font-medium text-gray-700">
            12th Percentage
          </label>
          <input required
            id="marks12"
            type="text"
            placeholder="Enter your 12th percentage"
            value={marks12}
            onChange={(e) => setMarks12(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <input
            type="submit"
            value="Submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
    </form>

    
    
  </div>
  );
}

export default Admissions;
