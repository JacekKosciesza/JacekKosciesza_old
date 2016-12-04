class SideNav {
    constructor(_root) {
        this.showHamburgerMenuButton = _root.querySelector('.show-hamburger-menu');
        this.hideHamburgerMenuButton = _root.querySelector('.hide-hamburger-menu');
        this.sideNavEl = _root.querySelector('.side-nav');
        this.sideNavContainer = _root.querySelector('.side-nav__container');

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

        document.addEventListener('touchstart', this.onTouchStart);
        document.addEventListener('touchmove', this.onTouchMove);
        document.addEventListener('touchend', this.onTouchEnd);
    }

    onTransitionEnd (event) {
        this.sideNavEl.classList.remove('side-nav--animatable');
        this.sideNavEl.removeEventListener('transitionend', this.onTransitionEnd);
    }

    showSideNav() {
        this.sideNavEl.classList.add('side-nav--animatable');
        this.sideNavEl.classList.add('side-nav--visible');
        this.sideNavEl.addEventListener('transitionend', this.onTransitionEnd);
    }

    hideSideNav() {
        this.sideNavEl.classList.add('side-nav--animatable');
        this.sideNavEl.classList.remove('side-nav--visible');
        this.sideNavEl.addEventListener('transitionend', this.onTransitionEnd);
    }

    blockClicks(event) {
        event.stopPropagation();
    }

    onTouchStart(event) {
        if (!this.sideNavEl.classList.contains('side-nav--visible')) {
            return;
        }

        this.startX = event.touches[0].pageX;
        this.currentX = this.startX;
    }

    onTouchMove(event) {
        this.currentX = event.touches[0].pageX;
        const translateX = Math.min(0, this.currentX - this.startX);

        // if (translateX < 0) {
        //     event.preventDefault();
        // }

        this.sideNavContainer.style.transform = `translateX(${translateX}px)`;
    }

    onTouchEnd(event) {
        const translateX = Math.min(0, this.currentX - this.startX);
        if (translateX < 0) {
            this.sideNavContainer.style.transform = '';
            this.hideSideNav();
        }
    }
}