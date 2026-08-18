/* Service worker — mode hors-ligne du Cabinet de collection.
   Trois stratégies selon la nature de la ressource. */

const VERSION = "wikimaster-v3";
const IMAGES  = "wikimaster-images-v1";

/* Les fichiers du site lui-même, mis en cache dès l'installation. */
const COQUILLE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

/* Domaines dont les images sont conservées durablement :
   drapeaux (flagcdn), vignettes Wikipédia (upload.wikimedia), polices Google. */
const DISTANTS = /^(flagcdn\.com|upload\.wikimedia\.org|fonts\.gstatic\.com|fonts\.googleapis\.com)$/;

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(COQUILLE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(
        noms.filter(n => n !== VERSION && n !== IMAGES).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  /* 1. Images et polices distantes : cache d'abord, réseau si absent. */
  if (DISTANTS.test(url.hostname)) {
    e.respondWith((async () => {
      const cache = await caches.open(IMAGES);
      const garde = await cache.match(req);
      if (garde) return garde;
      try {
        const rep = await fetch(req);
        if (rep.ok || rep.type === "opaque") cache.put(req, rep.clone());
        return rep;
      } catch (err) {
        return garde || Response.error();
      }
    })());
    return;
  }

  /* 2. API Wikipédia et Supabase : toujours le réseau, jamais de cache.
        La page gère elle-même sa mémoire des vignettes, et une collection
        servie depuis un cache serait une collection périmée. */
  if (url.hostname === "fr.wikipedia.org") return;
  if (/\.supabase\.(co|in)$/.test(url.hostname)) return;

  /* 3. config.js : réseau d'abord, cache en secours. Ainsi une modification
        des clés de partage prend effet sans attendre un changement de VERSION. */
  if (url.origin === location.origin && url.pathname.endsWith("/config.js")) {
    e.respondWith((async () => {
      try {
        const rep = await fetch(req, { cache: "no-store" });
        if (rep.ok) (await caches.open(VERSION)).put(req, rep.clone());
        return rep;
      } catch (err) {
        return (await caches.match(req)) || Response.error();
      }
    })());
    return;
  }

  /* 4. Le site : cache d'abord, réseau en secours, index.html en dernier recours. */
  e.respondWith((async () => {
    const garde = await caches.match(req);
    if (garde) return garde;
    try {
      const rep = await fetch(req);
      if (rep.ok && url.origin === location.origin) {
        const cache = await caches.open(VERSION);
        cache.put(req, rep.clone());
      }
      return rep;
    } catch (err) {
      return (await caches.match("./index.html")) || Response.error();
    }
  })());
});
