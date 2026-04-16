import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js";


// ✅ Generate JWT Token (WITH ROLE)
const generateToken = (user)=>{
    return jwt.sign(
        { id: user._id, role: user.role }, // ✅ include role
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
}


// ✅ Register User
export const registerUser = async (req, res)=>{
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password || password.length < 8){
            return res.json({success: false, message: 'Fill all the fields'})
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        const token = generateToken(user)

        res.json({
            success: true,
            token,
            role: user.role   // ✅ send role
        })

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// ✅ Login User (ADMIN INCLUDED)
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        // ✅ CHECK ACTIVE STATUS (MAIN FIX)
        if (user.active === false) {
            return res.json({
                success: false,
                message: "Your account is blocked by admin"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }

        const token = generateToken(user)

        res.json({
            success: true,
            token,
            role: user.role
        })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// ✅ Get User Data (Protected)
export const getUserData = async (req, res) =>{
    try {
        res.json({success: true, user: req.user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// ✅ Get All Cars
export const getCars = async (req, res) =>{
    try {
        const cars = await Car.find({isAvaliable: true})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}