import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import CarDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import MyBookings from './pages/MyBookings'
import Footer from './components/Footer'
import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'
import Login from './components/Login'
import AddLocation from './pages/owner/AddLocation'
import ManageLocations from './pages/owner/ManageLocations'
import Users from './components/admin/Users'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'

// ✅ Admin
import AdminLayout from './pages/admin/Layout'
import AdminDashboard from './components/admin/Dashboard'

const App = () => {

  const { showLogin } = useAppContext()
  const location = useLocation()

  const isOwnerPath = location.pathname.startsWith('/owner')
  const isAdminPath = location.pathname.startsWith('/admin')

  return (
    <>
      <Toaster />

      {showLogin && <Login />}

      {/* Hide Navbar */}
      {!isOwnerPath && !isAdminPath && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/car-details/:id' element={<CarDetails />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/my-bookings' element={<MyBookings />} />

        {/* OWNER */}
        <Route path='/owner' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
          <Route path="add-location" element={<AddLocation />} />
          <Route path="manage-locations" element={<ManageLocations />} />
        </Route>

        {/* ✅ ADMIN WITH SIDEBAR */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path='/admin/users' element={<Users />} />
        </Route>

      </Routes>

      {/* Hide Footer */}
      {!isOwnerPath && !isAdminPath && <Footer />}

    </>
  )
}

export default App