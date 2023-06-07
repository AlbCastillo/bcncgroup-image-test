import * as dotenv from 'dotenv';
dotenv.config();

interface ConfigI {
  API: {
    PORT: string;
    ENV: string;
  };
  MONGO: {
    URI: string;
  };
  JWT: {
    SECRET: string;
  };

  IMAGES: {
    PATH: string;
    SUPPORTED_FORMATS: string[];
    MAX_FILE_SIZE: number;
  };
}

export const CONFIG: ConfigI = {
  API: {
    PORT: process.env.PORT || '8080',
    ENV: process.env.ENV_LOCAL || 'local',
  },
  MONGO: {
    URI: process.env.MONGO_URI || '',
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
  },
};
