import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'

function Campus() {


  const [videos,setVideos]=useState([]);
  const videoRefs = useRef([]);

  const handlePlay = (index) => {
    videoRefs.current.forEach((video, idx) => {
      if (video && idx !== index) {
        video.pause();
      }
    });
  };


  const getData=async()=>{
    const res=await axios.post('http://localhost:3000/get_videos');
    setVideos(res.data);
  }

  useEffect(()=>{
    getData();
  },[])

  return (
    <div><h1 className="text-3xl text-center font-bold text-gray-800 mb-8 py-4">Videos</h1>


    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video, index) => (
        <div key={video._id} className="flex flex-col hover:shadow-xl items-center p-4 rounded-lg shadow-md">
          <video
            ref={(element) => (videoRefs.current[index] = element)}
            controls
            className="w-full h-64 rounded-md mb-4"
            onPlay={() => handlePlay(index)}
          >
            <source src={`http://localhost:3000/Videos/${video.video}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

<div className='flex'>
          <div className='mr-16'> <strong>Title : </strong>{video.title}</div>         
</div>

        </div>
      ))}
    </div>
    </div>
  )
}

export default Campus;