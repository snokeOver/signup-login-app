import User from "../schemas/userSchema.js";

export const checkUser = async (req, res) => {
  try {
    const result = await User.exists(req.body);
    res.status(200).send(result ? true : false);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server Error!");
  }
};
