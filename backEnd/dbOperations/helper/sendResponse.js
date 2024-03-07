import jwt from "jsonwebtoken";

export const sendResponse = (userDetails, res) => {
  //   console.log(userDetails);
  const { password: pass, __v: v1, ...rest } = userDetails._doc;
  const token = jwt.sign(
    {
      id: userDetails._id,
      type: userDetails.userId.userType,
    },
    process.env.JWT_SECRET
  );
  res.status(200).send({ ...rest, access_token: token });
  // .status(200)
  // .cookie("access_token", token, { httpOnly: true,  })
  // .send(rest);
  return;
};
