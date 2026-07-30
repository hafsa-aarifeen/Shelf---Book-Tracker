import { OpenLibrarySearchResult } from '../types';

export async function searchOpenLibrary(query: string): Promise<OpenLibrarySearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query.trim())}&limit=12`
    );

    if (!response.ok) {
      throw new Error(`OpenLibrary API returned status ${response.status}`);
    }

    const data = await response.json();
    const docs = data.docs || [];

    return docs.map((doc: any) => {
      const author = Array.isArray(doc.author_name) && doc.author_name.length > 0
        ? doc.author_name.join(', ')
        : 'Unknown Author';

      const coverUrl = doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
        : undefined;

      const pageCount = doc.number_of_pages_median || doc.number_of_pages || undefined;

      return {
        key: doc.key || Math.random().toString(),
        title: doc.title || 'Untitled',
        author,
        coverUrl,
        pageCount,
      };
    });
  } catch (error) {
    console.error('Failed to search OpenLibrary:', error);
    return [];
  }
}
