import React, { useEffect, useState } from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'
import { useAppContext } from '../context/AppContext'

const Testimonial = () => {

  const { axios } = useAppContext()

  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTestimonials = async () => {
    try {
      const { data } = await axios.get('/api/bookings/testimonials')

      console.log("API RESPONSE:", data) // ✅ debug

      if (data.success) {
        setTestimonials(data.testimonials || [])
      }

    } catch (error) {
      console.log("ERROR:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">

      {/* TITLE */}
      <Title 
        title="What Our Customers Say" 
        subTitle="Real experiences from our users."
      />

      {/* LOADING */}
      {loading && (
        <p className="text-center mt-10 text-gray-500">
          Loading testimonials...
        </p>
      )}

      {/* NO DATA */}
      {!loading && testimonials.length === 0 && (
        <p className="text-center mt-10 text-gray-500">
          No reviews available yet
        </p>
      )}

      {/* TESTIMONIAL GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

        {testimonials.map((item, index) => (

          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
          >

            {/* USER INFO */}
            <div className="flex items-center gap-3">
              <img
                src={assets.user_icon}
                alt="user"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-lg font-semibold">
                  {item.user?.name || "Anonymous"}
                </p>
                <p className="text-sm text-gray-500">
                  {item.car?.brand} {item.car?.model}
                </p>
              </div>
            </div>

           {/* ⭐ RATING */}
            <div className="flex items-center gap-1 mt-4">
            {[1,2,3,4,5].map((star) => (
                <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill={star <= item.rating ? "#facc15" : "#e5e7eb"} // yellow / gray
                className="w-4 h-4"
                >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
                </svg>
            ))}
            </div>

            {/* REVIEW */}
            <p className="text-gray-600 mt-4 text-sm leading-relaxed">
              "{item.review || "No review provided"}"
            </p>

            {/* DATE (optional) */}
            <p className="text-xs text-gray-400 mt-3">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>

          </motion.div>
        ))}

      </div>
    </div>
  )
}

export default Testimonial