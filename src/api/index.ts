import { ApiResponse, respond } from "../common/ApiResponse";
const express = require("express");

export const startup = (port: number = 3001) => {
  const app = express();

  app.get("/", (req: any, res: any): ApiResponse => {
    return respond(res, "hello world");
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(`API listening on port ${port}`);
  });
};

startup(parseInt(process.env.PORT || "3001"));
