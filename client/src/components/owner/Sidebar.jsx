import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Sidebar = () => {

  const { user, axios, fetchUser } = useAppContext()
  const location = useLocation()

  const [image, setImage] = useState('')

  const updateImage = async () => {

    try {

      const formData = new FormData()
      formData.append('image', image)

      const { data } = await axios.post('/api/owner/update-image', formData)

      if (data.success) {

        fetchUser()
        toast.success(data.message)
        setImage('')

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

  }

  return (

    <div className='min-h-screen border-r border-borderColor w-60 flex flex-col items-center pt-8 bg-white'>

      {/* USER IMAGE */}

      <div className='relative group'>

        <label htmlFor="image">

          <img
            src={image ? URL.createObjectURL(image) : user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d"}
            className='h-14 w-14 rounded-full object-cover cursor-pointer'
          />

          <input
            type="file"
            id='image'
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className='absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/20 rounded-full'>
            <img src={assets.edit_icon} />
          </div>

        </label>

      </div>

      {image && (

        <button
          onClick={updateImage}
          className='mt-2 flex items-center gap-1 text-primary text-xs'
        >
          Save <img src={assets.check_icon} width={12} />
        </button>

      )}

      <p className='mt-3 font-medium'>{user?.name}</p>


      {/* MENU */}

      <div className='w-full mt-6'>

        {ownerMenuLinks.map((link, index) => (

          <NavLink
            key={index}
            to={link.path}
            className={`flex items-center gap-3 px-6 py-3 text-sm relative
            ${location.pathname === link.path
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:bg-gray-50"
              }`}
          >

            <img
              src={location.pathname === link.path ? link.coloredIcon : link.icon}
              width={20}
            />

            <span>{link.name}</span>

            {location.pathname === link.path && (
              <div className='absolute right-0 w-1.5 h-8 bg-primary rounded-l'></div>
            )}

          </NavLink>

        ))}

      </div>

    </div>
  )
}

export default Sidebar