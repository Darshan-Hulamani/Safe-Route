import React, { useState } from 'react';
import BottomSheet from '../ui/BottomSheet';

export default function AddContactModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [priority, setPriority] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please fill in name and phone number.');
      return;
    }
    setSubmitting(true);
    onAdd({ name: name.trim(), phone: phone.trim(), email: email.trim(), priority: Number(priority) });
    setName('');
    setPhone('');
    setEmail('');
    setPriority(0);
    setSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    if (!submitting) {
      setName('');
      setPhone('');
      setEmail('');
      setPriority(0);
      onClose();
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '5px',
    background: 'var(--bg-secondary)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      <h3 style={{ marginBottom: '15px', color: 'var(--primary)', fontWeight: '700' }}>
        👤 Add Trusted Contact
      </h3>

      <p style={{
        fontSize: '13px',
        color: 'var(--text-secondary)',
        marginBottom: '18px',
      }}>
        Contacts will be notified when you activate the emergency SOS.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '2px', color: 'var(--text)', fontWeight: '500' }}>
            Full Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Rajesh Kumar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '2px', color: 'var(--text)', fontWeight: '500' }}>
            Phone Number *
          </label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '2px', color: 'var(--text)', fontWeight: '500' }}>
            Email (optional)
          </label>
          <input
            type="email"
            placeholder="rajesh@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '2px', color: 'var(--text)', fontWeight: '500' }}>
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={inputStyle}
          >
            <option value="0">🔔 Normal Priority</option>
            <option value="1">🚨 High Priority</option>
          </select>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            High priority contacts are notified first during an emergency.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleClose}
            style={{
              flex: 1,
              padding: '12px',
              background: 'var(--text-secondary)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              flex: 2,
              padding: '12px',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            ✅ Save Contact
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}