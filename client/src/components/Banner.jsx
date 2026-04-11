import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'
import { useAppContext } from '../context/AppContext'
import car1 from '../assets/car1.png'

const Banner = () => {

  const { axios } = useAppContext()

  const [open, setOpen] = useState(false)
  const [offers, setOffers] = useState([])

  // ✅ Fetch Offers when modal opens
  const fetchOffers = async () => {
    try {
      const { data } = await axios.get('/api/offers/list')
      if (data.success) setOffers(data.offers)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (open) fetchOffers()
  }, [open])

  return (
    <>
      {/* ================= BANNER ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='flex flex-col md:flex-row items-center justify-between px-8 md:pl-14 pt-10 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden'
      >

        <div className='text-white'>
          <h2 className='text-3xl font-medium'>Do You Own a Luxury Car?</h2>
          <p className='mt-2'>Monetize your vehicle effortlessly by listing it on CarRental.</p>
          <p className='max-w-[500px]'>
            We handle insurance, verification & payments.
          </p>

          {/* ✅ OPEN MODAL */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className='px-6 py-2 bg-white hover:bg-slate-100 text-blue-600 rounded-lg mt-4 cursor-pointer'
          >
            Offers
          </motion.button>
        </div>

        <motion.img 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          src={assets.banner_car_image}
          alt="car"
          className='max-h-48 mt-10'
        />
      </motion.div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          ></div>

          {/* Modal Box */}
          <div className="relative bg-white rounded-2xl w-[95%] max-w-5xl max-h-[90vh] overflow-y-auto p-6">

            {/* Close Button */}
            <button 
              onClick={() => setOpen(false)}
              className="absolute top-3 right-4 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6">🔥 Available Offers</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {offers.map((o) => (
                <div
                  key={o._id}
                  className="rounded-2xl p-5 text-white relative overflow-hidden shadow-lg"
                  style={{
                    backgroundImage: `url(${car1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

                  <div className="relative z-10">
                    <h3 className="text-lg font-bold">{o.name}</h3>
                    <p className="text-gray-200">{o.code}</p>

                    <p className="mt-2 font-semibold">
                      {o.discountType === "flat"
                        ? `₹${o.discountValue} OFF`
                        : `${o.discountValue}% OFF`}
                    </p>

                    <p className="text-xs mt-2 text-gray-200">
                      {new Date(o.startDate).toLocaleString()} <br />
                      → {new Date(o.endDate).toLocaleString()}
                    </p>

                    <p className={`mt-2 ${
                      o.isActive ? "text-green-400" : "text-red-400"
                    }`}>
                      {o.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  )
}

export default Banner