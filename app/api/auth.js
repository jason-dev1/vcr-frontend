import client from "./client";

const endpoint = "/auth";

const login = (email, password) =>
  client.post(`${endpoint}/jwt/create`, { email, password });

export default { login };
