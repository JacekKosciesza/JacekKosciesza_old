class App {
    constructor() {
        this.printVersion();
        this.registerServiceWorker();
        this.addEventListeners();
        this.updateOfflineStatus();

        this.router = new Router([
            ['blog', new Blog()],
            ['notes', new Notes()],
            ['resources', new Resources()],
            ['contact', new Contact()]
        ]);
        this.navigation = new Navigation();
    }

    printVersion() {
        const html = document.querySelector('html');
        const version = html.getAttribute('version');
        console.info(`Jacek Kościesza v${version}`);
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                let registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });
                console.info('sw: service worker registration successful with scope: ', registration.scope);

                if (!navigator.serviceWorker.controller) {
                    console.info(`sw: page wasn't loaded via a service worker, so they're looking at the latest version`);
                    return;
                }

                if (registration.waiting) {
                    console.info(`sw: there's an updated worker already waiting`);
                    console.log(`TODO: Toast: new version of this website is available. Refresh or Cancel`);
                    // TODO: Toast
                    return;
                }

                if (registration.installing) {
                    console.info(`sw: there's an updated worker installing, tracking it...`);
                    this.trackServiceWorkerInstalling(registration.installing);
                    return;

                }

                console.log('sw: listen for new installing workers arriving');
                registration.addEventListener('updatefound', _ => {
                    console.log('sw: new installing workers arrived, tracking it...');
                    this.trackServiceWorkerInstalling(registration.installing);
                });
            } catch (ex) {
                console.error('sw: service worker registration failed: ', ex);
            }
        }
    }

    trackServiceWorkerInstalling(worker) {
        worker.addEventListener('statechange', _ => {
            if (worker.state === 'installed') {
                console.log(`TODO: Toast: new version of this website is available. Refresh or Cancel`);
                // TODO: Toast
            }
        });
    }

    addEventListeners() {
        // Offline
        this.updateOfflineStatus = this.updateOfflineStatus.bind(this);
        window.addEventListener('online', this.updateOfflineStatus);
        window.addEventListener('offline', this.updateOfflineStatus);
    }

    updateOfflineStatus() {
        const html = document.querySelector('html');

        if (navigator.onLine) {
            html.removeAttribute('offline');
        } else {
            html.setAttribute('offline', '');
        }
    }

    removeEventListeners() {
        // Offline
        window.removeEventListener('online', this.updateOfflineStatus);
        window.removeEventListener('offline', this.updateOfflineStatus);
    }
}

window.addEventListener('load', _ => {
    const app = new App();
});