import { clsx, type ClassValue } from 'clsx';
import { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(price);
};

export function constructMetadata({
  title = 'CoverIt-Up',
  description = 'CoverIt-Up is a custom phone case company',
  image = '/thumbnail.png',
  icons = '/favicon.ico',
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@ahmetpalavan',
    },
    icons,
    metadataBase: new URL('https://coverit-up.vercel.app/'),
  };
}
