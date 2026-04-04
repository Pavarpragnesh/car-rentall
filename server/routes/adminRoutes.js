import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { getAllUsers,toggleUserStatus, 
  deleteUser, 
  updateUser,getAdminDashboard,getAllCars, toggleCarStatus, deleteCarAdmin } from "../controllers/adminController.js";
import User from "../models/User.js";
import { getAllBookings } from "../controllers/adminController.js";
import {
  getAllLocations,
  addLocation,
  toggleLocation,
  deleteLocation
} from "../controllers/adminController.js";

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
adminRouter.get("/cars", protect,adminOnly, getAllCars);
adminRouter.post("/toggle-car", protect,adminOnly,toggleCarStatus);
adminRouter.post("/delete-car", protect, adminOnly,deleteCarAdmin);
adminRouter.get("/locations", protect, adminOnly,getAllLocations);
adminRouter.post("/add-location", protect, adminOnly, addLocation);
adminRouter.post("/toggle-location", protect,adminOnly, toggleLocation);
adminRouter.post("/delete-location", protect,adminOnly, deleteLocation);
export default adminRouter; 