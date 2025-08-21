import { drizzle } from "drizzle-orm/libsql";
import { config } from "../config.js";
import * as schema from "./schema.js";

let conn = undefined;

if (config.db.url && config.db.authToken) {
  conn = drizzle({
    connection: {
      url: config.db.url,
      authToken: config.db.authToken,
    },
    schema: schema,
  });
  console.log("Connected to database!");
} else {
  console.log("DATABASE_URL or TURSO_AUTH_TOKEN environment variable is not set");
  console.log("Running without CRUD endpoints");
}

export const db = conn;

export function assertDbConnection() {
  if (!db) {
    throw new Error("Database connection is not available");
  }
}