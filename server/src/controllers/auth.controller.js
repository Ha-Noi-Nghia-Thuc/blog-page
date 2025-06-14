import bcrypt from "bcrypt";
import { formatResponseData } from "../lib/format-response-data.js";
import { generateUsername } from "../lib/generate-username.js";
import User from "../models/user.model.js";

export const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if email is already registered
    const existingUser = await User.findOne({ "personal_info.email": email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique username
    const username = await generateUsername(email);

    // Create and save new user
    const newUser = new User({
      personal_info: {
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        username,
      },
    });

    await newUser.save();

    // Format and return response
    return res.status(201).json({
      message: "Đăng ký thành công",
      user: formatResponseData(newUser),
    });
  } catch (error) {
    console.error("Lỗi khi tạo người dùng:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ",
      error: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find User by Email
    const user = await User.findOne({ "personal_info.email": email });
    if (!user) {
      return res.status(403).json({ message: "Email không tồn tại" });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.personal_info.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Mật khẩu không chính xác" });
    }

    // Format and return response
    return res.status(200).json({
      message: "Đăng nhập thành công",
      user: formatResponseData(user),
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ",
      error: error.message,
    });
  }
};
