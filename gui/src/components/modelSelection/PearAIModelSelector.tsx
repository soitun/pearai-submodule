import React, { useState, useRef, useEffect } from 'react';
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

interface PearAIModelSelectorProps {
  currentModel: string;
  onModelChange: (modelId: string) => void;
}

const PearAIModelSelector: React.FC<PearAIModelSelectorProps> = ({ currentModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const models = [
    { id: "pearai", name: "PearAI (recommended)" },
    { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
    { id: "gpt-4o", name: "GPT-4o" }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleModelChange = (modelId: string) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left mt-2" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm bg-gray-700 rounded hover:bg-gray-600"
      >
        {models.find(m => m.id === currentModel)?.name}
        <ChevronUpDownIcon className="w-5 h-5 ml-2" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelChange(model.id)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                role="menuitem"
              >
                {model.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PearAIModelSelector;
