import express from "express";
import cors from "cors";
import path from "path";
import { config } from "./config.js";
import { db } from "./db/index.js";
import { middlewareAuth } from "./api/middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerNotesCreate, handlerNotesGet } from "./api/notes.js";
import { handlerUsersCreate, handlerUsersGet } from "./api/users.js";

const __dirname = path.resolve();

if (!config.api.port) {
  console.error("PORT environment variable is not set");
  process.exit(1);
}

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`=== INCOMING REQUEST ===`);
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log(`URL: ${req.url}`);
  console.log(`======================`);
  next();
});

app.use(
  cors({
    origin: ["https://*", "http://*"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: "*",
    exposedHeaders: ["Link"],
    credentials: false,
    maxAge: 300,
  }),
);

app.get("/", (req, res) => {
  console.log("=== ROOT ROUTE HANDLER CALLED ===");
  res.send("<h1>Welcome to Notely!</h1>");
});

app.use("/", express.static(path.join(__dirname, config.api.filepathRoot)));

const v1Router = express.Router();

if (db) {
  v1Router.post("/users", handlerUsersCreate);
  v1Router.get("/users", middlewareAuth(handlerUsersGet));
  v1Router.get("/notes", middlewareAuth(handlerNotesGet));
  v1Router.post("/notes", middlewareAuth(handlerNotesCreate));
}

v1Router.get("/healthz", handlerReadiness);

app.use("/v1", v1Router);

console.log("Routes registered, starting server...");

app.listen(config.api.port, () => {
  console.log(`Server is running on port: ${config.api.port}`);
});
