import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'

const Users = () => {

  const { axios } = useAppContext()

  const [users, setUsers] = useState([])

  // ✅ Modal State
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    role: ''
  })

  // ✅ Fetch Users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin/users')

      if (data.success) {
        setUsers(data.users)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ✅ Toggle Status
  const toggleStatus = async (id) => {
    try {
      const { data } = await axios.post('/api/admin/toggle-user', {
        userId: id
      })

      if (data.success) {
        toast.success(data.message)
        fetchUsers()
        // instant UI update
        
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // ✅ Delete User
  const deleteUser = async (id) => {
    try {
      const { data } = await axios.post('/api/admin/delete-user', {
        userId: id
      })

      if (data.success) {
        toast.success(data.message)
        setUsers(prev => prev.filter(user => user._id !== id))
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // ✅ Open Modal
  const openUpdateModal = (user) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      role: user.role
    })
    setShowModal(true)
  }

  // ✅ Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // ✅ Update User
  const updateUser = async () => {
    try {
      const { data } = await axios.post('/api/admin/update-user', {
        userId: selectedUser._id,
        name: formData.name,
        role: formData.role
      })

      if (data.success) {
        toast.success(data.message)
        setShowModal(false)
        fetchUsers()
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>

      {/* ✅ Title */}
      <Title
        title="Users Management"
        subTitle="Manage all platform users"
      />

      {/* ✅ Table */}
      <div className='mt-6 border border-borderColor rounded-md p-4 md:p-6 w-full'>
        <div className='overflow-x-auto'>

          <table className='w-full text-sm text-left'>

            <thead className='border-b'>
              <tr>
                <th className='py-2'>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Role</th>
                <th>Image</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className='border-b hover:bg-gray-50'>

                  <td className='py-2'>{index + 1}</td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>******</td>

                  {/* Role */}
                  <td>
                    <span className='px-2 py-1 text-xs rounded bg-gray-100'>
                      {user.role}
                    </span>
                  </td>

                  {/* Image */}
                  <td>
                    <img
                      src={user.image || "https://via.placeholder.com/40"}
                      className='w-8 h-8 rounded-full object-cover'
                    />
                  </td>

                  {/* Status */}
                  <td>
                    <button
                      onClick={() => toggleStatus(user._id)}
                      className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition ${
                        user.active 
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      {user.active  ? "Available" : "Unavailable"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className='flex gap-2 py-2'>
                    <button
                      onClick={() => openUpdateModal(user)}
                      className='px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded cursor-pointer hover:bg-blue-200'
                    >
                      Update
                    </button>

                    <button
                      onClick={() => deleteUser(user._id)}
                      className='px-2 py-1 text-xs bg-red-100 text-red-600 rounded cursor-pointer hover:bg-red-200'
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

      {/* ✅ Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-lg p-6 w-[320px] shadow-lg">

            <h2 className="text-lg font-semibold mb-4">Update User</h2>

            {/* Name */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mb-3 px-3 py-2 border rounded outline-none"
            />

            {/* Role */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mb-4 px-3 py-2 border rounded outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={updateUser}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Users