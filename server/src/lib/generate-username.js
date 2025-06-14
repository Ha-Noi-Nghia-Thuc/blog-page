import { nanoid } from "nanoid";
import User from "../models/user.model.js";

export const generateUsername = async (email) => {
  let baseUsername = email.split("@")[0];
  let finalUsername = baseUsername;

  try {
    const isTaken = await User.exists({
      "personal_info.username": baseUsername,
    });

    if (isTaken) {
      finalUsername = `${baseUsername}-${nanoid(5)}`;
    }

    return finalUsername;
  } catch (error) {
    console.error("Lỗi khi tạo username:", error);
    throw new Error("Không thể tạo tên người dùng");
  }
};
