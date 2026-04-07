import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const CarCard = ({car}) => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()
    const toggleAvailability = async (carId) => {
  try {
    const { data } = await axios.post('/api/owner/toggle-car', { carId })

    if (data.success) {
      toast.success(data.message)

       // 🔥 Instant UI Update
        setCars(prev =>
          prev.map(car =>
            car._id === carId
              ? { ...car, isAvaliable: !car.isAvaliable }
              : car
          )
        )
    } else {
      toast.error(data.message)
    }

  } catch (error) {
    toast.error(error.message)
  }
}
const fetchOwnerCars = async () => {
  try {
    const { data } = await axios.get('/api/owner/cars')

    if (data.success) {
      setCars(data.cars)
    }
  } catch (error) {
    toast.error(error.message)
  }
}

  return (
    <div onClick={()=> {navigate(`/car-details/${car._id}`); scrollTo(0,0)}} className='group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer'>
      
      <div className='relative h-48 overflow-hidden'> 
        <img src={car.image} alt="Car Image" className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'/>

        <p className={`absolute top-4 left-4 text-white text-xs px-3 py-1 rounded-full
        ${car.isAvaliable ? 'bg-green-500' : 'bg-red-500'}
        `}>
        {car.isAvaliable ? "Available" : "Unavailable"}
        </p>

        <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
            <span className='font-semibold'>{currency}{car.pricePerDay}</span>
            <span className='text-sm text-white/80'> / day</span>
        </div>
      </div>

      <div className='p-4 sm:p-5'>
        <div className='flex justify-between items-start mb-2'>
            <div>
                <h3 className='text-lg font-medium'>{car.brand} {car.model}</h3>
                <p className='text-muted-foreground text-sm'>{car.category} • {car.year}</p>
            </div>
        </div>

        <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
            <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.users_icon} alt="" className='h-4 mr-2'/>
                <span>{car.seating_capacity} Seats</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.fuel_icon} alt="" className='h-4 mr-2'/>
                <span>{car.fuel_type}</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.car_icon} alt="" className='h-4 mr-2'/>
                <span>{car.transmission}</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.location_icon} alt="" className='h-4 mr-2'/>
                <span>{car.location}</span>
            </div>
        </div>

      </div>

    </div>
  )
}

export default CarCard
