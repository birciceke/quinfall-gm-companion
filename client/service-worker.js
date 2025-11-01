// A minimal service worker is required for the app to be considered installable.
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
});

self.addEventListener('fetch', (event) => {
  // A basic fetch handler is required for the 'beforeinstallprompt' event to fire.
  event.respondWith(fetch(event.request));
});
