import mongoose from "mongoose";
const forgotPasswordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    remainingTries: {
      type: Number,
      default: 3,
      max: 3,
    },
  },
  { timestamps: true }
);

const ForgotPasswordModel =
  mongoose.models.ForgotPassword ||
  mongoose.model("ForgotPassword", forgotPasswordSchema);

export default ForgotPasswordModel;
