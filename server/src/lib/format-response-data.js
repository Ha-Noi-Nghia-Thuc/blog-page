import jwt from "jsonwebtoken";

export const formatResponseData = (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  return {
    token,
    first_name: user.personal_info.first_name,
    last_name: user.personal_info.last_name,
    username: user.personal_info.username,
    profile_img: user.personal_info.profile_img,
  };
};
