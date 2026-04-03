import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Car from "../models/Car.js";

export const getAdminDashboard = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("car")
            .sort({ createdAt: -1 });

        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === "pending").length;
        const completedBookings = bookings.filter(b => b.status === "confirmed").length;

        const totalUsers = await User.countDocuments();
        const totalCars = await Car.countDocuments();

        const monthlyRevenue = bookings
            .filter(b => b.status === "confirmed")
            .reduce((acc, b) => acc + b.price, 0);

        res.json({
            success: true,
            dashboardData: {
                totalCars,
                totalUsers,
                totalBookings,
                pendingBookings,
                completedBookings,
                recentBookings: bookings.slice(0, 5),
                monthlyRevenue
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

// ✅ Get All Bookings (Admin)
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("car")
            .populate("user", "name email")
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            bookings
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Get All Cars (Admin)
export const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find()
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            cars
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

export const toggleCarStatus = async (req, res) => {
    try {
        const { carId } = req.body;

        const car = await Car.findById(carId);

        car.isAvaliable = !car.isAvaliable;

        await car.save();

        res.json({
            success: true,
            message: "Car status updated",
            isAvaliable: car.isAvaliable
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteCarAdmin = async (req, res) => {
    try {
        const { carId } = req.body;

        await Car.findByIdAndDelete(carId);

        res.json({
            success: true,
            message: "Car deleted"
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};