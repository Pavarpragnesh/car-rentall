import mongoose from "mongoose";

const termsSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

const Terms = mongoose.model("Terms", termsSchema);

export default Terms;