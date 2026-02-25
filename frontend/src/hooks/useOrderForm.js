import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { loadClients } from '../redux/slices/clientsSlice';
import { loadItems } from '../redux/slices/itemsSlice';
import { saveOrder, loadOrderById, clearCurrent } from '../redux/slices/ordersSlice';
import { num, calcLine, emptyLine, emptyForm } from '../utils/helpers';

export default function useOrderForm() {
  const { id } = useParams();
  const isEdit  = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: clients } = useSelector(s => s.clients);
  const { list: items }   = useSelector(s => s.items);
  const { current: loadedOrder, saving, error } = useSelector(s => s.orders);

  const [form, setForm]   = useState(emptyForm());
  const [saved, setSaved] = useState(false);

  // ─── Load clients, items and (if editing) the existing order ──
  useEffect(() => {
    dispatch(loadClients());
    dispatch(loadItems());
    if (isEdit) dispatch(loadOrderById(id));
    return () => { dispatch(clearCurrent()); };
  }, [dispatch, id, isEdit]);

  // ─── Populate form when existing order finishes loading ───────
  useEffect(() => {
    if (isEdit && loadedOrder) {
      setForm({
        clientId:     loadedOrder.clientId?.toString() || '',
        customerName: loadedOrder.customerName  || '',
        address1:     loadedOrder.address1      || '',
        address2:     loadedOrder.address2      || '',
        address3:     loadedOrder.address3      || '',
        suburb:       loadedOrder.suburb        || '',
        state:        loadedOrder.state         || '',
        postCode:     loadedOrder.postCode      || '',
        invoiceNo:    loadedOrder.invoiceNo     || '',
        invoiceDate:  loadedOrder.invoiceDate   || '',
        referenceNo:  loadedOrder.referenceNo   || '',
        note:         loadedOrder.note          || '',
        orderLines: loadedOrder.orderLines?.length
          ? loadedOrder.orderLines.map(l => ({ ...l, _key: Math.random() }))
          : [emptyLine()],
      });
    }
  }, [loadedOrder, isEdit]);

  // ─── Totals — recalculate whenever order lines change ─────────
  const totals = useMemo(() => {
    let excl = 0, tax = 0;
    form.orderLines.forEach(l => {
      excl += num(l.exclAmount);
      tax  += num(l.taxAmount);
    });
    return { excl, tax, incl: excl + tax };
  }, [form.orderLines]);

  // ─── Update any single header field ───────────────────────────
  const handleFieldChange = useCallback((field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  }, []);

  // ─── Select customer — auto-fills all address fields ──────────
  const handleClientSelect = useCallback((clientId) => {
    const client = clients.find(c => c.id.toString() === clientId);
    if (client) {
      setForm(f => ({
        ...f, clientId,
        customerName: client.customerName,
        address1: client.address1 || '',
        address2: client.address2 || '',
        address3: client.address3 || '',
        suburb:   client.suburb   || '',
        state:    client.state    || '',
        postCode: client.postCode || '',
      }));
    } else {
      setForm(f => ({ ...f, clientId }));
    }
  }, [clients]);

  // ─── Update one field on one order line row ────────────────────
  const updateLine = useCallback((idx, field, value) => {
    setForm(f => {
      const lines = [...f.orderLines];
      let line = { ...lines[idx], [field]: value };

      // Selecting item code → sync description + price
      if (field === 'itemCode') {
        const item = items.find(i => i.itemCode === value);
        if (item) {
          line.itemId      = item.id;
          line.itemCode    = item.itemCode;
          line.description = item.description;
          line.price       = item.price;
        }
      }

      // Selecting description → sync item code + price
      if (field === 'description') {
        const item = items.find(i => i.description === value);
        if (item) {
          line.itemId      = item.id;
          line.itemCode    = item.itemCode;
          line.description = item.description;
          line.price       = item.price;
        }
      }

      lines[idx] = calcLine(line);
      return { ...f, orderLines: lines };
    });
  }, [items]);

  // ─── Add a new empty row to the order lines table ─────────────
  const addLine = useCallback(() => {
    setForm(f => ({ ...f, orderLines: [...f.orderLines, emptyLine()] }));
  }, []);

  // ─── Remove a row by index ────────────────────────────────────
  const removeLine = useCallback((idx) => {
    setForm(f => ({ ...f, orderLines: f.orderLines.filter((_, i) => i !== idx) }));
  }, []);

  // ─── Save order (POST for new, PUT for existing) ──────────────
  const handleSave = useCallback(async () => {
    const payload = {
      ...form,
      clientId: parseInt(form.clientId),
      orderLines: form.orderLines
        .filter(l => l.itemCode || l.description)
        .map((l, i) => ({
          ...l,
          lineNumber: i + 1,
          quantity:   num(l.quantity),
          price:      num(l.price),
          taxRate:    num(l.taxRate),
          exclAmount: num(l.exclAmount),
          taxAmount:  num(l.taxAmount),
          inclAmount: num(l.inclAmount),
        })),
    };
    const result = await dispatch(saveOrder({ id: isEdit ? id : null, data: payload }));
    if (!result.error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (!isEdit && result.payload?.id)
        navigate(`/orders/${result.payload.id}`, { replace: true });
    }
  }, [form, dispatch, isEdit, id, navigate]);

  return {
    // Data
    form,
    saved,
    saving,
    error,
    isEdit,
    clients,
    items,
    totals,
    // Handlers
    handleFieldChange,
    handleClientSelect,
    updateLine,
    addLine,
    removeLine,
    handleSave,
  };
}