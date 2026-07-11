/**
 * Bodega de Playeras — Compra por WhatsApp (unisex oversize, talla única)
 * Número destino: 525569732164
 */

(function () {
    'use strict';

    const WHATSAPP_NUMBER = '525569732164';
    const FIT_LABEL = 'Unisex Oversize — Talla única';

    const btnBuy = document.getElementById('btnBuy');

    function getProductName() {
        const titleEl = document.querySelector('.product-info__title');
        return titleEl ? titleEl.textContent.trim() : 'Producto';
    }

    function getProductPrice() {
        const priceEl = document.querySelector('.product-info__price');
        if (!priceEl) return '$170 MXN';

        const dataPrice = priceEl.getAttribute('data-price');
        if (dataPrice) return '$' + dataPrice + ' MXN';

        return priceEl.textContent.replace(/\s+/g, ' ').trim();
    }

    function buildWhatsAppMessage(productName, price) {
        return (
            '¡Hola! Me interesa comprar este producto en tu tienda: ' +
            productName +
            ' (' + FIT_LABEL + '). El precio es de ' +
            price +
            '. ¿Me podrías proporcionar los datos para realizar el pago por transferencia bancaria?'
        );
    }

    if (btnBuy) {
        btnBuy.addEventListener('click', function () {
            const productName = getProductName();
            const price = getProductPrice();
            const message = buildWhatsAppMessage(productName, price);
            const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

            window.open(url, '_blank', 'noopener,noreferrer');
        });
    }
})();
