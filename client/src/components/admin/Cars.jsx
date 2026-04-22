import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'

const Cars = () => {

  const { axios } = useAppContext()

  const [cars, setCars] = useState([])
  const [selectedCar, setSelectedCar] = useState(null)
  const [openDrawer, setOpenDrawer] = useState(false)

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

  // ✅ Open Drawer
  const handleView = (car) => {
    setSelectedCar(car)
    setOpenDrawer(true)
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
                    <img src={car.image} className='w-12 h-8 object-cover rounded' />
                  </td>

                  {/* Status */}
                  <td>
                    <button
                      onClick={() => toggleStatus(car._id)}
                      className={`px-3 py-1 rounded text-xs ${
                        car.isAvaliable
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {car.isAvaliable ? "Available" : "Unavailable"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className='flex gap-2 py-2'>

                    {/* ✅ VIEW BUTTON */}
                    <button
                      onClick={() => handleView(car)}
                      className='px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded'
                    >
                      View
                    </button>

                    <button
                      onClick={() => deleteCar(car._id)}
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

      {/* ================= DRAWER ================= */}
     {openDrawer && selectedCar && (
  <div className="fixed inset-0 z-50 flex">

    {/* Overlay */}
    <div
      className="flex-1 bg-black/40"
      onClick={() => setOpenDrawer(false)}
    ></div>

    {/* Drawer */}
    <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10">
        <div>
          <h2 className="text-lg font-semibold">Car Details</h2>
          <p className="text-xs text-gray-500">Complete information</p>
        </div>

        <button
          onClick={() => setOpenDrawer(false)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          ✖
        </button>
      </div>

      {/* IMAGE + BASIC INFO */}
      <div className="p-6 border-b">

        <div className="flex gap-4">
          <img
            src={selectedCar.image}
            className="w-32 h-24 object-cover rounded-lg border"
          />

          <div className="flex-1">
            <h3 className="text-xl font-semibold">
              {selectedCar.brand} {selectedCar.model}
            </h3>

            <p className="text-sm text-gray-500">
              {selectedCar.category} • {selectedCar.year}
            </p>

            {/* STATUS */}
            <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${
              selectedCar.isAvaliable
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {selectedCar.isAvaliable ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>

      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 gap-4 p-6 border-b">

        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500">Price / Day</p>
          <p className="text-lg font-semibold">₹{selectedCar.pricePerDay}</p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500">Seats</p>
          <p className="text-lg font-semibold">{selectedCar.seating_capacity}</p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500">Fuel Type</p>
          <p className="text-lg font-semibold">{selectedCar.fuel_type}</p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500">Transmission</p>
          <p className="text-lg font-semibold">{selectedCar.transmission}</p>
        </div>

      </div>

      {/* DETAILS SECTION */}
      <div className="p-6 space-y-5 border-b">

        <div>
          <p className="text-sm font-medium mb-1">Location</p>
          <p className="text-sm text-gray-600">{selectedCar.location}</p>
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Description</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {selectedCar.description}
          </p>
        </div>

      </div>

      {/* OWNER SECTION */}
      <div className="p-6">

        <p className="text-sm font-medium mb-3">Owner Information</p>

        <div className="border rounded-lg p-4 flex justify-between items-center">

          <div>
            <p className="font-medium">{selectedCar.owner?.name}</p>
            <p className="text-xs text-gray-500">{selectedCar.owner?.email}</p>
          </div>

          <div className="text-xs text-gray-400">
            Owner
          </div>

        </div>

      </div>

    </div>
  </div>
)}

    </div>
  )
}

export default Cars