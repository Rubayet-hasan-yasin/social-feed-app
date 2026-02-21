import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export interface JwtPayload {
  id: string;
  username: string;
  email: string;
}

/**
 * Signs a JWT token with the given payload.
 * Expires in 7 days by default.
 */
export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * Throws an error if invalid or expired.
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
};
