import Terms from "../models/Terms.js";

// ✅ Get Terms (Public)
export const getTerms = async (req, res) => {
  try {
    const terms = await Terms.findOne().sort({ createdAt: -1 });

    res.json({ success: true, terms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ✅ Add / Update Terms (Admin)
export const saveTerms = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.json({ success: false, message: "Content required" });
    }

    let terms = await Terms.findOne();

    if (terms) {
      terms.content = content;
      await terms.save();
    } else {
      terms = await Terms.create({
        content,
        createdBy: req.user._id
      });
    }

    res.json({ success: true, message: "Terms saved successfully", terms });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ✅ Delete Terms (Optional)
export const deleteTerms = async (req, res) => {
  try {
    await Terms.deleteMany();
    res.json({ success: true, message: "Terms deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};