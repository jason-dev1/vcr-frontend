import client from "./client";

const endpoint = "/appointments";

const addAppointment = (timeslot) => client.post(`${endpoint}/`, { timeslot });

const getAppointment = (id) => client.get(`${endpoint}/${id}/`);

const getAppointments = () => client.get(`${endpoint}/`);

const updateAppointment = (id, status) =>
  client.patch(`${endpoint}/${id}/`, status);

export default {
  addAppointment,
  getAppointment,
  getAppointments,
  updateAppointment,
};
