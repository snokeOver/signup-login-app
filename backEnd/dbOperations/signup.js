import errorHandler from "../routes/errorHandler.js";
import User from "../schemas/userSchema.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  const passwordToSave = bcryptjs.hashSync(req.body.password, 9);
  const userToSaved = {
    user: req.body.user,
    userEmail: {
      email: req.body.email,
      isVerified: false,
    },
    password: passwordToSave,
  };

  try {
    const user = new User(userToSaved);
    const saveduser = await user.save();
    res.status(200).send({
      Message: "Signup Success!",
    });
  } catch (err) {
    // console.log(err.message);
    next(errorHandler(err.message));
  }
};
