'use strict'

self.oninstall = _ => {
    self.skipWaiting();
}

self.onactivate = _ => {
    self.clients.claim();
}

self.onfetch = evt => {
    evt.respondWith(fetch(evt.request)); // passthrough
}