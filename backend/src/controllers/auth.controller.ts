import { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user.model.js";
import { signToken } from "../utils/jwt.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";
import Expo from "expo-server-sdk";

//Validation

export const registerValidation = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 30 }).withMessage("Username must be 3–30 characters")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username may only contain letters, numbers and underscores"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const pushTokenValidation = [
  body("pushToken").notEmpty().withMessage("pushToken is required").isString(),
];

//Controller handler

/**
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      errorResponse(res, "Email already in use", 409);
      return;
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      errorResponse(res, "Username already taken", 409);
      return;
    }

    const user = await User.create({ username, email, password });
    const token = signToken({ id: user.id, username: user.username, email: user.email });

    successResponse(res, { token, user }, "Registration successful", 201);
  } catch (err) {
    errorResponse(res, "Registration failed", 500);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      errorResponse(res, "Invalid email or password", 401);
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      errorResponse(res, "Invalid email or password", 401);
      return;
    }

    const token = signToken({ id: user.id, username: user.username, email: user.email });

    successResponse(res, { token, user }, "Login successful");
  } catch {
    errorResponse(res, "Login failed", 500);
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      errorResponse(res, "User not found", 404);
      return;
    }
    successResponse(res, { user }, "Profile fetched");
  } catch {
    errorResponse(res, "Failed to fetch profile", 500);
  }
};

/**
 * PUT /api/auth/push-token
 */
export const updatePushToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pushToken } = req.body;
    if (!Expo.isExpoPushToken(pushToken)) {
      errorResponse(res, `Push token ${pushToken} is not a valid Expo push token`, 400);
      return;
    }
    await User.findByIdAndUpdate(req.user!.id, { pushToken });
    successResponse(res, null, "Push token updated");
  } catch (err) {
    errorResponse(res, "Failed to update push token", 500);
  }
};
