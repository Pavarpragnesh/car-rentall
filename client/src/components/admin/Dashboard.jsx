import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {

  const { axios, user, currency } = useAppContext()

  const isAdmin = user?.role === "admin"

  const [data, setData] = useState({
    totalCars: 0,
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  })

  // ✅ Dashboard Cards
  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    { title: "Total Users", value: data.totalUsers, icon: assets.userIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending Bookings", value: data.pendingBookings, icon: assets.cautionIconColored },
  ]

  // ✅ Fetch Dashboard Data
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

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData()
    }
  }, [isAdmin])

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>

      {/* ✅ Title */}
      <Title
        title="Admin Dashboard"
        subTitle="Monitor bookings, users, cars and revenue"
      />

      {/* ✅ Cards */}
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

      {/* ✅ Sections */}
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
                <p className={`px-3 py-0.5 rounded-full text-sm ${
                  booking.status === "confirmed"
                    ? "bg-green-100 text-green-600"
                    : booking.status === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}>
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

      {/* ✅ Booking Table */}
      <div className='mt-10 border border-borderColor rounded-md p-4 md:p-6 w-full'>
        <h1 className='text-lg font-medium'>All Bookings</h1>
        <p className='text-gray-500 mb-4'>Recent platform bookings</p>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>

            <thead className='border-b'>
              <tr>
                <th>#</th>
                <th>Car</th>
                <th>Pickup</th>
                <th>Return</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.recentBookings.map((item, index) => (
                <tr key={item._id} className='border-b hover:bg-gray-50'>

                  <td>{index + 1}</td>

                  <td>{item.car?.brand} {item.car?.model}</td>

                  <td>{new Date(item.pickupDate).toLocaleDateString()}</td>

                  <td>{new Date(item.returnDate).toLocaleDateString()}</td>

                  <td>{currency}{item.price}</td>

                  <td>
                    <span className={`px-2 py-1 text-xs rounded ${
                      item.status === "confirmed"
                        ? "bg-green-100 text-green-600"
                        : item.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {item.status}
                    </span>
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