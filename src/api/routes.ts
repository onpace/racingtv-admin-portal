import { ApiResponse, respond } from "../common/ApiResponse";

import ecs from "./routes/ecs";

const express = require("express");
const router = express.Router();
export class CodedError extends Error {
  code: number = 500;

  constructor(message: string, code: number = 500) {
    super(message);
    this.code = code;
  }
}

export const authenticate = (username: string, password: string): string => {
  const credentials = {
    login: process.env.ADMIN_USER || "rtvadmin",
    password: process.env.ADMIN_PASSWORD || "G4xY6bkUPVgQMB79"
  };
  if (username !== credentials.login || password !== credentials.password)
    throw new CodedError("Unauthorized", 401);

  return Buffer.from(`${username}:${password}`).toString("base64");
};

router.get("/", (req: any, res: any): ApiResponse => {
  return respond(res, "I'm alive !");
});

router.post("/login", (req: any, res: any): ApiResponse => {
  try {
    let { username, password } = req.body;
    if (!username || !password) {
      username = "";
      password = "";
    }
    const token = authenticate(username, password);
    return respond(res, { token });
  } catch (err: any) {
    console.log(err);
    return respond(res, {}, err.code || 500, err.message);
  }
});

router.use("/ecs", ecs);

export default router;
