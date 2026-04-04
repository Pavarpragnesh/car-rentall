import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import Title from '../../components/owner/Title'
import toast from 'react-hot-toast'

const ManageLocations = () => {

  const { axios } = useAppContext()
  const [locations, setLocations] = useState([])

  const fetchLocations = async () => {
    try {
      const { data } = await axios.get('/api/admin/locations')

      if (data.success) {
        setLocations(data.locations)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  // ✅ Toggle
  const toggle = async (id) => {
    try {
      const { data } = await axios.post('/api/admin/toggle-location', {
        locationId: id
      })

      if (data.success) {
        toast.success(data.message)
        fetchLocations()
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // ✅ Delete
  const remove = async (id) => {
    if (!window.confirm("Delete this location?")) return

    try {
      const { data } = await axios.post('/api/admin/delete-location', {
        locationId: id
      })

      if (data.success) {
        toast.success(data.message)
        fetchLocations()
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>

      <Title
        title="Manage Locations"
        subTitle="Control availability and delete locations"
      />

      <div className='max-w-4xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full text-left text-sm'>

          <thead className='border-b'>
            <tr>
              <th className="p-3">Location</th>
              <th className="p-3">Address</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {locations.map((loc) => (
              <tr key={loc._id} className='border-b hover:bg-gray-50'>

                <td className='p-3 font-medium'>{loc.name}</td>

                <td className='p-3 text-gray-500'>{loc.address}</td>

                <td className='p-3'>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    loc.isAvailable
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-500'
                  }`}>
                    {loc.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td className='flex gap-2 p-3'>
                  <button
                    onClick={() => toggle(loc._id)}
                    className='px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded cursor-pointer hover:bg-blue-200'
                  >
                    Toggle
                  </button>

                  <button
                    onClick={() => remove(loc._id)}
                    className='px-3 py-1 text-xs bg-red-100 text-red-600 rounded cursor-pointer hover:bg-red-200'
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
  )
}

export default ManageLocations