// Seed data extracted from Puthenpurayil Doors Google Sheet Workbook

export const DEFAULT_LISTS = {
  sources: [
    'Walk-in',
    'Referral - Suham',
    'Referral - Razack',
    'Referral - Jasim',
    'Meta Leads (Facebook/Instagram)',
    'Vendor Lead',
    'Website/Google',
    'Other'
  ],
  products: [
    'FRP Door',
    'Steel Door',
    'FERO Door',
    'Wooden Door',
    'Door Frame',
    'Window',
    'Door + Frame Combo',
    'Customized Door',
    'Door Fittings/Hardware',
    'Other'
  ],
  leadStatuses: [
    'New Lead',
    'Contacted',
    'Site Visit Scheduled',
    'Measurement Done',
    'Quotation Sent',
    'Negotiation',
    'Order Confirmed',
    'Advance Received',
    'In Production',
    'Ready for Delivery',
    'Installed/Completed',
    'On Hold',
    'Lost/Not Interested'
  ],
  measurementStatuses: [
    'Scheduled',
    'Completed',
    'Rescheduled',
    'Cancelled'
  ],
  quotationStatuses: [
    'Draft',
    'Sent',
    'Negotiation',
    'Approved',
    'Rejected',
    'Revised',
    'Expired'
  ],
  staff: [
    { name: 'Bindhu', role: 'Counter Staff' },
    { name: 'Nadiya', role: 'Counter Staff' },
    { name: 'Renjith', role: 'Counter Staff' },
    { name: 'Ashokan', role: 'Counter Staff' },
    { name: 'Staff A', role: 'Field Staff' },
    { name: 'Staff B', role: 'Field Staff' },
    { name: 'Staff C', role: 'Field Staff' }
  ]
};

