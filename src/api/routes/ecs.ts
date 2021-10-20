import { ApiResponse, respond } from "../../common/ApiResponse";

import {
  ECSClient,
  ListServicesCommand,
  DescribeServicesCommand,
  ListTasksCommand,
  StopTaskCommand
} from "@aws-sdk/client-ecs";
import { fromIni } from "@aws-sdk/credential-provider-ini";

const express = require("express");
const router = express.Router();

let client: ECSClient;
const cluster = "rtv-staging";

class CodedError extends Error {
  code: number = 500;
}

const error = (message: string = "Unknown error", code: number = 500) => {
  const e = new CodedError(message);
  e.code = code;
  throw e;
};

const getEcsClient = (): ECSClient => {
  if (!client) {
    const params: any = { region: process.env.AWS_REGION || "eu-west-2" };
    if (process.env.AWS_PROFILE) params.credentials = fromIni({ profile: process.env.AWS_PROFILE });
    client = new ECSClient(params);
  }
  return client;
};

router.get("/", async (req: any, res: any): Promise<ApiResponse> => {
  try {
    const client = getEcsClient();

    const command1 = new ListServicesCommand({ cluster });
    const data = await client.send(command1);

    const services = data?.serviceArns?.map((s) => s.split("/")[1]);

    const command2 = new DescribeServicesCommand({ cluster, services });
    const data2 = await client.send(command2);

    return respond(res, data2.services);
  } catch (err: any) {
    return respond(res, {}, 500, err.message);
  }
});

router.get("/reboot", async (req: any, res: any): Promise<ApiResponse> => {
  try {
    if (!req.query.service) error("Service missing");
    const client = getEcsClient();
    const command1 = new ListTasksCommand({ cluster, serviceName: req.query.service });
    const data1 = await client.send(command1);

    const tasks = data1?.taskArns?.map((t) => t.split("/").slice(-1)[0]);

    const promises = (tasks || []).map((task) => {
      const c = new StopTaskCommand({ cluster, task });
      return client.send(c);
    });

    const r = await Promise.all(promises);

    return respond(res, r);
  } catch (err: any) {
    return respond(res, {}, err.code || 500, err.message);
  }
});

export default router;
