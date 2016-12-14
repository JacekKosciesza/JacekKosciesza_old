(_ => {
    const supportsCustomElementsV1 = 'customElements' in window;
    const supportsShadowDOMV1 = !!HTMLElement.prototype.attachShadow;

    if (!supportsCustomElementsV1 || !supportsShadowDOMV1) {
        loadScript('/bower_components/webcomponentsjs/webcomponents-lite.js').then(_ => {
            console.info('Web components v1 polyfill')
        });
    } else {
        console.info('Web components v1 native')
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.async = true;
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
});