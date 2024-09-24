import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Footer from '~/components/footer';
import { Navbar } from '~/components/navbar';
import { Toaster } from '~/components/ui/toaster';
import './globals.css';
import { QueryProvider } from '~/providers/query-provider';
import { constructMetadata } from '~/lib/utils';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} ${geistMono.className} ${geistSans.className} antialiased`}>
        <Navbar />
        <main className='flex grainy-light flex-col min-h-[calc(100vh-3.5rem-1px)]'>
          <div className='flex-1 flex flex-col h-full'>
            <QueryProvider>{children}</QueryProvider>
          </div>
          <Toaster />
          <Footer />
        </main>
      </body>
    </html>
  );
}
