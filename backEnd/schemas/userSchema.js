import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    theID: {
      type: String,
      unique: true,
      default: () =>
        "BD" +
        Math.random().toString(9).slice(-6) +
        Math.random().toString(9).slice(-4),
    },
    userType: {
      type: String,
      default: "User",
    },
    status: {
      type: String,
      default: "Inactive",
    },
  },
  user: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
    maxLength: 15,
  },
  userEmail: {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      default: () =>
        "rand" +
        Math.random().toString(9).slice(-6) +
        Math.random().toString(9).slice(-4),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  mobileNumber: {
    number: {
      type: String,
      unique: true,
      sparse: true,
      minLength: 11,
      maxLength: 14,
      default: () =>
        "rand" +
        Math.random().toString(9).slice(-6) +
        Math.random().toString(9).slice(-4),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },

  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 150,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
  profilePic: {
    type: String,
    default:
      "https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png",
    required: true,
  },
});

const User = mongoose.model("MyUser", userSchema);
export default User;
