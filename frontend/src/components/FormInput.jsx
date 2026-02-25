export default function FormInput({ label, value, onChange, type = 'text', readOnly = false, className = '' }) {
  return (
    <div className="flex items-center gap-2">
      <label className="w-28 text-sm text-gray-700 shrink-0">{label}</label>
      <input
        type={type}
        readOnly={readOnly}
        value={value}
        onChange={onChange}
        className={`flex-1 border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-400 ${readOnly ? 'bg-gray-50' : 'bg-white'} ${className}`}
      />
    </div>
  );
}