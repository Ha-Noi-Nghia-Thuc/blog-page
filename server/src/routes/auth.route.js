import express from "express";
import { signIn, signUp } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { signUpSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/sign-up", validate(signUpSchema), signUp);
router.post("/sign-in", signIn);

export default router;
