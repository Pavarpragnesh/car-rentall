import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ManageCars = () => {

  const { isOwner, axios, currency } = useAppContext()
  const [cars, setCars] = useState([])
  const navigate = useNavigate()

  // ✅ Fetch Cars (WITH RATING)
  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get('/api/owner/cars')

      if (data.success) {
        setCars(data.cars)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // ✅ Toggle Availability
  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post('/api/owner/toggle-car', { carId })

      if (data.success) {
        toast.success(data.message)
        fetchOwnerCars()
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // ✅ Delete Car
  const deleteCar = async (carId) => {
    try {
      const confirm = window.confirm('Delete this car permanently?')
      if (!confirm) return

      const { data } = await axios.post('/api/owner/delete-car', { carId })

      if (data.success) {
        toast.success(data.message)
        fetchOwnerCars()
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isOwner) fetchOwnerCars()
  }, [isOwner])

  // ⭐ Render Stars
  const renderStars = (rating = 0) => {
    return [...Array(5)].map((_, i) => (
      <span key={i}>
        {i < Math.round(rating) ? "★" : "☆"}
      </span>
    ))
  }

  return (
    <div className='px-4 md:px-10 py-10 w-full bg-gray-50 min-h-screen'>

      <Title
        title="Manage Cars"
        subTitle="View, update, ratings and manage your cars"
      />

      <div className='bg-white shadow-md rounded-xl mt-8 border overflow-hidden'>

        <div className="overflow-x-auto">
          <table className='w-full text-sm text-gray-700'>

            {/* HEADER */}
            <thead className='bg-gray-100 text-gray-600 text-xs uppercase'>
              <tr>
                <th className="p-4 text-center w-12">#</th>
                <th className="p-4 text-left">Car</th>
                <th className="p-4 max-md:hidden">Category</th>
                <th className="p-4 max-md:hidden">Year</th>
                <th className="p-4 max-md:hidden">Fuel</th>
                <th className="p-4 max-md:hidden">Location</th>
                <th className="p-4">Price</th>
                <th className="p-4">Rating</th> {/* ⭐ NEW */}
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {cars.length > 0 ? cars.map((car, index) => (

                <tr key={car._id} className='border-t hover:bg-gray-50 transition'>

                  <td className='p-4 text-center'>{index + 1}</td>

                  {/* CAR INFO */}
                  <td className='p-4'>
                    <div className='flex items-center gap-3'>
                      <img
                        src={car.image}
                        className="h-14 w-14 rounded-lg object-cover border"
                        alt=""
                      />
                      <div>
                        <p className='font-semibold'>
                          {car.brand} {car.model}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {car.seating_capacity} Seats • {car.transmission}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className='p-4 max-md:hidden'>{car.category}</td>
                  <td className='p-4 max-md:hidden'>{car.year}</td>
                  <td className='p-4 max-md:hidden'>{car.fuel_type}</td>
                  <td className='p-4 max-md:hidden'>{car.location}</td>

                  {/* PRICE */}
                  <td className='p-4'>
                    {currency}{car.pricePerDay}
                  </td>

                  {/* ⭐ RATING COLUMN */}
                  <td className='p-4'>
                    {car.avgRating ? (
                      <div className='flex flex-col items-center'>

                        <div className='flex text-yellow-400'>
                          {renderStars(car.avgRating)}
                        </div>

                        <span className='text-xs text-gray-500'>
                          {car.avgRating} ({car.totalReviews})
                        </span>

                      </div>
                    ) : (
                      <span className='text-xs text-gray-400'>
                        No rating
                      </span>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className='p-4'>
                    <span className={`px-3 py-1 rounded-full text-xs 
                      ${car.isAvaliable
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                      }`}>
                      {car.isAvaliable ? "Available" : "Unavailable"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className='p-4'>
                    <div className='flex justify-center gap-3'>

                      {/* Toggle */}
                      <button onClick={() => toggleAvailability(car._id)}>
                        <img
                          src={car.isAvaliable
                            ? assets.eye_close_icon
                            : assets.eye_icon}
                          className='w-10'
                        />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() =>
                          navigate('/owner/add-car', { state: { car } })
                        }
                        className='p-2 hover:bg-blue-50 rounded'
                      >
                        <img src={assets.edit_icon} className='w-10' />
                      </button>

                      {/* Delete */}
                      <button onClick={() => deleteCar(car._id)}>
                        <img src={assets.delete_icon} className='w-10' />
                      </button>

                    </div>
                  </td>

                </tr>

              )) : (
                <tr>
                  <td colSpan="10" className="text-center py-10 text-gray-500">
                    No cars found 🚗
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  )
}

export default ManageCars