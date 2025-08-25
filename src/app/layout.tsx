import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-gray-200 font-sans">
        {/* Navbar */}
        <nav className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-nvidia">GPU Dashboard</h1>
          <div className="space-x-6">
            <Link href="/" className="hover:text-nvidia transition">Home</Link>
            <Link href="/chart" className="hover:text-nvidia transition">Chart</Link>
            <Link href="/table" className="hover:text-nvidia transition">Table</Link>
          </div>
        </nav>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
