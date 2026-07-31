import { Book, ReadingSession, Quote, ReadingStatus } from '../types';
import Papa from 'papaparse';

const STORAGE_KEY = 'shelf_books_data_v2';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'The Overstory',
    author: 'Richard Powers',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300&h=420',
    pageCount: 502,
    store: 'Kinokuniya Bookstore',
    price: 18.00,
    tags: ['environmental', 'fiction', 'pulitzer'],
    notes: 'Found the interconnected character arcs deeply moving, especially in chapter 4. The writing on trees and human perception is extraordinary.',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    sessions: [
      {
        id: 'session-1',
        bookId: 'book-1',
        startDate: new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0],
        status: 'reading',
        approxProgress: 'nearly_done',
        progressPercent: 75,
      },
    ],
    quotes: [
      {
        id: 'quote-1',
        bookId: 'book-1',
        text: 'The best time to plant a tree was twenty years ago. The second best time is now.',
        location: 'Chapter 4',
        dateAdded: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      },
      {
        id: 'quote-2',
        bookId: 'book-1',
        text: 'You cannot see what you do not have a word for.',
        location: 'Page 112',
        dateAdded: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      }
    ]
  },
  {
    id: 'book-2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=300&h=420',
    pageCount: 496,
    store: 'Barnes & Noble',
    price: 24.50,
    tags: ['sci-fi', 'space', 'survival'],
    notes: 'Engaging, optimistic sci-fi. Ryland Grace is a great protagonist.',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    sessions: [
      {
        id: 'session-2',
        bookId: 'book-2',
        startDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        status: 'reading',
        approxProgress: 'just_started',
        progressPercent: 20,
      }
    ],
    quotes: []
  },
  {
    id: 'book-3',
    title: 'Interior Chinatown',
    author: 'Charles Yu',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300&h=420',
    pageCount: 288,
    store: 'Kinokuniya Bookstore',
    price: 16.99,
    tags: ['satire', 'fiction', 'screenplay style'],
    notes: 'Unique screenplay format exploring Asian-American representation.',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    sessions: [
      {
        id: 'session-3',
        bookId: 'book-3',
        startDate: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0],
        status: 'reading',
        approxProgress: 'partway',
        progressPercent: 50,
      }
    ],
    quotes: []
  },
  {
    id: 'book-4',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300&h=420',
    pageCount: 416,
    tags: ['fiction', 'gaming', 'friendship'],
    notes: 'A brilliant exploration of creative partnership, games, and long-term love.',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    sessions: [
      {
        id: 'session-4',
        bookId: 'book-4',
        startDate: new Date(Date.now() - 25 * 86400000).toISOString().split('T')[0],
        finishDate: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
        status: 'finished',
        rating: 5,
        approxProgress: 'nearly_done',
        progressPercent: 100,
      }
    ],
    quotes: [
      {
        id: 'quote-3',
        bookId: 'book-4',
        text: 'The point of books is to get you out of your own life and into someone else\'s. Even for just a little while.',
        location: 'Chapter 12',
        dateAdded: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      }
    ]
  },
  {
    id: 'book-5',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=300&h=420',
    pageCount: 303,
    tags: ['sci-fi', 'dystopian', 'literary'],
    notes: 'Gentle, haunting perspective from an Artificial Friend.',
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    sessions: [
      {
        id: 'session-5',
        bookId: 'book-5',
        startDate: new Date(Date.now() - 40 * 86400000).toISOString().split('T')[0],
        finishDate: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0],
        status: 'finished',
        rating: 4.5,
        progressPercent: 100,
      }
    ],
    quotes: []
  },
  {
    id: 'book-6',
    title: 'Sea of Tranquility',
    author: 'Emily St. John Mandel',
    coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=300&h=420',
    pageCount: 272,
    tags: ['sci-fi', 'time travel'],
    notes: 'Recommended by a friend.',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    sessions: [
      {
        id: 'session-6',
        bookId: 'book-6',
        status: 'want_to_read',
      }
    ],
    quotes: []
  },
  {
    id: 'book-7',
    title: 'The 7 1/2 Deaths of Evelyn Hardcastle',
    author: 'Stuart Turton',
    coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=300&h=420',
    pageCount: 432,
    tags: ['mystery', 'thriller'],
    notes: 'Groundhog day mystery in an estate.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    sessions: [
      {
        id: 'session-7',
        bookId: 'book-7',
        status: 'want_to_read',
      }
    ],
    quotes: []
  }
];

