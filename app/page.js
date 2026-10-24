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
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [isKindnessOpen, setIsKindnessOpen] = useState(false);

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
    <div className="v3_1593">
      {/* Background Watercolor Art Illustration from ui/images/v10_4.png */}
      <div className="v10_4" aria-hidden="true" />

      {/* Top Header Bar matching ui/index.html (.v3_1594) */}
      <header className="v3_1594">
        {/* Brand Logo (.v3_1595) */}
        <div className="v3_1595">
          <div className="v3_1596">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(71,99,75,1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22v-9" />
              <path d="M12 13a5 5 0 0 1 5-5c0 0 .5 3-2 5a5.5 5.5 0 0 1-3 0Z" />
              <path d="M12 15a5 5 0 0 0-5-4c0 0-.5 3 2 4.5a5.5 5.5 0 0 0 3-.5Z" />
            </svg>
          </div>
          <h1 className="v3_1597">Tiny Wins</h1>
        </div>

        {/* Tagline (.v3_1603) */}
        <div className="v3_1603">
          <div className="v3_1743">
            <div className="v3_1744" />
          </div>
          <span className="v3_1605">A little space for good.</span>
        </div>

        {/* Navigation Pills matching Figma (.v3_1598) */}
        <nav aria-label="Main Navigation" className="v3_1598">
          {/* Active Community board pill (.v3_1599) */}
          <div className="v3_1599">
            <div className="v3_1600" />
            <span className="v3_1601">Community board</span>
          </div>

          {/* What is a tiny win? trigger button (.v3_1602) */}
          <button
            type="button"
            onClick={() => setIsExplainerOpen(true)}
            className="v3_1602"
          >
            What is a tiny win?
          </button>
        </nav>
      </header>

      {/* Decorative Whimsical Floating Botanical Doodles (.v17_8 & .v17_13) */}
      <div className="v17_8" aria-hidden="true">
        <div className="v17_9" />
        <div className="v17_10" />
        <div className="v17_11" />
        <div className="v17_12" />
      </div>
      <div className="v17_13" aria-hidden="true">
        <div className="v17_14" />
      </div>

      {/* Main Content Area - Community Board */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full flex-grow">
        {/* Subtitle / Intro */}
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-[#7C8076] font-nunito text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            A quiet space to celebrate everyday victories. No victory is too small to count.
          </p>
        </div>

        {/* Themed Writing Box: Where the tiny win is written */}
        <section className="bg-[#FFFEFA]/95 backdrop-blur-xl rounded-2xl border border-[#47634B]/20 shadow-[0_8px_30px_rgba(71,99,75,0.06)] hover:shadow-[0_12px_36px_rgba(71,99,75,0.09)] transition-all duration-300 p-6 sm:p-7 mb-10 relative overflow-hidden">
          {/* Top aesthetic accent line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#47634B] via-[#DDE8D7] to-[#F4D8C7]" />

          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label
                htmlFor="win-input"
                className="block text-xs font-nunito font-bold text-[#47634B] uppercase tracking-wider pl-1"
              >
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
                className="w-full resize-none rounded-xl border border-[#47634B]/20 bg-[#FFFDF9] p-4 text-[#303B34] text-sm sm:text-base placeholder-[#7C8076]/70 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#47634B]/15 focus:border-[#47634B] transition-all duration-200 disabled:bg-[#F7F1E8] disabled:cursor-not-allowed shadow-inner"
              />
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="text-xs font-medium text-rose-800 bg-rose-50/90 border border-rose-200/90 rounded-xl p-3 flex items-center gap-2">
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
                    ? 'text-rose-600 font-semibold'
                    : 'text-[#7C8076]'
                }`}
              >
                {remainingChars} characters left
              </span>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#47634B] hover:bg-[#39513C] active:bg-[#303B34] disabled:bg-[#DDE8D7] disabled:text-[#7C8076] disabled:cursor-not-allowed text-white font-nunito font-bold text-sm rounded-xl shadow-md shadow-[#47634B]/20 hover:shadow-lg hover:shadow-[#47634B]/25 transition-all duration-200 transform active:scale-95 cursor-pointer"
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
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-nunito font-bold uppercase tracking-widest text-[#47634B]">
                Recent Celebrations
              </h2>
              <span className="h-1.5 w-1.5 rounded-full bg-[#47634B]" />
            </div>

            {!isLoading && (
              <span className="text-xs font-inter font-semibold text-[#47634B] bg-[#DDE8D7] px-3 py-1 rounded-full border border-[#47634B]/20 shadow-2xs">
                {wins.length} {wins.length === 1 ? 'win' : 'wins'} shared
              </span>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16 bg-[#FFFEFA]/80 backdrop-blur-md rounded-2xl border border-[#47634B]/15 shadow-xs">
              <div className="inline-block animate-spin text-[#47634B] text-2xl mb-2">🌱</div>
              <p className="text-sm font-medium text-[#7C8076]">Loading wins...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && wins.length === 0 && (
            <div className="text-center py-16 px-4 bg-[#FFFEFA]/80 backdrop-blur-md rounded-2xl border border-dashed border-[#47634B]/30 text-[#7C8076] space-y-3">
              <span className="text-3xl block">🌱</span>
              <p className="text-sm font-nunito font-bold text-[#303B34]">No wins posted yet!</p>
              <p className="text-xs text-[#7C8076] max-w-xs mx-auto leading-relaxed">
                Be the first to share a tiny victory and bring a smile to someone today.
              </p>
            </div>
          )}

          {/* Win Cards Grid */}
          {!isLoading && wins.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wins.map((win) => (
                <article
                  key={win.id}
                  className="bg-[#FFFEFA]/90 backdrop-blur-md rounded-2xl p-5 border border-[#47634B]/15 shadow-[0_4px_20px_rgba(71,99,75,0.03)] hover:shadow-[0_10px_28px_rgba(71,99,75,0.08)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle card badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#47634B] bg-[#DDE8D7] px-2.5 py-0.5 rounded-full border border-[#47634B]/15">
                      <span>🌱</span>
                      <span>Tiny Win</span>
                    </span>
                  </div>

                  {/* Win text */}
                  <p className="text-[#303B34] font-nunito text-[15px] sm:text-base leading-relaxed break-words whitespace-pre-wrap font-semibold mb-5">
                    {win.content}
                  </p>

                  {/* Card Footer with date and actions */}
                  <div className="flex items-center justify-between text-xs text-[#7C8076] pt-3 border-t border-[#47634B]/10">
                    <div className="flex items-center gap-1.5 font-medium text-[#7C8076]">
                      <time dateTime={win.created_at}>{formatDate(win.created_at)}</time>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(win.id)}
                        disabled={deletingId === win.id}
                        aria-label="Delete win"
                        title="Delete celebration"
                        className="text-[#7C8076]/60 hover:text-rose-600 disabled:opacity-40 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
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

                      <span className="text-[#47634B]/40 group-hover:text-[#47634B] group-hover:scale-110 transition-all">
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

      {/* Bottom Footer matching ui/index.html (.v3_1736) */}
      <footer className="v3_1736">
        {/* Footer Logo (.v3_1737) */}
        <div className="v3_1737">
          <div className="v3_1738">
            <span className="w-1.5 h-1.5 rounded-full bg-[#47634B]" />
          </div>
          <span className="v3_1739">Tiny Wins</span>
        </div>

        {/* Subtitle (.v3_1740) */}
        <span className="v3_1740">
          A kinder corner of the internet. One tiny win at a time.
        </span>

        {/* Keep it kind button (.v3_1741) */}
        <button
          type="button"
          onClick={() => setIsKindnessOpen(true)}
          className="v3_1741"
        >
          Keep it kind ↗
        </button>
      </footer>

      {/* "What is a tiny win?" Modal */}
      {isExplainerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-[#FFFEFA] rounded-3xl border border-[#47634B]/20 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#47634B] via-[#DDE8D7] to-[#F4D8C7]" />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#DDE8D7] text-[#47634B] flex items-center justify-center font-bold text-base">
                  🌱
                </div>
                <h3 className="font-nunito font-black text-xl sm:text-2xl text-[#303B34]">
                  What is a Tiny Win?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsExplainerOpen(false)}
                className="text-[#7C8076] hover:text-[#303B34] p-1.5 rounded-lg hover:bg-[#DDE8D7]/30 transition-colors cursor-pointer text-lg leading-none"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <p className="font-nunito text-sm sm:text-base text-[#303B34] leading-relaxed">
              We often wait for huge milestones to feel proud, but life is made of little moments. A tiny win is any small step forward, positive choice, or quiet triumph.
            </p>

            <div className="space-y-2.5 bg-[#FFFDF9] p-4 rounded-2xl border border-[#47634B]/10">
              <span className="text-xs font-nunito font-bold text-[#47634B] uppercase tracking-wider block mb-1">
                Everyday inspiration:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#303B34] font-medium">
                <div className="flex items-center gap-1.5">💧 Drank enough water</div>
                <div className="flex items-center gap-1.5">🚶 15-minute gentle walk</div>
                <div className="flex items-center gap-1.5">✉️ Sent the overdue email</div>
                <div className="flex items-center gap-1.5">🌿 Watered the houseplants</div>
                <div className="flex items-center gap-1.5">🛏️ Made the bed neatly</div>
                <div className="flex items-center gap-1.5">🧘 Took 3 mindful breaths</div>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsExplainerOpen(false)}
                className="px-5 py-2.5 bg-[#47634B] hover:bg-[#39513C] text-white font-nunito font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                Let&apos;s Celebrate!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Keep it kind" Modal */}
      {isKindnessOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-[#FFFEFA] rounded-3xl border border-[#47634B]/20 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#F4D8C7] via-[#DDE8D7] to-[#47634B]" />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🕊️</span>
                <h3 className="font-nunito font-black text-xl text-[#303B34]">
                  Keep It Kind
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsKindnessOpen(false)}
                className="text-[#7C8076] hover:text-[#303B34] p-1.5 rounded-lg hover:bg-[#DDE8D7]/30 transition-colors cursor-pointer text-lg leading-none"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <p className="font-nunito text-sm text-[#303B34] leading-relaxed">
              This space is dedicated to warmth, encouragement, and lifting each other up.
            </p>

            <ul className="space-y-2 text-xs sm:text-sm text-[#47634B] font-medium bg-[#FFFDF9] p-4 rounded-2xl border border-[#47634B]/10">
              <li className="flex items-start gap-2">
                <span>🌸</span>
                <span>Celebrate without comparing yourself to others.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>💛</span>
                <span>Cheer for someone else silently or out loud.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🌿</span>
                <span>Resting when you are tired is a win too.</span>
              </li>
            </ul>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsKindnessOpen(false)}
                className="px-4 py-2 bg-[#47634B] hover:bg-[#39513C] text-white font-nunito font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

