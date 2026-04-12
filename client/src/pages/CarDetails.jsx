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

  const [offerCode, setOfferCode] = useState("")
  const [appliedOffer, setAppliedOffer] = useState(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  const [agreeTerms, setAgreeTerms] = useState(false)

  // ✅ APPLY OFFER
  const handleApplyOffer = async () => {
    if (!offerCode) return toast.error("Enter offer code")

    try {
      const { data } = await axios.post("/api/offers/apply", { code: offerCode })

      if (data.success) {
        const offer = data.offer

        let discount = 0

        if (offer.discountType === "flat") {
          discount = offer.discountValue
        } else {
          discount = (car.pricePerDay * offer.discountValue) / 100
        }

        if (discount > car.pricePerDay) {
          discount = car.pricePerDay
        }

        setAppliedOffer(offer)
        setDiscountAmount(discount)

        toast.success("Offer applied")
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const removeOffer = () => {
    setAppliedOffer(null)
    setDiscountAmount(0)
    setOfferCode("")
  }

  const finalPrice = car ? car.pricePerDay - discountAmount : 0

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!agreeTerms) return toast.error("Accept Terms")

    try {
      const { data } = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate,
        returnDate,
        offer: appliedOffer?._id || null
      })

      if (data.success) {
        toast.success(data.message)
        navigate('/my-bookings')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    setCar(cars.find(car => car._id === id))
  }, [cars, id])

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>

      {/* BACK */}
      <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 hover:text-black'>
        <img src={assets.arrow_icon} className='rotate-180 w-4 opacity-60' />
        Back to cars
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>

        {/* LEFT */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className='lg:col-span-2 space-y-6'>
          <img src={car.image} className='w-full h-[420px] object-cover rounded-2xl shadow-lg' />

          <div className='bg-white rounded-2xl p-6 shadow-md space-y-4'>
            <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
            <p className='text-gray-500'>{car.category} • {car.year}</p>

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4'>
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div key={text} className='flex flex-col items-center bg-gray-50 p-4 rounded-xl'>
                  <img src={icon} className='h-5 mb-2 opacity-70' />
                  <p className='text-sm'>{text}</p>
                </div>
              ))}
            </div>

            <p className='text-gray-500 text-sm'>{car.description}</p>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.form onSubmit={handleSubmit} className='sticky top-20 bg-white shadow-xl rounded-2xl p-6 space-y-6'>

          {/* PRICE */}
          <div>
            {appliedOffer ? (
              <>
                <p className='line-through text-gray-400'>{currency}{car.pricePerDay}</p>
                <p className='text-3xl font-bold text-green-600'>{currency}{finalPrice}</p>
                <p className='text-sm text-green-600'>You saved {currency}{discountAmount}</p>
              </>
            ) : (
              <p className='text-3xl font-bold'>{currency}{car.pricePerDay}</p>
            )}
          </div>

          {/* DATES */}
          <div className='space-y-3'>
            <div>
              <label className='text-sm'>Pickup Date</label>
              <input type="date" value={pickupDate} onChange={(e)=>setPickupDate(e.target.value)} className='w-full border rounded-lg px-3 py-2 mt-1' required />
            </div>

            <div>
              <label className='text-sm'>Return Date</label>
              <input type="date" value={returnDate} onChange={(e)=>setReturnDate(e.target.value)} className='w-full border rounded-lg px-3 py-2 mt-1' required />
            </div>
          </div>

          {/* OFFER */}
          <div className='bg-gray-50 p-4 rounded-xl space-y-3'>
            <label className='text-sm font-medium'>Offer Code</label>

            <div className='flex gap-2'>
              <input
                type="text"
                value={offerCode}
                onChange={(e)=>setOfferCode(e.target.value)}
                disabled={appliedOffer}
                className='flex-1 border rounded-lg px-3 py-2'
              />

              {!appliedOffer ? (
                <button type="button" onClick={handleApplyOffer} className='bg-black text-white px-4 rounded-lg'>
                  Apply
                </button>
              ) : (
                <button type="button" onClick={removeOffer} className='bg-red-500 text-white px-4 rounded-lg'>
                  Remove
                </button>
              )}
            </div>

            {appliedOffer && <p className='text-green-600 text-sm'>✓ {appliedOffer.code} applied</p>}
          </div>

          {/* TERMS */}
          <div className='flex items-start gap-2 text-sm'>
            <input type="checkbox" checked={agreeTerms} onChange={(e)=>setAgreeTerms(e.target.checked)} />
            <p>I agree to Terms & Conditions</p>
          </div>

          <button disabled={!agreeTerms} className={`w-full py-3 rounded-xl text-white ${agreeTerms ? 'bg-blue-600' : 'bg-gray-400'}`}>
            Book Now
          </button>

        </motion.form>
      </div>
    </div>
  ) : <Loader />
}

export default CarDetails