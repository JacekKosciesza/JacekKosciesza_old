'use strict';

const NAME = 'JacekKosciesza';
const VERSION = '{{VERSION}}';
const CACHE_NAME = `${NAME}-v${VERSION}`;
const DATA_CACHE_NAME = `${NAME}-Data-v${VERSION}`;
const DATA_URL = 'https://jacekkosciesza-659f4.firebaseio.com';

var ASSETS = [
    '/',
    '/?homescreen=true',
    '/views/blog.html',
    '/views/resources.html',
    '/views/contact.html',
    '/favicon.ico',
    '/scripts/view.js',
    '/scripts/blog.js',
    '/scripts/notes.js',
    '/scripts/resources.js',
    '/scripts/contact.js',
    '/scripts/router.js',
    '/scripts/navigation.js',
    '/scripts/app.js',
    '/styles/blog.css',
    '/styles/notes.css',
    '/styles/contact.css',
    '/images/icons/jacek-kosciesza-48x48.jpg',
    '/images/icons/jacek-kosciesza-60x60.jpg',
    '/images/icons/jacek-kosciesza-76x76.jpg',
    '/images/icons/jacek-kosciesza-96x96.jpg',
    '/images/icons/jacek-kosciesza-120x120.jpg',
    '/images/icons/jacek-kosciesza-128x128.jpg',
    '/images/icons/jacek-kosciesza-144x144.jpg',
    '/images/icons/jacek-kosciesza-152x152.jpg',
    '/images/icons/jacek-kosciesza-167x167.jpg',
    '/images/icons/jacek-kosciesza-180x180.jpg',
    '/images/icons/jacek-kosciesza-192x192.jpg',
    '/images/icons/jacek-kosciesza-256x256.jpg',
    '/images/icons/jacek-kosciesza-384x384.jpg',
    '/images/icons/jacek-kosciesza-512x512.jpg'
];

self.oninstall = evt => evt.waitUntil(async function () {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);

    return self.skipWaiting();
}());

self.onactivate = evt => {
    evt.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName.indexOf(NAME) === -1) {
                        //console.debug(`SW (activate): found cache '${cacheName}', but it's not matching our cache name '${NAME}'`);
                        return null;
                    }

                    if (cacheName !== CACHE_NAME) {
                        //console.debug(`SW (activate): found old cache '${cacheName}' - deleting`);
                        return caches.delete(cacheName);
                    }

                    return null;
                })
            );
        })
    );

    self.clients.claim(); // take care of all opened tabs
}

self.onfetch = evt => {
    if (evt.request.url.startsWith(DATA_URL)) {
        evt.respondWith(
            fetch(evt.request).then(function (response) {
                return caches.open(DATA_CACHE_NAME).then(function (cache) {
                    cache.put(evt.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        evt.respondWith(
            caches.match(evt.request)
            .then(response => {
                if (response) {
                    //console.debug(`SW (fetch): Cache hit '${evt.request.url}`);
                    return response;
                }

                //console.debug(`SW (fetch): Cache miss '${evt.request.url}`);
                return fetch(evt.request);
            })
        );
    }
}