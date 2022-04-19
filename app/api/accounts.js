import client from "./client";

const endpoint = "/accounts/me";

const getAccount = () => client.get(`${endpoint}/`);

const updateAccount = (account) => client.put(`${endpoint}/`, account);

export default { getAccount, updateAccount };
