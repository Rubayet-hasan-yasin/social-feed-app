import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { errorResponse } from "../utils/response.utils.js";

/**
 * Middleware that checks validation errors
 */
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorResponse(
      res,
      "Validation failed",
      422,
      errors.array().map((e) => ({ field: e.type === "field" ? e.path : e.type, message: e.msg }))
    );
    return;
  }
  next();
};
