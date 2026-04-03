import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'

const Cars = () => {

  const { axios } = useAppContext()
  const [cars, setCars] = useState([])

  // ✅ Fetch Cars
  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/api/admin/cars')

      if (data.success) {
        setCars(data.cars)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCars()
  }, [])

  // ✅ Toggle Availability
  const toggleStatus = async (id) => {
    try {
      const { data } = await axios.post('/api/admin/toggle-car', {
        carId: id
      })

      if (data.success) {
        toast.success(data.message)

        setCars(prev =>
          prev.map(car =>
            car._id === id
              ? { ...car, isAvaliable: data.isAvaliable }
              : car
          )
        )
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // ✅ Delete Car
  const deleteCar = async (id) => {
    try {
      const { data } = await axios.post('/api/admin/delete-car', {
        carId: id
      })

      if (data.success) {
        toast.success(data.message)
        setCars(prev => prev.filter(car => car._id !== id))
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>

      <Title title="Cars Management" subTitle="Manage all cars in platform" />

      <div className='mt-6 border border-borderColor rounded-md p-4 md:p-6 w-full'>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>

            <thead className='border-b'>
              <tr>
                <th>#</th>
                <th>Car</th>
                <th>Owner</th>
                <th>Price</th>
                <th>Image</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {cars.map((car, index) => (
                <tr key={car._id} className='border-b hover:bg-gray-50'>

                  <td>{index + 1}</td>

                  <td>{car.brand} {car.model}</td>

                  <td>
                    <p>{car.owner?.name}</p>
                    <p className='text-xs text-gray-500'>{car.owner?.email}</p>
                  </td>

                  <td>₹{car.pricePerDay}</td>

                  <td>
                    <img
                      src={car.image}
                      className='w-12 h-8 object-cover rounded'
                    />
                  </td>

                  {/* ✅ Status */}
                  <td>
                    <button
                      onClick={() => toggleStatus(car._id)}
                      className={`px-3 py-1 rounded text-xs cursor-pointer ${
                        car.isAvaliable
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {car.isAvaliable ? "Available" : "Unavailable"}
                    </button>
                  </td>

                  {/* ✅ Actions */}
                  <td className='flex gap-2 py-2'>
                    <button
                      onClick={() => deleteCar(car._id)}
                      className='px-2 py-1 text-xs bg-red-100 text-red-600 rounded cursor-pointer'
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

export default Cars