import React from 'react'
import Examinations from './routes/Examinations'
import About from './routes/About'
import Admissions from './routes/Admissions'
import {Routes,Route} from 'react-router-dom';
import Placements from './routes/Placements';
import Campus from './routes/Campus';
import Blogs from './routes/Blogs';
import ContactUs from './routes/ContactUs';
import Result from './routes/Result';
function ProfileRoutes() {
  return (
    <>
    
    <Routes>
        <Route path='examinations' element={<Examinations></Examinations>}></Route>
        <Route path='about' element={<About></About>}></Route>
        <Route path='admissions' element={<Admissions></Admissions>}></Route>
        <Route path='placements' element={<Placements></Placements>}></Route>
        <Route path='campus' element={<Campus></Campus>}></Route>
        <Route path='blogs' element={<Blogs></Blogs>}></Route>
        <Route path='contact_us' element={<ContactUs></ContactUs>}></Route>
        <Route path='results' element={<Result></Result>}></Route>
    </Routes>

    </>
  )
}

export default ProfileRoutes;