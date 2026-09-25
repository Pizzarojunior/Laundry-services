import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = { title: "FreshFold Laundry", description: "Book laundry pickup & delivery" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 antialiased">
        <header className="bg-white border-b sticky top-0 z-10">
          <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
            <Link href="/" className="text-xl font-bold text-sky-600">🫧 FreshFold</Link>
            <div className="flex gap-5 text-sm font-medium">
              <Link href="/#services">Services</Link>
              <Link href="/#plans">Plans</Link>
              <Link href="/book" className="text-sky-600">Book now</Link>
              <Link href="/my-bookings">My bookings</Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="text-center text-sm text-slate-500 py-8 border-t mt-16">
          © {new Date().getFullYear()} FreshFold Laundry · Mon–Sun 8am–8pm · support@freshfold.com · (555) 123-4567
        </footer>
      </body>
    </html>
  );
}
