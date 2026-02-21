import { Request, Response, NextFunction } from "express";

interface HttpError extends Error {
  status?: number;
  statusCode?: number;
  type?: string;
}

/**
 * Global error-handling middleware
 */
export const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (err.type === "entity.parse.failed" || (err.status === 400 && err.type !== undefined)) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON — request body must be a valid JSON object.",
    });
    return;
  }

  const statusCode = err.status ?? err.statusCode ?? 500;
  console.error("Unhandled Error:", err.message);

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message,
    ...(process.env.NODE_ENV === "development" && statusCode === 500 && { stack: err.stack }),
  });
};

/**
 * 404 Not Found handler
 */
export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
