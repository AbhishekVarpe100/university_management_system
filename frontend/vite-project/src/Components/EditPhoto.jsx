import React from 'react'
import { useParams } from 'react-router-dom';

function EditPhoto() {
    const {id,type}=useParams();
  return (
    <div className='p-8'>EditPhoto {id} {type}</div>
    
  )
}

export default EditPhoto;