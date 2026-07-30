import React, { useMemo } from 'react';
import { Book } from '../types';
import { Trophy, BarChart3, Star, Tag, Calendar, Sparkles } from 'lucide-react';

interface StatsViewProps {
  books: Book[];
  onOpenWrapUp: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ books, onOpenWrapUp }) => {
  const currentYear = new Date().getFullYear();

  // Finished books
  const finishedBooks = useMemo(() => {
    return books.filter((b) => {
      const session = b.sessions[b.sessions.length - 1];
      return session && session.status === 'finished';
    });
  }, [books]);

  // Books read per month for current year
  const monthlyCounts = useMemo(() => {
    const counts = Array(12).fill(0);
    finishedBooks.forEach((b) => {
      const session = b.sessions[b.sessions.length - 1];
      if (session?.finishDate) {
        const d = new Date(session.finishDate);
        if (d.getFullYear() === currentYear) {
          counts[d.getMonth()] += 1;
        }
      }
    });
    return counts;
  }, [finishedBooks, currentYear]);

  const maxMonthlyCount = Math.max(...monthlyCounts, 1);

  // Books read per year
  const yearlyCounts = useMemo(() => {
    const map: Record<number, number> = {};
    finishedBooks.forEach((b) => {
      const session = b.sessions[b.sessions.length - 1];
      if (session?.finishDate) {
        const d = new Date(session.finishDate);
        const y = d.getFullYear();
        if (!isNaN(y)) map[y] = (map[y] || 0) + 1;
      }
    });
    return Object.entries(map).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  }, [finishedBooks]);

  // Tag/Genre breakdown
  const tagBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    books.forEach((b) => {
      b.tags.forEach((t) => {
        map[t] = (map[t] || 0) + 1;
      });
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [books]);

  const maxTagCount = tagBreakdown.length > 0 ? tagBreakdown[0][1] : 1;

  // Rating distribution
  const ratingDist = useMemo(() => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    finishedBooks.forEach((b) => {
      const r = b.sessions[b.sessions.length - 1]?.rating;
      if (r) {
        const rounded = Math.round(r);
        if (dist[rounded] !== undefined) dist[rounded] += 1;
      }
    });
    return dist;
  }, [finishedBooks]);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className="space-y-6">
      {/* Header & Wrap-up Graphic Trigger */}
      <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="font-serif-title text-2xl font-bold text-[#3F382F]">
            Reading Statistics & Insights
          </h2>
          <p className="text-xs text-[#857B6D] mt-1">
            Calm, unhurried reflections on your reading journey.
          </p>
        </div>

        <button
          onClick={onOpenWrapUp}
          className="flex items-center gap-2 bg-[#B98A5E] hover:bg-[#9A6B52] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
        >
          <Sparkles size={16} />
          <span>Generate Wrap-up Graphic</span>
        </button>
      </div>

      {/* Grid of Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Breakdown Chart */}
        <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[#9A6B52]" />
              <h3 className="font-serif-title font-bold text-base text-[#3F382F]">
                {currentYear} Monthly Reading
              </h3>
            </div>
            <span className="text-xs text-[#857B6D] font-medium">
              {monthlyCounts.reduce((a, b) => a + b, 0)} books
            </span>
          </div>

          <div className="pt-4 flex items-end justify-between gap-1.5 h-44 border-b border-[#E4DBC9] pb-2">
            {monthlyCounts.map((count, idx) => {
              const heightPercent = (count / maxMonthlyCount) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] text-[#857B6D] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {count}
                  </span>
                  <div className="w-full bg-[#E4DBC9] rounded-t-sm h-32 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-[#B98A5E] group-hover:bg-[#9A6B52] transition-all rounded-t-sm"
                      style={{ height: `${count > 0 ? Math.max(heightPercent, 10) : 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-[#857B6D]">
                    {monthNames[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tag / Genre Breakdown */}
        <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-[#8B9A7A]" />
            <h3 className="font-serif-title font-bold text-base text-[#3F382F]">
              Top Tags & Genres
            </h3>
          </div>

          {tagBreakdown.length > 0 ? (
            <div className="space-y-2.5 pt-2">
              {tagBreakdown.map(([tag, count]) => {
                const widthPercent = (count / maxTagCount) * 100;
                return (
                  <div key={tag} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-[#3F382F]">
                      <span>#{tag}</span>
                      <span className="text-[#857B6D]">{count} books</span>
                    </div>
                    <div className="w-full h-2 bg-[#E4DBC9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#8B9A7A] rounded-full"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-[#A79D8C] italic py-8 text-center">
              Add tags to your books to see your genre breakdown!
            </p>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-[#B98A5E]" />
            <h3 className="font-serif-title font-bold text-base text-[#3F382F]">
              Rating Distribution
            </h3>
          </div>

          <div className="space-y-2 pt-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDist[stars] || 0;
              const percent = finishedBooks.length > 0 ? (count / finishedBooks.length) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-medium text-[#3F382F] flex items-center gap-1">
                    {stars} ★
                  </span>
                  <div className="flex-1 h-2 bg-[#E4DBC9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#B98A5E] rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[#857B6D] font-medium">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Yearly History */}
        <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-[#9A6B52]" />
            <h3 className="font-serif-title font-bold text-base text-[#3F382F]">
              Yearly Totals
            </h3>
          </div>

          {yearlyCounts.length > 0 ? (
            <div className="space-y-3 pt-2">
              {yearlyCounts.map(([year, count]) => (
                <div
                  key={year}
                  className="flex items-center justify-between p-3 bg-[#F4EEE3] rounded-xl border border-[#E4DBC9]"
                >
                  <span className="font-serif-title font-bold text-base text-[#3F382F]">
                    {year}
                  </span>
                  <span className="text-xs font-semibold text-[#9A6B52] bg-[#FBF8F2] px-3 py-1 rounded-full border border-[#E4DBC9]">
                    {count} books finished
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#A79D8C] italic py-8 text-center">
              Finish books to see yearly archive stats!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