export const DEFAULT_LEADS = [
  {
    id: 'L-0001',
    date: '2026-08-03',
    staffName: 'Bindhu',
    customerName: 'Anoop Menon',
    phoneNumber: '+91 9847012345',
    location: 'Kochi',
    source: 'Referral - Customer',
    followUpDate: '2026-09-22',
    status: 'Advance Received',
    measurementDate: '2026-09-21',
    measurementStatus: 'Completed',
    quotationSentDate: '2026-09-19',
    quotationStatus: 'Approved',
    advanceDate: '2026-09-21',
    advanceAmount: 25000,
    productionStartDate: '2026-09-22',
    inProductionDays: 5,
    remarks: 'Job closed, customer satisfied. 3 FRP door openings.'
  },
  {
    id: 'L-0002',
    date: '2026-08-06',
    staffName: 'Bindhu',
    customerName: 'Fathima Rasheed',
    phoneNumber: '+91 9188023456',
    location: 'Kozhikode',
    source: 'Referral - Suham',
    followUpDate: '2026-09-23',
    status: 'Order Confirmed',
    measurementDate: '2026-09-17',
    measurementStatus: 'Completed',
    quotationSentDate: '2026-09-18',
    quotationStatus: 'Approved',
    advanceDate: '',
    advanceAmount: 0,
    productionStartDate: '',
    inProductionDays: 0,
    remarks: 'Advance to be collected. 2 FERO Teak doors.'
  },
  {
    id: 'L-0003',
    date: '2026-08-10',
    staffName: 'Nadiya',
    customerName: 'Biju Thomas',
    phoneNumber: '+91 9744034567',
    location: 'Thrissur',
    source: 'Meta Leads (Facebook/Instagram)',
    followUpDate: '2026-09-23',
    status: 'Quotation Sent',
    measurementDate: '2026-09-15',
    measurementStatus: 'Completed',
    quotationSentDate: '2026-09-16',
    quotationStatus: 'Sent',
    advanceDate: '',
    advanceAmount: 0,
    productionStartDate: '',
    inProductionDays: 0,
    remarks: 'Waiting on customer decision for 4 Wooden doors combo.'
  },
  {
    id: 'L-0004',
    date: '2026-08-12',
    staffName: 'Renjith',
    customerName: 'Shibin Das',
    phoneNumber: '+91 9645045678',
    location: 'Malappuram',
    source: 'Vendor Lead',
    followUpDate: '2026-09-22',
    status: 'Negotiation',
    measurementDate: '2026-09-18',
    measurementStatus: 'Completed',
    quotationSentDate: '2026-09-19',
    quotationStatus: 'Negotiation',
    advanceDate: '',
    advanceAmount: 0,
    productionStartDate: '',
    inProductionDays: 0,
    remarks: 'Asked for 10% discount on Steel Door order.'
  },
  {
    id: 'L-0005',
    date: '2026-08-14',
    staffName: 'Ashokan',
    customerName: 'Aleena Joseph',
    phoneNumber: '+91 9946056789',
    location: 'Ernakulam',
    source: 'Referral - Razack',
    followUpDate: '2026-09-24',
    status: 'Measurement Done',
    measurementDate: '2026-09-20',
    measurementStatus: 'Completed',
    quotationSentDate: '',
    quotationStatus: 'Draft',
    advanceDate: '',
    advanceAmount: 0,
    productionStartDate: '',
    inProductionDays: 0,
    remarks: 'Quote to be prepared for 2 Door + Frame Combos.'
  },
  {
    id: 'L-0006',
    date: '2026-08-17',
    staffName: 'Staff A',
    customerName: 'Nizam Kareem',
    phoneNumber: '+91 9037067890',
    location: 'Kannur',
    source: 'Referral - Jasim',
    followUpDate: '2026-09-23',
    status: 'Site Visit Scheduled',
    measurementDate: '2026-09-24',
    measurementStatus: 'Scheduled',
    quotationSentDate: '',
    quotationStatus: '',
    advanceDate: '',
    advanceAmount: 0,
    productionStartDate: '',
    inProductionDays: 0,
    remarks: 'Confirm visit time for villa site measurement.'
  },
  {
    id: 'L-0007',
    date: '2026-08-20',
    staffName: 'Nadiya',
    customerName: 'Priya Nair',
    phoneNumber: '+91 8907078901',
    location: 'Kottayam',
    source: 'Website/Google',
    followUpDate: '2026-09-23',
    status: 'Contacted',
    measurementDate: '',
    measurementStatus: '',
    quotationSentDate: '',
    quotationStatus: '',
    advanceDate: '',
    advanceAmount: 0,
    productionStartDate: '',
    inProductionDays: 0,
    remarks: 'Wants catalogue shared on WhatsApp.'
  },
  {
    id: 'L-0008',
    date: '2026-08-23',
    staffName: 'Bindhu',
    customerName: 'Rahul Varma',
    phoneNumber: '+91 8129089012',
    location: 'Palakkad',
    source: 'Walk-in',
    followUpDate: '2026-09-25',
    status: 'New Lead',
    measurementDate: '',
    measurementStatus: '',
    quotationSentDate: '',
    quotationStatus: '',
    advanceDate: '',
    advanceAmount: 0,
    productionStartDate: '',
    inProductionDays: 0,
    remarks: 'Inquired about FRP Waterproof Doors for house.'
  },
  {
    id: 'L-0009',
    date: '2026-08-05',
    staffName: 'Renjith',
    customerName: 'Sana Habeeb',
    phoneNumber: '+91 9995090123',
    location: 'Kozhikode',
    source: 'Referral - Suham',
    followUpDate: '',
    status: 'Lost/Not Interested',
    measurementDate: '',
    measurementStatus: 'Cancelled',
    quotationSentDate: '',
    quotationStatus: 'Rejected',
    advanceDate: '',
    advanceAmount: 0,
    productionStartDate: '',
    inProductionDays: 0,
    remarks: 'Chose another vendor due to budget.'
  },
  {
    id: 'L-0010',
    date: '2026-09-19',
    staffName: 'Bindhu',
    customerName: 'JASARA',
    phoneNumber: '+91 9447112233',
    location: 'Malappuram',
    source: 'Referral - Razack',
    followUpDate: '2026-09-23',
    status: 'Order Confirmed',
    measurementDate: '2026-09-22',
    measurementStatus: 'Completed',
    quotationSentDate: '2026-09-23',
    quotationStatus: 'Approved',
    advanceDate: '2026-09-23',
    advanceAmount: 30000,
    productionStartDate: '2026-09-24',
    inProductionDays: 7,
    remarks: 'Order confirmed for 5 Custom Teak Doors.'
  },
  {
    id: 'L-0011',
    date: '2026-09-22',
    staffName: 'Nadiya',
    customerName: 'Jasu K.T.',
    phoneNumber: '+91 9846112234',
    location: 'Malappuram',
    source: 'Walk-in',
    followUpDate: '2026-09-23',
    status: 'Site Visit Scheduled',
    measurementDate: '2026-09-23',
    measurementStatus: 'Scheduled',
    quotationSentDate: '',
    quotationStatus: 'Draft',
    advanceDate: '',
    advanceAmount: 0,
    productionStartDate: '',
    inProductionDays: 0,
    remarks: 'Window measurements scheduled for tomorrow morning.'
  }
];

