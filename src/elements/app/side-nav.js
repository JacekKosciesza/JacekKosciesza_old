class SideNav {
    constructor(jacekKosciesza) {
        this.jacekKosciesza = jacekKosciesza;
        this.showHamburgerMenuButton = jacekKosciesza.shadowRoot.querySelector('.show-hamburger-menu');
        this.hideHamburgerMenuButton = jacekKosciesza.shadowRoot.querySelector('.hide-hamburger-menu');
        this.sideNavEl = jacekKosciesza.shadowRoot.querySelector('.side-nav');
        this.sideNavContainer = jacekKosciesza.shadowRoot.querySelector('.side-nav__container');

        this.showSideNav = this.showSideNav.bind(this);
        this.hideSideNav = this.hideSideNav.bind(this);
        this.blockClicks = this.blockClicks.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTransitionEnd = this.onTransitionEnd.bind(this);

        this.startX = 0;
        this.currentX = 0;
        
        this.addEventListeners();
    }

     addEventListeners() {
        this.showHamburgerMenuButton.addEventListener('click', this.showSideNav);
        this.hideHamburgerMenuButton.addEventListener('click', this.hideSideNav);
        this.sideNavEl.addEventListener('click', this.hideSideNav);
        this.sideNavContainer.addEventListener('click', this.blockClicks);

        // document.addEventListener('touchstart', this.onTouchStart);
        // document.addEventListener('touchmove', this.onTouchMove);
        // document.addEventListener('touchend', this.onTouchEnd);
    }

    removeEventListeners() {
        this.showHamburgerMenuButton.removeEventListener('click', this.showSideNav);
        this.hideHamburgerMenuButton.removeEventListener('click', this.hideSideNav);
        this.sideNavEl.removeEventListener('click', this.hideSideNav);
        this.sideNavContainer.removeEventListener('click', this.blockClicks);

        document.removeEventListener('touchstart', this.onTouchStart);
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
    }

    onTransitionEnd (evt) {
        this.sideNavEl.classList.remove('side-nav--animatable');
        this.sideNavEl.removeEventListener('transitionend', this.onTransitionEnd);
    }

    showSideNav() {
        this.sideNavEl.classList.add('side-nav--animatable');
        this.sideNavEl.classList.add('side-nav--visible');
        this.sideNavEl.addEventListener('transitionend', this.onTransitionEnd);

        // Store the event for later.
        const action =
        {
            category: 'nav',
            action: 'click',
            label: 'nav',
            value: 'open'
        };
        this.jacekKosciesza.dispatchEvent(new CustomEvent('new-action', { detail:  action}));
    }

    hideSideNav() {
        this.sideNavEl.classList.add('side-nav--animatable');
        this.sideNavEl.classList.remove('side-nav--visible');
        this.sideNavEl.addEventListener('transitionend', this.onTransitionEnd);

        // Store the event for later.
        const action =
        {
            category: 'nav',
            action: 'click',
            label: 'nav',
            value: 'close'
        };
        this.jacekKosciesza.dispatchEvent(new CustomEvent('new-action', { detail:  action}));
    }

    blockClicks(evt) {
        evt.stopPropagation();
    }

    onTouchStart(evt) {
        if (!this.sideNavEl.classList.contains('side-nav--visible')) {
            return;
        }

        this.startX = evt.touches[0].pageX;
        this.currentX = this.startX;
    }

    onTouchMove(evt) {
        this.currentX = evt.touches[0].pageX;
        const translateX = Math.min(0, this.currentX - this.startX);

        // if (translateX < 0) {
        //     evt.prevtDefault();
        // }

        this.sideNavContainer.style.transform = `translateX(${translateX}px)`;
    }

    onTouchEnd(evt) {
        const translateX = Math.min(0, this.currentX - this.startX);
        if (translateX < 0) {
            this.sideNavContainer.style.transform = '';
            this.hideSideNav();
        }
    }
}