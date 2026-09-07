import { getSetting, CONTENT_KEY } from "@/lib/settings";
import { parseContent, type TrackingConfig } from "@/lib/content";

/**
 * Injecte les pixels / outils de tracking configurés dans le dashboard
 * (Meta Pixel, GA4, Google Ads, TikTok, GTM). Composant serveur : lit les
 * réglages Airtable. Seuls des identifiants validés sont injectés (pas de
 * HTML brut) — aucun risque d'injection. Sans config, ne rend rien.
 */
export default async function TrackingScripts() {
  let tr: TrackingConfig = {};
  try {
    tr = parseContent(await getSetting(CONTENT_KEY)).tracking ?? {};
  } catch {
    tr = {};
  }
  const { metaPixelId, ga4Id, googleAdsId, tiktokPixelId, gtmId } = tr;
  if (!metaPixelId && !ga4Id && !googleAdsId && !tiktokPixelId && !gtmId) return null;

  const gtagId = ga4Id || googleAdsId;

  return (
    <>
      {/* Google Tag Manager */}
      {gtmId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
      )}

      {/* Google Analytics 4 / Google Ads (gtag) */}
      {gtagId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${ga4Id ? `gtag('config','${ga4Id}');` : ""}${googleAdsId ? `gtag('config','${googleAdsId}');` : ""}`,
            }}
          />
        </>
      )}

      {/* Meta (Facebook) Pixel */}
      {metaPixelId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`,
          }}
        />
      )}

      {/* TikTok Pixel */}
      {tiktokPixelId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${tiktokPixelId}');ttq.page()}(window,document,'ttq');`,
          }}
        />
      )}
    </>
  );
}
