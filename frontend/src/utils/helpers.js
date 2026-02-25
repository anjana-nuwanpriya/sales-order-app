// ─── Number helpers ───────────────────────────────────────────
export const num = (v) => parseFloat(v) || 0;

export const fmt = (v) =>
  v != null && v !== '' && !isNaN(v) ? Number(v).toFixed(2) : '';

// ─── Date / currency formatters ───────────────────────────────
export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-AU') : '';

export const formatCurrency = (v) =>
  v != null ? Number(v).toFixed(2) : '';

// ─── Line calculation ─────────────────────────────────────────
export const calcLine = (line) => {
  const qty    = num(line.quantity);
  const price  = num(line.price);
  const tax    = num(line.taxRate);
  const excl   = qty * price;
  const taxAmt = excl * tax / 100;
  return { ...line, exclAmount: excl, taxAmount: taxAmt, inclAmount: excl + taxAmt };
};

// ─── Empty record factories ───────────────────────────────────
export const emptyLine = () => ({
  _key: Math.random(), itemId: null, itemCode: '', description: '',
  note: '', quantity: '', price: '', taxRate: '',
  exclAmount: '', taxAmount: '', inclAmount: '',
});

export const emptyForm = () => ({
  clientId: '', customerName: '', address1: '', address2: '', address3: '',
  suburb: '', state: '', postCode: '', invoiceNo: '', invoiceDate: '',
  referenceNo: '', note: '', orderLines: [emptyLine()],
});