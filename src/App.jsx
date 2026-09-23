import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import LeadsView from './components/LeadsView';
import MeasurementScheduleView from './components/MeasurementScheduleView';
import QuotationsView from './components/QuotationsView';
import ListsSettingsView from './components/ListsSettingsView';
import {
  getStoredData,
  saveStoredData,
  resetStoredData
} from './data/initialData';

export default function App() {
  const [data, setData] = useState(() => getStoredData());
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | leads | schedule | quotations | settings
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('All Time'); // Daily | Weekly | Monthly | All Time
  const [theme, setTheme] = useState('light');
  const [toastMessage, setToastMessage] = useState('');

  // Synchronize LocalStorage on data changes
  useEffect(() => {
    saveStoredData(data);
  }, [data]);

  // Handle Theme switch
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toast alert trigger
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Lead Actions
  const handleSaveLead = (lead) => {
    const exists = data.leads.some((l) => l.id === lead.id);
    let updatedLeads;
    if (exists) {
      updatedLeads = data.leads.map((l) => (l.id === lead.id ? lead : l));
      showToast(`Lead ${lead.id} updated successfully.`);
    } else {
      updatedLeads = [lead, ...data.leads];
      showToast(`New Lead ${lead.id} created successfully.`);
    }
    setData((prev) => ({ ...prev, leads: updatedLeads }));
  };

  const handleDeleteLead = (leadId) => {
    if (window.confirm(`Are you sure you want to delete lead ${leadId}?`)) {
      const updated = data.leads.filter((l) => l.id !== leadId);
      setData((prev) => ({ ...prev, leads: updated }));
      showToast(`Lead ${leadId} deleted.`);
    }
  };

  // Measurement Actions
  const handleSaveMeasurement = (measurement) => {
    const exists = data.measurements.some((m) => m.id === measurement.id);
    let updatedMeasurements;
    if (exists) {
      updatedMeasurements = data.measurements.map((m) => (m.id === measurement.id ? measurement : m));
    } else {
      updatedMeasurements = [measurement, ...data.measurements];
    }

    // Also sync status on linked Lead if Completed
    let updatedLeads = [...data.leads];
    if (measurement.status === 'Completed') {
      updatedLeads = updatedLeads.map((l) => {
        if (l.id === measurement.leadId) {
          return {
            ...l,
            status: 'Measurement Done',
            measurementDate: measurement.measurementDate,
            measurementStatus: 'Completed'
          };
        }
        return l;
      });
    }

    setData((prev) => ({ ...prev, measurements: updatedMeasurements, leads: updatedLeads }));
    showToast(`Site visit schedule ${measurement.id} saved.`);
  };

  // Quotation Actions
  const handleSaveQuotation = (quotation) => {
    const exists = data.quotations.some((q) => q.id === quotation.id);
    let updatedQuotations;
    if (exists) {
      updatedQuotations = data.quotations.map((q) => (q.id === quotation.id ? quotation : q));
    } else {
      updatedQuotations = [quotation, ...data.quotations];
    }

    // Also sync lead status if quote is sent or approved
    let updatedLeads = [...data.leads];
    updatedLeads = updatedLeads.map((l) => {
      if (l.id === quotation.leadId) {
        let newStatus = l.status;
        if (quotation.status === 'Approved') newStatus = 'Order Confirmed';
        else if (quotation.status === 'Sent') newStatus = 'Quotation Sent';
        return {
          ...l,
          status: newStatus,
          quotationSentDate: quotation.sentDate,
          quotationStatus: quotation.status
        };
      }
      return l;
    });

    setData((prev) => ({ ...prev, quotations: updatedQuotations, leads: updatedLeads }));
    showToast(`Quotation ${quotation.id} saved successfully.`);
  };

  const handleDeleteQuotation = (quoteId) => {
    if (window.confirm(`Are you sure you want to delete quotation ${quoteId}?`)) {
      const updated = data.quotations.filter((q) => q.id !== quoteId);
      setData((prev) => ({ ...prev, quotations: updated }));
      showToast(`Quotation ${quoteId} deleted.`);
    }
  };

  // Settings Actions
  const handleSaveLists = (newLists) => {
    setData((prev) => ({ ...prev, lists: newLists }));
    showToast('Dropdown options updated workbook-wide.');
  };

  const handleResetAllData = () => {
    if (window.confirm('Reset all CRM data back to the original Google Sheet state?')) {
      const reset = resetStoredData();
      setData(reset);
      showToast('All CRM data reset to default workbook state.');
    }
  };

  const handleExportBackup = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Puthenpurayil_Doors_CRM_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showToast('CRM data backup downloaded as JSON.');
  };

  // Shortcut Modal triggers from Navbar
  const handleOpenNewLeadShortcut = () => {
    setActiveTab('leads');
  };
  const handleOpenNewScheduleShortcut = () => {
    setActiveTab('schedule');
  };
  const handleOpenNewQuoteShortcut = () => {
    setActiveTab('quotations');
  };

  return (
    <div className="app-container">
      <div className="main-wrapper">
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          periodFilter={periodFilter}
          setPeriodFilter={setPeriodFilter}
          theme={theme}
          setTheme={setTheme}
          onOpenNewLead={handleOpenNewLeadShortcut}
          onOpenNewQuote={handleOpenNewQuoteShortcut}
          onOpenNewSchedule={handleOpenNewScheduleShortcut}
        />

        {/* Page Content View */}
        <main className="page-content">
          {activeTab === 'dashboard' && (
            <DashboardView
              leads={data.leads}
              quotations={data.quotations}
              measurements={data.measurements}
              periodFilter={periodFilter}
              onOpenNewLead={handleOpenNewLeadShortcut}
            />
          )}

          {activeTab === 'leads' && (
            <LeadsView
              leads={data.leads}
              lists={data.lists}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSaveLead={handleSaveLead}
              onDeleteLead={handleDeleteLead}
              onOpenNewScheduleForLead={() => setActiveTab('schedule')}
              onOpenNewQuoteForLead={() => setActiveTab('quotations')}
            />
          )}

          {activeTab === 'schedule' && (
            <MeasurementScheduleView
              measurements={data.measurements}
              leads={data.leads}
              lists={data.lists}
              onSaveMeasurement={handleSaveMeasurement}
              onOpenNewQuoteForLead={() => setActiveTab('quotations')}
            />
          )}

          {activeTab === 'quotations' && (
            <QuotationsView
              quotations={data.quotations}
              leads={data.leads}
              lists={data.lists}
              onSaveQuotation={handleSaveQuotation}
              onDeleteQuotation={handleDeleteQuotation}
            />
          )}

          {activeTab === 'settings' && (
            <ListsSettingsView
              lists={data.lists}
              onSaveLists={handleSaveLists}
              onResetAllData={handleResetAllData}
              onExportCSV={handleExportBackup}
            />
          )}
        </main>

        {/* Toast Alert Notification */}
        {toastMessage && (
          <div
            className="animate-fade-in"
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: 'var(--bg-sidebar)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 2000,
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>✓ {toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
