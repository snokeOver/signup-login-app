import errorHandler from "../routes/errorHandler.js";
import otpModel from "../schemas/otpSchema.js";
import User from "../schemas/userSchema.js";
import { sendResponse } from "./helper/sendResponse.js";

export const verifyEmail = async (req, res, next) => {
  if (req.user.id !== req.params.userID) {
    return next(errorHandler("Unautorized", 401));
  }

  const { email, otpCode } = req.body;
  const ID = req.params.userID;
  const postData = {
    userEmail: {
      email: email,
      isVerified: true,
    },
  };
  try {
    const isAvailable = await otpModel.findOne({ userId: ID });

    if (!isAvailable) {
      return res.status(201).send({ Message: "Your OTP Expired!" });
    }
    const populatedOtpData = await otpModel
      .findOne({ userId: ID })
      .populate("userId", "userEmail");
    const savedOtp = populatedOtpData.code;
    if (savedOtp !== otpCode) {
      return res.status(201).send({ Message: "OTP doesn't Matched!" });
    }

    const userToUpdate = await User.findById(ID);
    if (!userToUpdate) {
      return next(errorHandler("User Not Found", 400));
    }
    // Update user properties with req.body values
    Object.assign(userToUpdate, postData);

    // Save the updated user, triggering schema validation
    const updatedUser = await userToUpdate.save();

    sendResponse(updatedUser, res);
  } catch (err) {
    next(errorHandler(err.message));
    console.log(err.message);
  }
};
