import express from "express";
import {
  addOffer,
  getOffers,
  updateOffer,
  deleteOffer,
  toggleOffer,
  applyOffer
} from "../controllers/offerController.js";

const router = express.Router();

router.post("/add", addOffer);
router.get("/list", getOffers);
router.post("/update", updateOffer);
router.post("/delete", deleteOffer);
router.post("/toggle", toggleOffer);
router.post("/apply", applyOffer);

export default router;