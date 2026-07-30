import React, { useRef, useState } from 'react';
import { X, Download, Sparkles, Image as ImageIcon, LayoutGrid, Smartphone } from 'lucide-react';
import { Book, Quote } from '../types';
import { toPng } from 'html-to-image';

interface QuoteCardModalProps {
  quote: Quote | null;
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteCardModal: React.FC<QuoteCardModalProps> = ({
  quote,
  book,
  isOpen,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [format, setFormat] = useState<'square' | 'story'>('square');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !quote || !book) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `shelf_quote_${book.title.replace(/\s+/g, '_').toLowerCase()}_${format}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export quote image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3F382F]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl max-w-xl w-full p-6 shadow-xl flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E4DBC9]">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#B98A5E]" />
            <h2 className="font-serif-title text-lg font-bold text-[#3F382F]">
              Bookstagram Quote Card
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#857B6D] hover:text-[#3F382F] p-1 rounded-lg hover:bg-[#F4EEE3]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex items-center justify-between my-4 bg-[#F4EEE3] p-1 rounded-xl border border-[#E4DBC9]">
          <button
            onClick={() => setFormat('square')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              format === 'square'
                ? 'bg-[#FBF8F2] text-[#3F382F] shadow-xs'
                : 'text-[#857B6D] hover:text-[#3F382F]'
            }`}
          >
            <LayoutGrid size={14} />
            <span>Square (1:1 Post)</span>
          </button>
          <button
            onClick={() => setFormat('story')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              format === 'story'
                ? 'bg-[#FBF8F2] text-[#3F382F] shadow-xs'
                : 'text-[#857B6D] hover:text-[#3F382F]'
            }`}
          >
            <Smartphone size={14} />
            <span>Story (9:16 Portrait)</span>
          </button>
        </div>

        {/* Preview Container */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center py-4 bg-[#D9D1C3]/30 rounded-xl border border-[#E4DBC9]">
          <div
            ref={cardRef}
            className={`bg-[#E9E1D3] text-[#3F382F] p-8 rounded-2xl border border-[#E4DBC9] shadow-md flex flex-col justify-between relative overflow-hidden transition-all ${
              format === 'square'
                ? 'w-[320px] h-[320px] sm:w-[380px] sm:h-[380px]'
                : 'w-[280px] h-[480px] sm:w-[320px] sm:h-[540px]'
            }`}
          >
            {/* Background Decorative Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E4EADA] rounded-full blur-2xl opacity-60 -mr-10 -mt-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F4EEE3] rounded-full blur-2xl opacity-80 -ml-10 -mb-10 pointer-events-none" />

            {/* Top Brand Tag */}
            <div className="flex items-center justify-between text-xs text-[#857B6D] font-medium tracking-wide z-10">
              <span className="font-serif-title font-bold text-[#9A6B52]">Shelf</span>
              {quote.location && <span>{quote.location}</span>}
            </div>

            {/* Quote Body */}
            <div className="my-auto py-4 z-10">
              <span className="text-4xl font-serif-title text-[#B98A5E]/40 leading-none block -mb-2">
                “
              </span>
              <p className="font-serif-title italic text-base sm:text-lg text-[#3F382F] leading-relaxed tracking-tight">
                {quote.text}
              </p>
              <span className="text-4xl font-serif-title text-[#B98A5E]/40 leading-none block text-right -mt-2">
                ”
              </span>
            </div>

            {/* Book Info Footer */}
            <div className="pt-4 border-t border-[#E4DBC9] flex items-center gap-3 z-10">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-8 h-11 object-cover rounded-sm shadow-xs border border-[#E4DBC9]"
                />
              ) : (
                <div className="w-8 h-11 bg-[#FBF8F2] border border-[#E4DBC9] rounded-sm flex items-center justify-center text-[#A79D8C]">
                  <ImageIcon size={14} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-serif-title font-bold text-xs text-[#3F382F] truncate">
                  {book.title}
                </h4>
                <p className="text-[11px] text-[#857B6D] truncate">{book.author}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-2 border-t border-[#E4DBC9] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#857B6D] hover:bg-[#F4EEE3] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-[#B98A5E] hover:bg-[#9A6B52] disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <Download size={14} />
            <span>{isDownloading ? 'Generating...' : 'Download Image'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
