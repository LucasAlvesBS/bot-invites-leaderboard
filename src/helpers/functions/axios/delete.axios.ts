import { AxiosStatic } from 'axios';
import https from 'https';

export const deleteAxios = async (
  axios: AxiosStatic,
  table: string,
  id: string | undefined,
) => {
  return await axios.delete(`/api/${table}/${id}`, {
    httpsAgent: new https.Agent({ keepAlive: true }),
  });
};
