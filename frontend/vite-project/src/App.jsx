import { useEffect, useState } from 'react';
import '../index.css';
import axios from 'axios';
import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import ProfileRoutes from './Components/ProfileRoutes';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Profile from './Components/Profile';
import { useSelector, useDispatch } from 'react-redux';
import Admin from './Components/routes/admin_section/Admin';
import Staff from './Components/routes/staff_section/Staff';
import ProfilePhoto from './Components/ProfilePhoto';
import EditPhoto from './Components/EditPhoto';
import UploadPhoto from './Components/UploadPhoto';
import EditInfo from './Components/EditInfo';
import Announcement from './Components/routes/admin_section/Announcement';
// import AdminRoutes from './Components/AdminRoutes';
import StaffRoutes from './Components/StaffRoutes';

import New_course from './Components/routes/admin_section/New_course';

import Statistics from './Components/routes/admin_section/Statistics';
import Add_Placements from './Components/routes/admin_section/Add_Placements';
import Add_Videos from './Components/routes/admin_section/Add_Videos';
import Add_blogs from './Components/routes/admin_section/Add_blogs';
import Student_voice from './Components/routes/admin_section/Student_voice';
import Admission_adm from './Components/routes/admin_section/Admissions_adm';
import All_Admissions from './Components/routes/admin_section/All_Admissions';
import Add_Subjects from './Components/routes/admin_section/Add_Subjects';
import About from './Components/routes/stud_section/About';
import Exams from './Components/routes/admin_section/Exams';
import Stud_results from './Components/routes/staff_section/Stud_results';


function App() {
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('token_expires_in');
    window.location.reload();
  };

  const username=useSelector((state)=>state.username);
  const email=useSelector((state)=>state.email);
  const type=useSelector((state)=>state.type);
  const [data,setData]=useState({});

  const dataObj={
    username:username,
    email:email,
    type:type,
  }

  async function getData(){
    const response=await axios.post('http://localhost:3000/getprofile_data',dataObj);
    setData(response.data)
  }

useEffect(() => {
  getData();
}, []);



  return (
    <>
      <BrowserRouter>
        <nav className="fixed top-0 left-0 right-0 bg-gray-800 text-white flex items-center justify-between p-6 z-50 shadow-md">
          <div className="space-x-4 flex items-center">
            <Link to="/" className="hover:underline hover:text-gray-400">
              Home
            </Link>
            {username && email ? (
              <>
                <Link
                  onClick={handleLogout}
                  to="/login"
                  className="hover:underline hover:text-gray-400"
                >
                  Log Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:underline hover:text-gray-400"
                >
                  Login   
                </Link>
                <Link
                  to="/register"
                  className="hover:underline hover:text-gray-400"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {
            localStorage.getItem('type')=='admin' || (!localStorage.getItem('email')  && !localStorage.getItem('username')) ? "":(
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span>{username}</span><br />
                  <span>{email}</span>
                </div>
                <Link to='/profile_img'>
                <img title='profile'
                  className="w-10 h-10 rounded-full"
                  src={!data.photo? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png' :`http://localhost:3000/Profile_Images/${data.photo}`}
                  alt="Profile Photo"
                />
                </Link>
              </div>
            )
          }
          
        </nav>
        {/* Push content down by the height of the navbar */}
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="profile_img" element={<ProfilePhoto></ProfilePhoto>} />
            <Route path="profile_img/edit/:id/:type" element={<EditPhoto></EditPhoto>} />
            <Route path="profile_img/upload/:id/:type" element={<UploadPhoto></UploadPhoto>} />
            <Route path="profile_img/edit_info/:id/:type" element={<EditInfo></EditInfo>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />


          <Route path="/admin" element={<Admin></Admin>}>
        
          <Route index element={<Announcement></Announcement>}></Route>


        {/* <Route path='announcement' element={<Announcement></Announcement>}></Route> */}
        <Route path='add_videos' element={<Add_Videos></Add_Videos>}></Route>
        <Route path='statistics' element={<Statistics></Statistics>}></Route>
        <Route path='add_placements' element={<Add_Placements></Add_Placements>}></Route>
        <Route path='add_blogs' element={<Add_blogs></Add_blogs>}></Route>
        <Route path='stud_voice' element={<Student_voice></Student_voice>}></Route>
        <Route path='exam_applications' element={<Exams></Exams>}></Route>


        <Route path='admission_adm' element={<Admission_adm></Admission_adm>}>
        <Route path='new_course' element={<New_course></New_course>}></Route>
        <Route index element={<All_Admissions></All_Admissions>}></Route>        
        <Route path='add_sub' element={<Add_Subjects></Add_Subjects>}></Route>
        </Route>


            {/* <Route path='*' element={<AdminRoutes></AdminRoutes>}> 
              <Route path='admission_adm/*' element={<Admissions_Routes></Admissions_Routes>}></Route>
            </Route>        */}



          </Route>
            <Route path="/staff" element={<Staff></Staff>}> 
              <Route path='/staff/*' element={<StaffRoutes></StaffRoutes>}></Route>
              <Route index element={<Stud_results></Stud_results>}></Route>
            </Route>  
            <Route path="/profile" element={<Profile/>}>
               <Route index element={<About></About>}></Route>
              <Route path="/profile/*" element={<ProfileRoutes />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
