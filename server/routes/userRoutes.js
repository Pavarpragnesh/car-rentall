import express from "express";
import {
    getCars,
    getUserData,
    loginUser,
    registerUser
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middleware/auth.js";
import User from "../models/User.js";

const userRouter = express.Router();

// ✅ Auth Routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// ✅ User Protected Route
userRouter.get('/data', protect, getUserData);

// ✅ Public Route
userRouter.get('/cars', getCars);

// ✅ Admin Only Route (example)
userRouter.get('/admin/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

export default userRouter;