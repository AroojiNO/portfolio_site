import Link from "next/link";

// Shown for any URL that doesn't exist, and for pages hidden with notFound()
export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-8 text-white">
      <div className="glass w-full max-w-lg text-center">
        <div className="p-4">
          <p className="text-7xl font-bold text-accent">404</p>
          <h1 className="mt-4 text-2xl font-semibold">This page doesn&apos;t exist</h1>
          <p className="mt-3 text-gray-300">The link may be broken, or the page may have moved.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="px-5 py-2 border border-accent text-accent rounded-full hover:bg-accent hover:text-dark transition-colors duration-300"
            >
              Back home
            </Link>
            <Link
              href="/projects"
              className="px-5 py-2 border border-white/15 text-gray-300 rounded-full hover:border-accent hover:text-accent transition-colors duration-300"
            >
              Projects
            </Link>
            <Link
              href="/resume"
              className="px-5 py-2 border border-white/15 text-gray-300 rounded-full hover:border-accent hover:text-accent transition-colors duration-300"
            >
              Resume
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
