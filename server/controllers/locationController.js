import Location from "../models/Location.js"

// Add Location
export const addLocation = async (req,res)=>{
    try {

        const {name,address} = req.body

        const location = await Location.create({
            name,
            address
        })

        res.json({
            success:true,
            message:"Location Added",
            location
        })

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}


// Get All Locations
export const getLocations = async (req,res)=>{
    try {

        const locations = await Location.find()

        res.json({
            success:true,
            locations
        })

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}


// Update Location
export const updateLocation = async (req,res)=>{
    try {

        const {locationId,name,address} = req.body

        await Location.findByIdAndUpdate(locationId,{
            name,
            address
        })

        res.json({
            success:true,
            message:"Location Updated"
        })

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}


// Toggle Availability
export const toggleLocation = async (req,res)=>{
    try {

        const {locationId} = req.body

        const location = await Location.findById(locationId)

        location.isAvailable = !location.isAvailable

        await location.save()

        res.json({
            success:true,
            message:"Availability Updated"
        })

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}


// Delete Location
export const deleteLocation = async (req,res)=>{
    try {

        const {locationId} = req.body

        await Location.findByIdAndDelete(locationId)

        res.json({
            success:true,
            message:"Location Deleted"
        })

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}