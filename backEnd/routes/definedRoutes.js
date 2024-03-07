import express from "express";
import { signup } from "../dbOperations/signup.js";
import { checkUser } from "../dbOperations/checkUser.js";
import { checkEmail } from "../dbOperations/checkEamil.js";
import { signIn } from "../dbOperations/signIn.js";
import { googleAuth } from "../dbOperations/googleAuth.js";
import { signOut } from "../dbOperations/signOut.js";
import { verifyToken } from "./verifyUser.js";
import { updateUser } from "../dbOperations/updateUser.js";
import { checkPhone } from "../dbOperations/checkPhone.js";
import { sendOTPToEmail } from "../dbOperations/helper/sendOTPToEmail.js";
import { saveEmailOtpToDB } from "../dbOperations/saveEmailOtpToDB.js";
import { verifyEmail } from "../dbOperations/verifyEmail.js";

// Initiate router
const router = express.Router();

//Sign Up (Insert One user into MongoDB)
router.post("/sign-up", signup);

//Sing In (Find one user with email)
router.post("/sign-in", signIn);

// Sign In with Google Authentication
router.post("/g-auth", googleAuth);

// Sign Out from Account
router.post("/sign-out", signOut);

// Update User
router.put("/update-user/:userID", verifyToken, updateUser);

// Check if the Username is already in the DB or not
// GET requests don't have a request body, accessing req.body in a GET request will likely result in an empty object ({})
router.post("/check-user", checkUser);

//Check if the Email is already in the DB or not
router.post("/check-email", checkEmail);

//Check if the Phone number is already in the DB or not
router.post("/check-phone", checkPhone);

// send otp to email
router.post(
  "/send-otp-to-email/:userID",
  verifyToken,
  saveEmailOtpToDB,
  sendOTPToEmail
);

// verify e-mail
router.patch("/verify-email/:userID", verifyToken, verifyEmail);

export default router;
