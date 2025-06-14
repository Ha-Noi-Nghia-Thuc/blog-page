import jwt from "jsonwebtoken";

export const formatResponseData = (user) => {
  try {
    if (!user || !user.personal_info) {
      throw new Error("Invalid user data provided");
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not defined");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.personal_info.email,
        username: user.personal_info.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
        issuer: "hanoi-nghia-thuc",
        audience: "hanoi-nghia-thuc-users",
      }
    );

    return {
      token,
      first_name: user.personal_info.first_name || "",
      last_name: user.personal_info.last_name || "",
      username: user.personal_info.username || "",
      profile_img: user.personal_info.profile_img || "",
      bio: user.personal_info.bio || "",
      joinedAt: user.joinedAt || new Date(),
    };
  } catch (error) {
    console.error("Response formatting error:", error);
    throw new Error("Failed to format user data");
  }
};
