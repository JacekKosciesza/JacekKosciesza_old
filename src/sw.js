'use strict';

const NAME = 'JacekKosciesza';
const VERSION = '{{VERSION}}';
const CACHE_NAME = `${NAME}-v${VERSION}`;

var ASSETS = [
    '/',
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
    '/images/icons/red-tie-icon-192x192.png',
    '/images/icons/red-tie-icon-512x512.png'
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