import app from "@/config/firebase.config";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Create Google provider instance with better configuration
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

// Initialize Firebase Auth
const auth = getAuth(app);

export const googleAuth = async () => {
  try {
    // Configure popup for better compatibility
    const result = await signInWithPopup(auth, provider);

    // Extract user info from result
    const user = result.user;

    // Get the ID token for backend authentication
    const idToken = await user.getIdToken();

    return {
      user,
      token: idToken, // Changed from idToken to token to match your auth.page.jsx
    };
  } catch (error) {
    console.error("Google sign-in failed:", error);

    // Handle specific Firebase Auth errors
    switch (error.code) {
      case "auth/popup-closed-by-user":
        throw new Error("popup-closed-by-user");
      case "auth/popup-blocked":
        throw new Error("popup-blocked");
      case "auth/cancelled-popup-request":
        throw new Error("cancelled-popup-request");
      case "auth/network-request-failed":
        throw new Error("Lỗi kết nối mạng");
      case "auth/too-many-requests":
        throw new Error("Quá nhiều yêu cầu. Vui lòng thử lại sau");
      default:
        throw new Error("Xác thực Google thất bại");
    }
  }
};
