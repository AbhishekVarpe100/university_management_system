import React from 'react'
import Notice_staff from './routes/staff_section/Notice_staff'
import Campus from './routes/stud_section/Campus';
import Placements from './routes/stud_section/Placements';
import Blogs from './routes/stud_section/Blogs';
import { Routes,Route } from 'react-router-dom'
function StaffRoutes() {
  return (
    <>
    <Routes>
        <Route path='notices_staff' element={<Notice_staff></Notice_staff>}></Route>
        <Route path='blogs' element={<Blogs></Blogs>}></Route>
        <Route path='campus' element={<Campus></Campus>}></Route>
        <Route path='placements' element={<Placements></Placements>}></Route>
        <Route path='admissions' element={<Notice_staff></Notice_staff>}></Route>
        <Route path='exminations' element={<Notice_staff></Notice_staff>}></Route>
    </Routes>
    </>
  )
}

export default StaffRoutes