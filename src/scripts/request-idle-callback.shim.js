// https://developers.google.com/web/updates/2015/08/using-requestidlecallback

(_ => {
    const supportsrequestIdleCallback = !!window.requestIdleCallback;

    if (!supportsrequestIdleCallback) {
        window.requestIdleCallback = (cb) => {
            var start = Date.now();
            return setTimeout(function () {
                cb({
                    didTimeout: false,
                    timeRemaining: function () {
                        return Math.max(0, 50 - (Date.now() - start));
                    }
                });
            }, 1);
        };
        window.cancelIdleCallback = (id) => clearTimeout(id);
        console.info('requestIdleCallback shim');
    } else {
        console.info('requestIdleCallback native');
    }
})();