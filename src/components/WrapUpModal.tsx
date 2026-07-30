import React, { useRef, useState } from 'react';
import { X, Download, Sparkles, Trophy, Star, BookOpen } from 'lucide-react';
import { Book } from '../types';
import { toPng } from 'html-to-image';

interface WrapUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
}

export const WrapUpModal: React.FC<WrapUpModalProps> = ({
  isOpen,
  onClose,
  books,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [periodType, setPeriodType] = useState<'year' | 'month'>('year');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter finished books in selected period
  const finishedBooks = books.filter((b) => {
    const session = b.sessions[b.sessions.length - 1];
    if (!session || session.status !== 'finished' || !session.finishDate) return false;
    const date = new Date(session.finishDate);
    if (isNaN(date.getTime())) return false;

    if (periodType === 'year') {
      return date.getFullYear() === selectedYear;
    } else {
      return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
    }
  });

  // Calculate stats
  const totalBooks = finishedBooks.length;
  const ratings = finishedBooks
    .map((b) => b.sessions[b.sessions.length - 1]?.rating)
    .filter((r): r is number => r !== undefined);

  const avgRating = ratings.length > 0
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : 'N/A';

  // Tag frequency
  const tagCounts: Record<string, number> = {};
  finishedBooks.forEach((b) => {
    b.tags.forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });
  const topGenres = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([tag]) => tag);

  // Standout cover list
  const covers = finishedBooks
    .map((b) => ({ cover: b.coverUrl, title: b.title, author: b.author }))
    .slice(0, 4);

  const titleText = periodType === 'year'
    ? `${selectedYear} Reading Wrap-up`
    : `${months[selectedMonth]} ${selectedYear} Wrap-up`;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `shelf_wrapup_${periodType}_${selectedYear}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export wrap-up image:', err);
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
            <Trophy size={18} className="text-[#B98A5E]" />
            <h2 className="font-serif-title text-lg font-bold text-[#3F382F]">
              Shareable Reading Wrap-up
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#857B6D] hover:text-[#3F382F] p-1 rounded-lg hover:bg-[#F4EEE3]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Period Selector Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-4">
          <div className="flex bg-[#F4EEE3] p-1 rounded-xl border border-[#E4DBC9]">
            <button
              onClick={() => setPeriodType('year')}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg ${
                periodType === 'year' ? 'bg-[#FBF8F2] text-[#3F382F]' : 'text-[#857B6D]'
              }`}
            >
              Year
            </button>
            <button
              onClick={() => setPeriodType('month')}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg ${
                periodType === 'month' ? 'bg-[#FBF8F2] text-[#3F382F]' : 'text-[#857B6D]'
              }`}
            >
              Month
            </button>
          </div>

          {periodType === 'month' && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              className="bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl px-2 py-1 text-xs font-medium text-[#3F382F]"
            >
              {months.map((m, idx) => (
                <option key={m} value={idx}>
                  {m}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl px-2 py-1 text-xs font-medium text-[#3F382F]"
          >
            {[2026, 2025, 2024, 2023].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Preview Card */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center py-4 bg-[#D9D1C3]/30 rounded-xl border border-[#E4DBC9]">
          <div
            ref={cardRef}
            className="w-[340px] sm:w-[380px] bg-[#E9E1D3] text-[#3F382F] p-6 rounded-2xl border border-[#E4DBC9] shadow-md flex flex-col gap-5 relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E4DBC9] pb-3">
              <div>
                <span className="font-serif-title text-xs font-bold text-[#9A6B52] uppercase tracking-wider block">
                  Shelf Journal
                </span>
                <h3 className="font-serif-title text-xl font-bold text-[#3F382F]">
                  {titleText}
                </h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#B98A5E] text-white flex items-center justify-center font-serif-title font-bold text-sm">
                S
              </div>
            </div>

            {/* Stat Row */}
            <div className="grid grid-cols-2 gap-3 bg-[#FBF8F2] border border-[#E4DBC9] rounded-xl p-4 text-center">
              <div>
                <span className="font-serif-title text-3xl font-bold text-[#9A6B52] block">
                  {totalBooks}
                </span>
                <span className="text-[11px] text-[#857B6D] font-medium uppercase tracking-wider">
                  Books Read
                </span>
              </div>
              <div>
                <span className="font-serif-title text-3xl font-bold text-[#8B9A7A] block">
                  {avgRating} ★
                </span>
                <span className="text-[11px] text-[#857B6D] font-medium uppercase tracking-wider">
                  Avg Rating
                </span>
              </div>
            </div>

            {/* Featured Covers */}
            {covers.length > 0 ? (
              <div>
                <span className="text-xs font-semibold text-[#857B6D] uppercase tracking-wider block mb-2">
                  Featured Titles
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {covers.map((item, idx) => (
                    <div
                      key={idx}
                      className="aspect-2/3 bg-[#D9D1C3] rounded-md overflow-hidden border border-[#E4DBC9] shadow-xs"
                    >
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full p-1 text-[9px] text-[#3F382F] font-serif-title font-bold flex items-center justify-center text-center">
                          {item.title}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#857B6D] text-center italic py-2">
                No finished books logged for this period.
              </p>
            )}

            {/* Top Genres */}
            {topGenres.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-[#857B6D] uppercase tracking-wider block mb-2">
                  Top Tagged Genres
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {topGenres.map((g) => (
                    <span
                      key={g}
                      className="px-2.5 py-1 bg-[#E4EADA] text-[#4F5D42] text-xs font-semibold rounded-full border border-[#8B9A7A]/30"
                    >
                      #{g}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
            disabled={isDownloading || totalBooks === 0}
            className="flex items-center gap-2 bg-[#B98A5E] hover:bg-[#9A6B52] disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <Download size={14} />
            <span>{isDownloading ? 'Generating...' : 'Download Graphic'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
