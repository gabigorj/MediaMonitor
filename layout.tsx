import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'MediaMonitor — Presa românească, într-un singur loc', description: 'Monitorizare de știri din surse publice din România.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ro"><body>{children}</body></html>; }
