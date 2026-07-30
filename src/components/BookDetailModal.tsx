import React, { useState, useEffect } from 'react';
import { X, Calendar, Plus, Trash2, Edit2, Image as ImageIcon, Quote as QuoteIcon, Sparkles, Check } from 'lucide-react';
import { Book, ReadingStatus, ReadingSession, Quote, ApproxProgress } from '../types';
import { StarRating } from './StarRating';
import { formatDate, formatTimeAgo, getStatusBadgeStyle, getStatusBadgeLabel } from '../utils/formatters';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateBook: (updatedBook: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onOpenQuoteCard: (quote: Quote, book: Book) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isOpen,
  onClose,
  onUpdateBook,
  onDeleteBook,
  onOpenQuoteCard,
}) => {
  if (!isOpen || !book) return null;

  // Active session
  const activeSession: ReadingSession = book.sessions[book.sessions.length - 1] || {
    id: 's-' + Date.now(),
    bookId: book.id,
    status: 'want_to_read',
  };

  const [status, setStatus] = useState<ReadingStatus>(activeSession.status);
  const [startDate, setStartDate] = useState(activeSession.startDate || '');
  const [finishDate, setFinishDate] = useState(activeSession.finishDate || '');
  const [rating, setRating] = useState<number | undefined>(activeSession.rating);
  const [approxProgress, setApproxProgress] = useState<ApproxProgress>(activeSession.approxProgress || 'partway');
  const [progressPercent, setProgressPercent] = useState<number>(activeSession.progressPercent ?? 50);
  const [dnfReason, setDnfReason] = useState(activeSession.dnfReason || '');

  // Book editable fields
  const [notes, setNotes] = useState(book.notes || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(book.tags || []);
  const [quotes, setQuotes] = useState<Quote[]>(book.quotes || []);

  // New Quote form state
  const [isAddingQuote, setIsAddingQuote] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteLocation, setNewQuoteLocation] = useState('');

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync state when book changes
  useEffect(() => {
    const sess = book.sessions[book.sessions.length - 1] || {
      id: 's-' + Date.now(),
      bookId: book.id,
      status: 'want_to_read',
    };
    setStatus(sess.status);
    setStartDate(sess.startDate || '');
    setFinishDate(sess.finishDate || '');
    setRating(sess.rating);
    setApproxProgress(sess.approxProgress || 'partway');
    setProgressPercent(sess.progressPercent ?? 50);
    setDnfReason(sess.dnfReason || '');
    setNotes(book.notes || '');
    setTags(book.tags || []);
    setQuotes(book.quotes || []);
    setShowDeleteConfirm(false);
  }, [book]);

  // Handle immediate auto-save for changes
  const saveChanges = (overrides: {
    status?: ReadingStatus;
    startDate?: string;
    finishDate?: string;
    rating?: number;
    approxProgress?: ApproxProgress;
    progressPercent?: number;
    dnfReason?: string;
    notes?: string;
    tags?: string[];
    quotes?: Quote[];
  }) => {
    const updatedStatus = overrides.status ?? status;
    const updatedStart = overrides.startDate !== undefined ? overrides.startDate : startDate;
    const updatedFinish = overrides.finishDate !== undefined ? overrides.finishDate : finishDate;
    const updatedRating = overrides.rating !== undefined ? overrides.rating : rating;
    const updatedApprox = overrides.approxProgress ?? approxProgress;
    const updatedPercent = overrides.progressPercent ?? progressPercent;
    const updatedDnf = overrides.dnfReason !== undefined ? overrides.dnfReason : dnfReason;
    const updatedNotes = overrides.notes !== undefined ? overrides.notes : notes;
    const updatedTags = overrides.tags ?? tags;
    const updatedQuotes = overrides.quotes ?? quotes;

    const updatedSessions = [...book.sessions];
    const lastSessionIndex = updatedSessions.length > 0 ? updatedSessions.length - 1 : 0;

    updatedSessions[lastSessionIndex] = {
      ...activeSession,
      status: updatedStatus,
      startDate: updatedStart || undefined,
      finishDate: updatedFinish || undefined,
      rating: updatedRating,
      approxProgress: updatedApprox,
      progressPercent: updatedPercent,
      dnfReason: updatedDnf || undefined,
    };

    const updatedBook: Book = {
      ...book,
      notes: updatedNotes,
      tags: updatedTags,
      quotes: updatedQuotes,
      sessions: updatedSessions,
    };

    onUpdateBook(updatedBook);
  };

  const handleStatusChange = (newStatus: ReadingStatus) => {
    setStatus(newStatus);
    let newStart = startDate;
    let newFinish = finishDate;

    if (newStatus === 'reading' && !newStart) {
      newStart = new Date().toISOString().split('T')[0];
    }
    if (newStatus === 'finished' && !newFinish) {
      newFinish = new Date().toISOString().split('T')[0];
    }

    setStartDate(newStart);
    setFinishDate(newFinish);

    saveChanges({
      status: newStatus,
      startDate: newStart,
      finishDate: newFinish,
    });
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const newTag = tagInput.trim().toLowerCase();
    if (!tags.includes(newTag)) {
      const updated = [...tags, newTag];
      setTags(updated);
      saveChanges({ tags: updated });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = tags.filter((t) => t !== tagToRemove);
    setTags(updated);
    saveChanges({ tags: updated });
  };

  const handleAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;

    const newQuote: Quote = {
      id: 'q-' + Date.now(),
      bookId: book.id,
      text: newQuoteText.trim(),
      location: newQuoteLocation.trim() || undefined,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    const updated = [newQuote, ...quotes];
    setQuotes(updated);
    saveChanges({ quotes: updated });
    setNewQuoteText('');
    setNewQuoteLocation('');
    setIsAddingQuote(false);
  };

  const handleDeleteQuote = (quoteId: string) => {
    const updated = quotes.filter((q) => q.id !== quoteId);
    setQuotes(updated);
    saveChanges({ quotes: updated });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3F382F]/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl max-w-3xl w-full p-4 sm:p-8 shadow-xl relative max-h-[92vh] flex flex-col my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#857B6D] hover:text-[#3F382F] p-1.5 rounded-lg hover:bg-[#F4EEE3] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto pr-1 space-y-6">
          {/* Main Book Header info */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Cover image */}
            <div className="w-28 h-40 sm:w-36 sm:h-52 bg-[#D9D1C3] rounded-lg overflow-hidden flex-shrink-0 border border-[#E4DBC9] shadow-xs flex items-center justify-center">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon size={32} className="text-[#A79D8C]" />
              )}
            </div>

            {/* Title, Author, Shelf & Progress */}
            <div className="flex-1 space-y-3">
              <div>
                <span
                  className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusBadgeStyle(
                    status
                  )} mb-2`}
                >
                  {getStatusBadgeLabel(status)}
                </span>
                <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#3F382F] leading-tight">
                  {book.title}
                </h1>
                <p className="text-[#857B6D] text-base font-medium mt-1">
                  {book.author}
                </p>
                {book.pageCount && (
                  <p className="text-xs text-[#A79D8C] mt-0.5">{book.pageCount} pages</p>
                )}
              </div>

              {/* Status Tabs */}
              <div>
                <label className="block text-xs font-semibold text-[#857B6D] uppercase tracking-wider mb-1.5">
                  Shelf Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-[#F4EEE3] p-1 rounded-xl border border-[#E4DBC9]">
                  {[
                    { id: 'reading', label: 'Reading' },
                    { id: 'want_to_read', label: 'Want to Read' },
                    { id: 'finished', label: 'Finished' },
                    { id: 'dnf', label: 'DNF' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleStatusChange(item.id as ReadingStatus)}
                      className={`py-1 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        status === item.id
                          ? 'bg-[#B98A5E] text-white shadow-xs'
                          : 'text-[#857B6D] hover:text-[#3F382F]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Section (When Finished or Editable) */}
              <div className="flex items-center gap-4 py-1">
                <span className="text-xs font-semibold text-[#857B6D] uppercase tracking-wider">
                  Rating
                </span>
                <StarRating
                  value={rating || 0}
                  onChange={(val) => {
                    setRating(val);
                    saveChanges({ rating: val });
                  }}
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* Reading Dates & Progress tracking */}
          <div className="bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#857B6D] mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    saveChanges({ startDate: e.target.value });
                  }}
                  className="w-full bg-[#FBF8F2] border border-[#E4DBC9] rounded-lg px-3 py-1.5 text-xs text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
                />
                {startDate && (
                  <span className="text-[11px] text-[#857B6D] mt-1 block">
                    {formatTimeAgo(startDate)}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#857B6D] mb-1">
                  Finish Date
                </label>
                <input
                  type="date"
                  value={finishDate}
                  onChange={(e) => {
                    setFinishDate(e.target.value);
                    saveChanges({ finishDate: e.target.value });
                  }}
                  className="w-full bg-[#FBF8F2] border border-[#E4DBC9] rounded-lg px-3 py-1.5 text-xs text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
                />
                {finishDate && (
                  <span className="text-[11px] text-[#857B6D] mt-1 block">
                    Finished {formatDate(finishDate)}
                  </span>
                )}
              </div>
            </div>

            {/* Approximate Progress (Optional soft slider & labels) */}
            {status === 'reading' && (
              <div className="space-y-2 pt-2 border-t border-[#E4DBC9]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#3F382F]">
                    Approximate Progress (Optional)
                  </span>
                  <span className="text-[#B98A5E] font-medium">
                    {progressPercent <= 30
                      ? 'Just started'
                      : progressPercent <= 75
                      ? 'Partway through'
                      : 'Nearly done'}{' '}
                    ({progressPercent}%)
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progressPercent}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setProgressPercent(val);
                    saveChanges({ progressPercent: val });
                  }}
                  className="w-full accent-[#B98A5E] cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-[#857B6D]">
                  <button
                    type="button"
                    onClick={() => {
                      setProgressPercent(20);
                      saveChanges({ progressPercent: 20 });
                    }}
                    className="hover:text-[#B98A5E] underline"
                  >
                    Just started
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProgressPercent(50);
                      saveChanges({ progressPercent: 50 });
                    }}
                    className="hover:text-[#B98A5E] underline"
                  >
                    Partway
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProgressPercent(85);
                      saveChanges({ progressPercent: 85 });
                    }}
                    className="hover:text-[#B98A5E] underline"
                  >
                    Nearly done
                  </button>
                </div>
              </div>
            )}

            {/* DNF Reason if DNF */}
            {status === 'dnf' && (
              <div>
                <label className="block text-xs font-semibold text-[#857B6D] mb-1">
                  Reason for DNF (Optional)
                </label>
                <input
                  type="text"
                  value={dnfReason}
                  onChange={(e) => {
                    setDnfReason(e.target.value);
                    saveChanges({ dnfReason: e.target.value });
                  }}
                  placeholder="e.g. Lost interest after chapter 3..."
                  className="w-full bg-[#FBF8F2] border border-[#E4DBC9] rounded-lg px-3 py-1.5 text-xs text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
                />
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#857B6D] uppercase tracking-wider">
              Custom Tags
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E4EADA] text-[#4F5D42] text-xs font-medium border border-[#8B9A7A]/30"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-[#8C3A3A] p-0.5 rounded-full cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="New tag..."
                  className="bg-[#F4EEE3] border border-[#E4DBC9] rounded-full px-2.5 py-1 text-xs text-[#3F382F] focus:outline-none focus:border-[#B98A5E] w-24"
                />
                <button
                  onClick={handleAddTag}
                  className="p-1 rounded-full bg-[#B98A5E] text-white hover:bg-[#9A6B52] transition-colors cursor-pointer"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#857B6D] uppercase tracking-wider">
              Personal Notes & Thoughts
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                saveChanges({ notes: e.target.value });
              }}
              placeholder="Write your thoughts, themes, or reading journal notes..."
              className="w-full bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl p-3 text-sm text-[#3F382F] focus:outline-none focus:border-[#B98A5E] resize-y"
            />
          </div>

          {/* Quotes Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-[#E4DBC9] pb-2">
              <div className="flex items-center gap-2">
                <QuoteIcon size={16} className="text-[#B98A5E]" />
                <h3 className="font-serif-title font-bold text-base text-[#3F382F]">
                  Quotes & Highlights ({quotes.length})
                </h3>
              </div>
              <button
                onClick={() => setIsAddingQuote(!isAddingQuote)}
                className="flex items-center gap-1 text-xs font-medium text-[#B98A5E] hover:text-[#9A6B52] cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Quote</span>
              </button>
            </div>

            {/* Add Quote Form */}
            {isAddingQuote && (
              <form onSubmit={handleAddQuote} className="bg-[#E4EADA] border border-[#8B9A7A]/30 rounded-xl p-3 space-y-2">
                <textarea
                  required
                  rows={2}
                  value={newQuoteText}
                  onChange={(e) => setNewQuoteText(e.target.value)}
                  placeholder="Paste or type a quote from the book..."
                  className="w-full bg-[#FBF8F2] border border-[#E4DBC9] rounded-lg p-2 text-sm text-[#3F382F] focus:outline-none focus:border-[#8B9A7A]"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newQuoteLocation}
                    onChange={(e) => setNewQuoteLocation(e.target.value)}
                    placeholder="Page number or chapter (optional)..."
                    className="flex-1 bg-[#FBF8F2] border border-[#E4DBC9] rounded-lg px-2.5 py-1 text-xs text-[#3F382F] focus:outline-none focus:border-[#8B9A7A]"
                  />
                  <button
                    type="submit"
                    className="bg-[#8B9A7A] hover:bg-[#4F5D42] text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    Save Quote
                  </button>
                </div>
              </form>
            )}

            {/* Quote List */}
            {quotes.length > 0 ? (
              <div className="space-y-3">
                {quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="bg-[#E4EADA]/60 border border-[#8B9A7A]/20 rounded-xl p-3.5 relative group"
                  >
                    <p className="font-serif-title italic text-sm text-[#4F5D42] leading-relaxed">
                      "{quote.text}"
                    </p>
                    <div className="flex items-center justify-between mt-2 text-[11px] text-[#4F5D42]/80 font-medium">
                      <span>{quote.location || 'Saved quote'}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenQuoteCard(quote, book)}
                          className="flex items-center gap-1 text-[#9A6B52] hover:text-[#3F382F] font-semibold cursor-pointer"
                          title="Generate Shareable Instagram Card"
                        >
                          <Sparkles size={12} />
                          <span>Share Card</span>
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="text-[#857B6D] hover:text-[#8C3A3A] p-0.5 cursor-pointer opacity-80 group-hover:opacity-100"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#A79D8C] italic">No quotes saved yet.</p>
            )}
          </div>

          {/* Delete Book Section */}
          <div className="pt-4 border-t border-[#E4DBC9]">
            {showDeleteConfirm ? (
              <div className="bg-[#F8ECEC] border border-[#E5B8B8] rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
                <div className="text-xs text-[#8C3A3A] font-medium text-center sm:text-left">
                  Are you sure you want to delete <strong className="font-semibold">"{book.title}"</strong> from your library?
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 rounded-lg border border-[#D1B5B5] bg-white text-xs font-medium text-[#5A3030] hover:bg-[#F3E2E2] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteBook(book.id);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#8C3A3A] hover:bg-[#6D2B2B] text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
                  >
                    Yes, Delete Book
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-[#8C3A3A] hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <Trash2 size={14} />
                  <span>Delete book from Shelf</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#B98A5E] hover:bg-[#9A6B52] text-white text-xs font-medium px-4 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
