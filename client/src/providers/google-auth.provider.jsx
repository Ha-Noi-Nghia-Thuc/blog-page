import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "@/config/firebase.config";

// Create Google provider instance with better configuration
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
  hd: undefined, // Remove domain restriction if any
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
    if (error.code === "auth/popup-closed-by-user") {
      console.log("User closed the popup");
    } else if (error.code === "auth/popup-blocked") {
      console.log("Popup was blocked by browser");
      // You could fallback to redirect here
      // await signInWithRedirect(auth, provider);
    } else if (error.code === "auth/cancelled-popup-request") {
      console.log("Popup request was cancelled");
    }

    throw error; // Re-throw to be handled by the calling component
  }
};
