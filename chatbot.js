/**
 * Bodega de Playeras — Chatbot de ventas
 * Estado simple: saluda, detecta intención (playeras / tenis / precio / envío…)
 * y ofrece un botón de compra directa por WhatsApp.
 */
(function () {
    'use strict';

    const WA = '525569732164';

    const chatbot = document.getElementById('chatbot');
    const toggle = document.getElementById('chatbotToggle');
    const win = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('chatbotClose');
    const body = document.getElementById('chatbotBody');
    const form = document.getElementById('chatbotForm');
    const input = document.getElementById('chatbotInput');
    const quick = document.getElementById('chatbotQuick');

    if (!chatbot || !toggle || !win) return;

    let greeted = false;

    function scrollBottom() { body.scrollTop = body.scrollHeight; }

    function addMessage(content, sender, isHTML) {
        const msg = document.createElement('div');
        msg.className = 'chatbot__msg chatbot__msg--' + sender;
        const bubble = document.createElement('div');
        bubble.className = 'chatbot__bubble';
        if (isHTML) { bubble.innerHTML = content; } else { bubble.textContent = content; }
        msg.appendChild(bubble);
        body.appendChild(msg);
        scrollBottom();
    }

    function typing(callback) {
        const t = document.createElement('div');
        t.className = 'chatbot__msg chatbot__msg--bot';
        t.innerHTML = '<div class="chatbot__bubble chatbot__typing"><span></span><span></span><span></span></div>';
        body.appendChild(t);
        scrollBottom();
        setTimeout(function () { t.remove(); callback(); }, 650);
    }

    function botSay(content, isHTML) {
        typing(function () { addMessage(content, 'bot', isHTML); });
    }

    function waLink(label, message) {
        return '<a class="chatbot__wa" href="https://wa.me/' + WA +
            '?text=' + encodeURIComponent(message) +
            '" target="_blank" rel="noopener">💬 ' + label + '</a>';
    }

    function respond(text) {
        const q = text.toLowerCase();

        if (/(tenis|zapat|calzad|sneaker)/.test(q)) {
            botSay('👟 Tenemos <strong>tenis para niño</strong> en tallas <strong>12 a 16</strong>, antiderrapantes y con cierre práctico. ¡Oferta a <strong>$170</strong>!<br>' +
                waLink('Ver tenis por WhatsApp', 'Hola, me interesan los tenis de niño ($170, tallas 12-16). ¿Qué modelos y tallas tienen?'), true);
        } else if (/(playera|oversize|camisa|remera|polo)/.test(q)) {
            botSay('👕 Nuestras <strong>playeras son unisex oversize</strong>, talla única y calce holgado. ¡Todas a <strong>$170</strong>! Tenemos Bugs Bunny, Barrow, Kaws, Anti Social y más.<br>' +
                waLink('Ver playeras por WhatsApp', 'Hola, me interesan las playeras oversize ($170). ¿Me pasas el catálogo disponible?'), true);
        } else if (/(precio|cuesta|cu[aá]nto|costo|vale|oferta|barat)/.test(q)) {
            botSay('🔥 ¡Estamos en oferta! <strong>Todo a $170 MXN</strong> — playeras y tenis de niño.<br>' +
                waLink('Aprovechar oferta', 'Hola, quiero aprovechar la oferta de todo a $170. ¿Me pasas los modelos disponibles?'), true);
        } else if (/(env[ií]o|entrega|mandar|paqueter|domicilio)/.test(q)) {
            botSay('🚚 Hacemos <strong>envíos en CDMX y Edomex</strong>. También puedes recoger en nuestras sucursales (Atizapán, Naucalpan, Tlalnepantla, Izcalli, Nicolás Romero y CDMX).<br>' +
                waLink('Coordinar envío', 'Hola, quiero coordinar un envío de mi pedido. ¿Me ayudas?'), true);
        } else if (/(pago|transfer|oxxo|tarjeta|deposit|pagar)/.test(q)) {
            botSay('💳 El pago es <strong>únicamente por transferencia bancaria</strong>. Te compartimos los datos por WhatsApp al confirmar tu pedido.<br>' +
                waLink('Comprar ahora', 'Hola, quiero comprar. ¿Me pasas los datos para pagar por transferencia?'), true);
        } else if (/(talla|medida|queda|grande|chico|chica)/.test(q)) {
            botSay('📏 Las <strong>playeras</strong> son talla única oversize (calce holgado). Los <strong>tenis de niño</strong> van en tallas <strong>12 a 16</strong>. Dinos qué buscas y te confirmamos disponibilidad.<br>' +
                waLink('Preguntar por mi talla', 'Hola, quiero saber sobre tallas disponibles.'), true);
        } else if (/(sucursal|tienda|direcci|ubicaci|d[oó]nde|horario|abren)/.test(q)) {
            botSay('📍 Tenemos sucursales en <strong>Atizapán, Naucalpan, Tlalnepantla, Cuautitlán Izcalli, Nicolás Romero y Cuauhtémoc (CDMX)</strong>. Abierto de martes a domingo, 4:00 a 8:00 PM.', true);
        } else if (/(hola|buen[oa]s|qu[eé] tal|hey|saludos)/.test(q)) {
            botSay('¡Hola! 😊 ¿Buscas <strong>playeras</strong> o <strong>tenis de niño</strong>? Todo está a <strong>$170</strong>.', true);
        } else if (/(gracias|thanks|ok|vale|perfecto)/.test(q)) {
            botSay('¡Con gusto! 🙌 Cuando quieras te atendemos por WhatsApp.<br>' +
                waLink('Escribir por WhatsApp', 'Hola, tengo una pregunta sobre sus productos.'), true);
        } else {
            botSay('No estoy seguro de haberte entendido 🤔, pero puedo ayudarte con <strong>playeras</strong>, <strong>tenis</strong>, precios, tallas o envíos. También puedes escribirnos directo:<br>' +
                waLink('Chatear por WhatsApp', 'Hola, me gustaría más información sobre sus productos.'), true);
        }
    }

    function greet() {
        if (greeted) return;
        greeted = true;
        addMessage('¡Hola! 👋 Soy el asistente de Bodega de Playeras.', 'bot');
        setTimeout(function () {
            addMessage('Estamos en oferta: 🔥 todo a $170. ¿Te interesan las playeras oversize o los tenis de niño? Escribe "playeras" o "tenis".', 'bot');
            scrollBottom();
        }, 500);
    }

    function openChat() {
        chatbot.classList.add('is-open');
        win.setAttribute('aria-hidden', 'false');
        greet();
        setTimeout(function () { input.focus(); }, 300);
    }

    function closeChat() {
        chatbot.classList.remove('is-open');
        win.setAttribute('aria-hidden', 'true');
    }

    toggle.addEventListener('click', function () {
        if (chatbot.classList.contains('is-open')) { closeChat(); } else { openChat(); }
    });

    closeBtn.addEventListener('click', closeChat);

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const value = input.value.trim();
        if (!value) return;
        addMessage(value, 'user');
        input.value = '';
        respond(value);
    });

    quick.addEventListener('click', function (e) {
        const btn = e.target.closest('.chatbot__chip');
        if (!btn) return;
        addMessage(btn.textContent.trim(), 'user');
        respond(btn.getAttribute('data-q'));
    });
})();
