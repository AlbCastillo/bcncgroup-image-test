import * as dotenv from 'dotenv';
dotenv.config();

interface ConfigI {
  API: {
    PORT: string;
    ENV: string;
  };
  MONGO: {
    URI: string;
    URI_TEST: string;
  };
  JWT: {
    SECRET: string;
  };

  IMAGES: {
    PATH: string;
    SUPPORTED_FORMATS: string[];
    MAX_FILE_SIZE: number;
    WIDTHS: number[];
  };
  AWS: {
    RESIZE_LAMBDA: string;
  };
}

export const CONFIG: ConfigI = {
  API: {
    PORT: process.env.PORT || '8080',
    ENV: process.env.ENV_LOCAL || 'local',
  },
  MONGO: {
    URI: process.env.MONGO_URI || '',
    URI_TEST: process.env.MONGO_URI_TEST || '',
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your-jwt-secret',
  },
  IMAGES: {
    PATH: process.env.IMAGES_PATH || 'output',
    SUPPORTED_FORMATS: [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'image/bmp',
    ],
    MAX_FILE_SIZE: 10 * 1024 * 1024,
    WIDTHS: [800, 1024],
  },
  AWS: {
    RESIZE_LAMBDA:
      process.env.RESIZE_LAMBDA_URL || 'http://localhost:3000/dev/resizeImage',
  },
};
