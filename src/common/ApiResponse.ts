type ApiMetadata = {
  code: number;
  error?: string;
};

export type ApiResponse = {
  meta: ApiMetadata;
  data: any;
};

export const respond = (
  res: any,
  data: any,
  code: number = 200,
  error: string = "Unknown error"
): ApiResponse => {
  const resp: ApiResponse = { meta: { code }, data };
  if (code >= 400) {
    resp.meta.error = error;
    delete resp.data;
  }
  res.status(code).send(resp);
  return resp;
};

export default ApiResponse;
