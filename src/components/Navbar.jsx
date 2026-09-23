import React from 'react';
import {
  DoorClosed,
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
  Filter
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
  onOpenNewSchedule
}) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads Tracker', icon: Users },
    { id: 'schedule', label: 'Measurement Visits', icon: Ruler },
    { id: 'quotations', label: 'Quotations', icon: Receipt },
    { id: 'settings', label: 'Lists & Settings', icon: Settings }
  ];

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
        borderBottom: '1px solid var(--border-color)'
      }}>
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 10px rgba(154, 52, 18, 0.3)'
          }}>
            <DoorClosed size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
              PUTHENPURAYIL <span style={{ color: 'var(--primary)' }}>DOORS</span>
            </h1>
            <span style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              CRM & SALES WORKFLOW SYSTEM
            </span>
          </div>
        </div>

        {/* Global Search Input */}
        <div style={{ flex: '1', maxWidth: '400px', position: 'relative' }}>
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
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <nav style={{ padding: '0 24px', display: 'flex', gap: '4px', overflowX: 'auto' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
