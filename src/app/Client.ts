const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

export const getMessage = async (): Promise<any> => {
  const response = await fetch(`${BASE_URL}/`);
  if (!response.ok) throw new Error();
  return response.json();
};
