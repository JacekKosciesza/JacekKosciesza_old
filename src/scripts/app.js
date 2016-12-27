class App {
    constructor() {
        this.printVersion();
        this.registerServiceWorker();
        this.addEventListeners();
        this.updateOfflineStatus();

        this.navigation = new Navigation();
        this.resources = new Resources();
        this.resources.display();
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
                console.info('Service Worker registration successful with scope: ', registration.scope);
            } catch (ex) {
                console.error('Service Worker registration failed: ', ex);
            }
        }
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