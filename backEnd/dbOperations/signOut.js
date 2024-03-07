import errorHandler from "../routes/errorHandler.js";

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).send("Sign Out successful");
  } catch (err) {
    next(errorHandler("Error while signing out"));
  }
};
