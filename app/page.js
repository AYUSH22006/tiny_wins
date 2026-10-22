'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [wins, setWins] = useState([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);

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

      if (data && data.length > 0) {
        setWins((prev) => [data[0], ...prev]);
      } else {
        await fetchWins();
      }

      setContent('');
    } catch (err) {
      console.error('Error saving win:', err.message);
      setErrorMessage('Failed to post your win. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle win deletion
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('wins')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWins((prev) => prev.filter((win) => win.id !== id));
    } catch (err) {
      console.error('Error deleting win:', err.message);
      setErrorMessage('Failed to delete win. Ensure Supabase allows DELETE operations.');
    } finally {
      setDeletingId(null);
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
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 antialiased relative selection:bg-amber-200 selection:text-amber-900 overflow-x-hidden">
      {/* Aesthetic Ambient Aurora & Grid Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Soft pastel mesh glows */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[450px] bg-gradient-to-tr from-amber-200/40 via-rose-200/30 to-violet-200/25 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 -left-48 w-[500px] h-[500px] bg-gradient-to-br from-amber-100/40 via-orange-100/30 to-transparent blur-[120px] rounded-full" />
        <div className="absolute bottom-10 -right-32 w-[550px] h-[450px] bg-gradient-to-tl from-rose-100/40 via-amber-100/35 to-indigo-50/20 blur-[130px] rounded-full" />
        {/* Subtle textured dotted grid */}
        <div className="absolute inset-0 bg-grid-dots opacity-40" />
      </div>

      <main className="relative max-w-3xl mx-auto px-4 py-14 sm:py-20">
        {/* Aesthetic Header */}
        <header className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/80 text-amber-800 border border-amber-200/70 shadow-xs backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="tracking-wide">✨ Daily Gratitude Garden</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-stone-900">
            Tiny Wins
          </h1>

          <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed font-light">
            A quiet space to celebrate everyday victories. No victory is too small to count.
          </p>
        </header>

        {/* Themed Writing Box: Where the tiny win is written */}
        <section className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/90 shadow-[0_12px_36px_rgba(120,53,15,0.06)] hover:shadow-[0_16px_44px_rgba(120,53,15,0.09)] transition-all duration-300 p-6 sm:p-7 mb-14 relative overflow-hidden ring-1 ring-stone-900/5">
          {/* Top aesthetic gradient shimmer bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-rose-300 to-amber-500" />

          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label htmlFor="win-input" className="block text-xs font-semibold text-stone-500 uppercase tracking-wider pl-1">
                Share a win for today
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
                className="w-full resize-none rounded-2xl border border-stone-200/90 bg-[#FAF9F6]/80 p-4 text-stone-800 text-sm sm:text-base placeholder-stone-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-amber-400/15 focus:border-amber-400 transition-all duration-200 disabled:bg-stone-50 disabled:cursor-not-allowed shadow-inner"
              />
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="text-xs text-rose-700 bg-rose-50/90 border border-rose-200/90 rounded-xl p-3 flex items-center gap-2 backdrop-blur-xs">
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
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:from-amber-700 active:to-amber-800 disabled:from-stone-200 disabled:to-stone-300 disabled:text-stone-400 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 transform active:scale-95 cursor-pointer"
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

        {/* Celebrations Feed */}
        <section className="space-y-5">
          <div className="flex items-center justify-between px-1.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-500">
                Recent Celebrations
              </h2>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            </div>

            {!isLoading && (
              <span className="text-xs font-medium text-stone-500 bg-white/70 px-2.5 py-0.5 rounded-full border border-stone-200/60 shadow-2xs">
                {wins.length} {wins.length === 1 ? 'win' : 'wins'} shared
              </span>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-3xl border border-stone-200/70 shadow-xs">
              <div className="inline-block animate-spin text-amber-500 text-xl mb-2">✨</div>
              <p className="text-sm font-medium text-stone-500">Loading wins...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && wins.length === 0 && (
            <div className="text-center py-16 px-4 bg-white/75 backdrop-blur-md rounded-3xl border border-dashed border-stone-300 text-stone-500 space-y-3">
              <span className="text-3xl block">🌱</span>
              <p className="text-sm font-semibold text-stone-800">No wins posted yet!</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                Be the first to share a tiny victory and bring a smile to someone today.
              </p>
            </div>
          )}

          {/* Themed Win Cards Grid (Where wins are written & displayed) */}
          {!isLoading && wins.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wins.map((win) => (
                <article
                  key={win.id}
                  className="bg-white/85 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-stone-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(217,119,6,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ring-1 ring-stone-900/[0.03]"
                >
                  {/* Subtle decorative card pill */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800/80 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                      <span>🌱</span>
                      <span>Tiny Win</span>
                    </span>
                  </div>

                  {/* Written win text */}
                  <p className="text-stone-800 text-[15px] sm:text-base leading-relaxed break-words whitespace-pre-wrap font-normal mb-5">
                    {win.content}
                  </p>

                  {/* Card Footer with date and actions */}
                  <div className="flex items-center justify-between text-xs text-stone-400 pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-1.5 font-medium text-stone-400">
                      <time dateTime={win.created_at}>{formatDate(win.created_at)}</time>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Delete option */}
                      <button
                        type="button"
                        onClick={() => handleDelete(win.id)}
                        disabled={deletingId === win.id}
                        aria-label="Delete win"
                        title="Delete celebration"
                        className="text-stone-300 hover:text-rose-500 disabled:opacity-40 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                      >
                        {deletingId === win.id ? (
                          <span className="text-[10px] text-rose-500 font-medium animate-pulse">Deleting...</span>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>

                      <span className="text-stone-300 group-hover:text-amber-400 group-hover:scale-110 transition-all">
                        ✨
                      </span>
                    </div>
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