export function getStoredBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveBooks(INITIAL_BOOKS);
      return INITIAL_BOOKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_BOOKS;
  } catch (err) {
    console.error('Failed to load books from localStorage:', err);
    return INITIAL_BOOKS;
  }
}

export function saveBooks(books: Book[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch (err) {
    console.error('Failed to save books to localStorage:', err);
  }
}

export function exportDataAsJSON(books: Book[]): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(books, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `shelf_library_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportDataAsCSV(books: Book[]): void {
  const rows: any[] = [];

  books.forEach(book => {
    const latestSession: Partial<ReadingSession> = book.sessions[book.sessions.length - 1] || {};
    rows.push({
      Title: book.title,
      Author: book.author,
      Status: latestSession.status || 'want_to_read',
      Rating: latestSession.rating || '',
      StartDate: latestSession.startDate || '',
      FinishDate: latestSession.finishDate || '',
      ApproxProgress: latestSession.approxProgress || '',
      ProgressPercent: latestSession.progressPercent ?? '',
      PageCount: book.pageCount || '',
      Tags: book.tags.join('; '),
      Notes: book.notes || '',
      QuoteCount: book.quotes.length,
      DNFReason: latestSession.dnfReason || '',
      DateAdded: book.createdAt.split('T')[0],
    });
  });

  const csv = Papa.unparse(rows);
  const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `shelf_library_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function parseCSVImport(fileText: string): Promise<Partial<Book>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(fileText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const imported: Partial<Book>[] = results.data.map((row: any) => {
            const title = row.Title || row.title || row['Book Title'] || 'Untitled';
            const author = row.Author || row.author || row.Authors || row['Author Name'] || 'Unknown Author';

            // Determine status
            let status: ReadingStatus = 'want_to_read';
            const rawStatus = (row.Status || row['Exclusive Shelf'] || row['Read Status'] || '').toLowerCase();
            if (rawStatus.includes('read') && !rawStatus.includes('want')) {
              status = 'finished';
            } else if (rawStatus.includes('currently') || rawStatus.includes('reading')) {
              status = 'reading';
            } else if (rawStatus.includes('dnf') || rawStatus.includes('did not finish')) {
              status = 'dnf';
            }

            // Rating
            const rawRating = parseFloat(row.Rating || row['My Rating'] || row['Star Rating'] || '0');
            const rating = !isNaN(rawRating) && rawRating > 0 ? Math.min(5, Math.max(0, rawRating)) : undefined;

            // Dates
            const startDate = row.StartDate || row['Date Started'] || undefined;
            const finishDate = row.FinishDate || row['Date Read'] || row['Dates Read'] || undefined;

            // Tags / Shelves
            const tagsRaw = row.Tags || row.Shelves || row.Bookshelves || '';
            const tags = tagsRaw
              ? tagsRaw.split(/[,;]/).map((t: string) => t.trim()).filter((t: string) => t && t !== 'to-read' && t !== 'currently-reading' && t !== 'read')
              : [];

            const pageCount = parseInt(row.PageCount || row['Number of Pages'] || row['Page Count'] || '0', 10) || undefined;
            const notes = row.Notes || row['My Review'] || row.Review || undefined;

            const session: ReadingSession = {
              id: 'session-' + Math.random().toString(36).substr(2, 9),
              bookId: '',
              status,
              rating,
              startDate,
              finishDate,
            };

            return {
              id: 'book-' + Math.random().toString(36).substr(2, 9),
              title,
              author,
              pageCount,
              tags,
              notes,
              createdAt: new Date().toISOString(),
              sessions: [session],
              quotes: [],
            };
          });

          resolve(imported);
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => reject(err),
    });
  });
}
