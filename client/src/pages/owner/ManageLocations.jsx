import React,{useEffect,useState} from 'react'
import { useAppContext } from '../../context/AppContext'
import Title from '../../components/owner/Title'
import toast from 'react-hot-toast'

const ManageLocations = () => {

const {axios} = useAppContext()

const [locations,setLocations] = useState([])

const fetchLocations = async()=>{
    try {

        const {data} = await axios.get('/api/location/list')

        if(data.success){
            setLocations(data.locations)
        }else{
            toast.error(data.message)
        }

    } catch (error) {
        toast.error(error.message)
    }
}

const toggle = async(id)=>{
    try {

        const {data} = await axios.post('/api/location/toggle',{locationId:id})

        if(data.success){
            toast.success(data.message)
            fetchLocations()
        }else{
            toast.error(data.message)
        }

    } catch (error) {
        toast.error(error.message)
    }
}

const remove = async(id)=>{

    const confirm = window.confirm("Delete this location?")

    if(!confirm) return

    try {

        const {data} = await axios.post('/api/location/delete',{locationId:id})

        if(data.success){
            toast.success(data.message)
            fetchLocations()
        }else{
            toast.error(data.message)
        }

    } catch (error) {
        toast.error(error.message)
    }
}

useEffect(()=>{
fetchLocations()
},[])

return (

<div className='px-4 pt-10 md:px-10 w-full'>

<Title
title="Manage Locations"
subTitle="View all locations, update availability or remove them."
/>

<div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

<table className='w-full border-collapse text-left text-sm text-gray-600'>

<thead className='text-gray-500'>
<tr>
<th className="p-3 font-medium">Location</th>
<th className="p-3 font-medium">Address</th>
<th className="p-3 font-medium">Status</th>
<th className="p-3 font-medium">Actions</th>
</tr>
</thead>

<tbody>

{locations.map((loc)=>(
<tr key={loc._id} className='border-t border-borderColor'>

<td className='p-3 font-medium'>
{loc.name}
</td>

<td className='p-3 text-gray-500'>
{loc.address}
</td>

<td className='p-3'>

<span className={`px-3 py-1 rounded-full text-xs
${loc.isAvailable
? 'bg-green-100 text-green-600'
: 'bg-red-100 text-red-500'}
`}>

{loc.isAvailable ? "Available" : "Unavailable"}

</span>

</td>

<td className='flex items-center gap-3 p-3'>

<button
onClick={()=>toggle(loc._id)}
className='px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded cursor-pointer hover:bg-blue-200'
>
👁Toggle
</button>

<button
onClick={()=>remove(loc._id)}
className='px-3 py-1 text-xs bg-red-100 text-red-600 rounded cursor-pointer hover:bg-red-200'
>
🗑 Delete
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