import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Logo from './Logo';
import {
  Receipt,
  Plus,
  Printer,
  Download,
  Trash2,
  Search,
  X,
  FileText,
  ArrowLeft
} from 'lucide-react';

export default function QuotationsView({
  quotations,
  leads,
  lists,
  onSaveQuotation,
  onDeleteQuotation
}) {
  const [activeModal, setActiveModal] = useState(false); // Builder modal
  const [previewQuote, setPreviewQuote] = useState(null); // Printable Invoice preview modal
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [exportingPdf, setExportingPdf] = useState(false);

  const invoicePrintRef = useRef(null);

  // Close modal on Esc key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPreviewQuote(null);
        setActiveModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [formData, setFormData] = useState({
    id: '',
    leadId: '',
    customerName: '',
    phoneNumber: '',
    sentBy: '',
    sentDate: new Date().toISOString().slice(0, 10),
    approvedBy: '',
    quotedAmount: 0,
    discount: 0,
    finalAmount: 0,
    followUpDate: '',
    validityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: 'Sent',
    items: [
      { product: 'FRP Door', qty: 1, rate: 25000, total: 25000 }
    ]
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const filtered = quotations.filter((q) => {
    const matchesSearch =
      searchQuery === '' ||
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.leadId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'All' || q.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals for builder form
  const calculateFormTotals = (items, discount = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const final = Math.max(0, subtotal - Number(discount));
    return { subtotal, final };
  };

  // Start New Quote
  const handleStartCreate = (preselectedLead = null) => {
    const maxNum = quotations.reduce((max, q) => {
      const num = parseInt(q.id.replace('Q-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextId = `Q-${String(maxNum + 1).padStart(4, '0')}`;

    const lead = preselectedLead || leads[0];
    const initialItems = [{ product: 'FRP Door', qty: 2, rate: 25000, total: 50000 }];
    const { subtotal, final } = calculateFormTotals(initialItems, 0);

    setFormData({
      id: nextId,
      leadId: lead ? lead.id : '',
      customerName: lead ? lead.customerName : '',
      phoneNumber: lead ? lead.phoneNumber : '',
      sentBy: lead?.staffName || lists.staff[0]?.name || '',
      sentDate: new Date().toISOString().slice(0, 10),
      approvedBy: '',
      quotedAmount: subtotal,
      discount: 0,
      finalAmount: final,
      followUpDate: '',
      validityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'Sent',
      items: initialItems
    });
    setActiveModal(true);
  };

  // Direct PDF Export Generator
  const handleDownloadPDF = async (quoteToExport) => {
    const quote = quoteToExport || previewQuote;
    if (!quote) return;

    setExportingPdf(true);

    try {
      if (!previewQuote || previewQuote.id !== quote.id) {
        setPreviewQuote(quote);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      const element = invoicePrintRef.current || document.getElementById('printable-quote-area');
      if (!element) {
        alert('Unable to capture quotation invoice element.');
        setExportingPdf(false);
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Quotation_${quote.id}_Puthenpurayil_Doors.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF. You can also use Print Invoice.');
    } finally {
      setExportingPdf(false);
    }
  };

  // Lead change in Quote Builder
  const handleLeadSelect = (leadId) => {
    const found = leads.find((l) => l.id === leadId);
    if (found) {
      setFormData({
        ...formData,
        leadId: found.id,
        customerName: found.customerName,
        phoneNumber: found.phoneNumber,
        sentBy: found.staffName || lists.staff[0]?.name || ''
      });
    }
  };

  // Item field change
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    if (field === 'qty' || field === 'rate') {
      const qty = Number(updatedItems[index].qty) || 0;
      const rate = Number(updatedItems[index].rate) || 0;
      updatedItems[index].total = qty * rate;
    }
    const { subtotal, final } = calculateFormTotals(updatedItems, formData.discount);
    setFormData({
      ...formData,
      items: updatedItems,
      quotedAmount: subtotal,
      finalAmount: final
    });
  };

  const handleAddItem = () => {
    const newItem = { product: lists.products[0] || 'FRP Door', qty: 1, rate: 10000, total: 10000 };
    const updatedItems = [...formData.items, newItem];
    const { subtotal, final } = calculateFormTotals(updatedItems, formData.discount);
    setFormData({
      ...formData,
      items: updatedItems,
      quotedAmount: subtotal,
      finalAmount: final
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const { subtotal, final } = calculateFormTotals(updatedItems, formData.discount);
    setFormData({
      ...formData,
      items: updatedItems,
      quotedAmount: subtotal,
      finalAmount: final
    });
  };

  const handleDiscountChange = (dis) => {
    const { subtotal, final } = calculateFormTotals(formData.items, dis);
    setFormData({
      ...formData,
      discount: dis,
      quotedAmount: subtotal,
      finalAmount: final
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveQuotation(formData);
    setActiveModal(false);
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Quotations Manager</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Generate, track, and export customer door quotations & invoices as PDF
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search quotes..."
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
            {lists.quotationStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={() => handleStartCreate()} style={{ height: '34px', padding: '0 14px' }}>
            <Plus size={15} /> New Quotation
          </button>
        </div>
      </div>

      {/* Quotations Table */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '14px 16px' }}>Quote No</th>
              <th style={{ padding: '14px 16px' }}>Lead No</th>
              <th style={{ padding: '14px 16px' }}>Customer Name</th>
              <th style={{ padding: '14px 16px' }}>Sent By</th>
              <th style={{ padding: '14px 16px' }}>Sent Date</th>
              <th style={{ padding: '14px 16px' }}>Quoted Amt</th>
              <th style={{ padding: '14px 16px' }}>Discount</th>
              <th style={{ padding: '14px 16px' }}>Final Payable</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
              <th style={{ padding: '14px 16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((quote) => (
              <tr key={quote.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="card-glow">
                <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--primary)' }}>{quote.id}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700 }}>{quote.leadId}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700 }}>{quote.customerName}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{quote.sentBy}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{quote.sentDate}</td>
                <td style={{ padding: '12px 16px' }}>{formatCurrency(quote.quotedAmount)}</td>
                <td style={{ padding: '12px 16px', color: 'var(--accent-rose)' }}>
                  {quote.discount ? `- ${formatCurrency(quote.discount)}` : '₹0'}
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--accent-green)' }}>
                  {formatCurrency(quote.finalAmount)}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span className={`badge badge-${quote.status.toLowerCase()}`}>
                    {quote.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setPreviewQuote(quote)}
                      title="View Invoice & Print"
                    >
                      <FileText size={14} /> View
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleDownloadPDF(quote)}
                      title="Export Quotation as PDF"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a', fontWeight: 700 }}
                    >
                      <Download size={14} /> Export PDF
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onDeleteQuotation(quote.id)}
                      title="Delete Quote"
                    >
                      <Trash2 size={14} style={{ color: 'var(--accent-rose)' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT QUOTATION BUILDER MODAL */}
      {activeModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '800px' }}>
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Create New Quotation ({formData.id})</h3>
              <button
                onClick={() => setActiveModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

                <div className="form-group">
                  <label className="form-label">Prepared By (Staff)</label>
                  <select
                    className="form-select"
                    value={formData.sentBy}
                    onChange={(e) => setFormData({ ...formData, sentBy: e.target.value })}
                  >
                    {lists.staff.map((st) => (
                      <option key={st.name} value={st.name}>{st.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Line Items Builder Section */}
              <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Door & Window Order Line Items</h4>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddItem}>
                    <Plus size={14} /> Add Item
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {formData.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 30px', gap: '10px', alignItems: 'center' }}>
                      <select
                        className="form-select"
                        value={item.product}
                        onChange={(e) => handleItemChange(idx, 'product', e.target.value)}
                      >
                        {lists.products.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        className="form-input"
                        value={item.qty}
                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                      />

                      <input
                        type="number"
                        min="0"
                        placeholder="Rate (₹)"
                        className="form-input"
                        value={item.rate}
                        onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                      />

                      <div style={{ fontWeight: 700, textAlign: 'right', fontSize: '0.85rem' }}>
                        {formatCurrency(item.total)}
                      </div>

                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount & Totals Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
                <div className="form-group">
                  <label className="form-label">Special Discount Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.discount}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                  />
                </div>

                <div style={{ background: 'var(--primary-light)', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Final Net Payable Amount</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {formatCurrency(formData.finalAmount)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Generate Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE & PDF LETTERHEAD INVOICE PREVIEW MODAL */}
      {previewQuote && (
        <div 
          className="modal-overlay" 
          onClick={() => setPreviewQuote(null)}
        >
          {/* FLOATING DIRECT BACK BUTTON ON VIEWPORT TOP-LEFT */}
          <button
            className="no-print btn"
            onClick={() => setPreviewQuote(null)}
            style={{
              position: 'fixed',
              top: '20px',
              left: '20px',
              zIndex: 100000,
              background: '#f59e0b',
              color: '#0f172a',
              border: 'none',
              fontWeight: 800,
              padding: '10px 18px',
              borderRadius: '10px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={18} /> Back to Quotations List
          </button>

          {/* Modal Container */}
          <div 
            className="modal-content animate-fade-in" 
            style={{ 
              maxWidth: '880px', 
              background: '#ffffff', 
              color: '#0f172a', 
              borderRadius: '16px', 
              overflow: 'hidden',
              marginTop: '40px',
              marginBottom: '40px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Action Header inside Modal */}
            <div 
              className="no-print" 
              style={{
                padding: '14px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#0f172a',
                color: '#ffffff',
                position: 'sticky',
                top: 0,
                zIndex: 100
              }}
            >
              {/* BACK BUTTON IN STICKY HEADER */}
              <button 
                className="btn"
                onClick={() => setPreviewQuote(null)}
                style={{ 
                  background: '#f59e0b', 
                  color: '#0f172a', 
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.875rem'
                }}
              >
                <ArrowLeft size={18} /> Back to Quotations List
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleDownloadPDF(previewQuote)}
                  disabled={exportingPdf}
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a', fontWeight: 800, padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <Download size={15} /> {exportingPdf ? 'Generating PDF...' : 'Download PDF'}
                </button>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => window.print()}
                  style={{ background: '#1e293b', color: '#ffffff', borderColor: '#334155', padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <Printer size={15} /> Print Invoice
                </button>
                <button
                  onClick={() => setPreviewQuote(null)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                  title="Close Modal"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Printable & Canvas Capture Area */}
            <div 
              ref={invoicePrintRef}
              id="printable-quote-area"
              className="printable-area" 
              style={{ padding: '36px', background: '#ffffff', color: '#0f172a' }}
            >
              {/* Header Letterhead - Perfectly Aligned 2-Column Layout */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                borderBottom: '3px solid #f59e0b', 
                paddingBottom: '20px', 
                marginBottom: '24px',
                gap: '20px'
              }}>
                <div style={{ flex: 1 }}>
                  {/* Brand Logo in Invoice */}
                  <Logo size="medium" variant="dark" showTagline={true} />
                  <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, marginTop: '12px' }}>
                    Premium FRP, FERO, Steel & Wooden Door Systems
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
                    Nellamkandy, Malappuram / Kozhikode / Ernakulam, Kerala<br />
                    Phone: +91 98470 12345 | Email: sales@puthenpurayildoors.com
                  </p>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.05em', lineHeight: 1 }}>
                    QUOTATION
                  </h2>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#d97706', marginTop: '6px' }}>
                    Quote No: {previewQuote.id}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px', lineHeight: 1.4 }}>
                    Date: {previewQuote.sentDate}<br />
                    Valid Until: {previewQuote.validityDate}
                  </div>
                </div>
              </div>

              {/* Bill To Info */}
              <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>CUSTOMER DETAILS</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{previewQuote.customerName}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>Phone: {previewQuote.phoneNumber}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>Lead Ref: {previewQuote.leadId}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>PREPARED BY</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{previewQuote.sentBy || 'Puthenpurayil Sales Desk'}</div>
                </div>
              </div>

              {/* Line Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                <thead>
                  <tr style={{ background: '#0f172a', color: '#ffffff', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>#</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Item / Description</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Unit Rate</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(previewQuote.items || []).map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '0.875rem' }}>
                      <td style={{ padding: '12px 14px' }}>{i + 1}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>{item.product}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>{item.qty}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>{formatCurrency(item.rate)}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700 }}>{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary Totals */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
                <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Subtotal:</span>
                    <span>{formatCurrency(previewQuote.quotedAmount)}</span>
                  </div>
                  {previewQuote.discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
                      <span>Discount:</span>
                      <span>- {formatCurrency(previewQuote.discount)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem', borderTop: '2px solid #f59e0b', paddingTop: '8px', color: '#d97706' }}>
                    <span>Net Amount:</span>
                    <span>{formatCurrency(previewQuote.finalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Footer Terms */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', fontSize: '0.775rem', color: '#64748b' }}>
                <strong>Terms & Conditions:</strong><br />
                1. Advance 50% required upon order confirmation.<br />
                2. Balance 50% payable prior to site delivery/installation.<br />
                3. Standard manufacturing lead time is 7-10 working days.<br />
                <div style={{ marginTop: '16px', fontStyle: 'italic', textAlign: 'center', fontWeight: 600, color: '#0f172a' }}>
                  Thank you for choosing Puthenpurayil Doors — Nellamkandy!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
