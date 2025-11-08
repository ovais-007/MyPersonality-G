import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 py-6 text-center text-sm text-gray-600">
      <Link href="/" className='underline hover:text-blue-600 transition-colors' >
      <p className="mb-2">
        © {new Date().getFullYear()} <span className="font-semibold">My Personality G</span>
      </p>
      </Link>
      <div className="space-x-4">
        <Link href="/privacy" className="underline hover:text-blue-600 transition-colors">
          Privacy Policy
        </Link>
        <Link href="/terms" className="underline hover:text-blue-600 transition-colors">
          Terms of Service
        </Link>
      </div>
    </footer>
  );
}