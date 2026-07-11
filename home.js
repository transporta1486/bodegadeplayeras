/**
 * Home — filtros de catálogo y menú móvil
 */
(function () {
    'use strict';

    const chips = document.querySelectorAll('.chip');
    const cards = document.querySelectorAll('.shop-card');
    const menuBtn = document.getElementById('menuBtn');
    const mainNav = document.getElementById('mainNav');

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            const filter = chip.getAttribute('data-filter');

            chips.forEach(function (c) { c.classList.remove('is-active'); });
            chip.classList.add('is-active');

            cards.forEach(function (card) {
                const variant = card.getAttribute('data-variant');
                const price = card.getAttribute('data-price');
                let show = false;

                if (filter === 'all') show = true;
                else if (filter === 'oversize') show = variant === 'oversize';
                else show = price === filter;

                card.classList.toggle('is-hidden', !show);
            });
        });
    });

    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', function () {
            mainNav.classList.toggle('is-open');
        });
    }

    // Cuenta regresiva de oferta — ciclo de 24 h por visitante
    const cdHours = document.getElementById('cdHours');
    const cdMins = document.getElementById('cdMins');
    const cdSecs = document.getElementById('cdSecs');

    if (cdHours && cdMins && cdSecs) {
        const KEY = 'ofertaDeadline';
        const CYCLE = 24 * 60 * 60 * 1000;

        function getDeadline() {
            let deadline = parseInt(localStorage.getItem(KEY), 10);
            if (!deadline || isNaN(deadline) || deadline <= Date.now()) {
                deadline = Date.now() + CYCLE;
                localStorage.setItem(KEY, String(deadline));
            }
            return deadline;
        }

        function pad(n) { return n < 10 ? '0' + n : String(n); }

        function tick() {
            let diff = getDeadline() - Date.now();
            if (diff < 0) diff = 0;

            const totalSecs = Math.floor(diff / 1000);
            cdHours.textContent = pad(Math.floor(totalSecs / 3600));
            cdMins.textContent = pad(Math.floor((totalSecs % 3600) / 60));
            cdSecs.textContent = pad(totalSecs % 60);
        }

        tick();
        setInterval(tick, 1000);
    }
})();
