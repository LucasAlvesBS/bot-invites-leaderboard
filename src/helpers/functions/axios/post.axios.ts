import { AxiosStatic } from 'axios';
import https from 'https';

export const postAxios = async (
  axios: AxiosStatic,
  table: string,
  body: Record<string, unknown>,
) => {
  return await axios.post(`/api/${table}`, body, {
    httpsAgent: new https.Agent({ keepAlive: true }),
  });
};
