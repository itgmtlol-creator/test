import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DEB8 — Structured Debate Platform',
  description: 'Structured debate, without the noise.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
