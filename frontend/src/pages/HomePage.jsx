import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadOrders, removeOrder } from '../redux/slices/ordersSlice';
import OrdersTable from '../components/OrdersTable';

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useSelector(s => s.orders);

  useEffect(() => { dispatch(loadOrders()); }, [dispatch]);

  const handleRowDoubleClick = useCallback((id) => navigate(`/orders/${id}`), [navigate]);
  const handleEdit = useCallback((id) => navigate(`/orders/${id}`), [navigate]);
  const handleDelete = useCallback((id) => {
    if (window.confirm('Delete this order?')) dispatch(removeOrder(id));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-200 border-b border-gray-400 px-3 py-1 flex items-center justify-center">
        <span className="text-sm font-medium text-gray-700">Home</span>
      </div>
      <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 flex items-center gap-2">
        <button
          onClick={() => navigate('/orders/new')}
          className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-400 rounded text-sm hover:bg-gray-50 shadow-sm"
        >
          Add New
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      <div className="p-4">
        <OrdersTable
          orders={list}
          loading={loading}
          onRowDoubleClick={handleRowDoubleClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}