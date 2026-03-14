import express from "express";
import { protect } from "../middleware/auth.js";
import { addLocation, deleteLocation, getLocations, toggleLocation, updateLocation } from "../controllers/locationController.js";

const locationRouter = express.Router()

locationRouter.post("/add",protect,addLocation)

locationRouter.get("/list",getLocations)

locationRouter.post("/update",protect,updateLocation)

locationRouter.post("/toggle",protect,toggleLocation)

locationRouter.post("/delete",protect,deleteLocation)

export default locationRouter