import errorHandler from "../routes/errorHandler.js";
import otpModel from "../schemas/otpSchema.js";

export const saveEmailOtpToDB = async (req, res, next) => {
  if (req.user.id !== req.params.userID) {
    return next(errorHandler("Unautorized", 401));
  }

  let generatedCode = Math.random().toString(9).slice(-6);
  const ID = req.params.userID;
  let emailToSend = "";
  const otpData = {
    userId: ID,
    code: generatedCode,
  };
  try {
    const isAvailable = await otpModel.findOne({ userId: ID });

    if (isAvailable) {
      const populatedOtpData = await otpModel
        .findOne({ userId: ID })
        .populate("userId", "userEmail");
      emailToSend = populatedOtpData.userId.userEmail.email;
      generatedCode = populatedOtpData.code;
    } else {
      const otpObjToStore = new otpModel(otpData);
      const savedOtpData = await otpObjToStore.save();

      //Fetch OTP data and populate the userId field

      const populatedOtpData = await otpModel
        .findOne({ userId: req.params.userID })
        .populate("userId", "userEmail");
      emailToSend = populatedOtpData.userId.userEmail.email;
      //  console.log(populatedOtpData.userId.userEmail.email);
    }
    req.code = generatedCode;
    req.email = emailToSend;

    next();
  } catch (err) {
    next(errorHandler(err.message));
    console.log(err.message);
  }
};
