import React, { useState } from 'react';
import {
  Ruler,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  UserCheck,
  Search,
  X
} from 'lucide-react';

export default function MeasurementScheduleView({
  measurements,
  leads,
  lists,
  onSaveMeasurement,
  onOpenNewQuoteForLead
}) {
  const [activeModal, setActiveModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [formData, setFormData] = useState({
    id: '',
    leadId: '',
    customerName: '',
    phoneNumber: '',
    location: '',
    staffName: '',
    leadAssignedDate: new Date().toISOString().slice(0, 10),
    measurementDate: new Date().toISOString().slice(0, 10),
    followUpDate: '',
    status: 'Scheduled',
    remarks: ''
  });

  // Filter measurements
  const filtered = measurements.filter((m) => {
    const matchesSearch =
      searchQuery === '' ||
      m.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.leadId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phoneNumber.includes(searchQuery) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'All' || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle lead selection in form
  const handleLeadSelect = (leadId) => {
    const found = leads.find((l) => l.id === leadId);
    if (found) {
      setFormData({
        ...formData,
        leadId: found.id,
        customerName: found.customerName,
        phoneNumber: found.phoneNumber,
        location: found.location,
        staffName: found.staffName || lists.staff[0]?.name || ''
      });
    }
  };

  // Start new measurement schedule
  const handleStartCreate = () => {
    const maxNum = measurements.reduce((max, m) => {
      const num = parseInt(m.id.replace('M-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextId = `M-${String(maxNum + 1).padStart(4, '0')}`;

    const defaultLead = leads[0];
    setFormData({
      id: nextId,
      leadId: defaultLead ? defaultLead.id : '',
      customerName: defaultLead ? defaultLead.customerName : '',
      phoneNumber: defaultLead ? defaultLead.phoneNumber : '',
      location: defaultLead ? defaultLead.location : '',
      staffName: defaultLead?.staffName || lists.staff[0]?.name || '',
      leadAssignedDate: new Date().toISOString().slice(0, 10),
      measurementDate: new Date().toISOString().slice(0, 10),
      followUpDate: '',
      status: 'Scheduled',
      remarks: ''
    });
    setActiveModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveMeasurement(formData);
    setActiveModal(false);
  };

  const handleMarkCompleted = (measurement) => {
    const updated = { ...measurement, status: 'Completed' };
    onSaveMeasurement(updated);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Control Header */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Site Visit & Measurement Schedule</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Schedule and record technician site visits across client locations
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search schedule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '32px', height: '34px', fontSize: '0.8rem' }}
            />
          </div>

          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 'auto', fontSize: '0.8rem', height: '34px' }}
          >
            <option value="All">All Statuses</option>
            {lists.measurementStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={handleStartCreate} style={{ height: '34px', padding: '0 14px' }}>
            <Plus size={15} /> Schedule Visit
          </button>
        </div>
      </div>

      {/* Measurement List Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '16px'
      }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            className="card-glow"
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-scheduled" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                  {item.leadId}
                </span>
                <span className={`badge badge-${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {item.customerName}
              </h3>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                📍 {item.location} • 📞 {item.phoneNumber}
              </div>

              <div style={{
                marginTop: '12px',
                padding: '10px 12px',
                background: 'var(--bg-main)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div><strong>Assigned Tech:</strong> {item.staffName || 'Unassigned'}</div>
                <div><strong>Scheduled Date:</strong> {item.measurementDate}</div>
                {item.remarks && <div><strong>Notes / Openings:</strong> {item.remarks}</div>}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
              {item.status !== 'Completed' && (
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, background: 'var(--accent-green)', borderColor: 'var(--accent-green)' }}
                  onClick={() => handleMarkCompleted(item)}
                >
                  <CheckCircle2 size={14} /> Mark Visited
                </button>
              )}

              <button
                className="btn btn-outline btn-sm"
                style={{ flex: 1 }}
                onClick={() => {
                  const lead = leads.find((l) => l.id === item.leadId) || {
                    id: item.leadId,
                    customerName: item.customerName,
                    phoneNumber: item.phoneNumber
                  };
                  onOpenNewQuoteForLead(lead);
                }}
              >
                <FileText size={14} /> Create Quote
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Visit Modal */}
      {activeModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Schedule Site Visit ({formData.id})</h3>
              <button
                onClick={() => setActiveModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Select Customer Lead *</label>
                <select
                  className="form-select"
                  value={formData.leadId}
                  onChange={(e) => handleLeadSelect(e.target.value)}
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.id} — {l.customerName} ({l.location})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Customer Name</label>
                  <input type="text" readOnly className="form-input" value={formData.customerName} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" readOnly className="form-input" value={formData.phoneNumber} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Assigned Staff / Technician</label>
                  <select
                    className="form-select"
                    value={formData.staffName}
                    onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
                  >
                    {lists.staff.map((st) => (
                      <option key={st.name} value={st.name}>{st.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Site Visit Date</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={formData.measurementDate}
                    onChange={(e) => setFormData({ ...formData, measurementDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Door & Window Measurement Notes</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="Record door opening dimensions (e.g., Main Entrance 7x3.5 ft, 3 Bathroom FRP doors 6.5x2.5 ft)."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Visit Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
