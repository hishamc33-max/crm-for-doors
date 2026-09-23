import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Kanban,
  List,
  Edit2,
  Trash2,
  Phone,
  MessageSquare,
  Calendar,
  ChevronRight,
  UserCheck,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

export default function LeadsView({
  leads,
  lists,
  searchQuery,
  setSearchQuery,
  onSaveLead,
  onDeleteLead,
  onOpenNewScheduleForLead,
  onOpenNewQuoteForLead
}) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [selectedStaff, setSelectedStaff] = useState('All');
  const [activeModalLead, setActiveModalLead] = useState(null); // Edit or View detail modal
  const [isCreating, setIsCreating] = useState(false);

  // Form State for creating/editing lead
  const [formData, setFormData] = useState({
    id: '',
    date: new Date().toISOString().slice(0, 10),
    staffName: '',
    customerName: '',
    phoneNumber: '',
    location: '',
    source: 'Walk-in',
    followUpDate: '',
    status: 'New Lead',
    measurementDate: '',
    measurementStatus: '',
    quotationSentDate: '',
    quotationStatus: '',
    advanceDate: '',
    advanceAmount: 0,
    productionStartDate: '',
    inProductionDays: 0,
    remarks: ''
  });

  // Filter Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchQuery === '' ||
      lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phoneNumber.includes(searchQuery) ||
      lead.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || lead.status === selectedStatus;
    const matchesSource = selectedSource === 'All' || lead.source === selectedSource;
    const matchesStaff = selectedStaff === 'All' || lead.staffName === selectedStaff;

    return matchesSearch && matchesStatus && matchesSource && matchesStaff;
  });

  // Start New Lead Form
  const handleStartCreate = () => {
    // Generate next Lead ID (e.g. L-0012)
    const maxNum = leads.reduce((max, l) => {
      const num = parseInt(l.id.replace('L-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextId = `L-${String(maxNum + 1).padStart(4, '0')}`;

    setFormData({
      id: nextId,
      date: new Date().toISOString().slice(0, 10),
      staffName: lists.staff[0]?.name || '',
      customerName: '',
      phoneNumber: '',
      location: '',
      source: 'Walk-in',
      followUpDate: '',
      status: 'New Lead',
      measurementDate: '',
      measurementStatus: '',
      quotationSentDate: '',
      quotationStatus: '',
      advanceDate: '',
      advanceAmount: 0,
      productionStartDate: '',
      inProductionDays: 0,
      remarks: ''
    });
    setIsCreating(true);
  };

  // Start Edit Form
  const handleStartEdit = (lead) => {
    setFormData({ ...lead });
    setActiveModalLead(lead);
  };

  // Handle Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveLead(formData);
    setIsCreating(false);
    setActiveModalLead(null);
  };

  // Change Lead Status directly from Kanban or Table
  const handleQuickStatusChange = (lead, newStatus) => {
    const updated = { ...lead, status: newStatus };
    onSaveLead(updated);
  };

  // Status Badge Class Helper
  const getBadgeClass = (status) => {
    const s = (status || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return `badge badge-${s}`;
  };

  // Main Kanban Columns setup
  const kanbanColumns = [
    { title: 'New Lead', status: 'New Lead', color: 'var(--accent-blue)' },
    { title: 'Contacted', status: 'Contacted', color: '#0284c7' },
    { title: 'Site Visit', status: 'Site Visit Scheduled', color: 'var(--accent-purple)' },
    { title: 'Measured', status: 'Measurement Done', color: '#c026d3' },
    { title: 'Quote Sent', status: 'Quotation Sent', color: 'var(--secondary)' },
    { title: 'Negotiation', status: 'Negotiation', color: '#ea580c' },
    { title: 'Order Confirmed', status: 'Order Confirmed', color: 'var(--accent-green)' },
    { title: 'Advance Recv', status: 'Advance Received', color: '#16a34a' },
    { title: 'In Production', status: 'In Production', color: '#ca8a04' },
    { title: 'Completed', status: 'Installed/Completed', color: '#059669' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Control Toolbar */}
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
        {/* Left: View Mode Toggle & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Lead Enquiries Tracker</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing {filteredLeads.length} of {leads.length} total customer leads
            </span>
          </div>

          <div style={{ display: 'flex', background: 'var(--bg-main)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: viewMode === 'kanban' ? 'var(--bg-card)' : 'transparent',
                color: viewMode === 'kanban' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'kanban' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <Kanban size={15} /> Kanban Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: viewMode === 'table' ? 'var(--bg-card)' : 'transparent',
                color: viewMode === 'table' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <List size={15} /> Data Table
            </button>
          </div>
        </div>

        {/* Right: Dropdown Filters & Add Lead Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Status Filter */}
          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: 'auto', fontSize: '0.8125rem' }}
          >
            <option value="All">All Statuses</option>
            {lists.leadStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Source Filter */}
          <select
            className="form-select"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            style={{ width: 'auto', fontSize: '0.8125rem' }}
          >
            <option value="All">All Sources</option>
            {lists.sources.map((src) => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>

          {/* Staff Filter */}
          <select
            className="form-select"
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            style={{ width: 'auto', fontSize: '0.8125rem' }}
          >
            <option value="All">All Staff</option>
            {lists.staff.map((st) => (
              <option key={st.name} value={st.name}>{st.name}</option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={handleStartCreate}>
            <Plus size={16} /> New Lead
          </button>
        </div>
      </div>

      {/* View Mode 1: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="kanban-grid">
          {kanbanColumns.map((col) => {
            const colLeads = filteredLeads.filter((l) => l.status === col.status);
            return (
              <div key={col.status} className="kanban-column">
                {/* Column Header */}
                <div style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-main)',
                  borderTopLeftRadius: 'var(--radius-md)',
                  borderTopRightRadius: 'var(--radius-md)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: col.color }} />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{col.title}</span>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)'
                  }}>
                    {colLeads.length}
                  </span>
                </div>

                {/* Column Lead Cards */}
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
                  {colLeads.length === 0 ? (
                    <div style={{ padding: '24px 10px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      No leads in this stage
                    </div>
                  ) : (
                    colLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="card-glow"
                        style={{
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '12px',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>{lead.id}</span>
                          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{lead.date}</span>
                        </div>

                        <div>
                          <h4
                            style={{ fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', color: 'var(--text-main)' }}
                            onClick={() => handleStartEdit(lead)}
                          >
                            {lead.customerName}
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            📍 {lead.location} • 📞 {lead.phoneNumber}
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '0.725rem' }}>
                          <span style={{ background: 'var(--bg-main)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                            🏷️ {lead.source}
                          </span>
                          {lead.staffName && (
                            <span style={{ background: 'var(--bg-main)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                              👤 {lead.staffName}
                            </span>
                          )}
                        </div>

                        {lead.remarks && (
                          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontStyle: 'italic', background: 'var(--bg-main)', padding: '6px', borderRadius: '4px' }}>
                            "{lead.remarks}"
                          </p>
                        )}

                        {/* Card Action Quick Links */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px stroke var(--border-color)' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <a
                              href={`https://wa.me/${lead.phoneNumber.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm"
                              style={{ background: '#25D366', color: 'white', padding: '4px 6px', fontSize: '0.7rem' }}
                              title="WhatsApp"
                            >
                              <MessageSquare size={12} />
                            </a>
                            <a
                              href={`tel:${lead.phoneNumber}`}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 6px', fontSize: '0.7rem' }}
                              title="Call"
                            >
                              <Phone size={12} />
                            </a>
                          </div>

                          <button
                            className="btn btn-outline btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.725rem' }}
                            onClick={() => handleStartEdit(lead)}
                          >
                            Details & Status
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode 2: DATA TABLE */}
      {viewMode === 'table' && (
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '14px 16px' }}>Lead No</th>
                <th style={{ padding: '14px 16px' }}>Date</th>
                <th style={{ padding: '14px 16px' }}>Customer Name</th>
                <th style={{ padding: '14px 16px' }}>Phone / Location</th>
                <th style={{ padding: '14px 16px' }}>Source</th>
                <th style={{ padding: '14px 16px' }}>Assigned Staff</th>
                <th style={{ padding: '14px 16px' }}>Lead Status</th>
                <th style={{ padding: '14px 16px' }}>Follow-up Date</th>
                <th style={{ padding: '14px 16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s' }}
                  className="card-glow"
                >
                  <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--primary)' }}>{lead.id}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{lead.date}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>{lead.customerName}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div>{lead.phoneNumber}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {lead.location}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: 'var(--bg-main)', padding: '3px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
                      {lead.source}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{lead.staffName || 'Unassigned'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      className={`form-select ${getBadgeClass(lead.status)}`}
                      value={lead.status}
                      onChange={(e) => handleQuickStatusChange(lead, e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '0.775rem', fontWeight: 700, borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer' }}
                    >
                      {lists.leadStatuses.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{lead.followUpDate || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleStartEdit(lead)} title="Edit Lead">
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => onDeleteLead(lead.id)} title="Delete Lead">
                        <Trash2 size={14} style={{ color: 'var(--accent-rose)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT LEAD MODAL */}
      {(isCreating || activeModalLead) && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            {/* Modal Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {isCreating ? `New Lead (${formData.id})` : `Edit Lead Details — ${formData.id}`}
              </h3>
              <button
                onClick={() => { setIsCreating(false); setActiveModalLead(null); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Customer Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Site Location *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lead Source</label>
                  <select
                    className="form-select"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  >
                    {lists.sources.map((src) => (
                      <option key={src} value={src}>{src}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Assigned Staff</label>
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
                  <label className="form-label">Lead Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {lists.leadStatuses.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Follow-up Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Remarks & Door Requirements</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="e.g. Needs 3 FRP doors, 2 Teak door combos. Customer requested WhatsApp catalogue."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                />
              </div>

              {/* Action Shortcuts within Modal */}
              {!isCreating && (
                <div style={{ display: 'flex', gap: '10px', background: 'var(--bg-main)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setIsCreating(false);
                      setActiveModalLead(null);
                      onOpenNewScheduleForLead(formData);
                    }}
                  >
                    <Calendar size={14} /> Schedule Measurement Visit
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setIsCreating(false);
                      setActiveModalLead(null);
                      onOpenNewQuoteForLead(formData);
                    }}
                  >
                    <Plus size={14} /> Create Quotation
                  </button>
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setIsCreating(false); setActiveModalLead(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Lead Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
