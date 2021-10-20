import { ApiResponse } from "../common/ApiResponse";

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

export const getMessage = async (): Promise<string> => {
  const response = await fetch(`${BASE_URL}/`);
  const json: ApiResponse = (await response.json()) as ApiResponse;
  if (!response.ok) throw new Error(json.meta.error);
  return json.data;
};
