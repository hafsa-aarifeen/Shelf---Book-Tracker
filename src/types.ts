export type ReadingStatus = 'want_to_read' | 'reading' | 'finished' | 'dnf';

export type ApproxProgress = 'just_started' | 'partway' | 'nearly_done';

export interface ReadingSession {
  id: string;
  bookId: string;
  startDate?: string; // YYYY-MM-DD
  finishDate?: string; // YYYY-MM-DD
  status: ReadingStatus;
  dnfReason?: string;
  rating?: number; // 0 to 5 in 0.5 steps
  approxProgress?: ApproxProgress;
  progressPercent?: number; // 0 - 100 soft slider
}

export interface Quote {
  id: string;
  bookId: string;
  text: string;
  location?: string; // e.g. "Chapter 4" or "Page 42"
  dateAdded: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  galleryImages?: string[]; // photos of favorite lines, book notes, etc.
  pageCount?: number;
  store?: string; // bookstore or source where the book was bought
  price?: number; // price paid for the book
  tags: string[];
  notes?: string;
  createdAt: string;
  sessions: ReadingSession[];
  quotes: Quote[];
}

export interface OpenLibrarySearchResult {
  key: string;
  title: string;
  author: string;
  coverUrl?: string;
  pageCount?: number;
}
