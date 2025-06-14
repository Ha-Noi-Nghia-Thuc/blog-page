import { nanoid } from "nanoid";
import User from "../models/user.model.js";

export const generateUsername = async (email) => {
  try {
    if (!email || typeof email !== "string") {
      throw new Error("Invalid email provided");
    }

    // Extract base username from email
    let baseUsername = email.split("@")[0].toLowerCase();

    // Remove special characters except hyphens and underscores
    baseUsername = baseUsername.replace(/[^a-z0-9_-]/g, "");

    // Ensure minimum length
    if (baseUsername.length < 3) {
      baseUsername = `user${baseUsername}`;
    }

    // Ensure maximum length
    if (baseUsername.length > 20) {
      baseUsername = baseUsername.substring(0, 20);
    }

    let finalUsername = baseUsername;

    // Check if username is taken
    const existingUser = await User.findOne({
      "personal_info.username": baseUsername,
    });
    if (existingUser) {
      // Generate unique suffix
      const suffix = nanoid(6).toLowerCase();
      finalUsername = `${baseUsername}-${suffix}`;

      // Ensure final username doesn't exceed limit
      if (finalUsername.length > 30) {
        const maxBaseLength = 30 - suffix.length - 1; // -1 for hyphen
        finalUsername = `${baseUsername.substring(0, maxBaseLength)}-${suffix}`;
      }
    }

    return finalUsername;
  } catch (error) {
    console.error("Username generation error:", error);
    // Fallback to random username
    return `user-${nanoid(8).toLowerCase()}`;
  }
};
