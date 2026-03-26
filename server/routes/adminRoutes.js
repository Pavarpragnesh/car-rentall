import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import User from "../models/User.js";

const adminRouter = express.Router();

// ✅ Admin Users API
adminRouter.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

export default adminRouter;