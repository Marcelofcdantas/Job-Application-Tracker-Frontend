import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions: string[];
};

export default function AutocompleteInput({
  value,
  onChange,
  placeholder,
  suggestions,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const filteredSuggestions = useMemo(() => {
    const unique = [...new Set(suggestions.filter(Boolean))];
    const q = value.trim().toLowerCase();

    if (!q) return unique.slice(0, 6);

    return unique
      .filter((item) => item.toLowerCase().includes(q))
      .slice(0, 6);
  }, [suggestions, value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="autocomplete-field" ref={wrapperRef}>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        autoComplete="off"
      />

      {isOpen && filteredSuggestions.length > 0 && (
        <div className="autocomplete-menu">
          {filteredSuggestions.map((item) => (
            <button
              key={item}
              type="button"
              className="autocomplete-option"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(item);
                setIsOpen(false);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}