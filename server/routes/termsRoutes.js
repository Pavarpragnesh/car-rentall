import express from "express";
import { getTerms, saveTerms, deleteTerms } from "../controllers/termsController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const termsRouter = express.Router();

// ✅ Public
termsRouter.get("/", getTerms);

// ✅ Admin
termsRouter.post("/save", protect, adminOnly, saveTerms);
termsRouter.delete("/delete", protect, adminOnly, deleteTerms);

export default termsRouter;