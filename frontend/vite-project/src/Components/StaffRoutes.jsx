import React from 'react'
import Notice_staff from './routes/staff_section/Notice_staff'
import { Routes,Route } from 'react-router-dom'
function StaffRoutes() {
  return (
    <>
    <Routes>
        <Route path='notices_staff' element={<Notice_staff></Notice_staff>}></Route>
    </Routes>
    </>
  )
}

export default StaffRoutes