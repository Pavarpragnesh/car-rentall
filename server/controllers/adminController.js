import User from "../models/User.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

export const getAdminDashboard = async (req, res) => {
    try {
        const totalCars = await Car.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalBookings = await Booking.countDocuments();

        res.json({
            success: true,
            dashboardData: {
                totalCars,
                totalUsers,
                totalBookings,
                pendingBookings: 0,
                completedBookings: 0,
                recentBookings: [],
                monthlyRevenue: 0
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ✅ Get All Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // hide password

        res.json({
            success: true,
            users
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Toggle Active Status
export const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        user.active = !user.active;

        await user.save();

        res.json({ success: true, message: "Status updated" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ✅ Delete User
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;

        await User.findByIdAndDelete(userId);

        res.json({ success: true, message: "User deleted" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ✅ Update User
export const updateUser = async (req, res) => {
    try {
        const { userId, name, role } = req.body;

        await User.findByIdAndUpdate(userId, { name, role });

        res.json({ success: true, message: "User updated" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};