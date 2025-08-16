import React, { useEffect, useRef } from 'react';
import { View } from '../types';

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (view: View) => void;
  currentView: View;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ isOpen, onClose, onSelect, currentView }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSelect = (view: View) => {
    onSelect(view);
    onClose();
  };

  const menuItems: { label: string; view: View }[] = [
    { label: 'Image Generator', view: 'imageGenerator' },
    { label: 'App Info', view: 'appInfo' },
    { label: 'Terms & Agreements', view: 'terms' },
  ];

  if (currentView !== 'chat') {
    menuItems.unshift({ label: 'Back to Chat', view: 'chat' });
  }


  return (
    <div
      ref={menuRef}
      className="absolute top-14 right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 animate-fade-in-down"
    >
      <ul className="py-1">
        {menuItems.map(item => (
             <li key={item.view}>
             <button
               onClick={() => handleSelect(item.view)}
               className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
             >
               {item.label}
             </button>
           </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;