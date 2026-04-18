import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageCars = () => {

  const { isOwner, axios, currency } = useAppContext()
  const [cars, setCars] = useState([])

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

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post('/api/owner/toggle-car', { carId })
      if (data.success) {
        toast.success(data.message)
        fetchOwnerCars()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteCar = async (carId) => {
    try {
      const confirm = window.confirm('Delete this car permanently?')
      if (!confirm) return

      const { data } = await axios.post('/api/owner/delete-car', { carId })
      if (data.success) {
        toast.success(data.message)
        fetchOwnerCars()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isOwner) fetchOwnerCars()
  }, [isOwner])

  return (
  <div className='px-4 md:px-10 py-10 w-full bg-gray-50 min-h-screen'>

    <Title
      title="Manage Cars"
      subTitle="View, update or remove cars from your platform."
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
              <th className="p-4">Rating</th>
              <th className="p-4 max-md:hidden">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {cars.length > 0 ? cars.map((car, index) => (
              <tr
                key={index}
                className='border-t hover:bg-gray-50 transition'
              >

                {/* INDEX */}
                <td className='p-4 text-center font-medium text-gray-500'>
                  {index + 1}
                </td>

                {/* CAR */}
                <td className='p-4'>
                  <div className='flex items-center gap-3'>

                    {/* IMAGE */}
                    <div className='h-14 w-14 flex-shrink-0'>
                      <img
                        src={car.image || "/placeholder-car.png"}
                        onError={(e) => (e.target.src = "/placeholder-car.png")}
                        className="h-full w-full rounded-lg object-cover border"
                        alt=""
                      />
                    </div>

                    {/* TEXT */}
                    <div>
                      <p className='font-semibold text-gray-800'>
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
                <td className='p-4 font-medium'>
                  {currency}{car.pricePerDay}
                  <span className='text-xs text-gray-400'> /day</span>
                </td>

                {/* RATING */}
                <td className='p-4'>
                  {car.avgRating > 0 ? (
                    <div className="flex items-center gap-1 text-yellow-500 font-medium">
                      ⭐ {car.avgRating}
                      <span className="text-xs text-gray-400">
                        ({car.totalReviews})
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No Ratings</span>
                  )}
                </td>

                {/* STATUS */}
                <td className='p-4 max-md:hidden'>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${car.isAvaliable
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                    }`}>
                    {car.isAvaliable ? "Available" : "Unavailable"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className='p-4'>
                  <div className='flex items-center justify-center gap-4'>

                    <button
                      onClick={() => toggleAvailability(car._id)}
                      className='p-2 hover:bg-gray-100 rounded-md transition'
                    >
                      <img
                        src={car.isAvaliable ? assets.eye_close_icon : assets.eye_icon}
                        className='w-5'
                        alt=""
                      />
                    </button>

                    <button className='p-2 hover:bg-blue-50 rounded-md transition'>
                      <img src={assets.edit_icon} className='w-5' alt="" />
                    </button>

                    <button
                      onClick={() => deleteCar(car._id)}
                      className='p-2 hover:bg-red-50 rounded-md transition'
                    >
                      <img src={assets.delete_icon} className='w-5' alt="" />
                    </button>

                  </div>
                </td>

              </tr>
            )) : (
              <tr>
                <td colSpan="10" className="text-center py-12 text-gray-400">
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