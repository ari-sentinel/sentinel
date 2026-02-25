import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

export interface DropdownOption {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  triggerClassName?: string;
  align?: 'left' | 'right';
}

export function Dropdown({ 
  options, 
  value, 
  onChange, 
  label, 
  className, 
  triggerClassName,
  align = 'right'
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(o => o.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={clsx("relative inline-block text-left", className)} ref={containerRef}>
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-muted)] mr-2">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "inline-flex items-center justify-between gap-2 px-3 h-8 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--surface-2)] hover:bg-[color:var(--surface-3)] transition-all",
          triggerClassName
        )}
      >
        <span className="truncate">{selectedOption?.label || 'Select...'}</span>
        <ChevronDown size={12} className={clsx("transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className={clsx(
          "absolute z-[100] mt-2 w-56 origin-top rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] shadow-2xl animate-in zoom-in-95 duration-150",
          align === 'right' ? "right-0" : "left-0"
        )}>
          <div className="py-1.5 px-1.5 space-y-0.5">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={clsx(
                  "flex flex-col w-full px-3 py-2 text-left rounded-lg transition-colors",
                  value === option.id 
                    ? "bg-[color:var(--surface-accent)] text-[color:var(--text-primary)]" 
                    : "text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-1)] hover:text-[color:var(--text-primary)]"
                )}
              >
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {option.label}
                  </span>
                </div>
                {option.description && (
                  <span className="text-[9px] text-[color:var(--text-muted)] font-medium mt-0.5 leading-tight">
                    {option.description}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
