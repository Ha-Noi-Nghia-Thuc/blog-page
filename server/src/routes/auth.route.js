import express from "express";
import {
  signIn,
  signInWithGoogle,
  signUp,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  authSignInSchema,
  authSignUpSchema,
} from "../validations/auth.validation.js";

const router = express.Router();

router.post("/sign-up", validate(authSignUpSchema), signUp);
router.post("/sign-in", validate(authSignInSchema), signIn);
router.post("/google-auth", signInWithGoogle);

export default router;
