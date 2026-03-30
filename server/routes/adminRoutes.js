import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { getAllUsers,toggleUserStatus, 
  deleteUser, 
  updateUser,getAdminDashboard } from "../controllers/adminController.js";
import User from "../models/User.js";
import { getAllBookings } from "../controllers/adminController.js";
const adminRouter = express.Router();

adminRouter.get("/users", protect,adminOnly, getAllUsers);
adminRouter.get("/dashboard", protect,adminOnly, getAdminDashboard);
// ✅ Admin Users API
adminRouter.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});
adminRouter.post("/toggle-user", protect,adminOnly, toggleUserStatus);
adminRouter.post("/delete-user", protect,adminOnly, deleteUser);
adminRouter.post("/update-user", protect,adminOnly, updateUser);
adminRouter.get("/bookings", protect, getAllBookings);

export default adminRouter; 