import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export interface JwtPayload {
  id: string;
  username: string;
  email: string;
}


export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN });
};


export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
};
