import React, { useState } from 'react';
import { Book } from '../types';
import {
  exportDataAsJSON,
  exportDataAsCSV,
  parseCSVImport,
} from '../services/storage';
import { Download, Upload, Database, RefreshCw, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  books: Book[];
  onImportBooks: (newBooks: Book[], mergeStrategy: 'append' | 'replace') => void;
  onResetToDefault: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  books,
  onImportBooks,
  onResetToDefault,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importedPreview, setImportedPreview] = useState<Partial<Book>[] | null>(null);
  const [mergeStrategy, setMergeStrategy] = useState<'append' | 'replace'>('append');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus('Reading file...');
      const text = await file.readAsText ? await file.readAsText() : await file.text();

      if (file.name.endsWith('.json')) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          setImportedPreview(parsed);
          setImportStatus(`Successfully loaded JSON with ${parsed.length} books!`);
        } else {
          setImportStatus('Invalid JSON format.');
        }
      } else {
        // Assume CSV
        const parsedBooks = await parseCSVImport(text);
        setImportedPreview(parsedBooks);
        setImportStatus(`Successfully parsed CSV with ${parsedBooks.length} books!`);
      }
    } catch (err: any) {
      console.error('Failed to import file:', err);
      setImportStatus('Error importing file. Please check format.');
    }
  };

  const handleConfirmImport = () => {
    if (!importedPreview) return;
    const validBooks: Book[] = importedPreview.map((b) => ({
      id: b.id || 'b-' + Math.random().toString(36).substr(2, 9),
      title: b.title || 'Untitled',
      author: b.author || 'Unknown Author',
      coverUrl: b.coverUrl,
      pageCount: b.pageCount,
      tags: b.tags || [],
      notes: b.notes || '',
      createdAt: b.createdAt || new Date().toISOString(),
      sessions: b.sessions || [
        {
          id: 's-' + Math.random().toString(36).substr(2, 9),
          bookId: b.id || '',
          status: 'want_to_read',
        },
      ],
      quotes: b.quotes || [],
    }));

    onImportBooks(validBooks, mergeStrategy);
    setImportedPreview(null);
    setImportStatus('Import completed successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-6 shadow-xs">
        <h2 className="font-serif-title text-2xl font-bold text-[#3F382F]">
          Data Ownership & Settings
        </h2>
        <p className="text-xs text-[#857B6D] mt-1">
          Your book data belongs entirely to you. Export your entire library at any time or import from Goodreads/StoryGraph.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Download size={20} className="text-[#B98A5E]" />
            <h3 className="font-serif-title font-bold text-base text-[#3F382F]">
              Export Data
            </h3>
          </div>
          <p className="text-xs text-[#857B6D] leading-relaxed">
            Download your entire library including quotes, notes, start/finish dates, ratings, and tags.
          </p>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => exportDataAsJSON(books)}
              className="w-full bg-[#F4EEE3] hover:bg-[#E4EADA] border border-[#E4DBC9] text-[#3F382F] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Database size={16} className="text-[#B98A5E]" />
                <span>Export Full Backup (JSON)</span>
              </div>
              <Download size={14} className="text-[#857B6D]" />
            </button>

            <button
              onClick={() => exportDataAsCSV(books)}
              className="w-full bg-[#F4EEE3] hover:bg-[#E4EADA] border border-[#E4DBC9] text-[#3F382F] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[#8B9A7A]" />
                <span>Export Spreadsheet (CSV)</span>
              </div>
              <Download size={14} className="text-[#857B6D]" />
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Upload size={20} className="text-[#8B9A7A]" />
            <h3 className="font-serif-title font-bold text-base text-[#3F382F]">
              Import Library
            </h3>
          </div>
          <p className="text-xs text-[#857B6D] leading-relaxed">
            Import from Goodreads CSV export, StoryGraph CSV export, or Shelf JSON backup file.
          </p>

          <div className="pt-2 space-y-3">
            <label className="block w-full bg-[#F4EEE3] hover:bg-[#E4EADA] border border-dashed border-[#B98A5E] rounded-xl p-4 text-center cursor-pointer transition-colors">
              <Upload size={24} className="mx-auto text-[#B98A5E] mb-1" />
              <span className="text-xs font-semibold text-[#3F382F] block">
                Choose CSV or JSON File
              </span>
              <span className="text-[11px] text-[#857B6D]">
                Goodreads / StoryGraph CSV or Shelf JSON
              </span>
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {importStatus && (
              <p className="text-xs font-medium text-[#4F5D42] bg-[#E4EADA] p-2 rounded-lg text-center">
                {importStatus}
              </p>
            )}

            {importedPreview && (
              <div className="space-y-3 pt-2 border-t border-[#E4DBC9]">
                <div>
                  <label className="block text-xs font-semibold text-[#857B6D] mb-1">
                    Import Mode
                  </label>
                  <select
                    value={mergeStrategy}
                    onChange={(e) => setMergeStrategy(e.target.value as any)}
                    className="w-full bg-[#F4EEE3] border border-[#E4DBC9] rounded-lg px-2.5 py-1.5 text-xs text-[#3F382F]"
                  >
                    <option value="append">Append to existing books</option>
                    <option value="replace">Replace current library entirely</option>
                  </select>
                </div>

                <button
                  onClick={handleConfirmImport}
                  className="w-full bg-[#8B9A7A] hover:bg-[#4F5D42] text-white py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Confirm & Import {importedPreview.length} Books
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Options */}
      <div className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif-title font-bold text-sm text-[#3F382F]">
            Restore Sample Library
          </h4>
          <p className="text-xs text-[#857B6D]">
            Reset library to the sample set of curated books.
          </p>
        </div>
        {showResetConfirm ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 rounded-xl border border-[#E4DBC9] text-xs font-medium text-[#857B6D] hover:bg-[#F4EEE3] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onResetToDefault();
                setShowResetConfirm(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#8C3A3A] text-white text-xs font-semibold hover:bg-[#6D2B2B] cursor-pointer"
            >
              Confirm Reset
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 bg-[#F4EEE3] hover:bg-[#E4DBC9] text-[#857B6D] hover:text-[#3F382F] px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Reset Defaults</span>
          </button>
        )}
      </div>
    </div>
  );
};
