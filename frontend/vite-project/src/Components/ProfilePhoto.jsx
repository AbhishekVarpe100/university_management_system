import React, { useEffect, useState } from 'react';
import './css/Loader.css';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
function ProfilePhoto() {

  const [loader, setLoader] = useState(true);
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
    setTimeout(() => {
      setLoader(false);
    }, 3000);
  }, []);




  return (
    <>
      {loader ? (
        <div className="p-10">
          <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>     
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <div className="p-10">
        <section>
            <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png' alt="" />
            {!data.photo ? <Link to={`/profile_img/upload/${data._id}/${type}`}> Upload photo</Link> : <Link to={`/profile_img/edit/${data._id}/${type}`}>Edit photo</Link> }
            <br></br>
            <button className='bg-green-500'>Edit photo</button> <button className='bg-red-500'>Delete photo</button>
        </section>

        </div>
      )}
    </>
  );
}

export default ProfilePhoto;
