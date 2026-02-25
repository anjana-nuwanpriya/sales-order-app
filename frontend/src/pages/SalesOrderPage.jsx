import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadClients } from '../redux/slices/clientsSlice';
import { loadItems } from '../redux/slices/itemsSlice';
import { saveOrder, loadOrderById, clearCurrent } from '../redux/slices/ordersSlice';
import { useReactToPrint } from 'react-to-print';

const num = (v) => parseFloat(v) || 0;
const fmt = (v) => (v != null && v !== '' && !isNaN(v)) ? Number(v).toFixed(2) : '';

const calcLine = (line) => {
  const qty = num(line.quantity);
  const price = num(line.price);
  const tax = num(line.taxRate);
  const excl = qty * price;
  const taxAmt = excl * tax / 100;
  return { ...line, exclAmount: excl, taxAmount: taxAmt, inclAmount: excl + taxAmt };
};

const emptyLine = () => ({
  _key: Math.random(), itemId: null, itemCode: '', description: '',
  note: '', quantity: '', price: '', taxRate: '',
  exclAmount: '', taxAmount: '', inclAmount: '',
});

const emptyForm = () => ({
  clientId: '', customerName: '', address1: '', address2: '', address3: '',
  suburb: '', state: '', postCode: '', invoiceNo: '', invoiceDate: '',
  referenceNo: '', note: '', orderLines: [emptyLine()],
});