export const DEFAULT_MEASUREMENTS = [
  {
    id: 'M-0001',
    leadId: 'L-0001',
    customerName: 'Anoop Menon',
    phoneNumber: '+91 9847012345',
    location: 'Kochi',
    staffName: 'Bindhu',
    leadAssignedDate: '2026-08-03',
    measurementDate: '2026-09-21',
    followUpDate: '2026-09-22',
    status: 'Completed',
    remarks: 'Frame size noted, 3 openings (7x3 ft FRP).'
  },
  {
    id: 'M-0002',
    leadId: 'L-0010',
    customerName: 'JASARA',
    phoneNumber: '+91 9447112233',
    location: 'Malappuram',
    staffName: 'Bindhu',
    leadAssignedDate: '2026-09-19',
    measurementDate: '2026-09-22',
    followUpDate: '2026-09-23',
    status: 'Completed',
    remarks: 'Morning slot completed, 5 custom teak door frames.'
  },
  {
    id: 'M-0003',
    leadId: 'L-0011',
    customerName: 'Jasu K.T.',
    phoneNumber: '+91 9846112234',
    location: 'Malappuram',
    staffName: 'Nadiya',
    leadAssignedDate: '2026-09-22',
    measurementDate: '2026-09-23',
    followUpDate: '2026-09-24',
    status: 'Scheduled',
    remarks: 'Window measurements to be taken - 4 nos.'
  }
];

export const DEFAULT_QUOTATIONS = [
  {
    id: 'Q-0001',
    leadId: 'L-0001',
    customerName: 'Anoop Menon',
    phoneNumber: '+91 9847012345',
    sentBy: 'Bindhu',
    sentDate: '2026-09-19',
    approvedBy: 'Anoop Menon',
    quotedAmount: 110000,
    discount: 10000,
    finalAmount: 100000,
    followUpDate: '2026-09-21',
    validityDate: '2026-10-19',
    status: 'Approved',
    items: [
      { product: 'FRP Door', qty: 3, rate: 25000, total: 75000 },
      { product: 'Door Frame', qty: 3, rate: 11666, total: 35000 }
    ]
  },
  {
    id: 'Q-0002',
    leadId: 'L-0002',
    customerName: 'Fathima Rasheed',
    phoneNumber: '+91 9188023456',
    sentBy: 'Bindhu',
    sentDate: '2026-09-18',
    approvedBy: 'Fathima Rasheed',
    quotedAmount: 215000,
    discount: 15000,
    finalAmount: 200000,
    followUpDate: '2026-09-22',
    validityDate: '2026-10-18',
    status: 'Approved',
    items: [
      { product: 'FERO Door', qty: 2, rate: 80000, total: 160000 },
      { product: 'Door + Frame Combo', qty: 1, rate: 55000, total: 55000 }
    ]
  },
  {
    id: 'Q-0003',
    leadId: 'L-0003',
    customerName: 'Biju Thomas',
    phoneNumber: '+91 9744034567',
    sentBy: 'Nadiya',
    sentDate: '2026-09-16',
    approvedBy: '',
    quotedAmount: 110000,
    discount: 10000,
    finalAmount: 100000,
    followUpDate: '2026-09-23',
    validityDate: '2026-10-16',
    status: 'Sent',
    items: [
      { product: 'Wooden Door', qty: 4, rate: 27500, total: 110000 }
    ]
  },
  {
    id: 'Q-0004',
    leadId: 'L-0010',
    customerName: 'JASARA',
    phoneNumber: '+91 9447112233',
    sentBy: 'Bindhu',
    sentDate: '2026-09-23',
    approvedBy: 'JASARA',
    quotedAmount: 110000,
    discount: 10000,
    finalAmount: 100000,
    followUpDate: '2026-09-24',
    validityDate: '2026-10-23',
    status: 'Approved',
    items: [
      { product: 'Customized Door', qty: 5, rate: 22000, total: 110000 }
    ]
  }
];

// LocalStorage Persistence Handlers
const STORAGE_KEYS = {
  LEADS: 'puthenpurayil_crm_leads',
  MEASUREMENTS: 'puthenpurayil_crm_measurements',
  QUOTATIONS: 'puthenpurayil_crm_quotations',
  LISTS: 'puthenpurayil_crm_lists'
};

export const getStoredData = () => {
  const leads = localStorage.getItem(STORAGE_KEYS.LEADS);
  const measurements = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
  const quotations = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
  const lists = localStorage.getItem(STORAGE_KEYS.LISTS);

  return {
    leads: leads ? JSON.parse(leads) : DEFAULT_LEADS,
    measurements: measurements ? JSON.parse(measurements) : DEFAULT_MEASUREMENTS,
    quotations: quotations ? JSON.parse(quotations) : DEFAULT_QUOTATIONS,
    lists: lists ? JSON.parse(lists) : DEFAULT_LISTS
  };
};

export const saveStoredData = (data) => {
  if (data.leads) localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(data.leads));
  if (data.measurements) localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(data.measurements));
  if (data.quotations) localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(data.quotations));
  if (data.lists) localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(data.lists));
};

export const resetStoredData = () => {
  localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(DEFAULT_LEADS));
  localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(DEFAULT_MEASUREMENTS));
  localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(DEFAULT_QUOTATIONS));
  localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(DEFAULT_LISTS));
  return getStoredData();
};
