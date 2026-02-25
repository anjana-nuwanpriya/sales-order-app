import { formatDate, formatCurrency } from '../utils/helpers';

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

const getCellValue = (order, key) => {
  if (key === 'invoiceDate') return formatDate(order[key]);
  if (['totalExcl', 'totalTax', 'totalIncl'].includes(key)) return formatCurrency(order[key]);
  return order[key] ?? '';
};

export default function OrdersTable({ orders, loading, onRowDoubleClick, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-300">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-300">
              {COLUMNS.map(col => (
                <th key={col.key} className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                  <span className="flex items-center gap-1">▼ {col.label}</span>
                </th>
              ))}
              <th className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="px-4 py-8 text-center text-gray-400 text-sm">Loading...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="px-4 py-8 text-center text-gray-400 text-sm">
                  No orders found. Click <strong>Add New</strong> to create one.
                </td>
              </tr>
            ) : orders.map((order, idx) => (
              <tr
                key={order.id}
                className={`cursor-pointer border-b border-gray-100 hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                onDoubleClick={() => onRowDoubleClick(order.id)}
                title="Double-click to open"
              >
                {COLUMNS.map(col => (
                  <td key={col.key} className="border border-gray-100 px-3 py-1.5 text-gray-700 whitespace-nowrap">
                    {getCellValue(order, col.key)}
                  </td>
                ))}
                <td className="border border-gray-100 px-2 py-1.5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onEdit(order.id)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(order.id); }} className="text-xs text-red-500 hover:text-red-700">Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length > 0 && (
        <div className="px-3 py-1.5 border-t border-gray-200 text-xs text-gray-400">
          {orders.length} order{orders.length !== 1 ? 's' : ''} — double-click a row to open
        </div>
      )}
    </div>
  );
}