import mongoose, { Schema } from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "MyUser", //Reference to the "myusers" collection
  },
  code: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    expires: 900, //It will expire after 15 minutes
  },
});

const otpModel = mongoose.model("otpCollection", otpSchema);

export default otpModel;
