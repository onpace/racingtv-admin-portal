import { respond } from "../common/ApiResponse";
import routes from "./routes";

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

export const startup = (port: number = 3001) => {
  const app = express();
  app.use(bodyParser.json());
  app.use((req: any, res: any, next: () => void) => {
    res.set(
      `Access-Control-Allow-Origin`,
      (process.env.CORS_URL || req.headers["origin"] || "").replace(/ /g, "")
    );
    res.set(
      `Access-Control-Allow-Methods`,
      process.env.CORS_METHODS || "GET, POST, DELETE, OPTIONS"
    );
    res.set(
      `Access-Control-Allow-Headers`,
      process.env.CORS_HEADERS || "Authorization,Content-Type"
    );
    next();
  });

  // CORS Preflight
  app.options("*", (req: any, res: any) => res.status(200).send());

  // API Routes
  app.use("/api", routes);

  // Static files
  app.use("/", express.static(path.join(__dirname + "../../../build")));

  // 404 catch all
  app.use((req: any, res: any, next: () => void) => {
    respond(res, {}, 404, "Not Found");
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(`API listening on port ${port}`);
  });
};

startup(parseInt(process.env.PORT || "3001"));
