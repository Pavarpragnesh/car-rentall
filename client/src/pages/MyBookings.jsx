import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const MyBookings = () => {

  const { axios, user, currency } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [ratingData, setRatingData] = useState({})
  const [hover, setHover] = useState({})

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const bookingsPerPage = 3

  // ✅ Format Date
  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString()
  }

  // ✅ Fetch Bookings
  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user')
      if (data.success) {
        setBookings(data.bookings || [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) fetchMyBookings()
  }, [user])

  // ✅ Pagination Logic
  const indexOfLast = currentPage * bookingsPerPage
  const indexOfFirst = indexOfLast - bookingsPerPage
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(bookings.length / bookingsPerPage)

  // ✅ Submit Rating
  const submitRating = async (bookingId) => {
    try {
      const current = ratingData[bookingId]

      if (!current?.rating) {
        return toast.error("Please select rating")
      }

      const { data } = await axios.post('/api/bookings/add-rating', {
        bookingId,
        rating: current.rating,
        review: current.review || ''
      })

      if (data.success) {
        toast.success("Rating submitted")
        fetchMyBookings()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // ✅ Completed Check
  const isCompleted = (booking) => {
    return (
      booking.status === "confirmed" &&
      new Date(booking.returnDate) < new Date()
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'
    >

      <Title
        title='My Bookings'
        subTitle='View and manage your all car bookings'
        align="left"
      />

      {/* Empty State */}
      {bookings.length === 0 && (
        <p className='mt-10 text-center text-gray-500'>
          No bookings found.
        </p>
      )}

      <div>
        {currentBookings.map((booking, index) => {

          const completed = isCompleted(booking)
          const car = booking.car || {}

          return (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'
            >

              {/* Car Info */}
              <div>
                <div className='rounded-md overflow-hidden mb-3'>
                  <img
                    src={car.image || assets.placeholder}
                    alt="car"
                    className='w-full aspect-video object-cover'
                  />
                </div>

                <p className='text-lg font-medium'>
                  {car.brand} {car.model}
                </p>

                <p className='text-gray-500'>
                  {car.year} • {car.category} • {car.location}
                </p>
              </div>

              {/* Booking Info */}
              <div className='md:col-span-2'>

                <div className='flex items-center gap-2'>
                  <p className='px-3 py-1.5 bg-light rounded'>
                    Booking #{indexOfFirst + index + 1}
                  </p>

                  <p className={`px-3 py-1 text-xs rounded-full 
                    ${booking.status === 'confirmed'
                      ? 'bg-green-400/15 text-green-600'
                      : 'bg-red-400/15 text-red-600'
                    }`}>
                    {booking.status}
                  </p>
                </div>

                {/* Rental Period */}
                <div className='flex items-start gap-2 mt-3'>
                  <img src={assets.calendar_icon_colored} className='w-4 h-4 mt-1' />
                  <div>
                    <p className='text-gray-500'>Rental Period</p>
                    <p>
                      {formatDate(booking.pickupDate)} To {formatDate(booking.returnDate)}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className='flex items-start gap-2 mt-3'>
                  <img src={assets.location_icon_colored} className='w-4 h-4 mt-1' />
                  <div>
                    <p className='text-gray-500'>Pick-up Location</p>
                    <p>{car.location}</p>
                  </div>
                </div>

              </div>

              {/* Price + Rating */}
              <div className='flex flex-col justify-between'>

                {/* Price */}
                <div className='text-right'>
                  <p className='text-gray-500'>Total Price</p>
                  <h1 className='text-2xl font-semibold text-primary'>
                    {currency}{booking.price}
                  </h1>
                  <p className='mt-1 text-gray-500 text-xs'>
                    Booked on {formatDate(booking.createdAt)}
                  </p>
                </div>

                {/* Rating */}
                <div className='mt-4 text-right'>

                  {booking.rating ? (
                    <>
                      <p className='text-gray-500 text-sm'>Your Rating</p>

                      <div className='flex justify-end gap-1 text-yellow-400 text-lg mt-1'>
                        {[...Array(booking.rating)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>

                      {booking.review && (
                        <p className='text-gray-600 text-xs mt-1 italic'>
                          "{booking.review}"
                        </p>
                      )}
                    </>
                  ) : completed && (
                    <div>
                      <p className='text-gray-500 text-sm mb-1'>Rate</p>

                      <div className='flex justify-end gap-1 mb-2'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onMouseEnter={() =>
                              setHover(prev => ({ ...prev, [booking._id]: star }))
                            }
                            onMouseLeave={() =>
                              setHover(prev => ({ ...prev, [booking._id]: 0 }))
                            }
                            onClick={() =>
                              setRatingData(prev => ({
                                ...prev,
                                [booking._id]: {
                                  ...prev[booking._id],
                                  rating: star
                                }
                              }))
                            }
                            className={`cursor-pointer text-xl
                              ${(hover[booking._id] || ratingData[booking._id]?.rating || 0) >= star
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                              }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      <textarea
                        placeholder="Write review..."
                        className='w-full border rounded p-1 text-xs mb-2'
                        onChange={(e) =>
                          setRatingData(prev => ({
                            ...prev,
                            [booking._id]: {
                              ...prev[booking._id],
                              review: e.target.value
                            }
                          }))
                        }
                      />

                      <button
                        disabled={!ratingData[booking._id]?.rating}
                        onClick={() => submitRating(booking._id)}
                        className='px-3 py-1 bg-primary text-white rounded text-xs disabled:opacity-50'
                      >
                        Submit
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </motion.div>
          )
        })}
      </div>

      {/* ✅ Pagination UI */}
      {bookings.length > bookingsPerPage && (
        <div className='flex justify-center items-center gap-4 mt-10'>

          <button
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
            className='px-4 py-1 border rounded disabled:opacity-50'
          >
            Prev
          </button>

          <p className='text-sm'>
            Page {currentPage} of {totalPages}
          </p>

          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages}
            className='px-4 py-1 border rounded disabled:opacity-50'
          >
            Next
          </button>

        </div>
      )}

    </motion.div>
  )
}

export default MyBookings