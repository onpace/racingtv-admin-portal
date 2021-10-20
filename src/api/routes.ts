import { ApiResponse, respond } from "../common/ApiResponse";

import ecs from "./routes/ecs";

export const routes = (app: any) => {
  app.get("/", (req: any, res: any): ApiResponse => {
    return respond(res, "I'm alive !");
  });

  app.use("/ecs", ecs);
};
