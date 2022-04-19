import client from "./client";

const endpoint = "/auth/users";

const register = (userInfo) => client.post(`${endpoint}/`, userInfo);

const resetPassword = (payload) =>
  client.post(`${endpoint}/set_password/`, payload);

export default { register, resetPassword };
