import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'

const Bookings = () => {

  const { axios } = useAppContext()
  const [bookings, setBookings] = useState([])

  // ✅ Fetch Bookings
  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/api/admin/bookings')

      if (data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>

      <Title
        title="All Bookings"
        subTitle="Manage all platform bookings"
      />

      <div className='mt-6 border border-borderColor rounded-md p-4 md:p-6 w-full'>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>

            <thead className='border-b'>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Car</th>
                <th>Owner</th>
                <th>Pickup</th>
                <th>Return</th>
                <th>Price</th>
                <th>Reting</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((item, index) => (
                <tr key={item._id} className='border-b hover:bg-gray-50'>

                  <td>{index + 1}</td>

                  <td>
                    <div>
                      <p className='font-medium'>{item.user?.name}</p>
                      <p className='text-xs text-gray-500'>{item.user?.email}</p>
                    </div>
                  </td>

                  <td>{item.car?.brand || item.car?.name || "Car"}</td>

                  <td> 
                    <div>
                      <p>{item.owner?.name}</p>
                      <p className='text-xs text-gray-500'>{item.owner?.email}</p>
                    </div>
                  </td>

                  <td>
                    {new Date(item.pickupDate).toLocaleDateString()}
                  </td>

                  <td>
                    {new Date(item.returnDate).toLocaleDateString()}
                  </td>

                  <td>₹{item.price}</td>

                  {/* ⭐ Rating & Review */}
                <td className='p-3 max-md:hidden'>
                  {item.rating ? (
                    <div className='flex flex-col gap-1'>

                      {/* Stars */}
                      <div className='flex gap-1 text-yellow-400'>
                        {[...Array(item.rating)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>

                      {/* Review */}
                      {item.review && (
                        <p className='text-xs text-gray-500 italic'>
                          "{item.review}"
                        </p>
                      )}

                    </div>
                  ) : (
                    <span className='text-xs text-gray-400'>
                      No rating
                    </span>
                  )}
                </td>

                  {/* ✅ Status */}
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

export default Bookings