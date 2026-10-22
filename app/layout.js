import './globals.css';

export const metadata = {
  title: 'Tiny Wins - Celebrate Everyday Victories',
  description: 'A minimalist public gratitude board to share and celebrate small daily wins.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
