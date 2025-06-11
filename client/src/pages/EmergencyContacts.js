import React from 'react';
import EmergencyContactForm from '../components/EmergencyContactForm';
import { useAuth } from '../context/AuthContext';
import { addEmergencyContacts } from '../services/contactService';

const EmergencyContacts = () => {
  const { user } = useAuth();

  const handleSubmit = async (contacts) => {
    if (!user || !user._id) {
      alert('User not logged in or invalid user data');
      return;
    }

    try {
      await addEmergencyContacts(user._id, contacts);
      alert('Contacts saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save contacts');
    }
  };

  if (!user) {
    return <div className="p-6 max-w-xl mx-auto text-red-600">Please log in to manage emergency contacts.</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Emergency Contacts</h2>
      <EmergencyContactForm useId={user._id} onSubmit={handleSubmit} />
    </div>
  );
};

export default EmergencyContacts;