import express from "express";
import {
  addOffer,
  getOffers,
  updateOffer,
  deleteOffer,
  toggleOffer,
} from "../controllers/offerController.js";

const router = express.Router();

router.post("/add", addOffer);
router.get("/list", getOffers);
router.post("/update", updateOffer);
router.post("/delete", deleteOffer);
router.post("/toggle", toggleOffer);

export default router;