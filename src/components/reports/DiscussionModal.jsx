import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../services/firebase/firebase';

export default function DiscussionModal({ report, onClose }) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(3);
  const [discussions, setDiscussions] = useState([]);

  // Real‑time listener for discussions of this zone
  useEffect(() => {
    if (!report) return;
    const q = query(
      collection(db, 'zone_discussions'),
      where('zoneId', '==', report.id)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDiscussions(data);
    });
    return () => unsubscribe();
  }, [report]);

  // Calculate average rating from all discussion ratings
  const getAverageRating = async () => {
    const q = query(
      collection(db, 'zone_discussions'),
      where('zoneId', '==', report.id)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return 0;
    let total = 0,
      count = 0;
    snapshot.forEach(doc => {
      const r = doc.data().rating;
      if (typeof r === 'number') {
        total += r;
        count++;
      }
    });
    return count > 0 ? Math.round((total / count) * 10) / 10 : 0; // one decimal
  };

  // Update the danger zone's rating in Firestore
  const updateZoneRating = async () => {
    const avg = await getAverageRating();
    try {
      const zoneRef = doc(db, 'danger_zones', report.id);
      await updateDoc(zoneRef, { rating: avg });
    } catch (error) {
      console.error('Failed to update zone rating:', error);
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    try {
      await addDoc(collection(db, 'zone_discussions'), {
        zoneId: report.id,
        comment,
        rating,
        created_at: Date.now(),
      });
      setComment('');
      setRating(3);
      // After adding the comment, recalculate the average and update the zone
      await updateZoneRating();
    } catch (error) {
      console.error('Error posting discussion:', error);
    }
  };

  if (!report) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'var(--card-bg)',
          color: 'var(--text)',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          borderRadius: '16px',
          padding: '20px',
          overflowY: 'auto',
          boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--primary)' }}>💬 Discussion</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share safety information..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              background: 'var(--bg-secondary)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <label style={{ color: 'var(--text)', fontWeight: '500' }}>Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{
              padding: '8px 12px',
              background: 'var(--bg-secondary)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          >
            <option value={1}>⭐ 1</option>
            <option value={2}>⭐⭐ 2</option>
            <option value={3}>⭐⭐⭐ 3</option>
            <option value={4}>⭐⭐⭐⭐ 4</option>
            <option value={5}>⭐⭐⭐⭐⭐ 5</option>
          </select>
          <button
            onClick={handleSubmit}
            style={{
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: '600',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            Post
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '15px 0' }} />

        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {discussions.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '14px' }}>
              No discussions yet. Be the first to share!
            </p>
          )}
          {discussions.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '10px 0',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              <div style={{ color: '#f59e0b', fontSize: '14px' }}>
                {'⭐'.repeat(item.rating)}
              </div>
              <div style={{ color: 'var(--text)', fontSize: '14px' }}>{item.comment}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                {new Date(item.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}