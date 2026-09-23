import React, { useState } from 'react';
import {
  Settings,
  Plus,
  Trash2,
  RotateCcw,
  Download,
  CheckCircle,
  Database,
  Layers
} from 'lucide-react';

export default function ListsSettingsView({
  lists,
  onSaveLists,
  onResetAllData,
  onExportCSV
}) {
  const [activeCategory, setActiveCategory] = useState('products');
  const [newOptionText, setNewOptionText] = useState('');

  const categories = [
    { id: 'products', label: 'Products & Door Models', listKey: 'products' },
    { id: 'sources', label: 'Lead Sources', listKey: 'sources' },
    { id: 'leadStatuses', label: 'Lead Statuses', listKey: 'leadStatuses' },
    { id: 'measurementStatuses', label: 'Measurement Statuses', listKey: 'measurementStatuses' },
    { id: 'quotationStatuses', label: 'Quotation Statuses', listKey: 'quotationStatuses' },
    { id: 'staff', label: 'Staff Members', listKey: 'staff' }
  ];

  const currentCategory = categories.find((c) => c.id === activeCategory);
  const currentList = lists[currentCategory.listKey] || [];

  const handleAddOption = (e) => {
    e.preventDefault();
    if (!newOptionText.trim()) return;

    let updatedList;
    if (activeCategory === 'staff') {
      updatedList = [...currentList, { name: newOptionText.trim(), role: 'Counter Staff' }];
    } else {
      updatedList = [...currentList, newOptionText.trim()];
    }

    onSaveLists({
      ...lists,
      [currentCategory.listKey]: updatedList
    });
    setNewOptionText('');
  };

  const handleRemoveOption = (index) => {
    const updatedList = currentList.filter((_, i) => i !== index);
    onSaveLists({
      ...lists,
      [currentCategory.listKey]: updatedList
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Settings Header */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        padding: '20px 24px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Workbook Dropdown Lists & System Configuration</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Changes made here update dropdown selections dynamically across all CRM leads, site visits, and quotations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={onExportCSV}>
            <Download size={16} /> Export Backup (JSON)
          </button>
          <button className="btn btn-outline" onClick={onResetAllData} style={{ color: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' }}>
            <RotateCcw size={16} /> Reset Sheet Defaults
          </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
        {/* Category Sidebar Navigation */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeCategory === cat.id ? 'var(--primary-light)' : 'transparent',
                color: activeCategory === cat.id ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: activeCategory === cat.id ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{cat.label}</span>
              <span className="badge badge-new" style={{ fontSize: '0.7rem' }}>
                {(lists[cat.listKey] || []).length}
              </span>
            </button>
          ))}
        </div>

        {/* Selected List Editor Panel */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Manage {currentCategory.label} Options
          </h3>

          {/* Add Option Form */}
          <form onSubmit={handleAddOption} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              required
              className="form-input"
              placeholder={`Enter new ${currentCategory.label} option...`}
              value={newOptionText}
              onChange={(e) => setNewOptionText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              <Plus size={16} /> Add Option
            </button>
          </form>

          {/* List Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
            {currentList.map((item, index) => {
              const label = typeof item === 'object' ? item.name : item;
              return (
                <div
                  key={index}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                    title="Delete Option"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
