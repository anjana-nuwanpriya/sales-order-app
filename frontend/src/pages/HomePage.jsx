import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadOrders, removeOrder } from '../redux/slices/ordersSlice';

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-AU') : '';
const formatCurrency = (v) => v != null ? Number(v).toFixed(2) : '';

const COLUMNS = [
  { key: 'id',           label: 'ID' },
  { key: 'invoiceNo',    label: 'Invoice No.' },
  { key: 'customerName', label: 'Customer Name' },
  { key: 'invoiceDate',  label: 'Invoice Date' },
  { key: 'referenceNo',  label: 'Reference No' },
  { key: 'totalExcl',    label: 'Total Excl' },
  { key: 'totalTax',     label: 'Total Tax' },
  { key: 'totalIncl',    label: 'Total Incl' },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useSelector(s => s.orders);

  useEffect(() => { dispatch(loadOrders()); }, [dispatch]);

  const handleRowDoubleClick = useCallback((id) => navigate(`/orders/${id}`), [navigate]);
  const handleDelete = useCallback((e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this order?')) dispatch(removeOrder(id));
  }, [dispatch]);

  const getCellValue = (order, key) => {
    if (key === 'invoiceDate') return formatDate(order[key]);
    if (['totalExcl', 'totalTax', 'totalIncl'].includes(key)) return formatCurrency(order[key]);
    return order[key] ?? '';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Window chrome — matches wireframe title bar */}
      <div className="bg-gray-200 border-b border-gray-400 px-3 py-1 flex items-center justify-center relative">
        <div className="absolute left-3 flex gap-1.5">
          <div className="w-3.5 h-3.5 rounded-full bg-red-500 border border-red-600" />
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-500" />
          <div className="w-3.5 h-3.5 rounded-full bg-green-500 border border-green-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">Home</span>
      </div>

      {/* Toolbar with Add New button (top-left, matches wireframe) */}
      <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 flex items-center gap-2">
        <button
          onClick={() => navigate('/orders/new')}
          className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-400 rounded text-sm hover:bg-gray-50 shadow-sm"
        >
          Add New
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>

      {/* Orders grid */}
      <div className="p-4">
        <div className="bg-white border border-gray-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-200 border-b border-gray-300">
                  {COLUMNS.map(col => (
                    <th key={col.key} className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        ▼ {col.label}
                      </span>
                    </th>
                  ))}
                  <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 w-16">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={COLUMNS.length + 1} className="px-4 py-8 text-center text-gray-400 text-sm">
                      Loading...
                    </td>
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS.length + 1} className="px-4 py-8 text-center text-gray-400 text-sm">
                      No orders found. Click <strong>Add New</strong> to create one.
                    </td>
                  </tr>
                ) : list.map((order, idx) => (
                  <tr
                    key={order.id}
                    className={`cursor-pointer border-b border-gray-100 hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    onDoubleClick={() => handleRowDoubleClick(order.id)}
                    title="Double-click to open"
                  >
                    {COLUMNS.map(col => (
                      <td key={col.key} className="border border-gray-100 px-3 py-1.5 text-gray-700 whitespace-nowrap">
                        {getCellValue(order, col.key)}
                      </td>
                    ))}
                    <td className="border border-gray-100 px-2 py-1.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >Edit</button>
                        <button
                          onClick={(e) => handleDelete(e, order.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {list.length > 0 && (
            <div className="px-3 py-1.5 border-t border-gray-200 text-xs text-gray-400">
              {list.length} order{list.length !== 1 ? 's' : ''} — double-click a row to open
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
