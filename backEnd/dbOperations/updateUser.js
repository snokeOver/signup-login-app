import errorHandler from "../routes/errorHandler.js";
import bcryptjs from "bcryptjs";
import User from "../schemas/userSchema.js";
import { sendResponse } from "./helper/sendResponse.js";

export const updateUser = async (req, res, next) => {
  // console.log(req.body);

  if (req.user.id !== req.params.userID) {
    return next(errorHandler("Unauthorized", 401));
  }
  if (req.body.password) {
    req.body.password = bcryptjs.hashSync(req.body.password, 9);
  }
  try {
    const userToUpdate = await User.findById(req.params.userID);
    if (!userToUpdate) {
      return next(errorHandler("User Not Found", 400));
    }
    // Update user properties with req.body values
    Object.assign(userToUpdate, req.body);

    // Save the updated user, triggering schema validation
    const updatedUser = await userToUpdate.save();

    sendResponse(updatedUser, res);
  } catch (err) {
    console.log(err.message);
    next(errorHandler(err.message));
  }
};
