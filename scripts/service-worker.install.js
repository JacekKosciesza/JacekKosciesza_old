if ('serviceWorker' in navigator) {
    window.addEventListener('load', _ => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('Service Worker registration successful with scope: ', registration.scope);
        }).catch(err => {
            console.log('Service Worker registration failed: ', err);
        });
    });
}