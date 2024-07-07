import { useEffect, useState } from 'react';
import '../index.css';
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

function App() {
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('token_expires_in');
    window.location.reload();
  };

  const username = useSelector((state) => state.username);
  const email = useSelector((state) => state.email);

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
            localStorage.getItem('type')=='admin'? "":(
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span>{username}</span><br />
                  <span>{email}</span>
                </div>
  
                <Link to='/profile_img'>
                <img title='profile'
                  className="w-10 h-10 rounded-full"
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin></Admin>} />
            <Route path="/staff" element={<Staff></Staff>} />
            <Route path="/profile" element={<Profile/>}>
              <Route path="/profile/*" element={<ProfileRoutes />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
