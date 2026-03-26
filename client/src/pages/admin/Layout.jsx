import React from 'react'
import Sidebar from '../../components/admin/Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex'>
      {/* ✅ Sidebar here */}
      <Sidebar />

      {/* ✅ Page content */}
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout