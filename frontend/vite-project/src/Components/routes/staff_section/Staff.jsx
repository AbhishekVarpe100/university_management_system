import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom';
function Staff() {


  const [tokenValid,setTokenValid]=useState(false);

  


  useEffect(()=>{
    sendToken();
  },[]);

  async function sendToken() {
    let token_header = localStorage.getItem('token');
    const response = await axios.post('http://localhost:3000/staff', {
      token_header,
    });
    
    if (response.data.message === 'profile_accessed') {
      if(localStorage.getItem('token') && localStorage.getItem('email') && localStorage.getItem('type')=='staff'){
        setTokenValid(true);
      localStorage.setItem(
        'token_expires_in',
        `${(response.data.authData.exp - response.data.authData.iat) / 60} minutes` 
      );
      }
    } else if (response.data.result === 'invalid token'){
      setTokenValid(false);
      setTimeout(() => {
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('token_expires_in');
        localStorage.removeItem('token');
      }, 3000);
    }
  }
  
  return (


    <>
    {
      tokenValid?
      
      
      
      
      <div className='pt-7'>
        
        
        Staff accessed
        
        
        </div >
        
        
        
        :(
        <div className="m-10">
          Your token has expired{' '}
          <Link
            className="text-blue-700 font-bold hover:underline hover:text-blue-400"
            to="/login"
          >
            Login here
          </Link>{' '}
          again to continue
        </div>
      )
    }
    </>
    
  )
}

export default Staff;