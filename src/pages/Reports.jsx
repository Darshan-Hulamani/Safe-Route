import React, { useState } from 'react';
import { useReports } from '../hooks/useReports';
import DiscussionModal from '../components/reports/DiscussionModal';
import ReportLocation from '../components/reports/ReportLocation';

const typeIcons = {
  assault: '🗡️',
  theft: '💰',
  harassment: '😠',
  poor_lighting: '💡',
  other: '📌',
};

const typeColors = {
  assault: '#e63946',
  theft: '#f4a261',
  harassment: '#e76f51',
  poor_lighting: '#ffb703',
  other: '#6c757d',
};

export default function Reports() {
  const { reports, confirmReport } = useReports();
  const [filter, setFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = filter === 'all'
    ? reports
    : reports.filter(r => r.type === filter);

  return (
    <div className="reports-page" style={{ padding: '16px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '20px', fontSize: 'clamp(1.5rem,5vw,2rem)' }}>
        📋 Community Reports
      </h1>

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px', overflowX: 'auto', paddingBottom: '5px' }}>
        {['all', 'assault', 'theft', 'harassment', 'poor_lighting', 'other'].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              border: `1px solid ${filter === t ? typeColors[t] || 'var(--primary)' : 'var(--border)'}`,
              background: filter === t ? (typeColors[t] || 'var(--primary)') : 'var(--card-bg)',
              color: filter === t ? '#fff' : 'var(--text)',
              fontWeight: filter === t ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {t === 'all' ? 'All' : `${typeIcons[t]} ${t.replace('_', ' ')}`}
          </button>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
          No reports found. Be the first to report a danger zone!
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {filteredReports.map(report => (
          <div
            key={report.id}
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: 'var(--shadow)',
            }}
          >
            {/* Top row: Icon, badge, confirmations, date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '28px' }}>{typeIcons[report.type] || '📌'}</span>
              <span
                style={{
                  background: typeColors[report.type] || '#6c757d',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                }}
              >
                {report.type.replace('_', ' ')}
              </span>

              {/* Confirmation count moved here */}
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary)', marginLeft: 'auto', marginRight: '15px' }}>
                👍 {report.confirm_count || 0}
              </span>

              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                {new Date(report.created_at).toLocaleString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>

            {/* Description */}
            <p style={{ margin: '0 0 10px', color: 'var(--text)', lineHeight: 1.4 }}>
              {report.description || 'No description provided.'}
            </p>

            {/* Location name + Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              flexWrap: 'wrap',
              borderTop: '1px solid var(--border)',
              paddingTop: '10px',
            }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                <ReportLocation lat={report.latitude} lng={report.longitude} />
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                <button
                  onClick={() => confirmReport(report.id)}
                  style={{
                    background: '#22c55e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  ✓ Confirm
                </button>

                <button
                  onClick={() => setSelectedReport(report)}
                  style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  💬 Discuss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <DiscussionModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}