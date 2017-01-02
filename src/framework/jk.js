'use strict';

let JK = (function() {
    let jk = {};

    jk.Element = class extends HTMLElement {
        constructor() {
            super();
            console.log('JK Element constructor');
        }
    }

    return jk;
})();