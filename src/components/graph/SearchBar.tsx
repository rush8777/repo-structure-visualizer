import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  resultCount?: number;
}

export const SearchBar = ({ onSearch, onClear, resultCount }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 200);
  }, [onSearch]);
  
  const handleClear = useCallback(() => {
    setQuery('');
    onClear();
    inputRef.current?.focus();
  }, [onClear]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && isFocused) {
        handleClear();
        inputRef.current?.blur();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, handleClear]);
  
  return (
    <div className="relative flex items-center">
      <div className={`
        relative flex items-center transition-all duration-200
        ${isFocused ? 'w-64' : 'w-48'}
      `}>
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search nodes... ⌘K"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-9 pr-8 h-9 bg-card/90 backdrop-blur border-border text-sm"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 h-6 w-6"
            onClick={handleClear}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
      
      {query && resultCount !== undefined && (
        <span className="ml-2 text-xs text-muted-foreground whitespace-nowrap">
          {resultCount} {resultCount === 1 ? 'result' : 'results'}
        </span>
      )}
    </div>
  );
};

export default SearchBar;
