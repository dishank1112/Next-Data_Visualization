interface SearchBoxProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      type="text"
      placeholder="🔍 Search all columns..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-xl p-2 w-full shadow-sm"
    />
  );
}
