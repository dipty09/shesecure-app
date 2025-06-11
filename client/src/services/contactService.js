import api from './api'; // your axios instance

export const addEmergencyContacts = async (userId, contacts) => {
  return api.post('/contacts/save', { userId, contacts });
};