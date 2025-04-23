import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const ColorPicker = ({ value, onChange, label, className }) => {
  const [color, setColor] = useState(value || '#ffffff');

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    if (onChange) {
      onChange(newColor);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <div 
          className="w-10 h-10 rounded border border-input" 
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={handleColorChange}
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="w-10 h-10 cursor-pointer"
        />
      </div>
    </div>
  );
};

export { ColorPicker }; 