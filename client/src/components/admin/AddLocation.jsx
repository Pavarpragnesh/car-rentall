import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import Title from '../../components/owner/Title'

const AddLocation = () => {

  const { axios } = useAppContext()

  const [name, setName] = useState("")
  const [address, setAddress] = useState("")

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post('/api/admin/add-location', {
        name,
        address
      })

      if (data.success) {
        toast.success(data.message)
        setName("")
        setAddress("")
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>

      <Title title="Add Location" subTitle="Add new pickup location" />

      <form onSubmit={submitHandler} className='flex flex-col gap-4 max-w-md mt-6'>

        <input
          type="text"
          placeholder="Location Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='border p-2 rounded'
          required
        />

        <textarea
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className='border p-2 rounded'
          required
        />

        <button className='bg-primary text-white px-4 py-2 rounded hover:opacity-90'>
          Add Location
        </button>

      </form>

    </div>
  )
}

export default AddLocation