export default function SalesOrderPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const printRef = useRef();

  const { list: clients } = useSelector(s => s.clients);
  const { list: items } = useSelector(s => s.items);
  const { current: loadedOrder, saving, error } = useSelector(s => s.orders);

  const [form, setForm] = useState(emptyForm());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dispatch(loadClients());
    dispatch(loadItems());
    if (isEdit) dispatch(loadOrderById(id));
    return () => { dispatch(clearCurrent()); };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && loadedOrder) {
      setForm({
        clientId: loadedOrder.clientId?.toString() || '',
        customerName: loadedOrder.customerName || '',
        address1: loadedOrder.address1 || '',
        address2: loadedOrder.address2 || '',
        address3: loadedOrder.address3 || '',
        suburb: loadedOrder.suburb || '',
        state: loadedOrder.state || '',
        postCode: loadedOrder.postCode || '',
        invoiceNo: loadedOrder.invoiceNo || '',
        invoiceDate: loadedOrder.invoiceDate || '',
        referenceNo: loadedOrder.referenceNo || '',
        note: loadedOrder.note || '',
        orderLines: loadedOrder.orderLines?.length
          ? loadedOrder.orderLines.map(l => ({ ...l, _key: Math.random() }))
          : [emptyLine()],
      });
    }
  }, [loadedOrder, isEdit]);

  const totals = React.useMemo(() => {
    let excl = 0, tax = 0;
    form.orderLines.forEach(l => { excl += num(l.exclAmount); tax += num(l.taxAmount); });
    return { excl, tax, incl: excl + tax };
  }, [form.orderLines]);

  const handleFieldChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleClientSelect = (clientId) => {
    const client = clients.find(c => c.id.toString() === clientId);
    if (client) {
      setForm(f => ({
        ...f, clientId,
        customerName: client.customerName,
        address1: client.address1 || '', address2: client.address2 || '',
        address3: client.address3 || '', suburb: client.suburb || '',
        state: client.state || '', postCode: client.postCode || '',
      }));
    } else {
      setForm(f => ({ ...f, clientId }));
    }
  };

  const updateLine = useCallback((idx, field, value) => {
    setForm(f => {
      const lines = [...f.orderLines];
      let line = { ...lines[idx], [field]: value };
      if (field === 'itemCode') {
        const item = items.find(i => i.itemCode === value);
        if (item) { line.itemId = item.id; line.itemCode = item.itemCode; line.description = item.description; line.price = item.price; }
      }
      if (field === 'description') {
        const item = items.find(i => i.description === value);
        if (item) { line.itemId = item.id; line.itemCode = item.itemCode; line.description = item.description; line.price = item.price; }
      }
      lines[idx] = calcLine(line);
      return { ...f, orderLines: lines };
    });
  }, [items]);

  const addLine = () => setForm(f => ({ ...f, orderLines: [...f.orderLines, emptyLine()] }));
  const removeLine = (idx) => setForm(f => ({ ...f, orderLines: f.orderLines.filter((_, i) => i !== idx) }));

  const handleSave = async () => {
    const payload = {
      ...form,
      clientId: parseInt(form.clientId),
      orderLines: form.orderLines
        .filter(l => l.itemCode || l.description)
        .map((l, i) => ({
          ...l, lineNumber: i + 1,
          quantity: num(l.quantity), price: num(l.price), taxRate: num(l.taxRate),
          exclAmount: num(l.exclAmount), taxAmount: num(l.taxAmount), inclAmount: num(l.inclAmount),
        })),
    };
    const result = await dispatch(saveOrder({ id: isEdit ? id : null, data: payload }));
    if (!result.error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (!isEdit && result.payload?.id) navigate(`/orders/${result.payload.id}`, { replace: true });
    }
  };

  const handlePrint = useReactToPrint({ content: () => printRef.current });

  return (
    <div className="min-h-screen bg-gray-100" ref={printRef}>
      {/* Window chrome — matches the wireframe title bar */}
      <div className="bg-gray-200 border-b border-gray-400 px-3 py-1 flex items-center justify-center relative no-print">
        <div className="absolute left-3 flex gap-1.5">
          <button onClick={() => navigate('/')} className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 border border-red-600" title="Back to Home" />
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-500" />
          <div className="w-3.5 h-3.5 rounded-full bg-green-500 border border-green-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">Sales Order</span>
      </div>

      {/* Save Order toolbar */}
      <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 flex items-center gap-2 no-print">
        <button
          onClick={handleSave}
          disabled={saving || !form.clientId}
          className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-400 rounded text-sm hover:bg-gray-50 disabled:opacity-50 shadow-sm"
        >
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {saving ? 'Saving...' : 'Save Order'}
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-400 rounded text-sm hover:bg-gray-50 shadow-sm"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
        {saved && <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-300">✓ Saved</span>}
        {error && <span className="text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-300">{error}</span>}
      </div>

      {/* Main form body */}
      <div className="p-4 max-w-6xl mx-auto space-y-4">

        {/* Customer + Invoice details — side by side like the wireframe */}
        <div className="bg-white border border-gray-300 p-4">
          <div className="grid grid-cols-2 gap-6">

            {/* LEFT: Customer fields */}
            <div className="space-y-1.5">
              {/* Customer Name with dropdown */}
              <div className="flex items-center gap-2">
                <label className="w-28 text-sm text-gray-700 shrink-0">Customer Name</label>
                <select
                  className="flex-1 border border-gray-300 px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-400"
                  value={form.clientId}
                  onChange={e => handleClientSelect(e.target.value)}
                >
                  <option value=""></option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.customerName}</option>)}
                </select>
              </div>
              {[
                ['address1', 'Address 1'],
                ['address2', 'Address 2'],
                ['address3', 'Address 3'],
                ['suburb',   'Suburb'],
                ['state',    'State'],
                ['postCode', 'Post Code'],
              ].map(([field, label]) => (
                <div key={field} className="flex items-center gap-2">
                  <label className="w-28 text-sm text-gray-700 shrink-0">{label}</label>
                  <input
                    className="flex-1 border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
                    value={form[field]}
                    onChange={e => handleFieldChange(field, e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* RIGHT: Invoice fields */}
            <div className="space-y-1.5">
              {[
                ['invoiceNo',   'Invoice No.'],
                ['invoiceDate', 'Invoice Date'],
                ['referenceNo', 'Reference no'],
              ].map(([field, label]) => (
                <div key={field} className="flex items-center gap-2">
                  <label className="w-28 text-sm text-gray-700 shrink-0">{label}</label>
                  <input
                    type={field === 'invoiceDate' ? 'date' : 'text'}
                    className="flex-1 border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
                    value={form[field]}
                    onChange={e => handleFieldChange(field, e.target.value)}
                  />
                </div>
              ))}
              <div className="flex items-start gap-2">
                <label className="w-28 text-sm text-gray-700 shrink-0 pt-1">Note</label>
                <textarea
                  className="flex-1 border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-400 resize-none"
                  rows={4}
                  value={form.note}
                  onChange={e => handleFieldChange('note', e.target.value)}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Order Lines Table */}
        <div className="bg-white border border-gray-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  {[
                    'Item Code', 'Description', 'Note', 'Quantity', 'Price', 'Tax', 'Excl Amount', 'Tax Amount', 'Incl Amount', ''
                  ].map(h => (
                    <th key={h} className="border border-gray-300 px-2 py-1.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {form.orderLines.map((line, idx) => (
                  <tr key={line._key ?? idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {/* Item Code dropdown */}
                    <td className="border border-gray-200 px-1 py-1">
                      <select
                        className="w-full border-0 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 px-1"
                        value={line.itemCode}
                        onChange={e => updateLine(idx, 'itemCode', e.target.value)}
                      >
                        <option value=""></option>
                        {items.map(i => <option key={i.id} value={i.itemCode}>{i.itemCode}</option>)}
                      </select>
                    </td>
                    {/* Description dropdown */}
                    <td className="border border-gray-200 px-1 py-1">
                      <select
                        className="w-full border-0 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 px-1"
                        value={line.description}
                        onChange={e => updateLine(idx, 'description', e.target.value)}
                      >
                        <option value=""></option>
                        {items.map(i => <option key={i.id} value={i.description}>{i.description}</option>)}
                      </select>
                    </td>
                    {/* Note */}
                    <td className="border border-gray-200 px-1 py-1">
                      <input className="w-full border-0 bg-transparent text-sm focus:outline-none px-1 min-w-[60px]"
                        value={line.note || ''} onChange={e => updateLine(idx, 'note', e.target.value)} />
                    </td>
                    {/* Quantity */}
                    <td className="border border-gray-200 px-1 py-1">
                      <input className="w-full border-0 bg-transparent text-sm focus:outline-none text-right px-1 min-w-[60px]"
                        type="number" min="0" step="0.01" value={line.quantity}
                        onChange={e => updateLine(idx, 'quantity', e.target.value)} />
                    </td>
                    {/* Price (read-only, auto-filled from item) */}
                    <td className="border border-gray-200 px-1 py-1 bg-gray-50">
                      <input className="w-full border-0 bg-transparent text-sm focus:outline-none text-right px-1 min-w-[60px]"
                        type="number" min="0" step="0.01" value={line.price}
                        onChange={e => updateLine(idx, 'price', e.target.value)} />
                    </td>
                    {/* Tax */}
                    <td className="border border-gray-200 px-1 py-1">
                      <input className="w-full border-0 bg-transparent text-sm focus:outline-none text-right px-1 min-w-[50px]"
                        type="number" min="0" max="100" step="0.1" value={line.taxRate}
                        onChange={e => updateLine(idx, 'taxRate', e.target.value)} />
                    </td>
                    {/* Calculated — read only */}
                    {['exclAmount', 'taxAmount', 'inclAmount'].map(field => (
                      <td key={field} className="border border-gray-200 px-2 py-1 bg-gray-50 text-right text-sm text-gray-700 min-w-[80px]">
                        {line[field] ? fmt(line[field]) : ''}
                      </td>
                    ))}
                    {/* Remove row */}
                    <td className="border border-gray-200 px-1 py-1 text-center w-8">
                      <button onClick={() => removeLine(idx)}
                        className="text-gray-400 hover:text-red-500 text-xs font-bold leading-none"
                        title="Remove">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add line + Totals row */}
          <div className="border-t border-gray-200 px-3 py-2 flex items-start justify-between">
            <button onClick={addLine}
              className="text-xs text-blue-600 hover:text-blue-800 border border-blue-300 hover:border-blue-500 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100">
              + Add Line
            </button>

            {/* Totals — label left, read-only input box right (matches wireframe) */}
            <div className="space-y-1">
              {[
                ['Total Excl', totals.excl],
                ['Total Tax',  totals.tax],
                ['Total Incl', totals.incl],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 w-20 text-right">{label}</span>
                  <input
                    readOnly
                    value={value !== 0 ? value.toFixed(2) : ''}
                    className="w-32 border border-gray-300 px-2 py-0.5 text-sm text-right bg-gray-50 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
