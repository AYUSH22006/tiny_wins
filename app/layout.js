import './globals.css';
import '../ui/css/main.css';

export const metadata = {
  title: 'Tiny Wins - A little space for good',
  description: 'A kinder corner of the internet. Celebrate everyday victories, one tiny win at a time.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-forest-200 selection:text-forest-900">{children}</body>
    </html>
  );
}
