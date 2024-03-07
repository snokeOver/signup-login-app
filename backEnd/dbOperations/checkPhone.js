import User from "../schemas/userSchema.js";

export const checkPhone = async (req, res) => {
  try {
    const result = await User.exists({
      "mobileNumber.number": req.body.phoneNum,
    });
    res.status(200).send(result ? true : false);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};
