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