import { ApiResponse } from "../common/ApiResponse";
import { logout } from "./App";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001/api";

export const getMessage = async (): Promise<string> => {
  const response = await fetch(`${BASE_URL}/`);
  const json: ApiResponse = (await response.json()) as ApiResponse;
  if (!response.ok) throw new Error(json.meta.error);
  return json.data;
};

type Deployment = {
  createdAt: string;
  desiredCount: number;
  failedTasks: number;
  id: string;
  launchType: string;
  networkConfiguration: any;
  pendingCount: number;
  platformVersion: string;
  rolloutState: string;
  rolloutStateReason: string;
  runningCount: number;
  status: string;
  taskDefinition: string;
  updatedAt: string;
};

export type Service = {
  clusterArn: string;
  createdAt: string;
  createdBy: string;
  deploymentConfiguration: any;
  deployments: Deployment[];
  desiredCount: 3;
  enableECSManagedTags: false;
  enableExecuteCommand: false;
  events: any[];
  launchType: string;
  loadBalancers: [];
  networkConfiguration: any;
  pendingCount: number;
  placementConstraints: [];
  placementStrategy: [];
  platformVersion: string;
  propagateTags: string;
  roleArn: string;
  runningCount: number;
  schedulingStrategy: string;
  serviceArn: string;
  serviceName: string;
  serviceRegistries: [];
  status: string;
  taskDefinition: string;
};

const headers = (): any => {
  const t = localStorage.getItem("token");
  const h: any = { "Content-Type": "application/json" };
  if (t) h["Authorization"] = `Basic ${t}`;
  return h;
};

export const getServices = async (): Promise<Service[]> => {
  const response = await fetch(`${BASE_URL}/ecs/`, { headers: headers() });
  const json: ApiResponse = (await response.json()) as ApiResponse;
  if (response.status === 401) logout && logout();
  if (!response.ok) throw new Error(json.meta.error);
  const services = (json.data as Service[]).filter((s) => s.serviceName.indexOf("daemon") >= 0);
  services.sort((a, b) => (a.serviceName > b.serviceName ? -1 : 1));

  return services;
};

export const rebootService = async (name: string): Promise<boolean> => {
  const response = await fetch(`${BASE_URL}/ecs/reboot?service=${name}`, { headers: headers() });
  const json: ApiResponse = (await response.json()) as ApiResponse;
  if (response.status === 401) logout && logout();
  if (!response.ok) throw new Error(json.meta.error);
  return response.ok;
};

export const postLogin = async (username: string, password: string): Promise<string> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    headers: headers(),
    body: JSON.stringify({ username, password }) // body data type must match "Content-Type" header
  });
  const json: ApiResponse = (await response.json()) as ApiResponse;
  if (!response.ok) throw new Error(json.meta.error);
  return json.data.token;
};
