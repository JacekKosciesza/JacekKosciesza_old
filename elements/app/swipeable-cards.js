'use strict';

/* eslint-env es6 */

class Cards {
    constructor(_root) {
        this._root = _root;
        this.cards = _root.querySelectorAll('.card');

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.update = this.update.bind(this);

        this.target = null;
        this.startX = 0;
        this.currentX = 0;

        this.addEventListeners();

        requestAnimationFrame(this.update);
    }

    addEventListeners() {
        this._root.addEventListener('touchstart', this.onTouchStart);
        document.addEventListener('touchmove', this.onTouchMove);
        this._root.addEventListener('touchend', this.onTouchEnd);
    }

    removeEventListeners() {
        this._root.removeEventListener('touchstart', this.onTouchStart);
        document.removeEventListener('touchmove', this.onTouchMove);
        this._root.removeEventListener('touchend', this.onTouchEnd);
    }

    onTouchStart(evt) {
        if (!evt.target.classList.contains('card')) {
            return;
        }

        this.target = evt.target;
        this.startX = evt.pageX || evt.touches[0].pageX;
        this.currentX = this.startX;

        this.target.style.willChange = 'transform';

        //evt.preventDefault();
    }

    onTouchMove(evt) {
        if (!this.target) {
            return;
        }
        this.currentX = evt.pageX || evt.touches[0].pageX;
    }

    onTouchEnd(evt) {
        if (!this.target) {
            return;
        }
    }

    update(evt) {
        requestAnimationFrame(this.update);
        
        if (!this.target) {
            return;
        }

        const screenX = this.currentX - this.startX;
        this.target.style.transform = `translateX(${screenX}px)`;

    }
}
