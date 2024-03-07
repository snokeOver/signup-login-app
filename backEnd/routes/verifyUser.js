import jwt from "jsonwebtoken";
import errorHandler from "./errorHandler.js";

export const verifyToken = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(errorHandler("Unauthorized user", 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler("Unauthorized", 401));
    }
    req.user = user;
    next();
  });
};
