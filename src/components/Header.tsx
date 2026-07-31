import React from 'react';
import { Plus, BookOpen, Library, Quote as QuoteIcon, BarChart3, Settings, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenAddModal,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'quotes', label: 'Quotes', icon: QuoteIcon },
    { id: 'stores', label: 'Bookstores', icon: ShoppingBag },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'settings', label: 'Export / Import', icon: Settings },
  ];

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b border-[#E4DBC9] mb-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#B98A5E] flex items-center justify-center text-white font-serif-title font-bold text-lg shadow-xs">
          S
        </div>
        <span
          onClick={() => onTabChange('home')}
          className="font-serif-title text-2xl font-bold text-[#9A6B52] cursor-pointer tracking-tight hover:opacity-90"
        >
          Shelf
        </span>
      </div>

      <nav className="flex items-center gap-1 sm:gap-6 text-sm text-[#857B6D] overflow-x-auto w-full sm:w-auto py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#FBF8F2] text-[#3F382F] shadow-xs border border-[#E4DBC9]'
                  : 'hover:text-[#3F382F] hover:bg-[#F4EEE3]/60'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-[#B98A5E]' : 'text-[#857B6D]'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={onOpenAddModal}
        className="flex items-center gap-1.5 bg-[#B98A5E] hover:bg-[#9A6B52] text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
      >
        <Plus size={16} />
        <span>Add book</span>
      </button>
    </header>
  );
};
