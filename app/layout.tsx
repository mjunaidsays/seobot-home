import { Metadata } from 'next';
import Script from 'next/script';
import { Toaster } from '@/components/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';
import { cn } from '@/utils/cn';
import { Inter as FontSans } from 'next/font/google';
import { JetBrains_Mono as FontMono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import dynamic from 'next/dynamic';
import { Analytics } from '@vercel/analytics/react';
import { PostHogProviderComponent } from '@/components/PostHogProvider';
import DelayedMatrixRain from '@/components/DelayedMatrixRain';
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

const meta = {
  title: 'SaaS starter',
  description: 'AI SaaS starter kit',
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
    keywords: ['saas', 'ai'],
    authors: [{ name: 'Author Name', url: 'author_url' }],
    creator: 'Creator',
    publisher: 'Publisher',
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
  const CrispWithNoSSR = dynamic(() => import('../components/crisp'));
  return (
    <html lang="en" className="scroll-smooth scroll-p-16">
      <head>
        {PIXEL_ID && (
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
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
                fbq('init', '${PIXEL_ID}');
                fbq('track', 'PageView');
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
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased loading',
          fontSans.variable,
          fontMono.variable
        )}
        data-google-ads-id={GOOGLE_ADS_ID}
      >
        <CrispWithNoSSR />
        <DelayedMatrixRain />
        <AttributionCapture />
        <PostHogProviderComponent>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main
              id="skip"
              className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
            >
              {children}
            </main>
            <Suspense>
              <Toaster />
            </Suspense>
          </ThemeProvider>
        </PostHogProviderComponent>
        <Analytics />
      </body>
    </html>
  );
}
