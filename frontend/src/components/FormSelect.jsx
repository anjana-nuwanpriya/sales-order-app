export default function FormSelect({ label, value, onChange, options = [], placeholder = '' }) {
  return (
    <div className="flex items-center gap-2">
      <label className="w-28 text-sm text-gray-700 shrink-0">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="flex-1 border border-gray-300 px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-400"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}