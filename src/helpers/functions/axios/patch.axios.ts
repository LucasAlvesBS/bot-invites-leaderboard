import { AxiosStatic } from 'axios';
import https from 'https';

export const patchAxios = async (
  axios: AxiosStatic,
  table: string,
  id: string | undefined,
  body: Record<string, unknown>,
) => {
  return await axios.patch(`/api/${table}/${id}`, body, {
    httpsAgent: new https.Agent({ keepAlive: true }),
  });
};
