'use strict'

const NAME = 'JacekKosciesza';
const VERSION = '0.1';
const CACHE_NAME = `${NAME}-v${VERSION}`;

var urlsToCache = [
    '/',
    '/styles/all.css'
];

self.oninstall = evt => {
    evt.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            //console.debug('SW (install): Opened cache, adding all URLs to cache');
            return cache.addAll(urlsToCache);
        })
    );

    self.skipWaiting();
}

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

    self.clients.claim();
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