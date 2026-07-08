/**
 * Bodega de Playeras — Lógica de producto + WhatsApp
 * Número destino obligatorio: 525569732164
 */

(function () {
    'use strict';

    const WHATSAPP_NUMBER = '525569732164';

    // —— Referencias DOM ——
    const mainImage = document.getElementById('mainImage');
    const galleryMain = document.getElementById('galleryMain');
    const thumbs = document.querySelectorAll('.gallery__thumb');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const btnBuy = document.getElementById('btnBuy');
    const alertModal = document.getElementById('alertModal');
    const alertBackdrop = document.getElementById('alertBackdrop');
    const alertClose = document.getElementById('alertClose');

    const galleryCounter = document.getElementById('galleryCounter');

    let selectedSize = null;

    function setGalleryImage(thumb) {
        const newSrc = thumb.getAttribute('data-src');
        const index = thumb.getAttribute('data-index');
        if (!newSrc || !mainImage) return;

        mainImage.classList.add('is-fading');
        setTimeout(function () {
            mainImage.src = newSrc;
            mainImage.style.transform = 'scale(1)';
            mainImage.style.transformOrigin = 'center center';
            mainImage.classList.remove('is-fading');
        }, 180);

        thumbs.forEach(function (t) {
            t.classList.remove('is-active');
            t.setAttribute('aria-selected', 'false');
        });
        thumb.classList.add('is-active');
        thumb.setAttribute('aria-selected', 'true');

        if (galleryCounter && index !== null) {
            galleryCounter.textContent = (parseInt(index, 10) + 1) + ' / ' + thumbs.length;
        }
    }

    // ═══════════════════════════════════════════
    // Galería: cambio de imagen con miniaturas
    // ═══════════════════════════════════════════
    thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            setGalleryImage(thumb);
        });
    });

    // Abrir vista según ?v=2 en la URL
    const urlV = new URLSearchParams(window.location.search).get('v');
    if (urlV === '2' && thumbs[1]) {
        setGalleryImage(thumbs[1]);
    }

    // ═══════════════════════════════════════════
    // Zoom premium que sigue el cursor (escritorio)
    // ═══════════════════════════════════════════
    if (galleryMain && mainImage && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        galleryMain.addEventListener('mousemove', function (e) {
            const rect = galleryMain.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            mainImage.style.transformOrigin = x + '% ' + y + '%';
            mainImage.style.transform = 'scale(2)';
        });

        galleryMain.addEventListener('mouseleave', function () {
            mainImage.style.transform = 'scale(1)';
            mainImage.style.transformOrigin = 'center center';
        });
    }

    // ═══════════════════════════════════════════
    // Selector de tallas
    // ═══════════════════════════════════════════
    sizeButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            sizeButtons.forEach(function (b) {
                b.classList.remove('is-selected');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('is-selected');
            btn.setAttribute('aria-pressed', 'true');
            selectedSize = btn.getAttribute('data-size');
        });
    });

    // ═══════════════════════════════════════════
    // Modal de validación
    // ═══════════════════════════════════════════
    function showAlert() {
        alertModal.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
    }

    function hideAlert() {
        alertModal.setAttribute('hidden', '');
        document.body.style.overflow = '';
    }

    if (alertClose) alertClose.addEventListener('click', hideAlert);
    if (alertBackdrop) alertBackdrop.addEventListener('click', hideAlert);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !alertModal.hasAttribute('hidden')) {
            hideAlert();
        }
    });

    // ═══════════════════════════════════════════
    // Compra por WhatsApp
    // Lee en tiempo real: h1, precio y talla
    // ═══════════════════════════════════════════
    function getProductName() {
        const titleEl = document.querySelector('.product-info__title');
        return titleEl ? titleEl.textContent.trim() : 'Producto';
    }

    function getProductPrice() {
        const priceEl = document.querySelector('.product-info__price');
        if (!priceEl) return '$199 MXN';

        const dataPrice = priceEl.getAttribute('data-price');
        if (dataPrice) return '$' + dataPrice + ' MXN';

        return priceEl.textContent.replace(/\s+/g, ' ').trim();
    }

    function buildWhatsAppMessage(productName, size, price) {
        return (
            '¡Hola! Me interesa comprar este producto en tu tienda: ' +
            productName +
            ' en Talla: ' +
            size +
            '. El precio es de ' +
            price +
            '. ¿Me podrías proporcionar los datos para realizar el pago por transferencia o depósito en Oxxo?'
        );
    }

    if (btnBuy) {
        btnBuy.addEventListener('click', function () {
            if (!selectedSize) {
                showAlert();
                return;
            }

            const productName = getProductName();
            const price = getProductPrice();
            const message = buildWhatsAppMessage(productName, selectedSize, price);
            const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

            window.open(url, '_blank', 'noopener,noreferrer');
        });
    }
})();
