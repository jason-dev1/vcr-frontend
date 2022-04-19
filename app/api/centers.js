import client from "./client";

const endpoint = "/centers";

const getNearbyCenters = (lat, lon) =>
  client.get(`${endpoint}/nearby/${lat},${lon}/`);

const getTimeslots = (center_pk) =>
  client.get(`${endpoint}/${center_pk}/timeslots/`);

export default { getNearbyCenters, getTimeslots };
