import React, { useState, useEffect } from 'react';
import { Book, ReadingStatus, Quote } from './types';
import { getStoredBooks, saveBooks, INITIAL_BOOKS } from './services/storage';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { LibraryView } from './components/LibraryView';
import { QuotesView } from './components/QuotesView';
import { StatsView } from './components/StatsView';
import { StoresView } from './components/StoresView';
import { SettingsModal } from './components/SettingsModal';
import { AddBookModal } from './components/AddBookModal';
import { BookDetailModal } from './components/BookDetailModal';
import { QuoteCardModal } from './components/QuoteCardModal';
import { WrapUpModal } from './components/WrapUpModal';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<Book | null>(null);
  const [selectedQuoteForCard, setSelectedQuoteForCard] = useState<{
    quote: Quote;
    book: Book;
  } | null>(null);
  const [isWrapUpOpen, setIsWrapUpOpen] = useState(false);

  // Load books on mount
  useEffect(() => {
    const loaded = getStoredBooks();
    setBooks(loaded);
  }, []);

  // Save books to localStorage whenever books state updates
  const updateBooksState = (newBooks: Book[]) => {
    setBooks(newBooks);
    saveBooks(newBooks);
  };

  // Add a new book
  const handleAddBook = (bookData: Partial<Book>, initialStatus: ReadingStatus) => {
    const newBookId = 'book-' + Math.random().toString(36).substr(2, 9);
    const newSessionId = 'session-' + Math.random().toString(36).substr(2, 9);

    const newBook: Book = {
      id: newBookId,
      title: bookData.title || 'Untitled',
      author: bookData.author || 'Unknown Author',
      coverUrl: bookData.coverUrl,
      pageCount: bookData.pageCount,
      tags: bookData.tags || [],
      notes: '',
      createdAt: new Date().toISOString(),
      sessions: [
        {
          id: newSessionId,
          bookId: newBookId,
          status: initialStatus,
          startDate: initialStatus === 'reading' ? new Date().toISOString().split('T')[0] : undefined,
          finishDate: initialStatus === 'finished' ? new Date().toISOString().split('T')[0] : undefined,
          approxProgress: initialStatus === 'reading' ? 'just_started' : undefined,
          progressPercent: initialStatus === 'reading' ? 20 : undefined,
        },
      ],
      quotes: [],
    };

    const updated = [newBook, ...books];
    updateBooksState(updated);
  };

  // Update an existing book
  const handleUpdateBook = (updatedBook: Book) => {
    const updated = books.map((b) => (b.id === updatedBook.id ? updatedBook : b));
    updateBooksState(updated);
    if (selectedBookForDetail?.id === updatedBook.id) {
      setSelectedBookForDetail(updatedBook);
    }
  };

  // Delete a book
  const handleDeleteBook = (bookId: string) => {
    const updated = books.filter((b) => b.id !== bookId);
    updateBooksState(updated);
    if (selectedBookForDetail?.id === bookId) {
      setSelectedBookForDetail(null);
    }
  };

  // Handle import
  const handleImportBooks = (
    imported: Book[],
    mergeStrategy: 'append' | 'replace'
  ) => {
    if (mergeStrategy === 'replace') {
      updateBooksState(imported);
    } else {
      const merged = [...imported, ...books];
      updateBooksState(merged);
    }
  };

  // Reset to defaults
  const handleResetToDefault = () => {
    updateBooksState(INITIAL_BOOKS);
  };

  return (
    <div className="min-h-screen bg-[#E9E1D3] text-[#3F382F] font-sans px-4 sm:px-8 py-6 max-w-7xl mx-auto flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <Header
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        {/* Tab Views */}
        <main className="pb-12">
          {currentTab === 'home' && (
            <HomeView
              books={books}
              onSelectBook={(b) => setSelectedBookForDetail(b)}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenQuoteCard={(q, b) => setSelectedQuoteForCard({ quote: q, book: b })}
            />
          )}

          {currentTab === 'library' && (
            <LibraryView
              books={books}
              onSelectBook={(b) => setSelectedBookForDetail(b)}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {currentTab === 'quotes' && (
            <QuotesView
              books={books}
              onOpenQuoteCard={(q, b) => setSelectedQuoteForCard({ quote: q, book: b })}
              onSelectBook={(b) => setSelectedBookForDetail(b)}
              onUpdateBook={handleUpdateBook}
            />
          )}

          {currentTab === 'stores' && (
            <StoresView
              books={books}
              onSelectBook={(b) => setSelectedBookForDetail(b)}
            />
          )}

          {currentTab === 'stats' && (
            <StatsView
              books={books}
              onOpenWrapUp={() => setIsWrapUpOpen(true)}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsModal
              books={books}
              onImportBooks={handleImportBooks}
              onResetToDefault={handleResetToDefault}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="pt-6 border-t border-[#E4DBC9] text-center text-xs text-[#857B6D] flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-serif-title font-semibold text-[#9A6B52]">
          Shelf — A calm, personal book journal for single readers
        </span>
        <span className="text-[#A79D8C]">
          No page counts forced • Start/Finish date model • Full data ownership
        </span>
      </footer>

      {/* Modals */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBook={handleAddBook}
      />

      <BookDetailModal
        book={selectedBookForDetail}
        isOpen={!!selectedBookForDetail}
        onClose={() => setSelectedBookForDetail(null)}
        onUpdateBook={handleUpdateBook}
        onDeleteBook={handleDeleteBook}
        onOpenQuoteCard={(q, b) => setSelectedQuoteForCard({ quote: q, book: b })}
      />

      <QuoteCardModal
        quote={selectedQuoteForCard?.quote || null}
        book={selectedQuoteForCard?.book || null}
        isOpen={!!selectedQuoteForCard}
        onClose={() => setSelectedQuoteForCard(null)}
      />

      <WrapUpModal
        isOpen={isWrapUpOpen}
        onClose={() => setIsWrapUpOpen(false)}
        books={books}
      />
    </div>
  );
}
