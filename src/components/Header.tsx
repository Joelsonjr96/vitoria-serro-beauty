import Link from 'next/link';
import SafeImage from './SafeImage';

export default function Header() {
  return (
    <header className="w-full border-b border-accent-lavender bg-bg-card relative z-50">
      <nav className="w-full px-4 py-4 flex items-center justify-center">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <SafeImage
            src="/images/branding/logo-preta.png"
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
