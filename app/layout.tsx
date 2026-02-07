import { Metadata } from 'next';
import Script from 'next/script';
import { Toaster } from '@/components/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';
import { cn } from '@/utils/cn';
import { Inter as FontSans, Instrument_Serif as FontDisplay } from 'next/font/google';
import { JetBrains_Mono as FontMono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { PostHogProviderComponent } from '@/components/PostHogProvider';
import AttributionCapture from '@/components/AttributionCapture';

const fontSans = FontSans({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Reduced from 6 weights to 3 for better performance
  variable: '--font-sans',
  display: 'swap', // Improves visual stability during font loading
  preload: true
});

const fontMono = FontMono({
  subsets: ['latin'],
  weight: ['400', '600'], // Only include weights we actually use
  variable: '--font-mono',
  display: 'swap',
  preload: false // Only preload if used above-the-fold
});

const fontDisplay = FontDisplay({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument-serif',
  preload: false
});

const meta = {
  title: 'Seoscribed',
  description: 'AI-powered local content for directory founders scaling location pages.',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: getURL()
};

const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const GOOGLE_ADS_ID = process.env.GOOGLE_ADS_ID;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: meta.title,
    description: meta.description,
    referrer: 'origin-when-cross-origin',
    keywords: ['seo', 'directory', 'location pages', 'local content', 'ai'],
    authors: [{ name: 'Ahmad S.' }],
    creator: 'Seoscribed',
    publisher: 'Seoscribed',
    robots: meta.robots,
    icons: { icon: meta.favicon },
    metadataBase: new URL(meta.url),
    openGraph: {
      url: meta.url,
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
      type: 'website',
      siteName: meta.title
    },
    twitter: {
      card: 'summary_large_image',
      site: '@',
      creator: '@',
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage]
    }
  };
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="scroll-p-16" suppressHydrationWarning>
      <head>
        {PIXEL_ID && (
          <Script
            id="fb-pixel"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                if(!window.__fbPixelInit){
                  window.__fbPixelInit=true;
                  fbq('init', '${PIXEL_ID}');
                  fbq('track', 'PageView');
                }
              `,
            }}
          />
        )}
        {GOOGLE_ADS_ID && (
          <>
            <Script
              id="google-ads-gtag-src"
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-ads-gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GOOGLE_ADS_ID}');
                `,
              }}
            />
          </>
        )}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased loading',
          fontSans.variable,
          fontMono.variable,
          fontDisplay.variable
        )}
        data-google-ads-id={GOOGLE_ADS_ID}
      >
        <Suspense fallback={null}>
          <AttributionCapture />
        </Suspense>
        <PostHogProviderComponent>
          <main
            id="skip"
            className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
          >
            {children}
          </main>
          <Suspense fallback={null}>
            <Toaster />
          </Suspense>
        </PostHogProviderComponent>
        <Analytics />
      </body>
    </html>
  );
}
