// Service Worker für Event Timer PWA
const CACHE_NAME = 'event-timer-v1.0.0';
const urlsToCache = [
  '/event-timer/',
  '/event-timer/index.html',
  '/event-timer/manifest.json',
  '/event-timer/tailwind.css',
  '/event-timer/icons/icon-16x16.svg',
  '/event-timer/icons/icon-32x32.svg',
  '/event-timer/icons/icon-192x192.png',
  '/event-timer/data/events.json',
  '/event-timer/data/settings.json'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
