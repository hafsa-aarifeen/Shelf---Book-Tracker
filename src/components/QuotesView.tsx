import React, { useState, useMemo } from 'react';
import { Book, Quote } from '../types';
import { Search, Quote as QuoteIcon, Sparkles, Plus, Image as ImageIcon, Edit2, Trash2 } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface QuotesViewProps {
  books: Book[];
  onOpenQuoteCard: (quote: Quote, book: Book) => void;
  onSelectBook: (book: Book) => void;
  onUpdateBook?: (updatedBook: Book) => void;
}

export const QuotesView: React.FC<QuotesViewProps> = ({
  books,
  onOpenQuoteCard,
  onSelectBook,
  onUpdateBook,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<string>('all');

  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [editQuoteText, setEditQuoteText] = useState('');
  const [editQuoteLocation, setEditQuoteLocation] = useState('');
  const [quoteToDelete, setQuoteToDelete] = useState<{ quote: Quote; book: Book } | null>(null);

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

  const handleSaveEditQuote = (quoteId: string, book: Book) => {
    if (!editQuoteText.trim() || !onUpdateBook) return;
    const updatedQuotes = book.quotes.map((q) =>
      q.id === quoteId
        ? {
            ...q,
            text: editQuoteText.trim(),
            location: editQuoteLocation.trim() || undefined,
          }
        : q
    );
    onUpdateBook({ ...book, quotes: updatedQuotes });
    setEditingQuoteId(null);
  };

  const handleConfirmDeleteQuote = () => {
    if (!quoteToDelete || !onUpdateBook) return;
    const { quote, book } = quoteToDelete;
    const updatedQuotes = book.quotes.filter((q) => q.id !== quote.id);
    onUpdateBook({ ...book, quotes: updatedQuotes });
    setQuoteToDelete(null);
  };

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
              {editingQuoteId === quote.id ? (
                <div className="space-y-2 mb-4">
                  <textarea
                    rows={2}
                    value={editQuoteText}
                    onChange={(e) => setEditQuoteText(e.target.value)}
                    placeholder="Quote text..."
                    className="w-full bg-[#FBF8F2] border border-[#8B9A7A] rounded-lg p-2 text-sm text-[#3F382F] focus:outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editQuoteLocation}
                      onChange={(e) => setEditQuoteLocation(e.target.value)}
                      placeholder="Page or location..."
                      className="flex-1 bg-[#FBF8F2] border border-[#8B9A7A] rounded-lg px-2.5 py-1 text-xs text-[#3F382F] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEditQuote(quote.id, book)}
                      className="bg-[#8B9A7A] hover:bg-[#4F5D42] text-white px-3 py-1 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingQuoteId(null)}
                      className="bg-white hover:bg-[#F4EEE3] text-[#5C5449] border border-[#D1C7B7] px-3 py-1 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
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
              )}

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

                <div className="flex items-center gap-1.5">
                  {onUpdateBook && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingQuoteId(quote.id);
                          setEditQuoteText(quote.text);
                          setEditQuoteLocation(quote.location || '');
                        }}
                        className="p-1.5 text-[#4F5D42] hover:text-[#3F382F] bg-[#FBF8F2] hover:bg-[#D1C7B7] rounded-lg transition-colors cursor-pointer"
                        title="Edit Quote"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuoteToDelete({ quote, book })}
                        className="p-1.5 text-[#8C3A3A] hover:text-white bg-[#F8ECEC] hover:bg-[#8C3A3A] rounded-lg transition-colors cursor-pointer"
                        title="Delete Quote"
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onOpenQuoteCard(quote, book)}
                    className="flex items-center gap-1.5 bg-[#FBF8F2] hover:bg-[#8B9A7A] hover:text-white text-[#4F5D42] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#8B9A7A]/30 transition-all cursor-pointer shadow-2xs"
                  >
                    <Sparkles size={14} />
                    <span>Instagram Card</span>
                  </button>
                </div>
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

      {/* Delete Quote Confirmation Modal */}
      <ConfirmModal
        isOpen={!!quoteToDelete}
        title="Delete Quote?"
        message="Are you sure you want to delete this quote from your highlights?"
        confirmText="Delete Quote"
        onConfirm={handleConfirmDeleteQuote}
        onClose={() => setQuoteToDelete(null)}
      />
    </div>
  );
};
