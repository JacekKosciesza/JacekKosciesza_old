if ('serviceWorker' in navigator) {
    window.addEventListener('load', _ => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.info('Service Worker registration successful with scope: ', registration.scope);
        }).catch(err => {
            console.info('Service Worker registration failed: ', err);
        });
    });
}