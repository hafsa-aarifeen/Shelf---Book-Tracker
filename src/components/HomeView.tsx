import React from 'react';
import { Book, Quote } from '../types';
import { formatTimeAgo, getProgressLabel } from '../utils/formatters';
import { Plus, BookOpen, Quote as QuoteIcon, ArrowRight, Image as ImageIcon, Sparkles } from 'lucide-react';

interface HomeViewProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onOpenAddModal: () => void;
  onOpenQuoteCard: (quote: Quote, book: Book) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  books,
  onSelectBook,
  onOpenAddModal,
  onOpenQuoteCard,
}) => {
  // Get all books in 'reading' shelf
  const currentlyReadingBooks = books.filter((b) => {
    const session = b.sessions[b.sessions.length - 1];
    return session && session.status === 'reading';
  });

  // Primary featured book is the first currently reading book (or null)
  const heroBook = currentlyReadingBooks[0];
  const alsoReadingBooks = currentlyReadingBooks.slice(1);

  // Calculate monthly & yearly finished books
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const finishedThisMonth = books.filter((b) => {
    const session = b.sessions[b.sessions.length - 1];
    if (session && session.status === 'finished' && session.finishDate) {
      const d = new Date(session.finishDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }
    return false;
  }).length;

  const finishedThisYear = books.filter((b) => {
    const session = b.sessions[b.sessions.length - 1];
    if (session && session.status === 'finished' && session.finishDate) {
      const d = new Date(session.finishDate);
      return d.getFullYear() === currentYear;
    }
    return false;
  }).length;

  // Average rating
  const ratings = books
    .map((b) => b.sessions[b.sessions.length - 1]?.rating)
    .filter((r): r is number => r !== undefined);

  const avgRating = ratings.length > 0
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : '0.0';

  // Find a calm featured quote
  const allQuotes: { quote: Quote; book: Book }[] = [];
  books.forEach((b) => {
    b.quotes.forEach((q) => {
      allQuotes.push({ quote: q, book: b });
    });
  });
  const featuredQuoteObj = allQuotes.length > 0 ? allQuotes[0] : null;

  return (
    <div className="space-y-6">
      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HERO CARD: Featured Current Read */}
        <div className="lg:col-span-2 bg-[#F4EEE3] border border-[#E4DBC9] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 relative shadow-xs hover:border-[#B98A5E]/40 transition-colors">
          {heroBook ? (
            <>
              {/* Book Cover */}
              <div
                onClick={() => onSelectBook(heroBook)}
                className="w-36 h-52 sm:w-44 sm:h-64 bg-[#D9D1C3] rounded-md overflow-hidden shadow-md border border-[#E4DBC9] flex-shrink-0 cursor-pointer group hover:scale-[1.02] transition-transform flex items-center justify-center"
              >
                {heroBook.coverUrl ? (
                  <img
                    src={heroBook.coverUrl}
                    alt={heroBook.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon size={32} className="text-[#A79D8C]" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="inline-block px-3 py-1 bg-[#E4EADA] text-[#4F5D42] rounded-full text-xs font-semibold mb-3">
                    Currently Reading
                  </div>
                  <h2
                    onClick={() => onSelectBook(heroBook)}
                    className="font-serif-title text-2xl sm:text-3xl font-bold text-[#3F382F] leading-snug cursor-pointer hover:text-[#9A6B52] transition-colors"
                  >
                    {heroBook.title}
                  </h2>
                  <p className="text-[#857B6D] text-base font-medium mt-1">
                    {heroBook.author}
                  </p>
                </div>

                {/* Progress Section */}
                <div className="space-y-2 bg-[#FBF8F2] p-4 rounded-xl border border-[#E4DBC9]">
                  <div className="flex justify-between items-center text-xs text-[#857B6D]">
                    <span className="font-medium">
                      {formatTimeAgo(
                        heroBook.sessions[heroBook.sessions.length - 1]?.startDate
                      )}
                    </span>
                    <span className="text-[#B98A5E] font-semibold">
                      {getProgressLabel(
                        heroBook.sessions[heroBook.sessions.length - 1]?.approxProgress,
                        heroBook.sessions[heroBook.sessions.length - 1]?.progressPercent
                      )}
                    </span>
                  </div>

                  {/* Soft Progress Bar */}
                  <div className="w-full h-2 bg-[#E4DBC9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#B98A5E] rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          heroBook.sessions[heroBook.sessions.length - 1]?.progressPercent ??
                          50
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Latest Note/Quote or Action */}
                {heroBook.notes ? (
                  <p className="text-xs text-[#857B6D] italic line-clamp-2">
                    "{heroBook.notes}"
                  </p>
                ) : heroBook.quotes.length > 0 ? (
                  <p className="text-xs text-[#857B6D] italic line-clamp-2">
                    "{heroBook.quotes[0].text}"
                  </p>
                ) : null}

                <div className="pt-2">
                  <button
                    onClick={() => onSelectBook(heroBook)}
                    className="text-xs font-semibold text-[#9A6B52] hover:text-[#3F382F] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Update reading details</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E4EADA] text-[#4F5D42] flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-[#3F382F]">
                No current reads
              </h3>
              <p className="text-xs text-[#857B6D] max-w-xs">
                You don't have any books marked as "Currently Reading". Start a book from your library or add a new one!
              </p>
              <button
                onClick={onOpenAddModal}
                className="mt-2 bg-[#B98A5E] hover:bg-[#9A6B52] text-white px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Add a book to start</span>
              </button>
            </div>
          )}
        </div>

        {/* ALSO READING SIDE CARD */}
        <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-6 flex flex-col">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#A79D8C] mb-4">
            Also Reading ({alsoReadingBooks.length})
          </div>

          {alsoReadingBooks.length > 0 ? (
            <div className="space-y-3 divide-y divide-[#E4DBC9]">
              {alsoReadingBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book)}
                  className="pt-3 first:pt-0 flex items-center gap-3 cursor-pointer group hover:opacity-90"
                >
                  <div className="w-10 h-14 bg-[#D9D1C3] rounded-xs overflow-hidden flex-shrink-0 border border-[#E4DBC9]">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#A79D8C]">
                        <ImageIcon size={16} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif-title font-semibold text-sm text-[#3F382F] truncate group-hover:text-[#B98A5E]">
                      {book.title}
                    </h4>
                    <p className="text-xs text-[#857B6D] truncate">{book.author}</p>
                    <span className="text-[11px] font-medium text-[#B98A5E] block mt-0.5">
                      {getProgressLabel(
                        book.sessions[book.sessions.length - 1]?.approxProgress,
                        book.sessions[book.sessions.length - 1]?.progressPercent
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-[#A79D8C] italic my-auto">
              No secondary reads currently in progress.
            </div>
          )}
        </div>
      </div>

      {/* SECOND ROW BENTO: Calm Stats & Featured Quote */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CALM STATS CARD */}
        <div className="lg:col-span-2 bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-6 flex items-center justify-around">
          <div className="text-center">
            <span className="font-serif-title text-4xl sm:text-5xl font-bold text-[#9A6B52] block leading-none">
              {finishedThisMonth}
            </span>
            <span className="text-xs font-semibold text-[#A79D8C] uppercase tracking-wider mt-2 block">
              Books this month
            </span>
          </div>

          <div className="w-px h-16 bg-[#E4DBC9]" />

          <div className="text-center">
            <span className="font-serif-title text-4xl sm:text-5xl font-bold text-[#9A6B52] block leading-none">
              {finishedThisYear}
            </span>
            <span className="text-xs font-semibold text-[#A79D8C] uppercase tracking-wider mt-2 block">
              Books this year
            </span>
          </div>

          <div className="w-px h-16 bg-[#E4DBC9]" />

          <div className="text-center">
            <span className="font-serif-title text-4xl sm:text-5xl font-bold text-[#8B9A7A] block leading-none">
              {avgRating}
            </span>
            <span className="text-xs font-semibold text-[#A79D8C] uppercase tracking-wider mt-2 block">
              Average rating
            </span>
          </div>
        </div>

        {/* FEATURED QUOTE CARD */}
        <div className="bg-[#E4EADA] border border-[#8B9A7A]/30 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          {featuredQuoteObj ? (
            <>
              <div className="relative z-10">
                <span className="text-4xl font-serif-title text-[#8B9A7A]/40 leading-none block -mb-2">
                  “
                </span>
                <p className="font-serif-title italic text-sm text-[#4F5D42] leading-relaxed">
                  {featuredQuoteObj.quote.text}
                </p>
              </div>

              <div className="pt-3 border-t border-[#8B9A7A]/20 flex items-center justify-between text-xs text-[#4F5D42] font-semibold z-10 mt-4">
                <span>— {featuredQuoteObj.book.title}</span>
                <button
                  onClick={() =>
                    onOpenQuoteCard(featuredQuoteObj.quote, featuredQuoteObj.book)
                  }
                  className="flex items-center gap-1 text-[#9A6B52] hover:underline cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>Share</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-6 text-center text-xs text-[#4F5D42] my-auto">
              Save quotes while reading to feature them here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
