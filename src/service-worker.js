'use strict'

const NAME = 'JacekKosciesza';
const VERSION = '0.1';
const CACHE_NAME = `${NAME}-v${VERSION}`;

var ASSETS = [
    '/',
    '/styles/all.css'
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

// https://www.youtube.com/watch?v=X8EQSy-ajo4&index=21&list=PLNYkxOF6rcIBTs2KPy1E6tIYaWoFcG3uj
function staleWhileRevalidate(evt) {
    const fetchedVersion = fetch(evt.request);
    const fetchedCopy = fetchedVersion.then(response => response.clone());
    const cachedVersion = caches.match(evt.request);

    evt.respondWith(async function () {
        try {
            const response = await Promise.race([
                fetchedVersion.catch(_ => cachedVersion),
                cachedVersion
            ]);
            if (!response) {
                return await fetchedVersion;
            }
            return response;
        } catch (_) {
            return new Response(null, {
                status: 404
            });
        }
    }());

    evt.waitUntil(async function () {
        try {
            const response = await fetchedCopy;
            const cache = await caches.open(CACHE_NAME);

            return cache.put(event.request, response);
        } catch(_) {
            // eat errors
        }
    }());
}