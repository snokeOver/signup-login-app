import errorHandler from "../routes/errorHandler.js";
import User from "../schemas/userSchema.js";
import bcryptjs from "bcryptjs";
import { sendResponse } from "./helper/sendResponse.js";

export const googleAuth = async (req, res, next) => {
  const { email } = req.body;
  try {
    const result = await User.findOne({ "userEmail.email": email });
    if (result) {
      sendResponse(result, res);
    } else {
      console.log("No user");
      const generatedPass = Math.random().toString(36).slice(-8);
      const hashedPass = bcryptjs.hashSync(generatedPass, 9);
      const userToStore = new User(req.body);
      userToStore.userEmail.email = req.body.email;
      userToStore.userEmail.isVerified = true;

      userToStore.user =
        req.body.user.toLowerCase().split(" ").join("").substring(0, 10) +
        Math.random().toString(9).slice(-5);
      userToStore.password = hashedPass;
      console.log("before save:", userToStore);
      const savedUser = await userToStore.save();
      console.log("before save:", savedUser);
      sendResponse(savedUser, res);
    }
  } catch (err) {
    console.log(err.message);
    next(errorHandler(err.message));
  }
};
