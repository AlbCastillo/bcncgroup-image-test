export interface HttpError {
  name: string;
  statusCode: number;
  message: string;
}

export const HTTP_ERRORS = {
  BAD_REQUEST: {
    name: 'Bad Request',
    statusCode: 400,
    message: 'The server could not understand the request due to malformed syntax.',
  },
  UNAUTHORIZED: {
    name: 'Unauthorized',
    statusCode: 401,
    message: 'The request requires user authentication.',
  },
  FORBIDDEN: {
    name: 'Forbidden',
    statusCode: 403,
    message: 'The server understood the request, but is refusing to fulfill it.',
  },
  NOT_FOUND: {
    name: 'Not Found',
    statusCode: 404,
    message:
      'The requested resource could not be found but may be available in the future.',
  },
  INTERNAL_SERVER_ERROR: {
    name: 'Internal Server Error',
    statusCode: 500,
    message:
      'The server encountered an unexpected condition that prevented it from fulfilling the request.',
  },
  VALIDATION_ERROR: {
    name: 'Validation Error',
    statusCode: 422,
    message: 'The request could not be processed because of validation errors.',
  },
};
