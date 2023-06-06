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
};
