/**
 * Bodega de Playeras — Página de producto dinámica
 * Muestra cada producto (playera o tenis) en detalle, con foto más cercana
 * y compra directa por WhatsApp (solo transferencia).
 */
(function () {
    'use strict';

    const WHATSAPP_NUMBER = '525569732164';
    const IMG = 'img/WhatsApp%20Image%202026-07-10%20at%203.26.';

    const CATALOG = {
        'bugs-bunny': {
            cat: 'playera',
            name: 'Bugs Bunny Warner Bros — Oversize',
            img: 'playera-producto.png',
            pos: 'center 22%',
            rating: '4.9', reviews: 42
        },
        'oso-barrow': {
            cat: 'playera',
            name: 'Oso Barrow Buttons — Oversize',
            img: IMG + '46%20PM%20(3).jpeg',
            pos: 'center 32%',
            rating: '4.9', reviews: 37
        },
        'bugs-kingness': {
            cat: 'playera',
            name: 'Bugs Bunny King-ness — Oversize',
            img: IMG + '47%20PM%20(3).jpeg',
            pos: 'center 40%',
            rating: '5.0', reviews: 28
        },
        'tom-jerry': {
            cat: 'playera',
            name: 'Tom y Jerry Arrows — Oversize',
            img: IMG + '47%20PM%20(6).jpeg',
            pos: 'center 42%',
            rating: '4.8', reviews: 31
        },
        'anti-social-mario': {
            cat: 'playera',
            name: 'Anti Social — Mario — Oversize',
            img: IMG + '46%20PM%20(12).jpeg',
            pos: 'center 44%',
            rating: '4.9', reviews: 45
        },
        'angel-cupido': {
            cat: 'playera',
            name: 'Ángel Cupido — Oversize',
            img: IMG + '47%20PM%20(7).jpeg',
            pos: 'center 40%',
            rating: '4.7', reviews: 22
        },
        'angel-blue': {
            cat: 'playera',
            name: 'Ángel Blue — Oversize',
            img: IMG + '47%20PM%20(9).jpeg',
            pos: 'center 42%',
            rating: '4.8', reviews: 19
        },
        'kaws-black': {
            cat: 'playera',
            name: 'Kaws Black — Oversize',
            img: IMG + '47%20PM%20(11).jpeg',
            pos: 'center 42%',
            rating: '4.9', reviews: 33
        },
        'arrows-street': {
            cat: 'playera',
            name: 'Arrows Street — Oversize',
            img: IMG + '47%20PM%20(2).jpeg',
            pos: 'center 44%',
            rating: '4.7', reviews: 18
        },
        'oso-mini': {
            cat: 'playera',
            name: 'Oso Mini Bear — Oversize',
            img: IMG + '47%20PM%20(5).jpeg',
            pos: 'center 42%',
            rating: '4.8', reviews: 24
        },
        'tenis-blanco-rosa-velcro': {
            cat: 'tenis',
            name: 'Tenis Blanco Rosa — Velcro',
            img: IMG + '46%20PM%20(1).jpeg',
            pos: 'center 40%',
            rating: '4.9', reviews: 26
        },
        'tenis-blanco-rosa-perforado': {
            cat: 'tenis',
            name: 'Tenis Blanco Rosa — Perforado',
            img: IMG + '47%20PM.jpeg',
            pos: 'center 45%',
            rating: '4.8', reviews: 21
        },
        'tenis-blanco-casual': {
            cat: 'tenis',
            name: 'Tenis Blanco — Casual',
            img: IMG + '46%20PM%20(6).jpeg',
            pos: 'center 45%',
            rating: '4.7', reviews: 17
        },
        'tenis-negro-velcro': {
            cat: 'tenis',
            name: 'Tenis Negro — Velcro',
            img: IMG + '46%20PM%20(13).jpeg',
            pos: 'center 48%',
            rating: '4.8', reviews: 20
        },
        'tenis-rosa-cordon': {
            cat: 'tenis',
            name: 'Tenis Rosa — Cordón',
            img: IMG + '47%20PM%20(10).jpeg',
            pos: 'center 52%',
            rating: '4.7', reviews: 15
        },
        'tenis-rosa-estrella': {
            cat: 'tenis',
            name: 'Tenis Rosa — Estrella',
            img: IMG + '46%20PM%20(7).jpeg',
            pos: 'center 52%',
            zoom: true,
            rating: '4.9', reviews: 19
        }
    };

    const PRICE = 170;

    function getSlug() {
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('p');
        return CATALOG[slug] ? slug : 'bugs-bunny';
    }

    function starsMarkup(rating) {
        const full = Math.floor(rating);
        const half = rating - full >= 0.5;
        let html = '';
        let count = 0;
        for (let i = 0; i < full; i++) { html += '<span class="stars__icon">★</span>'; count++; }
        if (half && count < 5) { html += '<span class="stars__icon stars__icon--half">★</span>'; count++; }
        while (count < 5) { html += '<span class="stars__icon" style="color:var(--line)">★</span>'; count++; }
        return html;
    }

    function buildMessage(product) {
        if (product.cat === 'tenis') {
            return '¡Hola! Me interesan los Tenis ' + product.name +
                ' para niño. ¿Tienen mi talla (12 a 16)? Precio de oferta $' + PRICE +
                ' MXN. ¿Me pasas los datos para pagar por transferencia?';
        }
        return '¡Hola! Me interesa la Playera ' + product.name +
            ' (unisex oversize, talla única). Precio de oferta $' + PRICE +
            ' MXN. ¿Me pasas los datos para pagar por transferencia?';
    }

    function render() {
        const slug = getSlug();
        const product = CATALOG[slug];
        const isTenis = product.cat === 'tenis';

        document.title = product.name + ' | Bodega de Playeras';

        const img = document.getElementById('pdpImg');
        img.src = product.img;
        img.alt = product.name;
        img.style.objectPosition = product.pos;
        if (product.zoom) img.classList.add('pdp-img--zoom');

        document.getElementById('pdpTitle').textContent = product.name;

        document.getElementById('pdpPriceOld').textContent = (isTenis ? '$349' : '$299') + ' MXN';

        document.getElementById('pdpStars').innerHTML = starsMarkup(parseFloat(product.rating));
        document.getElementById('pdpScore').textContent = product.rating;
        document.getElementById('pdpReviews').textContent = '(' + product.reviews + ' reseñas)';

        const tagsEl = document.getElementById('pdpTags');
        const tags = isTenis
            ? ['Niños', 'Tallas 12–16', 'Antiderrapante']
            : ['Unisex', 'Oversize', 'Talla única'];
        tagsEl.innerHTML = tags.map(function (t) {
            return '<span class="fit-badge__tag">' + t + '</span>';
        }).join('');

        document.getElementById('pdpDesc').innerHTML = isTenis
            ? 'Tenis para niño <strong>' + product.name + '</strong>. Suela antiderrapante y cierre práctico para el día a día. Disponibles en <strong>tallas 12 a 16</strong>. Indícanos tu talla por WhatsApp.'
            : 'Playera <strong>unisex oversize</strong> con estampado ' + product.name.replace(' — Oversize', '') + '. Talla única con calce holgado para todos. Tela 200g premium, mangas amplias y caída streetwear.';

        document.getElementById('pdpNote').textContent = isTenis
            ? 'Tallas de niño 12 a 16 — confirma tu talla por WhatsApp.'
            : 'Sin selección de talla — una sola medida oversize que adapta a la mayoría.';

        const btnBuy = document.getElementById('btnBuy');
        btnBuy.addEventListener('click', function () {
            const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(buildMessage(product));
            window.open(url, '_blank', 'noopener,noreferrer');
        });

        // Acercar la foto al tocar / hacer clic (útil en celular)
        const main = document.getElementById('pdpMain');
        main.addEventListener('click', function () {
            main.classList.toggle('is-zoomed');
        });
    }

    document.addEventListener('DOMContentLoaded', render);
})();
