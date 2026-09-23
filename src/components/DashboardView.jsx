import React from 'react';
import {
  Users,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  TrendingUp,
  Ruler,
  Phone,
  MessageSquare,
  Clock,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

export default function DashboardView({
  leads,
  quotations,
  measurements,
  periodFilter,
  onSelectLead,
  onOpenNewLead
}) {
  // Helper for formatting Indian currency (e.g. ₹1,00,000)
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Filter Data according to periodFilter
  const filterByPeriod = (items, dateField = 'date') => {
    if (periodFilter === 'All Time') return items;
    const now = new Date('2026-09-22'); // Current CRM baseline date
    return items.filter((item) => {
      if (!item[dateField]) return false;
      const d = new Date(item[dateField]);
      if (isNaN(d.getTime())) return true;
      if (periodFilter === 'Daily') {
        return d.toISOString().slice(0, 10) === '2026-09-22';
      }
      if (periodFilter === 'Weekly') {
        const diffDays = Math.abs((now - d) / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }
      if (periodFilter === 'Monthly') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filteredLeads = filterByPeriod(leads, 'date');
  const filteredQuotations = filterByPeriod(quotations, 'sentDate');

  // KPI Calculations
  const totalLeads = filteredLeads.length;

  const confirmedLeads = filteredLeads.filter((l) =>
    ['Order Confirmed', 'Advance Received', 'In Production', 'Ready for Delivery', 'Installed/Completed'].includes(l.status)
  );

  const totalQuotationValue = quotations.reduce((acc, q) => acc + (q.finalAmount || 0), 0);
  const confirmedValue = quotations
    .filter((q) => q.status === 'Approved')
    .reduce((acc, q) => acc + (q.finalAmount || 0), 0);

  const approvedQuotesCount = quotations.filter((q) => q.status === 'Approved').length;
  const quoteApprovalRate = quotations.length ? Math.round((approvedQuotesCount / quotations.length) * 100) : 0;

  const completedMeasurements = measurements.filter((m) => m.status === 'Completed').length;
  const measurementRate = measurements.length ? Math.round((completedMeasurements / measurements.length) * 100) : 0;

  // Action desk: Follow-ups Due / Overdue
  const followUpLeads = leads.filter(
    (l) => l.followUpDate && l.status !== 'Installed/Completed' && l.status !== 'Lost/Not Interested'
  );

  // Pipeline funnel distribution for Chart
  const statusCounts = {
    'New Lead': 0,
    'Contacted': 0,
    'Site Visit': 0,
    'Measurement': 0,
    'Quote Sent': 0,
    'Negotiation': 0,
    'Confirmed': 0
  };

  leads.forEach((l) => {
    if (l.status === 'New Lead') statusCounts['New Lead']++;
    else if (l.status === 'Contacted') statusCounts['Contacted']++;
    else if (l.status === 'Site Visit Scheduled') statusCounts['Site Visit']++;
    else if (l.status === 'Measurement Done') statusCounts['Measurement']++;
    else if (l.status === 'Quotation Sent') statusCounts['Quote Sent']++;
    else if (l.status === 'Negotiation') statusCounts['Negotiation']++;
    else if (['Order Confirmed', 'Advance Received', 'In Production', 'Ready for Delivery', 'Installed/Completed'].includes(l.status)) {
      statusCounts['Confirmed']++;
    }
  });

  const pipelineChartData = Object.keys(statusCounts).map((key) => ({
    stage: key,
    count: statusCounts[key]
  }));

  // Source breakdown chart
  const sourceMap = {};
  leads.forEach((l) => {
    const s = l.source || 'Other';
    sourceMap[s] = (sourceMap[s] || 0) + 1;
  });

  const PIE_COLORS = ['#9a3412', '#d97706', '#3b82f6', '#10b981', '#8b5cf6', '#f43f5e', '#64748b'];

  const sourceChartData = Object.keys(sourceMap).map((key) => ({
    name: key,
    value: sourceMap[key]
  }));

  // Staff Performance Data
  const staffPerformanceMap = {};
  leads.forEach((l) => {
    const s = l.staffName || 'Unassigned';
    if (!staffPerformanceMap[s]) {
      staffPerformanceMap[s] = { staffName: s, totalLeads: 0, confirmed: 0 };
    }
    staffPerformanceMap[s].totalLeads++;
    if (['Order Confirmed', 'Advance Received', 'In Production', 'Ready for Delivery', 'Installed/Completed'].includes(l.status)) {
      staffPerformanceMap[s].confirmed++;
    }
  });

  const staffData = Object.values(staffPerformanceMap);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner / Welcome Bar */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-sidebar), #1e293b)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ background: 'var(--primary)', color: 'white', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
              {periodFilter.toUpperCase()} DASHBOARD
            </span>
            <span style={{ opacity: 0.8, fontSize: '0.875rem' }}>Live Workstation Summary</span>
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Puthenpurayil Doors Sales Overview</h2>
          <p style={{ opacity: 0.85, fontSize: '0.9rem', marginTop: '4px' }}>
            Tracking {leads.length} total enquiries, active site visits, and quotation approvals across Kerala.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewLead} style={{ padding: '12px 20px', fontSize: '0.95rem' }}>
          + Add New Enquiry
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px'
      }}>
        {/* Total Leads */}
        <div className="card-glow" style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Leads</span>
            <div style={{ background: 'var(--accent-blue-bg)', color: 'var(--accent-blue)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, margin: '12px 0 4px 0', color: 'var(--text-main)' }}>
            {totalLeads}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 600 }}>
            {confirmedLeads.length} Orders Confirmed
          </span>
        </div>

        {/* Total Quoted Value */}
        <div className="card-glow" style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Pipeline Quoted Value</span>
            <div style={{ background: 'var(--secondary-light)', color: 'var(--secondary)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, margin: '12px 0 4px 0', color: 'var(--text-main)' }}>
            {formatCurrency(totalQuotationValue)}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Across {quotations.length} Active Quotes
          </span>
        </div>

        {/* Confirmed Orders Revenue */}
        <div className="card-glow" style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Confirmed Orders Value</span>
            <div style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, margin: '12px 0 4px 0', color: 'var(--accent-green)' }}>
            {formatCurrency(confirmedValue)}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 600 }}>
            Approved & In Production
          </span>
        </div>

        {/* Quotation Approval Ratio */}
        <div className="card-glow" style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Quotation Conversion</span>
            <div style={{ background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, margin: '12px 0 4px 0', color: 'var(--text-main)' }}>
            {quoteApprovalRate}%
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {approvedQuotesCount} of {quotations.length} Quotes Approved
          </span>
        </div>
      </div>

      {/* Main Grid: Action Follow-Up Desk + Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px'
      }}>
        {/* Action Desk: Follow-ups Due / Overdue */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} style={{ color: 'var(--secondary)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Follow-ups Action Desk</h3>
            </div>
            <span className="badge badge-quotation">{followUpLeads.length} Due</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Action items requiring contact or site visit confirmation today.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '380px', paddingRight: '4px' }}>
            {followUpLeads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{lead.customerName}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({lead.id})</span>
                    <span className={`badge badge-${lead.status.toLowerCase().replace(/[^a-z0-9]/g, '')}`}>
                      {lead.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '12px' }}>
                    <span>📍 {lead.location}</span>
                    <span>👤 Staff: {lead.staffName || 'Unassigned'}</span>
                    <span>📅 Due: {lead.followUpDate}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {/* WhatsApp Link */}
                  <a
                    href={`https://wa.me/${lead.phoneNumber.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.customerName)},%20greeting%20from%20Puthenpurayil%20Doors!`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm"
                    style={{ background: '#25D366', color: 'white', border: 'none', padding: '6px 10px' }}
                    title="Send WhatsApp Message"
                  >
                    <MessageSquare size={14} /> WhatsApp
                  </a>

                  {/* Call Link */}
                  <a
                    href={`tel:${lead.phoneNumber}`}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 10px' }}
                    title="Call Customer"
                  >
                    <Phone size={14} /> Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Stage Distribution Chart */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Lead Pipeline Breakdown</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Distribution of leads across initial contact, measurement visits, quotations, and confirmed sales.
          </p>

          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="stage" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Grid: Sources Donut + Staff Performance */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '24px'
      }}>
        {/* Lead Sources Donut Chart */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Enquiry Sources</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Where customers are discovering Puthenpurayil Doors.
          </p>

          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
            {sourceChartData.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                <span>{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Sales Performance */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Staff Conversion Tracker</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Lead assignment and order confirmation performance per team member.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {staffData.map((staff) => {
              const conversion = staff.totalLeads ? Math.round((staff.confirmed / staff.totalLeads) * 100) : 0;
              return (
                <div
                  key={staff.staffName}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{staff.staffName}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-green)' }}>
                      {staff.confirmed} Confirmed ({conversion}%)
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${conversion}%`,
                        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Total Assigned Leads: {staff.totalLeads}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
