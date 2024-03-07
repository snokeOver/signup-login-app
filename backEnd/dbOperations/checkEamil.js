import User from "../schemas/userSchema.js";

export const checkEmail = async (req, res) => {
  try {
    const result = await User.exists({ "userEmail.email": req.body.email });
    res.status(200).send(result ? true : false);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};
