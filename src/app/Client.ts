import { ApiResponse } from "../common/ApiResponse";

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

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

export const getServices = async (): Promise<Service[]> => {
  const response = await fetch(`${BASE_URL}/ecs/`);
  const json: ApiResponse = (await response.json()) as ApiResponse;
  if (!response.ok) throw new Error(json.meta.error);
  const services = json.data as Service[];
  services.sort((a, b) => (a.serviceName > b.serviceName ? -1 : 1));
  return services;
};

export const rebootService = async (name: string): Promise<boolean> => {
  const response = await fetch(`${BASE_URL}/ecs/reboot?service=${name}`);
  const json: ApiResponse = (await response.json()) as ApiResponse;
  if (!response.ok) throw new Error(json.meta.error);
  return response.ok;
};
