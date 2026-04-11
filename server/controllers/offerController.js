import Offer from "../models/offer.js";

// ➕ ADD
export const addOffer = async (req, res) => {
  try {
    const {
      name,
      code,
      discountType,
      discountValue,
      startDate,
      endDate,
    } = req.body;

    if (!name || !code || !discountType || !discountValue || !startDate || !endDate) {
      return res.json({ success: false, message: "All fields required" });
    }

    const exist = await Offer.findOne({ code });
    if (exist) {
      return res.json({ success: false, message: "Code already exists" });
    }

    const offer = await Offer.create({
      name,
      code,
      discountType,
      discountValue,
      startDate,
      endDate,
    });

    res.json({ success: true, offer });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 📋 LIST
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json({ success: true, offers });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✏️ UPDATE
export const updateOffer = async (req, res) => {
  try {
    const { id, ...data } = req.body;

    await Offer.findByIdAndUpdate(id, data);

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ❌ DELETE
export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.body;

    await Offer.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 🔁 TOGGLE ACTIVE
export const toggleOffer = async (req, res) => {
  try {
    const { id } = req.body;

    const offer = await Offer.findById(id);
    offer.isActive = !offer.isActive;

    await offer.save();

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};