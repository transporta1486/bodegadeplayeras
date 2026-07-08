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
                const color = card.getAttribute('data-color');
                const price = card.getAttribute('data-price');
                let show = false;

                if (filter === 'all') show = true;
                else if (filter === 'blanco' || filter === 'negro') show = color === filter;
                else if (filter === '199' || filter === '299') show = price === filter;

                card.classList.toggle('is-hidden', !show);
            });
        });
    });

    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', function () {
            mainNav.classList.toggle('is-open');
        });
    }
})();
