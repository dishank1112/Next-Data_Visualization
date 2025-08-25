interface SearchBoxProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="🔍 Search all columns..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl bg-gray-900/90 border border-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 shadow-[0_0_15px_rgba(118,185,0,0.05)] 
                   focus:outline-none focus:ring-2 focus:ring-[#76b900] focus:border-[#76b900] transition-all"
      />
      <span className="absolute right-4 top-3 text-[#76b900] text-sm">⌕</span>
    </div>
  );
}
