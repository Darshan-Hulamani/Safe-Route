import React, { useState } from 'react';
import { useSOSContext } from '../context/SOSContext';
import ContactCard from '../components/contacts/ContactCard';
import AddContactModal from '../components/contacts/AddContactModal';

export default function Contacts() {
  const { contacts, setContacts } = useSOSContext();
  const [addOpen, setAddOpen] = useState(false);

  const addContact = (contact) => {
    const newContact = { ...contact, id: Date.now().toString() };
    setContacts([...contacts, newContact]);
  };

  const deleteContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="contacts-page" style={{ padding: '20px' }}>
      <h1 style={{ color: '#1e3c72', marginBottom: '20px' }}>Trusted Contacts</h1>
      
      <button 
        onClick={() => setAddOpen(true)}
        style={{ 
          padding: '12px 20px', 
          background: '#1e3c72', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        + Add Contact
      </button>
      
      <div className="contacts-list">
        {contacts.length === 0 ? (
          <p style={{ color: '#6c757d', textAlign: 'center', marginTop: '40px' }}>
            No trusted contacts yet. Add contacts who will be alerted during emergency.
          </p>
        ) : (
          contacts.map(c => (
            <ContactCard key={c.id} contact={c} onDelete={deleteContact} />
          ))
        )}
      </div>
      
      <AddContactModal 
        isOpen={addOpen} 
        onClose={() => setAddOpen(false)} 
        onAdd={addContact} 
      />
    </div>
  );
}