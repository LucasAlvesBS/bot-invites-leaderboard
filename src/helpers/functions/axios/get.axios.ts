import { AxiosStatic } from 'axios';
import https from 'https';

export const getAxios = async (axios: AxiosStatic, table: string) => {
  return await axios.get(`/api/${table}?page=1&limit=999999`, {
    httpsAgent: new https.Agent({ keepAlive: true }),
  });
};
