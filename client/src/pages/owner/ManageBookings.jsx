import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBookings = () => {

  const { currency, axios } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ Fetch Owner Bookings
  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/owner')

      if (data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Change Booking Status
  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', {
        bookingId,
        status
      })

      if (data.success) {
        toast.success(data.message)
        fetchOwnerBookings()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchOwnerBookings()
  }, [])

  // ✅ Loading UI
  if (loading) {
    return (
      <div className='p-10 text-center text-gray-500'>
        Loading bookings...
      </div>
    )
  }

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>

      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."
      />

      <div className='max-w-6xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>

          {/* Header */}
          <thead className='text-gray-500 bg-gray-50'>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Customer</th>
              <th className="p-3 font-medium max-md:hidden">Date</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Rating</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>

            {bookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-400">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className='border-t border-borderColor hover:bg-gray-50'
                >

                  {/* Car */}
                  <td className='p-3 flex items-center gap-3'>
                    <img
                      src={booking.car?.image || "/default-car.png"}
                      alt="car"
                      className='h-12 w-12 rounded-md object-cover'
                    />
                    <div>
                      <p className='font-medium'>
                        {booking.car?.brand} {booking.car?.model}
                      </p>
                      <p className='text-xs text-gray-400'>
                        {booking.car?.category} • {booking.car?.location}
                      </p>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className='p-3 max-md:hidden'>
                    <p className='font-medium'>
                      {booking.user?.name || "N/A"}
                    </p>
                    <p className='text-xs text-gray-400'>
                      {booking.user?.email || ""}
                    </p>
                  </td>

                  {/* Date */}
                  <td className='p-3 max-md:hidden'>
                    <p>
                      {new Date(booking.pickupDate).toLocaleDateString()}{" "}
                      to{" "}
                      {new Date(booking.returnDate).toLocaleDateString()}
                    </p>
                  </td>

                  {/* Price */}
                  <td className='p-3 font-medium'>
                    {currency}{booking.price}
                  </td>

                  {/* ⭐ Rating */}
                  <td className='p-3 max-md:hidden'>
                    {booking.rating ? (
                      <div className='flex flex-col gap-1'>

                        {/* Stars */}
                        <div className='flex gap-1 text-yellow-400'>
                          {[...Array(booking.rating)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>

                        {/* Review */}
                        {booking.review && (
                          <p className='text-xs text-gray-500 italic'>
                            "{booking.review}"
                          </p>
                        )}

                      </div>
                    ) : (
                      <span className='text-xs text-gray-400'>
                        No rating
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className='p-3'>
                    {booking.status === 'pending' ? (
                      <select
                        onChange={(e) =>
                          changeBookingStatus(booking._id, e.target.value)
                        }
                        value={booking.status}
                        className='px-2 py-1.5 text-gray-500 border border-borderColor rounded-md outline-none'
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold 
                        ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-500'
                        }`}
                      >
                        {booking.status}
                      </span>
                    )}
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default ManageBookings