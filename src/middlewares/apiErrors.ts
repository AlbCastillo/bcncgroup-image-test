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
    // Manejo de errores de validación
    return res.status(422).json({
      name: 'ValidationError',
      statusCode: 422,
      message: 'Validation error',
      details: err?.fields,
    });
  }

  if (err instanceof Error) {
    // Resto de manejo de errores
    if (err.name === 'CastError') {
      return res.status(400).json({
        name: 'BadRequest',
        statusCode: 400,
        message: 'Bad request',
      });
    }
    if (err.name === 'NotFoundError') {
      return res.status(404).json({
        name: 'NotFound',
        statusCode: 404,
        message: 'Resource not found',
      });
    }
    return res.status(500).json({
      name: 'InternalServerError',
      statusCode: 500,
      message: 'Server error',
    });
  }

  next();
}
