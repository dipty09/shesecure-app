import React,{useState,useEffect}from 'react';
import useAuth from '../hooks/useAuth'; 
import axios from 'axios';// adjust path as needed

const EmergencyContactForm = () => {
  const { user } = useAuth(); // 👈 get the logged-in user

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchContacts = async () => {
      try {
        const res = await axios.get(`/api/emergency-contacts/${user._id}`);
        setContacts(res.data);
      } catch (err) {
        console.error('Error fetching contacts:', err);
      }
    };

    fetchContacts();
  }, [user?._id]);

  const handleChange = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const addContact = () => {
    if (contacts.length < 5) {
      setContacts([...contacts, { name: '', phone: '', email: '', isNew: true }]);
    }
  };

  const handleDelete = async (contactId, index) => {
    if (contactId) {
      try {
        await axios.delete(`/api/emergency-contacts/${contactId}`);
      } catch (err) {
        console.error('Failed to delete contact:', err);
        return;
      }
    }
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/emergency-contacts/${user._id}`, contacts);
      alert('Contacts updated successfully');
    } catch (err) {
      console.error('Error saving contacts:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-xl shadow-md space-y-6">
      {contacts.map((contact, i) => (
        <div key={i} className="relative p-4 border bg-gray-50 rounded-lg shadow-sm space-y-2">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Name"
              value={contact.name}
              onChange={(e) => handleChange(i, 'name', e.target.value)}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={contact.phone}
              onChange={(e) => handleChange(i, 'phone', e.target.value)}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={contact.email}
              onChange={(e) => handleChange(i, 'email', e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>
          <button
            type="button"
            onClick={() => handleDelete(contact._id, i)}
            className="absolute top-2 right-2 text-sm text-red-600 hover:text-red-800"
          >
            ✖ Remove
          </button>
        </div>
      ))}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={addContact}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add More
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ✅ Save Contacts
        </button>
      </div>
    </form>
  );
};

export default EmergencyContactForm;