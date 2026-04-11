import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const CarDetails = () => {

  const { id } = useParams()

  const { cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext()

  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const currency = import.meta.env.VITE_CURRENCY

  // ✅ Terms states
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [termsContent, setTermsContent] = useState("")

  // ✅ Fetch Terms
  const fetchTerms = async () => {
    try {
      const { data } = await axios.get("/api/terms")
      if (data.success) {
        setTermsContent(data.terms?.content || "")
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (showTerms) fetchTerms()
  }, [showTerms])

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!agreeTerms) {
      return toast.error("Please accept Terms & Conditions")
    }

    try {
      const { data } = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate,
        returnDate
      })

      if (data.success) {
        toast.success(data.message)
        navigate('/my-bookings')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    setCar(cars.find(car => car._id === id))
  }, [cars, id])

  return car ? (
    <>
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>

        <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
          <img src={assets.arrow_icon} className='rotate-180 opacity-65' />
          Back to all cars
        </button>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className='lg:col-span-2'
          >
            <img
              src={car.image}
              className='w-full md:max-h-100 object-cover rounded-xl mb-6 shadow-md'
            />

            <div className='space-y-6'>
              <div>
                <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
                <p className='text-gray-500 text-lg'>{car.category} • {car.year}</p>
              </div>

              <hr className='border-borderColor my-6' />

              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                {[
                  { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                  { icon: assets.fuel_icon, text: car.fuel_type },
                  { icon: assets.car_icon, text: car.transmission },
                  { icon: assets.location_icon, text: car.location },
                ].map(({ icon, text }) => (
                  <div key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                    <img src={icon} className='h-5 mb-2' />
                    {text}
                  </div>
                ))}
              </div>

              <div>
                <h1 className='text-xl font-medium mb-3'>Description</h1>
                <p className='text-gray-500'>{car.description}</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT FORM */}
          <motion.form
            onSubmit={handleSubmit}
            className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'
          >

            <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
              {currency}{car.pricePerDay}
              <span className='text-base text-gray-400 font-normal'>per day</span>
            </p>

            <hr className='border-borderColor my-6' />

            <div className='flex flex-col gap-2'>
              <label>Pickup Date</label>
              <input
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                type="date"
                className='border px-3 py-2 rounded-lg'
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label>Return Date</label>
              <input
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                type="date"
                className='border px-3 py-2 rounded-lg'
                required
              />
            </div>

            {/* ✅ TERMS */}
            <div className='flex items-start gap-2 text-sm'>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1"
              />
              <p>
                I agree to the{" "}
                <span
                  onClick={() => setShowTerms(true)}
                  className="text-blue-600 underline cursor-pointer"
                >
                  Terms & Conditions
                </span>
              </p>
            </div>

            <button
              disabled={!agreeTerms}
              className={`w-full py-3 font-medium text-white rounded-xl ${
                agreeTerms
                  ? "bg-primary hover:bg-primary-dull"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Book Now
            </button>

            <p className='text-center text-sm'>No credit card required</p>

          </motion.form>
        </div>
      </div>

      {/* ✅ FIXED SCROLL MODAL */}
      {showTerms && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center px-4"
          onClick={() => setShowTerms(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-3xl h-[85vh] rounded-xl shadow-lg flex flex-col"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b bg-white shrink-0">
              <h2 className="text-lg font-semibold">Terms & Conditions</h2>
              <button onClick={() => setShowTerms(false)}>✕</button>
            </div>

            {/* SCROLL AREA */}
            <div className="flex-1 overflow-y-auto p-5 text-sm text-gray-700">
              {termsContent ? (
                <div dangerouslySetInnerHTML={{ __html: termsContent }} />
              ) : (
                "Loading..."
              )}
            </div>

          </div>
        </div>
      )}
    </>
  ) : <Loader />
}

export default CarDetails