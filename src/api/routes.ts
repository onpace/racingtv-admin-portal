import { ApiResponse, respond } from "../common/ApiResponse";

export const routes = (app: any) => {
  app.get("/", (req: any, res: any): ApiResponse => {
    return respond(res, "hello world");
  });
};
