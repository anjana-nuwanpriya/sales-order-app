export default function AppButton({ onClick, disabled = false, variant = 'default', children }) {
  const base = 'flex items-center gap-1.5 px-3 py-1 border rounded text-sm shadow-sm transition-colors';
  const variants = {
    default: 'bg-white border-gray-400 hover:bg-gray-50 disabled:opacity-50',
    danger:  'bg-white border-red-400 text-red-600 hover:bg-red-50',
    link:    'border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs',
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant] ?? variants.default}`}>
      {children}
    </button>
  );
}