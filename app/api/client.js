import { create } from "apisauce";
import authStorage from "../auth/storage";
import settings from "../config/settings";

const apiClient = create({
  baseURL: settings.apiUrl,
});

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["authorization"] = `JWT ${authToken}`;
});

const get = apiClient.get;
apiClient.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);

  if (response.ok) {
    return response;
  }
  return response;
};

export default apiClient;
