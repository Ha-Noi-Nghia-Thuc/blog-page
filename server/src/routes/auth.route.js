import express from "express";
import {
  handleGoogleSignIn,
  handleSignIn,
  handleSignUp,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  authSignInSchema,
  authSignUpSchema,
} from "../validations/auth.validation.js";

const router = express.Router();

router.post("/sign-up", validate(authSignUpSchema), handleSignUp);
router.post("/sign-in", validate(authSignInSchema), handleSignIn);
router.post("/google-auth", handleGoogleSignIn);

export default router;
