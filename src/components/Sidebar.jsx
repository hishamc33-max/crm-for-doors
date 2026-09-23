import React from 'react';
import Logo from './Logo';
import {
  LayoutDashboard,
  Users,
  Ruler,
  Receipt,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  onLogout,
  leadsCount = 0,
  scheduleCount = 0,
  quotesCount = 0
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads Tracker', icon: Users, badge: leadsCount, badgeColor: '#3b82f6' },
    { id: 'schedule', label: 'Measurement Visits', icon: Ruler, badge: scheduleCount, badgeColor: '#8b5cf6' },
    { id: 'quotations', label: 'Quotations & Sales', icon: Receipt, badge: quotesCount, badgeColor: '#f59e0b' },
    { id: 'settings', label: 'Lists & Settings', icon: Settings }
  ];

  return (
    <aside
      style={{
        width: collapsed ? '72px' : '260px',
        backgroundColor: 'var(--bg-sidebar, #0f172a)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        borderRight: '1px solid var(--border-color, #1e293b)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 110,
        userSelect: 'none',
        flexShrink: 0
      }}
    >
      {/* Sidebar Header with Brand Logo & Toggle Button */}
      <div
        style={{
          padding: collapsed ? '16px 12px' : '16px 12px 16px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          height: '70px',
          gap: '8px'
        }}
      >
        {!collapsed ? (
          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <Logo size="small" variant="light" showTagline={true} />
          </div>
        ) : (
          <div
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#f59e0b',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1c1917',
              fontWeight: 900,
              fontSize: '0.85rem',
              flexShrink: 0
            }}
          >
            PD
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#94a3b8',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s ease'
          }}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main Navigation Links */}
      <div style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.675rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', padding: collapsed ? '0 4px 6px 4px' : '0 10px 8px 10px', textAlign: collapsed ? 'center' : 'left' }}>
          {collapsed ? '—' : 'CRM MODULES'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between',
                padding: collapsed ? '12px 0' : '12px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(154, 52, 18, 0.3))'
                  : 'transparent',
                color: isActive ? '#f59e0b' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
              title={collapsed ? item.label : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={19} style={{ color: isActive ? '#f59e0b' : '#94a3b8', flexShrink: 0 }} />
                {!collapsed && <span>{item.label}</span>}
              </div>

              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    backgroundColor: item.badgeColor || '#f59e0b',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Session & Logout Footer */}
      <div
        style={{
          padding: '16px 12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#f59e0b',
                color: '#1c1917',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85rem',
                flexShrink: 0
              }}
            >
              AD
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap' }}>
                System Admin
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                admin@puthenpurayil.com
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            background: 'rgba(244, 63, 94, 0.08)',
            color: '#fb7185',
            fontWeight: 600,
            fontSize: '0.825rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="Sign Out"
        >
          <LogOut size={16} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
