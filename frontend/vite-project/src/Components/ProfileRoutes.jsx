import React from 'react'
import Examinations from './routes/stud_section/Examinations'
import About from './routes/stud_section/About'
import Admissions from './routes/stud_section/Admissions'
import {Routes,Route} from 'react-router-dom';
import Placements from './routes/stud_section/Placements';
import Campus from './routes/stud_section/Campus';
import Blogs from './routes/stud_section/Blogs';
import ContactUs from './routes/stud_section/ContactUs';
import Result from './routes/stud_section/Result';
import Notices from './routes/stud_section/Notices';
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
        <Route path='notices' element={<Notices></Notices>}></Route>
    </Routes>

    </>
  )
}

export default ProfileRoutes;