import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import locationRouter from "./routes/locationRoutes.js";
import termsRouter from "./routes/termsRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";

// ✅ ADD THIS
import adminRouter from "./routes/adminRoutes.js";

// Initialize Express App
const app = express()

// Connect Database
await connectDB()

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res)=> res.send("Server is running"))

// Routes
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)
app.use("/api/location", locationRouter)
app.use("/api/terms", termsRouter);
app.use("/api/offers", offerRoutes);
// ✅ VERY IMPORTANT (THIS FIXES YOUR ERROR)
app.use('/api/admin', adminRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))