import Link from 'next/link';
import SafeImage from './SafeImage';

export default function Header() {
  return (
    <header className="border-b border-accent-lavender bg-bg-card sticky top-0 z-50">
      <nav className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-center">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <SafeImage
            src="/images/LOGO PRETA.png"
            alt="Vitória Serro Beauty Logo"
            className="h-14 w-auto object-contain"
            width={200}
            height={100}
          />
        </Link>
      </nav>
    </header>
  );
}
