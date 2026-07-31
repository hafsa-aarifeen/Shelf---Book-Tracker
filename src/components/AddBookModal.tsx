import React, { useState } from 'react';
import { X, Search, BookPlus, Loader2, Image as ImageIcon, Check } from 'lucide-react';
import { OpenLibrarySearchResult, ReadingStatus, Book } from '../types';
import { searchOpenLibrary } from '../services/openLibrary';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (bookData: Partial<Book>, initialStatus: ReadingStatus) => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onClose,
  onAddBook,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'manual'>('search');
  
  // Search state
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<OpenLibrarySearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedResult, setSelectedResult] = useState<OpenLibrarySearchResult | null>(null);

  // Manual state
  const [manualTitle, setManualTitle] = useState('');
  const [manualAuthor, setManualAuthor] = useState('');
  const [manualCoverUrl, setManualCoverUrl] = useState('');
  const [manualPageCount, setManualPageCount] = useState('');
  const [manualTags, setManualTags] = useState('');
  const [manualStore, setManualStore] = useState('');
  const [manualPrice, setManualPrice] = useState('');

  // Common shelf selection
  const [initialStatus, setInitialStatus] = useState<ReadingStatus>('reading');

  if (!isOpen) return null;

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    const results = await searchOpenLibrary(query);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleAddFromSearch = (result: OpenLibrarySearchResult) => {
    onAddBook(
      {
        title: result.title,
        author: result.author,
        coverUrl: result.coverUrl,
        pageCount: result.pageCount,
        tags: [],
      },
      initialStatus
    );
    onClose();
    resetForm();
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    const tagsArray = manualTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    onAddBook(
      {
        title: manualTitle.trim(),
        author: manualAuthor.trim() || 'Unknown Author',
        coverUrl: manualCoverUrl.trim() || undefined,
        pageCount: manualPageCount ? parseInt(manualPageCount, 10) : undefined,
        store: manualStore.trim() || undefined,
        price: manualPrice ? parseFloat(manualPrice) : undefined,
        tags: tagsArray,
      },
      initialStatus
    );
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setSelectedResult(null);
    setManualTitle('');
    setManualAuthor('');
    setManualCoverUrl('');
    setManualPageCount('');
    setManualTags('');
    setManualStore('');
    setManualPrice('');
    setInitialStatus('reading');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3F382F]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E4DBC9]">
          <h2 className="font-serif-title text-xl font-bold text-[#3F382F]">
            Add a book
          </h2>
          <button
            onClick={onClose}
            className="text-[#857B6D] hover:text-[#3F382F] p-1 rounded-lg hover:bg-[#F4EEE3]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 my-4 bg-[#F4EEE3] p-1 rounded-xl border border-[#E4DBC9]">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'search'
                ? 'bg-[#FBF8F2] text-[#3F382F] shadow-xs'
                : 'text-[#857B6D] hover:text-[#3F382F]'
            }`}
          >
            Search OpenLibrary
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-[#FBF8F2] text-[#3F382F] shadow-xs'
                : 'text-[#857B6D] hover:text-[#3F382F]'
            }`}
          >
            Add Manually
          </button>
        </div>

        {/* Status Selection */}
        <div className="mb-4">
          <label className="block text-xs uppercase tracking-wider text-[#857B6D] font-semibold mb-2">
            Target Shelf
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'reading', label: 'Reading' },
              { id: 'want_to_read', label: 'Want to read' },
              { id: 'finished', label: 'Finished' },
              { id: 'dnf', label: 'DNF' },
            ].map((shelf) => (
              <button
                key={shelf.id}
                type="button"
                onClick={() => setInitialStatus(shelf.id as ReadingStatus)}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                  initialStatus === shelf.id
                    ? 'bg-[#B98A5E] text-white border-[#9A6B52]'
                    : 'bg-[#F4EEE3] text-[#857B6D] border-[#E4DBC9] hover:bg-[#E4EADA]'
                }`}
              >
                {shelf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'search' ? (
            <div className="space-y-4">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857B6D]"
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Title, author, or ISBN..."
                    className="w-full bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl pl-10 pr-4 py-2 text-sm text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !query.trim()}
                  className="bg-[#B98A5E] hover:bg-[#9A6B52] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {isSearching ? <Loader2 size={16} className="animate-spin" /> : 'Search'}
                </button>
              </form>

              {/* Results list */}
              {isSearching ? (
                <div className="py-12 text-center text-[#857B6D]">
                  <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[#B98A5E]" />
                  <p className="text-sm">Searching OpenLibrary...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <div
                      key={result.key}
                      onClick={() => handleAddFromSearch(result)}
                      className="flex items-center gap-4 p-3 bg-[#F4EEE3] hover:bg-[#E4EADA] border border-[#E4DBC9] rounded-xl cursor-pointer transition-colors group"
                    >
                      <div className="w-12 h-16 bg-[#D9D1C3] rounded-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {result.coverUrl ? (
                          <img
                            src={result.coverUrl}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={20} className="text-[#A79D8C]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif-title font-semibold text-[#3F382F] text-base truncate">
                          {result.title}
                        </h4>
                        <p className="text-xs text-[#857B6D] truncate">{result.author}</p>
                        {result.pageCount && (
                          <p className="text-[11px] text-[#A79D8C] mt-1">
                            {result.pageCount} pages
                          </p>
                        )}
                      </div>
                      <button className="bg-[#B98A5E] text-white text-xs px-3 py-1.5 rounded-lg opacity-90 group-hover:opacity-100 flex items-center gap-1">
                        <BookPlus size={14} />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : hasSearched ? (
                <div className="py-12 text-center text-[#857B6D]">
                  <p className="text-sm">No books found. Try adding manually!</p>
                  <button
                    onClick={() => {
                      setActiveTab('manual');
                      setManualTitle(query);
                    }}
                    className="mt-3 text-xs text-[#B98A5E] underline hover:text-[#9A6B52]"
                  >
                    Add "{query}" manually
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center text-[#A79D8C] text-sm">
                  Search millions of books on OpenLibrary or add by hand.
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleAddManual} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3F382F] mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g. The Overstory"
                  className="w-full bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl px-3 py-2 text-sm text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3F382F] mb-1">
                  Author (Optional)
                </label>
                <input
                  type="text"
                  value={manualAuthor}
                  onChange={(e) => setManualAuthor(e.target.value)}
                  placeholder="e.g. Richard Powers"
                  className="w-full bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl px-3 py-2 text-sm text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3F382F] mb-1">
                  Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={manualCoverUrl}
                  onChange={(e) => setManualCoverUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl px-3 py-2 text-sm text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3F382F] mb-1">
                    Page Count (Optional)
                  </label>
                  <input
                    type="number"
                    value={manualPageCount}
                    onChange={(e) => setManualPageCount(e.target.value)}
                    placeholder="e.g. 502"
                    className="w-full bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl px-3 py-2 text-sm text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3F382F] mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={manualTags}
                    onChange={(e) => setManualTags(e.target.value)}
                    placeholder="fiction, mystery"
                    className="w-full bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl px-3 py-2 text-sm text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3F382F] mb-1">
                    Bookstore / Source (Optional)
                  </label>
                  <input
                    type="text"
                    value={manualStore}
                    onChange={(e) => setManualStore(e.target.value)}
                    placeholder="e.g. Kinokuniya"
                    className="w-full bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl px-3 py-2 text-sm text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3F382F] mb-1">
                    Price (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(e.target.value)}
                    placeholder="e.g. 19.99"
                    className="w-full bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl px-3 py-2 text-sm text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!manualTitle.trim()}
                className="w-full bg-[#B98A5E] hover:bg-[#9A6B52] disabled:opacity-50 text-white font-medium py-2.5 rounded-xl text-sm transition-colors cursor-pointer mt-4"
              >
                Save to Shelf
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
