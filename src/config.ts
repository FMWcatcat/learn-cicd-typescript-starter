import dotenv from "dotenv";
dotenv.config();

type Config = {
  db: DBConfig;
  api: APIConfig;
};

type APIConfig = {
  port: string | number | undefined;
  filepathRoot: string;
};

type DBConfig = {
  url: string | undefined;
  authToken: string | undefined;
};

export const config: Config = {
  api: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
    filepathRoot: "./assets",
  },
  db: {
    url: process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
};
