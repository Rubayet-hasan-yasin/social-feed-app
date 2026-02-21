import { Response } from "express";

/** Standard success response */
export const successResponse = (
  res: Response,
  data: unknown,
  message = "Success",
  statusCode = 200
): Response => {
  return res.status(statusCode).json({ success: true, message, data });
};

/** Standard error response */
export const errorResponse = (
  res: Response,
  message = "Something went wrong",
  statusCode = 500,
  errors?: unknown
): Response => {
  return res.status(statusCode).json({ success: false, message, errors });
};
