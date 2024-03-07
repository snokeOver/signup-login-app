import errorHandler from "../routes/errorHandler.js";
import User from "../schemas/userSchema.js";
import bcryptjs from "bcryptjs";
import { sendResponse } from "./helper/sendResponse.js";

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await User.findOne({ "userEmail.email": email });
    if (!result) {
      next(errorHandler("Either email or password is wrong!", 400));
    } else {
      const validPass = bcryptjs.compareSync(password, result.password);

      if (!validPass) {
        next(errorHandler("Either email or password is wrong!", 400));
      } else {
        sendResponse(result, res);
      }
    }
  } catch (err) {
    next(errorHandler(err.message));
  }
};
