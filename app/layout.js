// app/layout.js
import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'Tigrinya App',
  description: 'Learn Tigrinya',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Ethiopic font for clean Tigrinya rendering */}
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <div className="mx-auto grid max-w-5xl grid-cols-[120px_1fr] gap-6 p-6">
          <Sidebar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}

