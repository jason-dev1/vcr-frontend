import client from "./client";

const endpoint = "/statistic";

const getStatistic = () => client.get(`${endpoint}/`);

export default { getStatistic };
