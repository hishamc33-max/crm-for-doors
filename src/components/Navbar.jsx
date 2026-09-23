import React from 'react';
import {
  Search,
  Plus,
  Calendar,
  FileText,
  Sun,
  Moon,
  LayoutDashboard,
  Users,
  Ruler,
  Receipt,
  Settings,
  Filter,
  LogOut
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  periodFilter,
  setPeriodFilter,
  theme,
  setTheme,
  onOpenNewLead,
  onOpenNewQuote,
  onOpenNewSchedule,
  onLogout,
  showTabs = false
}) {
  const tabLabels = {
    dashboard: 'CRM Dashboard & Analytics',
    leads: 'Leads Tracker & Customer Records',
    schedule: 'Measurement & Site Visits',
    quotations: 'Quotations & Invoicing System',
    settings: 'System Lists & Options'
  };

  return (
    <header style={{
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Top Header Bar */}
      <div style={{
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        borderBottom: showTabs ? '1px solid var(--border-color)' : 'none'
      }}>
        {/* Current Module Title Breadcrumb */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
            {tabLabels[activeTab] || 'Puthenpurayil Doors CRM'}
          </h2>
          <span style={{ fontSize: '0.725rem', fontWeight: 600, color: '#f59e0b', letterSpacing: '0.04em' }}>
            PUTHENPURAYIL DOORS • NELLAMKANDY
          </span>
        </div>

        {/* Global Search Input */}
        <div style={{ flex: '1', maxWidth: '420px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search leads, phone numbers, quotes, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px', height: '38px', borderRadius: 'var(--radius-full)' }}
          />
        </div>

        {/* Quick Actions & Period Filter & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Dashboard Period Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-main)', padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.8125rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="Daily">Daily (Today)</option>
              <option value="Weekly">Weekly (This Week)</option>
              <option value="Monthly">Monthly (This Month)</option>
              <option value="All Time">All Time</option>
            </select>
          </div>

          {/* Quick Action Buttons */}
          <button className="btn btn-primary btn-sm" onClick={onOpenNewLead}>
            <Plus size={15} /> Lead
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onOpenNewSchedule}>
            <Calendar size={15} /> Visit
          </button>
          <button className="btn btn-outline btn-sm" onClick={onOpenNewQuote}>
            <FileText size={15} /> Quote
          </button>

          {/* Dark Mode Toggle */}
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} />}
          </button>

          {/* User Profile / Logout Button */}
          {onLogout && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onLogout}
              title="Sign Out"
              style={{ color: 'var(--accent-rose, #f43f5e)', borderColor: 'var(--border-color)', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
