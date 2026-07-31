import React, { useState, useMemo } from "react";
import { Book } from "../types";
import {
  ShoppingBag,
  Store,
  DollarSign,
  BookOpen,
  Search,
  Image as ImageIcon,
  Tag,
  Sparkles,
} from "lucide-react";
import { getStatusBadgeLabel, getStatusBadgeStyle } from "../utils/formatters";

interface StoresViewProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export const StoresView: React.FC<StoresViewProps> = ({
  books,
  onSelectBook,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<string>("all");

  // Compute store groups and statistics
  const { storeGroups, totalSpent, storeNames } = useMemo(() => {
    const groups: Record<string, { books: Book[]; total: number }> = {};
    let sumTotal = 0;

    books.forEach((b) => {
      const storeName =
        b.store && b.store.trim() ? b.store.trim() : "Unspecified / Other";
      if (!groups[storeName]) {
        groups[storeName] = { books: [], total: 0 };
      }
      groups[storeName].books.push(b);
      if (b.price !== undefined && !isNaN(b.price)) {
        groups[storeName].total += b.price;
        sumTotal += b.price;
      }
    });

    // Sort store names with defined stores first, then Unspecified
    const names = Object.keys(groups).sort((a, b) => {
      if (a === "Unspecified / Other") return 1;
      if (b === "Unspecified / Other") return -1;
      return groups[b].books.length - groups[a].books.length;
    });

    return {
      storeGroups: groups,
      totalSpent: sumTotal,
      storeNames: names,
    };
  }, [books]);

  // Filtered store list based on selected tab and search query
  const filteredStores = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return storeNames
      .filter((storeName) => {
        if (selectedStore !== "all" && storeName !== selectedStore) {
          return false;
        }
        return true;
      })
      .map((storeName) => {
        const group = storeGroups[storeName];
        const matchingBooks = group.books.filter((b) => {
          if (!query) return true;
          return (
            b.title.toLowerCase().includes(query) ||
            b.author.toLowerCase().includes(query) ||
            storeName.toLowerCase().includes(query)
          );
        });
        return {
          storeName,
          books: matchingBooks,
          total: group.total,
          totalCount: group.books.length,
        };
      })
      .filter((item) => item.books.length > 0);
  }, [storeNames, storeGroups, selectedStore, searchQuery]);

  // Count distinct recorded bookstores
  const recordedStoresCount = useMemo(() => {
    return storeNames.filter((name) => name !== "Unspecified / Other").length;
  }, [storeNames]);

  return (
    <div className="space-y-6">
      {/* Header & Overall Summary Cards */}
      <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-[#B98A5E]" size={22} />
              <h2 className="font-serif-title text-2xl font-bold text-[#3F382F]">
                Bookstores & Spending Overview
              </h2>
            </div>
            <p className="text-xs text-[#857B6D] mt-1">
              See where you bought your books, compare stores, and track total
              expenditures.
            </p>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#B98A5E]/15 flex items-center justify-center text-[#B98A5E] flex-shrink-0">
              <Store size={20} />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#857B6D] block uppercase">
                Bookstores Recorded
              </span>
              <span className="font-serif-title text-2xl font-bold text-[#3F382F]">
                {recordedStoresCount}{" "}
                {recordedStoresCount === 1 ? "store" : "stores"}
              </span>
            </div>
          </div>

          <div className="bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8B9A7A]/20 flex items-center justify-center text-[#4F5D42] flex-shrink-0">
              <DollarSign size={20} />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#857B6D] block uppercase">
                Total Spent
              </span>
              <span className="font-serif-title text-2xl font-bold text-[#4F5D42]">
                ${totalSpent.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#9A6B52]/15 flex items-center justify-center text-[#9A6B52] flex-shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#857B6D] block uppercase">
                Total Books
              </span>
              <span className="font-serif-title text-2xl font-bold text-[#3F382F]">
                {books.length} {books.length === 1 ? "book" : "books"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Store Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedStore("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedStore === "all"
                ? "bg-[#B98A5E] text-white shadow-xs"
                : "bg-[#FBF8F2] text-[#857B6D] hover:text-[#3F382F] border border-[#E4DBC9]"
            }`}
          >
            All Stores ({storeNames.length})
          </button>
          {storeNames.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setSelectedStore(name)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedStore === name
                  ? "bg-[#B98A5E] text-white shadow-xs"
                  : "bg-[#FBF8F2] text-[#857B6D] hover:text-[#3F382F] border border-[#E4DBC9]"
              }`}
            >
              {name} ({storeGroups[name]?.books.length || 0})
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A79D8C]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books or store..."
            className="w-full bg-[#FBF8F2] border border-[#E4DBC9] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#3F382F] focus:outline-none focus:border-[#B98A5E]"
          />
        </div>
      </div>

      {/* Bookstores Grid / Sections */}
      {filteredStores.length === 0 ? (
        <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-12 text-center">
          <Store size={40} className="text-[#A79D8C] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif-title text-lg font-bold text-[#3F382F]">
            No books found
          </h3>
          <p className="text-xs text-[#857B6D] mt-1">
            Try adjusting your search query or add bookstore details to your
            books.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredStores.map(
            ({ storeName, books: storeBooks, total, totalCount }) => (
              <div
                key={storeName}
                className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-5 shadow-xs space-y-4"
              >
                {/* Store Section Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E4DBC9]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#B98A5E]/15 flex items-center justify-center text-[#B98A5E]">
                      <Store size={18} />
                    </div>
                    <div>
                      <h3 className="font-serif-title text-lg font-bold text-[#3F382F] flex items-center gap-2">
                        <span>{storeName}</span>
                        <span className="text-xs font-normal text-[#857B6D] bg-[#F4EEE3] px-2 py-0.5 rounded-full border border-[#E4DBC9]">
                          {totalCount} {totalCount === 1 ? "book" : "books"}
                        </span>
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {total > 0 && (
                      <div className="text-right">
                        <span className="text-[10px] text-[#857B6D] block uppercase font-semibold">
                          Total Spent Here
                        </span>
                        <span className="font-serif-title font-bold text-base text-[#4F5D42]">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Books in this Store Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {storeBooks.map((book) => {
                    const lastSession = book.sessions[book.sessions.length - 1];
                    const status = lastSession ? lastSession.status : "reading";

                    return (
                      <div
                        key={book.id}
                        onClick={() => onSelectBook(book)}
                        className="group bg-[#F4EEE3]/60 hover:bg-[#F4EEE3] border border-[#E4DBC9] rounded-xl p-3 flex items-center gap-3 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                      >
                        {/* Cover thumbnail */}
                        <div className="w-12 h-16 bg-[#D9D1C3] rounded-md overflow-hidden flex-shrink-0 border border-[#E4DBC9] flex items-center justify-center">
                          {book.coverUrl ? (
                            <img
                              src={book.coverUrl}
                              alt={book.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <ImageIcon size={18} className="text-[#A79D8C]" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${getStatusBadgeStyle(
                                status,
                              )}`}
                            >
                              {getStatusBadgeLabel(status)}
                            </span>
                            {book.price !== undefined && !isNaN(book.price) && (
                              <span className="text-xs font-bold text-[#4F5D42]">
                                ${book.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif-title text-sm font-bold text-[#3F382F] truncate mt-1">
                            {book.title}
                          </h4>
                          <p className="text-xs text-[#857B6D] truncate">
                            {book.author}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
};
