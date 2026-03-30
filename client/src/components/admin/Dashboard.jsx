import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {

  const { axios, user, currency } = useAppContext()

  // ✅ Check Admin
  const isAdmin = user?.role === "admin"

  // ✅ Dashboard Data
  const [data, setData] = useState({
    totalCars: 0,
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  })

  // ✅ Users Table (Static for now)
  const [users, setUsers] = useState([
    {
      _id: "1",
      name: "John Doe",
      email: "john@gmail.com",
      password: "******",
      role: "user",
      image: "https://i.pravatar.cc/40",
      active: true,
    },
    {
      _id: "2",
      name: "Admin User",
      email: "admin@gmail.com",
      password: "******",
      role: "admin",
      image: "https://i.pravatar.cc/41",
      active: false,
    },
  ])

  // ✅ Dashboard Cards
  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    { title: "Total Users", value: data.totalUsers, icon: assets.userIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
  ]

  // ✅ Fetch Dashboard API
  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard')

      if (data.success) {
        setData(data.dashboardData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // ✅ Toggle Active / Inactive
  const toggleStatus = (id) => {
    setUsers(users.map(user =>
      user._id === id ? { ...user, active: !user.active } : user
    ))
  }

  // ✅ Delete User
  const deleteUser = (id) => {
    setUsers(users.filter(user => user._id !== id))
    toast.success("User deleted")
  }

  // ✅ Update User (dummy)
  const updateUser = (id) => {
    toast.success("Update clicked (connect backend)")
  }

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData()
    }
  }, [isAdmin])

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>

      {/* ✅ TITLE */}
      <Title
        title="Admin Dashboard"
        subTitle="Monitor platform performance including users, cars, bookings, revenue, and recent activities"
      />

      {/* ✅ CARDS */}
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-4xl'>
        {dashboardCards.map((card, index) => (
          <div key={index} className='flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor'>
            <div>
              <h1 className='text-xs text-gray-500'>{card.title}</h1>
              <p className='text-lg font-semibold'>{card.value}</p>
            </div>
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary/10'>
              <img src={card.icon} alt="" className='h-4 w-4' />
            </div>
          </div>
        ))}
      </div>

      {/* ✅ SECTIONS */}
      <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>

        {/* 🔹 Recent Bookings */}
        <div className='p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full'>
          <h1 className='text-lg font-medium'>Recent Bookings</h1>
          <p className='text-gray-500'>Latest customer bookings</p>

          {data.recentBookings.length === 0 && (
            <p className='text-sm text-gray-400 mt-3'>No bookings found</p>
          )}

          {data.recentBookings.map((booking, index) => (
            <div key={index} className='mt-4 flex items-center justify-between'>

              <div className='flex items-center gap-2'>
                <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'>
                  <img src={assets.listIconColored} alt="" className='h-5 w-5' />
                </div>
                <div>
                  <p>{booking.car?.brand} {booking.car?.model}</p>
                  <p className='text-sm text-gray-500'>
                    {booking.createdAt?.split('T')[0]}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-2 font-medium'>
                <p className='text-sm text-gray-500'>
                  {currency}{booking.price}
                </p>
                <p className='px-3 py-0.5 border border-borderColor rounded-full text-sm'>
                  {booking.status}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* 🔹 Monthly Revenue */}
        <div className='p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs'>
          <h1 className='text-lg font-medium'>Monthly Revenue</h1>
          <p className='text-gray-500'>Revenue for current month</p>

          <p className='text-3xl mt-6 font-semibold text-primary'>
            {currency}{data.monthlyRevenue}
          </p>
        </div>

      </div>

      {/* ✅ USERS TABLE */}
      <div className='mt-10 border border-borderColor rounded-md p-4 md:p-6 w-full'>
        <h1 className='text-lg font-medium'>Users Management</h1>
        <p className='text-gray-500 mb-4'>Manage platform users</p>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>

            <thead className='border-b'>
              <tr>
                <th className='py-2'>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Role</th>
                <th>Image</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className='border-b hover:bg-gray-50'>

                  <td className='py-2'>{index + 1}</td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>{user.password}</td>

                  <td>
                    <span className='px-2 py-1 rounded text-xs bg-gray-100'>
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <img
                      src={user.image}
                      className='w-8 h-8 rounded-full object-cover'
                    />
                  </td>

                  {/* Toggle */}
                  <td>
                    <button
                      onClick={() => toggleStatus(user._id)}
                      className={`px-3 py-1 rounded text-xs ${
                        user.active
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.active ? "Available" : "Unavailable"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className='flex gap-2 py-2'>
                    <button
                      onClick={() => updateUser(user._id)}
                      className='px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded'
                    >
                      Update
                    </button>

                    <button
                      onClick={() => deleteUser(user._id)}
                      className='px-2 py-1 text-xs bg-red-100 text-red-600 rounded'
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  )
}

export default Dashboard