import { useEffect, useState } from 'react';
import '../index.css';
import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import ProfileRoutes from './Components/ProfileRoutes';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Profile from './Components/Profile';
import { useSelector, useDispatch } from 'react-redux';

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
          {username && email && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span>{username}</span><br />
                <span>{email}</span>
              </div>
              <img
                className="w-10 h-10 rounded-full"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                alt="Profile Photo"
              />
            </div>
          )}
        </nav>

        {/* Push content down by the height of the navbar */}
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />}>
              <Route path="/profile/*" element={<ProfileRoutes />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
