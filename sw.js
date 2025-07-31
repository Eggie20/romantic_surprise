// Service Worker for Romantic Surprise App
// Enables offline functionality

const CACHE_NAME = 'romantic-surprise-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/script.js',
    '/assets/music/intro.mp3',
    '/assets/music/slideshow.mp3',
    '/assets/music/love_book.mp3',
    '/assets/images/memory1.jpg',
    '/assets/images/memory2.jpg',
    '/assets/images/memory3.jpg',
    '/assets/images/memory4.jpg',
    '/assets/images/memory5.jpg',
    '/assets/images/memory6.jpg',
    '/assets/images/memory7.jpg',
    '/assets/images/memory8.jpg',
    '/assets/images/memory9.jpg',
    '/assets/images/memory10.jpg'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.log('Cache install failed:', err);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
            .catch(() => {
                // Fallback for offline scenarios
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});