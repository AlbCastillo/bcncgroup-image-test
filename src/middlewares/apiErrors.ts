import { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';

import { HTTP_ERRORS, HttpError } from '../utils/httpErrors';

/**
 * API ERROR CLASS
 */
export class ApiError extends Error {
  readonly name: string;
  readonly statusCode: number;
  readonly message: string;

  constructor(httpError: HttpError, message?: string) {
    const { name, statusCode }: HttpError = httpError;
    const defaultMessage = httpError.message;
    super(message || defaultMessage);
    this.name = name;
    this.statusCode = statusCode;
    this.message = message || defaultMessage;
  }
}

export function errorAPIHandler(
  err: unknown | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json({ name: err.name, statusCode: err.statusCode, message: err.message });
  }

  if (err instanceof ValidateError) {
    const { name, statusCode, message } = HTTP_ERRORS.VALIDATION_ERROR;
    return res
      .status(statusCode)
      .json({ name, statusCode, message, details: err?.fields });
  }

  if (err instanceof Error) {
    if (err.name === 'CastError') {
      const { name, statusCode, message } = HTTP_ERRORS.BAD_REQUEST;
      return res.status(statusCode).json({ name, statusCode, message });
    }
    if (err.name === 'NotFoundError') {
      const { name, statusCode, message } = HTTP_ERRORS.NOT_FOUND;
      return res.status(statusCode).json({ name, statusCode, message });
    }
    const { name, statusCode, message } = HTTP_ERRORS.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json({ name, statusCode, message });
  }

  next();
}
