import React, { useState } from 'react';
import BottomSheet from '../ui/BottomSheet';
import toast from 'react-hot-toast';
import { useReports } from '../../hooks/useReports';

export default function ReportZoneModal({ isOpen, onClose, position }) {
  const [type, setType] = useState('assault');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addReport } = useReports();

  const submit = async (e) => {
    e.preventDefault();
    if (!position) {
      toast.error('No location selected');
      return;
    }
    setSubmitting(true);
    try {
      const newReport = await addReport({
        latitude: position.lat,
        longitude: position.lng,
        type,
        description: description || `Unsafe zone - ${type}`,
        user_id: 'guest_user',
      });
      console.log('Report saved:', newReport);
      toast.success('🚨 Danger zone reported!');
      setDescription('');
      setType('assault');
      onClose();
    } catch (error) {
      console.error('Report error:', error);
      toast.error('Failed to report zone');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setDescription('');
      setType('assault');
      onClose();
    }
  };

  if (!isOpen) return null;

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
        ⚠️ Report Unsafe Zone
      </h3>

      <p style={{
        fontSize: '14px',
        color: 'var(--text-secondary)',
        marginBottom: '15px',
        background: 'var(--bg-secondary)',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid var(--border)',
      }}>
        📍 Location: {position ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : 'Not selected'}
      </p>

      <form onSubmit={submit}>
        <label style={{ display: 'block', marginBottom: '15px', color: 'var(--text)' }}>
          <strong>Danger Type:</strong>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={submitting}
            style={inputStyle}
          >
            <option value="assault">🗡️ Assault</option>
            <option value="theft">💰 Theft</option>
            <option value="harassment">😠 Harassment</option>
            <option value="poor_lighting">💡 Poor Lighting</option>
            <option value="other">📌 Other</option>
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: '15px', color: 'var(--text)' }}>
          <strong>Description (optional):</strong>
          <textarea
            placeholder="Describe what makes this area unsafe..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
            style={{
              ...inputStyle,
              minHeight: '80px',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </label>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            style={{
              flex: 1,
              padding: '12px',
              background: 'var(--text-secondary)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              flex: 2,
              padding: '12px',
              background: 'var(--danger)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {submitting ? '⏳ Reporting...' : '🚨 Report Danger Zone'}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}