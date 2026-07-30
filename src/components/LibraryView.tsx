import React, { useState, useMemo } from 'react';
import { Book, ReadingStatus, Quote } from '../types';
import { StarRating } from './StarRating';
import { getStatusBadgeStyle, getStatusBadgeLabel } from '../utils/formatters';
import { Search, Plus, Filter, Image as ImageIcon, BookOpen } from 'lucide-react';

interface LibraryViewProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onOpenAddModal: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  books,
  onSelectBook,
  onOpenAddModal,
}) => {
  const [selectedShelf, setSelectedShelf] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'author' | 'rating'>('recent');

  // Extract all unique tags across library
  const allTags = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => b.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [books]);

  // Extract all unique authors across library
  const allAuthors = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => set.add(b.author));
    return Array.from(set).sort();
  }, [books]);

  // Filter & Sort books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const lastSession = book.sessions[book.sessions.length - 1];
        const status = lastSession?.status || 'want_to_read';

        // Shelf filter
        if (selectedShelf !== 'all' && status !== selectedShelf) return false;

        // Tag filter
        if (selectedTag !== 'all' && !book.tags.includes(selectedTag)) return false;

        // Author filter
        if (selectedAuthor !== 'all' && book.author !== selectedAuthor) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = book.title.toLowerCase().includes(q);
          const matchesAuthor = book.author.toLowerCase().includes(q);
          const matchesNotes = (book.notes || '').toLowerCase().includes(q);
          const matchesTags = book.tags.some((t) => t.toLowerCase().includes(q));
          return matchesTitle || matchesAuthor || matchesNotes || matchesTags;
        }

        return true;
      })
      .sort((a, b) => {
        const aSess = a.sessions[a.sessions.length - 1] || {};
        const bSess = b.sessions[b.sessions.length - 1] || {};

        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        } else if (sortBy === 'author') {
          return a.author.localeCompare(b.author);
        } else if (sortBy === 'rating') {
          const rA = aSess.rating || 0;
          const rB = bSess.rating || 0;
          return rB - rA;
        } else {
          // recent
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [books, selectedShelf, selectedTag, selectedAuthor, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-4 space-y-4 shadow-xs">
        {/* Shelf Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E4DBC9] text-xs font-medium">
          {[
            { id: 'all', label: `All Books (${books.length})` },
            {
              id: 'reading',
              label: `Reading (${
                books.filter(
                  (b) => b.sessions[b.sessions.length - 1]?.status === 'reading'
                ).length
              })`,
            },
            {
              id: 'want_to_read',
              label: `Want to Read (${
                books.filter(
                  (b) => b.sessions[b.sessions.length - 1]?.status === 'want_to_read'
                ).length
              })`,
            },
            {
              id: 'finished',
              label: `Finished (${
                books.filter(
                  (b) => b.sessions[b.sessions.length - 1]?.status === 'finished'
                ).length
              })`,
            },
            {
              id: 'dnf',
              label: `DNF (${
                books.filter((b) => b.sessions[b.sessions.length - 1]?.status === 'dnf')
                  .length
              })`,
            },
          ].map((shelf) => (
            <button
              key={shelf.id}
              onClick={() => setSelectedShelf(shelf.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedShelf === shelf.id
                  ? 'bg-[#B98A5E] text-white font-semibold shadow-xs'
                  : 'text-[#857B6D] hover:bg-[#F4EEE3] hover:text-[#3F382F]'
              }`}
            >
              {shelf.label}
            </button>
          ))}
        </div>

        {/* Filters & Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Input */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857B6D]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, notes..."
              className="w-full bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl pl-9 pr-3 py-2 text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
            />
          </div>

          {/* Tag Filter */}
          <div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl px-3 py-2 text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
            >
              <option value="all">Filter by Tag (All)</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>

          {/* Author Filter */}
          <div>
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="w-full bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl px-3 py-2 text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
            >
              <option value="all">Filter by Author (All)</option>
              {allAuthors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl px-3 py-2 text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
            >
              <option value="recent">Sort: Recently Added</option>
              <option value="title">Sort: Title (A-Z)</option>
              <option value="author">Sort: Author (A-Z)</option>
              <option value="rating">Sort: Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredBooks.map((book) => {
            const lastSession = book.sessions[book.sessions.length - 1] || {};
            const status = lastSession.status || 'want_to_read';

            return (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-xl p-3 flex flex-col justify-between hover:border-[#B98A5E] hover:shadow-md transition-all cursor-pointer group"
              >
                <div>
                  {/* Cover */}
                  <div className="aspect-2/3 bg-[#D9D1C3] rounded-lg overflow-hidden border border-[#E4DBC9] mb-3 relative group-hover:scale-[1.02] transition-transform">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#A79D8C] p-2 text-center">
                        <ImageIcon size={24} />
                      </div>
                    )}
                    {/* Status badge on top right */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs ${getStatusBadgeStyle(
                          status
                        )}`}
                      >
                        {getStatusBadgeLabel(status)}
                      </span>
                    </div>
                  </div>

                  {/* Title & Author */}
                  <h3 className="font-serif-title font-bold text-sm text-[#3F382F] line-clamp-2 leading-tight group-hover:text-[#9A6B52] transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-[#857B6D] mt-1 font-medium truncate">
                    {book.author}
                  </p>
                </div>

                {/* Rating & Tags Footer */}
                <div className="mt-3 pt-2 border-t border-[#E4DBC9] space-y-1">
                  {lastSession.rating ? (
                    <StarRating value={lastSession.rating} readOnly size={14} />
                  ) : null}

                  {book.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {book.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-[#E4EADA] text-[#4F5D42] px-1.5 py-0.5 rounded-md font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                      {book.tags.length > 2 && (
                        <span className="text-[10px] text-[#A79D8C]">
                          +{book.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-12 text-center space-y-3">
          <BookOpen size={32} className="mx-auto text-[#A79D8C]" />
          <h3 className="font-serif-title text-lg font-bold text-[#3F382F]">
            No books match filters
          </h3>
          <p className="text-xs text-[#857B6D] max-w-sm mx-auto">
            Try adjusting your search terms or shelf selection, or add a new book to your library!
          </p>
          <button
            onClick={onOpenAddModal}
            className="mt-2 bg-[#B98A5E] hover:bg-[#9A6B52] text-white px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-colors inline-flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add book</span>
          </button>
        </div>
      )}
    </div>
  );
};
