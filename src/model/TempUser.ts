import { model, models, Schema } from "mongoose";

const TempUserSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, required: false },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    verificationToken: String, // Add this field

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const TempUserModel = models.TempUsers || model("TempUsers", TempUserSchema);
export default TempUserModel;
