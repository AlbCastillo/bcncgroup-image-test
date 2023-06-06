import { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';

/**
 * API ERROR CLASS
 */
export class ApiError extends Error {
  statusCode: number;

  constructor({
    name,
    statusCode,
    message,
  }: {
    name: string;
    statusCode: number;
    message?: string;
  }) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

export function errorAPIHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      name: err.name,
      statusCode: err.statusCode,
      message: err.message,
    });
  }
  if (err instanceof ValidateError) {
    return res.status(422).json({
      name: 'ValidationError',
      statusCode: 422,
      message: err.message,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      name: 'InternalServerError',
      statusCode: 500,
      message: err.message,
    });
  }
  next();
}
