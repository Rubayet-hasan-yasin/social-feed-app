import { Router } from "express";
import {
  register,
  login,
  getMe,
  updatePushToken,
  registerValidation,
  loginValidation,
  pushTokenValidation,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();


router.post("/register", registerValidation, validate, register);

router.post("/login", loginValidation, validate, login);

router.get("/me", authenticate, getMe);

router.put("/push-token", authenticate, pushTokenValidation, validate, updatePushToken);



export default router;
