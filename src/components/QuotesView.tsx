import React, { useState, useMemo } from 'react';
import { Book, Quote } from '../types';
import { Search, Quote as QuoteIcon, Sparkles, Plus, Image as ImageIcon } from 'lucide-react';

interface QuotesViewProps {
  books: Book[];
  onOpenQuoteCard: (quote: Quote, book: Book) => void;
  onSelectBook: (book: Book) => void;
}

export const QuotesView: React.FC<QuotesViewProps> = ({
  books,
  onOpenQuoteCard,
  onSelectBook,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<string>('all');

  // Flatten all quotes with their associated book
  const allQuotesWithBooks = useMemo(() => {
    const list: { quote: Quote; book: Book }[] = [];
    books.forEach((book) => {
      book.quotes.forEach((quote) => {
        list.push({ quote, book });
      });
    });
    return list;
  }, [books]);

  // Filtered quotes
  const filteredQuotes = useMemo(() => {
    return allQuotesWithBooks.filter(({ quote, book }) => {
      if (selectedBookId !== 'all' && book.id !== selectedBookId) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesText = quote.text.toLowerCase().includes(q);
        const matchesBook = book.title.toLowerCase().includes(q);
        const matchesAuthor = book.author.toLowerCase().includes(q);
        const matchesLocation = (quote.location || '').toLowerCase().includes(q);
        return matchesText || matchesBook || matchesAuthor || matchesLocation;
      }

      return true;
    });
  }, [allQuotesWithBooks, selectedBookId, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <QuoteIcon size={20} className="text-[#B98A5E]" />
          <h2 className="font-serif-title text-lg font-bold text-[#3F382F]">
            Quotes Collection ({allQuotesWithBooks.length})
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto text-xs">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857B6D]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quotes, books, authors..."
              className="w-full bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl pl-8 pr-3 py-1.5 text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
            />
          </div>

          {/* Book Filter Dropdown */}
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl px-3 py-1.5 text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
          >
            <option value="all">All Books</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.quotes.length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quotes Masonry / Grid */}
      {filteredQuotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuotes.map(({ quote, book }) => (
            <div
              key={quote.id}
              className="bg-[#E4EADA]/70 border border-[#8B9A7A]/30 rounded-2xl p-5 flex flex-col justify-between hover:border-[#8B9A7A] transition-all relative group shadow-2xs"
            >
              <div>
                <span className="text-3xl font-serif-title text-[#8B9A7A]/50 leading-none block -mb-1">
                  “
                </span>
                <p className="font-serif-title italic text-base text-[#4F5D42] leading-relaxed">
                  {quote.text}
                </p>
                {quote.location && (
                  <span className="text-[11px] text-[#4F5D42]/70 font-semibold block mt-2">
                    {quote.location}
                  </span>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-[#8B9A7A]/20 flex items-center justify-between">
                <div
                  onClick={() => onSelectBook(book)}
                  className="flex items-center gap-2 cursor-pointer group/book"
                >
                  <div className="w-6 h-8 bg-[#D9D1C3] rounded-xs overflow-hidden flex-shrink-0 border border-[#E4DBC9]">
                    {book.coverUrl ? (
                      <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#A79D8C]">
                        <ImageIcon size={12} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif-title font-bold text-xs text-[#3F382F] truncate group-hover/book:text-[#9A6B52]">
                      {book.title}
                    </h4>
                    <p className="text-[11px] text-[#857B6D] truncate">{book.author}</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenQuoteCard(quote, book)}
                  className="flex items-center gap-1.5 bg-[#FBF8F2] hover:bg-[#8B9A7A] hover:text-white text-[#4F5D42] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#8B9A7A]/30 transition-all cursor-pointer shadow-2xs"
                >
                  <Sparkles size={14} />
                  <span>Instagram Card</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-12 text-center space-y-3">
          <QuoteIcon size={32} className="mx-auto text-[#A79D8C]" />
          <h3 className="font-serif-title text-lg font-bold text-[#3F382F]">
            No quotes found
          </h3>
          <p className="text-xs text-[#857B6D] max-w-sm mx-auto">
            You haven't saved any quotes yet or none match your search criteria. Open a book's detail page to add quotes!
          </p>
        </div>
      )}
    </div>
  );
};
