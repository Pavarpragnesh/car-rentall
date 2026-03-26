import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Protect Middleware
export const protect = async (req, res, next)=>{
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({ success: false, message: "Not authorized, no token" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.id) {
            return res.json({ success: false, message: "Invalid token" });
        }

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: "Not authorized, token failed" });
    }
};


// ✅ ADD THIS (MISSING PART)
export const adminOnly = (req, res, next)=>{
    try {
        if(req.user.role !== "admin"){
            return res.json({ success: false, message: "Admin access only" });
        }
        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};