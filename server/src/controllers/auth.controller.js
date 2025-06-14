import bcrypt from "bcrypt";
import { getAuth } from "firebase-admin/auth";
import { formatResponseData } from "../lib/format-response-data.js";
import { generateUsername } from "../lib/generate-username.js";
import User from "../models/user.model.js";

export const handleSignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if email alreadyy exists
    const existingUser = await User.findOne({ "personal_info.email": email });
    if (existingUser) {
      return res.status(400).json({ message: "Email này đã được sử dụng" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate unique username
    const username = await generateUsername(email);

    // Create new user
    const newUser = new User({
      personal_info: {
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        username,
      },
    });

    await newUser.save();

    return res.status(201).json({
      message: "Đăng ký thành công",
      user: formatResponseData(newUser),
    });
  } catch (error) {
    console.error("Sign up error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = field.includes("email")
        ? "Email này đã được sử dụng"
        : "Tên người dùng đã tồn tại";

      return res.status(400).json({ message });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: messages[0] || "Dữ liệu không hợp lệ",
      });
    }

    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

export const handleSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      "personal_info.email": email.toLowerCase(),
    });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không chính xác" });
    }

    // Check if user registered with Google
    if (user.google_auth) {
      return res.status(400).json({
        message:
          "Tài khoản này được đăng ký bằng Google. Vui lòng sử dụng đăng nhập bằng Google.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.personal_info.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không chính xác" });
    }

    return res.status(200).json({
      message: "Đăng nhập thành công",
      user: formatResponseData(user),
    });
  } catch (error) {
    console.error("Sign in error:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

export const handleGoogleSignIn = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token Google không hợp lệ" });
    }

    // Verify Google token
    const decodedUser = await getAuth().verifyIdToken(token);
    const { name, email, picture } = decodedUser;
    if (!email) {
      return res.status(400).json({
        message: "Không thể lấy thông tin email từ Google",
      });
    }

    const profileImg = picture?.replace("s96-c", "s384-c") || "";

    // Check if user exists
    let user = await User.findOne({
      "personal_info.email": email.toLowerCase(),
    });

    // If user exists but not registered with Google
    if (user && !user.google_auth) {
      return res.status(400).json({
        message:
          "Email này đã được đăng ký bằng mật khẩu. Vui lòng sử dụng đăng nhập thường.",
      });
    }

    // Create new user if not exist
    if (!user) {
      const username = await generateUsername(email);
      const nameParts = name?.split(" ") || ["", ""];
      const firstName = nameParts.pop() || "";
      const lastName = nameParts.join(" ") || "";

      user = new User({
        personal_info: {
          first_name: firstName,
          last_name: lastName,
          email: email.toLowerCase(),
          profile_img: profileImg,
          username,
        },
        google_auth: true,
      });

      await user.save();
    }

    return res.status(200).json({
      message: "Đăng nhập Google thành công",
      user: formatResponseData(user),
    });
  } catch (error) {
    console.error("Google auth error:", error);

    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        message: "Token Google đã hết hạn",
      });
    }

    if (error.code === "auth/invalid-id-token") {
      return res.status(401).json({
        message: "Token Google không hợp lệ",
      });
    }

    return res.status(500).json({
      message: "Lỗi xác thực Google",
    });
  }
};
