'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [wins, setWins] = useState([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const MAX_CHARACTERS = 150;

  // Fetch all wins ordered by newest first
  const fetchWins = async () => {
    try {
      const { data, error } = await supabase
        .from('wins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWins(data || []);
    } catch (err) {
      console.error('Error fetching wins:', err.message);
      setErrorMessage('Could not load wins. Please check your Supabase connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchWins();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedContent = content.trim();

    // Validation: empty or whitespace only
    if (!trimmedContent) {
      setErrorMessage('Please enter a win before celebrating!');
      return;
    }

    // Validation: character limit check
    if (trimmedContent.length > MAX_CHARACTERS) {
      setErrorMessage(`Please keep your win under ${MAX_CHARACTERS} characters.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase
        .from('wins')
        .insert([{ content: trimmedContent }])
        .select();

      if (error) throw error;

      // Optimistically update the list if data is returned, or refresh feed
      if (data && data.length > 0) {
        setWins((prev) => [data[0], ...prev]);
      } else {
        await fetchWins();
      }

      // Reset form input
      setContent('');
    } catch (err) {
      console.error('Error saving win:', err.message);
      setErrorMessage('Failed to post your win. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format timestamp into friendly date (e.g., "Oct 22, 2026")
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const remainingChars = MAX_CHARACTERS - content.length;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-800 antialiased">
      {/* Background soft ambiance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-100/40 blur-[100px] rounded-full" />
      </div>

      <main className="relative max-w-3xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <header className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100/80 text-amber-800 border border-amber-200/60 shadow-xs">
            <span>✨</span>
            <span>Daily Gratitude & Progress</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-stone-900">
            Tiny Wins
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            A quiet space to celebrate everyday victories. No victory is too small to count.
          </p>
        </header>

        {/* Submission Form Card */}
        <section className="bg-white/90 backdrop-blur-xs rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 p-5 sm:p-6 mb-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="win-input" className="sr-only">
                Your tiny win
              </label>
              <textarea
                id="win-input"
                rows={3}
                value={content}
                maxLength={MAX_CHARACTERS}
                disabled={isSubmitting}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="What's your tiny win today? (e.g., 'Finally fixed that bug', 'Drank enough water', 'Took a 15-min walk')"
                className="w-full resize-none rounded-xl border border-stone-200 p-3.5 text-stone-800 text-sm sm:text-base placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/80 focus:border-amber-400 transition disabled:bg-stone-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2.5 flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Footer */}
            <div className="flex items-center justify-between pt-1">
              {/* Character Counter */}
              <span
                className={`text-xs font-mono transition-colors ${
                  remainingChars <= 20
                    ? 'text-amber-600 font-semibold'
                    : 'text-stone-400'
                }`}
              >
                {remainingChars} characters left
              </span>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl shadow-xs transition-all duration-150 transform active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>Celebrating...</span>
                  </>
                ) : (
                  <>
                    <span>🎉</span>
                    <span>Celebrate!</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Community Wins Feed */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Recent Celebrations
            </h2>
            {!isLoading && (
              <span className="text-xs text-stone-400">
                {wins.length} {wins.length === 1 ? 'win' : 'wins'} shared
              </span>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16 bg-white/60 rounded-2xl border border-stone-200/60">
              <div className="inline-block animate-spin text-amber-500 mb-2">✨</div>
              <p className="text-sm text-stone-500">Loading wins...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && wins.length === 0 && (
            <div className="text-center py-16 px-4 bg-white/70 rounded-2xl border border-dashed border-stone-300 text-stone-500 space-y-2">
              <span className="text-2xl">🌱</span>
              <p className="text-sm font-medium text-stone-700">No wins posted yet!</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Be the first to share a tiny victory and bring a smile to someone today.
              </p>
            </div>
          )}

          {/* Wins Responsive Grid */}
          {!isLoading && wins.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wins.map((win) => (
                <article
                  key={win.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs hover:shadow-md hover:border-amber-200/70 transition-all duration-200 flex flex-col justify-between group"
                >
                  <p className="text-stone-800 text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap mb-4">
                    {win.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-100">
                    <time dateTime={win.created_at}>{formatDate(win.created_at)}</time>
                    <span className="text-stone-300 group-hover:text-amber-400 transition-colors">
                      ✨
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
