import client from "./client";

const endpoint = "/records";

const getRecords = () => client.get(`${endpoint}/`);

export default { getRecords };
