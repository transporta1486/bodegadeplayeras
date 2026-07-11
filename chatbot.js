/**
 * Bodega de Playeras — Chatbot de ventas
 * Detecta la página con window.location.pathname y adapta el saludo,
 * los accesos rápidos y las respuestas. En la página de producto ejecuta
 * un flujo guiado (talla → color → cantidad) y arma un botón de WhatsApp
 * prellenado con todos los datos del pedido.
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

    /* ── Detección de página ── */
    const path = window.location.pathname.toLowerCase();

    const SUC_INFO = {
        'atizapan': 'Atizapán de Zaragoza (Zona Esmeralda, Las Alamedas y alrededores)',
        'naucalpan': 'Naucalpan (Satélite, Echegaray y Lomas Verdes)',
        'tlalnepantla': 'Tlalnepantla de Baz (Gustavo Baz, Viveros de la Loma y San Javier)',
        'izcalli': 'Cuautitlán Izcalli (zona norte del Edomex)',
        'nicolas-romero': 'Nicolás Romero (centro y alrededores, Edomex)',
        'cuhutemoc': 'Cuauhtémoc, CDMX (Roma, Condesa y centro)'
    };

    const isProducto = path.indexOf('producto') !== -1;
    let sucKey = null;
    for (const key in SUC_INFO) {
        if (path.indexOf(key) !== -1) { sucKey = key; break; }
    }
    const isSucursal = sucKey !== null;
    const sucArea = isSucursal ? SUC_INFO[sucKey] : '';

    function productName() {
        const el = document.querySelector('.product-info__title');
        const name = el ? el.textContent.trim() : '';
        return name && name !== 'Cargando…' ? name : 'nuestro producto';
    }

    /* ── Estado del pedido guiado (solo página de producto) ── */
    const order = { active: false, i: 0, steps: [], data: {}, tenis: false };

    /* ── Utilidades ── */
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
        setTimeout(function () { t.remove(); callback(); }, 600);
    }

    function botSay(content, isHTML) {
        typing(function () { addMessage(content, 'bot', isHTML); });
    }

    /* Botón verde de WhatsApp prellenado dinámicamente */
    function waCTA(label, message) {
        return '<a class="chatbot__wa" href="https://wa.me/' + WA +
            '?text=' + encodeURIComponent(message) +
            '" target="_blank" rel="noopener">💬 ' + label + '</a>';
    }

    function ctxSuffix() {
        if (isProducto) return ' de ' + productName();
        if (isSucursal) return ' en la sucursal de ' + sucArea;
        return '';
    }

    /* ── Flujo guiado de pedido ── */
    function startOrder() {
        order.active = true;
        order.editing = null;
        order.i = 0;
        order.data = {};
        order.tenis = /tenis|zapat|calzad/i.test(productName());
        order.steps = order.tenis ? ['talla', 'color', 'cantidad'] : ['color', 'cantidad'];
        askStep();
    }

    function promptText(field) {
        if (field === 'talla') return '📏 ¿Qué <strong>talla</strong> necesitas? (disponibles: <strong>12 a 16</strong>)';
        if (field === 'color') {
            return order.tenis
                ? '🎨 ¿Qué <strong>color</strong> prefieres? (ej: blanco/rosa, negro o rosa)'
                : '👕 Esta playera es <strong>talla única oversize</strong>. ¿Qué <strong>color</strong> quieres? (blanco o negro)';
        }
        if (field === 'cantidad') return '🔢 ¿<strong>Cuántas piezas</strong> quieres? (1 pieza = menudeo · 6 o más = mayoreo 📦)';
        return '';
    }

    function askStep() {
        botSay(promptText(order.steps[order.i]), true);
    }

    function askField(field) {
        order.active = true;
        order.editing = field;
        botSay('✏️ ' + promptText(field), true);
    }

    function reAsk() {
        if (order.editing) { botSay(promptText(order.editing), true); } else { askStep(); }
    }

    function orderTipo() {
        const n = parseInt(order.data.cantidad || '1', 10);
        return (!isNaN(n) && n >= 6) ? 'MAYOREO' : 'menudeo';
    }

    function showSummary() {
        order.active = false;
        order.editing = null;
        const talla = order.tenis ? (order.data.talla || 'por confirmar') : 'talla única (oversize)';
        const color = order.data.color || 'por confirmar';
        const cantTxt = order.data.cantidad || '1';
        const tipo = orderTipo();

        const msg = 'Hola, quiero hacer este pedido:\n' +
            '• Producto: ' + productName() + '\n' +
            '• Talla: ' + talla + '\n' +
            '• Color: ' + color + '\n' +
            '• Cantidad: ' + cantTxt + ' (' + tipo + ')\n' +
            '• Precio: $170 c/u\n' +
            '¿Me confirmas disponibilidad y los datos para pagar por transferencia?';

        let edits = '<div class="chatbot__edits">';
        if (order.tenis) edits += '<button class="chatbot__edit" data-edit="talla">✏️ Talla</button>';
        edits += '<button class="chatbot__edit" data-edit="color">✏️ Color</button>';
        edits += '<button class="chatbot__edit" data-edit="cantidad">✏️ Cantidad</button>';
        edits += '</div>';

        botSay('✅ <strong>Revisa tu pedido:</strong><br>' +
            '👕 ' + productName() + '<br>' +
            '📏 Talla: ' + talla + '<br>' +
            '🎨 Color: ' + color + '<br>' +
            '🔢 Cantidad: ' + cantTxt + ' (' + tipo + ')<br>' +
            '💲 $170 c/u' +
            edits +
            waCTA('Confirmar y enviar', msg) +
            '<br><small>Toca ✏️ para corregir algo antes de enviar.</small>', true);
    }

    function processStep(text) {
        const q = text.toLowerCase();
        const current = order.editing || order.steps[order.i];

        // Permite preguntar dudas sin perder el paso actual
        if (/(precio|cuesta|cu[aá]nto|costo|vale)/.test(q)) {
            botSay('🔥 Todos los artículos están a <strong>$170 c/u</strong> (mayoreo desde 6 piezas).', true);
            reAsk();
            return;
        }
        if (/(env[ií]o|entrega|recoger)/.test(q)) {
            botSay('🚚 Enviamos en CDMX y Edomex, o puedes recoger en sucursal. Lo coordinamos al confirmar.', true);
            reAsk();
            return;
        }
        if (/(pago|transfer|pagar|dep[oó]sito)/.test(q)) {
            botSay('💳 El pago es <strong>solo por transferencia bancaria</strong>. Te pasamos los datos al confirmar.', true);
            reAsk();
            return;
        }
        if (/(color|colores|tono)/.test(q) && current !== 'color') {
            botSay('🎨 Colores: playeras en blanco/negro; tenis en blanco/rosa, negro o rosa.', true);
            reAsk();
            return;
        }
        if (/(mayoreo|por mayor|docena)/.test(q) && current !== 'cantidad') {
            botSay('📦 Desde 6 piezas aplica precio de mayoreo. Indícame la cantidad y lo calculo.', true);
            reAsk();
            return;
        }
        if (/(preguntas frecuentes|faq|duda)/.test(q)) {
            botSay('❓ Todo a $170, pago por transferencia, envíos CDMX/Edomex; playeras talla única y tenis 12–16.', true);
            reAsk();
            return;
        }

        // Edición de un solo campo → vuelve al resumen
        if (order.editing) {
            order.data[order.editing] = text;
            order.editing = null;
            showSummary();
            return;
        }

        // Guarda la respuesta del paso y avanza
        order.data[order.steps[order.i]] = text;
        order.i++;
        if (order.i < order.steps.length) { askStep(); } else { showSummary(); }
    }

    /* ── Motor de respuestas general ── */
    function respond(text) {
        const q = text.toLowerCase();

        // En página de producto: control del flujo guiado
        if (isProducto) {
            if (/(reinici|nuevo pedido|otro pedido|empezar)/.test(q)) { startOrder(); return; }
            if (order.active) { processStep(text); return; }
        }

        if (/(preguntas frecuentes|faq|dudas|pregunta frecuente)/.test(q)) {
            botSay('❓ <strong>Preguntas frecuentes:</strong><br>' +
                '• Playeras unisex oversize, talla única.<br>' +
                '• Tenis de niño en tallas 12–16.<br>' +
                '• 🔥 Todo a $170 MXN.<br>' +
                '• Pago <strong>solo por transferencia</strong>.<br>' +
                '• Envíos en CDMX y Edomex, o recoge en sucursal.<br>' +
                waCTA('Tengo otra duda', 'Hola, tengo una pregunta sobre sus productos' + ctxSuffix() + '.'), true);

        } else if (/(color|colores|tono)/.test(q)) {
            botSay('🎨 <strong>Colores disponibles:</strong> playeras en <strong>blanco y negro</strong>; ' +
                'tenis de niño en <strong>blanco/rosa, negro y rosa</strong>.<br>' +
                waCTA('Preguntar por color', 'Hola, quiero saber los colores disponibles' + ctxSuffix() + '.'), true);

        } else if (/(mayoreo|por mayor|docena|revend|al por mayor)/.test(q)) {
            botSay('📦 ¡Sí manejamos <strong>mayoreo y menudeo</strong>! Desde <strong>6 piezas</strong> aplica precio de mayoreo. ' +
                'Dinos qué cantidad necesitas y te cotizamos.<br>' +
                waCTA('Cotizar mayoreo', 'Hola, me interesa comprar por MAYOREO' + ctxSuffix() + '. ¿Me pasan precios por cantidad?'), true);

        } else if (/(precio|cuesta|cu[aá]nto|costo|vale|oferta|barat)/.test(q)) {
            botSay('🔥 ¡Estamos en oferta! <strong>Todo a $170 MXN</strong> — playeras y tenis de niño.<br>' +
                waCTA('Aprovechar oferta', 'Hola, quiero aprovechar la oferta de todo a $170' + ctxSuffix() + '. ¿Me pasas lo disponible?'), true);

        } else if (/(env[ií]o|entrega|mandar|paqueter|domicilio|recoger|recojo)/.test(q)) {
            const extra = isSucursal
                ? ' Puedes recoger directamente en <strong>' + sucArea + '</strong>.'
                : '';
            botSay('🚚 Hacemos <strong>envíos en CDMX y Edomex</strong> y también puedes recoger en tienda.' + extra +
                ' Sucursales: Atizapán, Naucalpan, Tlalnepantla, Izcalli, Nicolás Romero y CDMX.<br>' +
                waCTA('Coordinar entrega', 'Hola, quiero coordinar la entrega/envío' + ctxSuffix() + '. ¿Me ayudas?'), true);

        } else if (/(pago|transfer|oxxo|tarjeta|deposit|pagar)/.test(q)) {
            botSay('💳 El pago es <strong>únicamente por transferencia bancaria</strong>. ' +
                'Te compartimos los datos por WhatsApp al confirmar tu pedido.<br>' +
                waCTA('Comprar ahora', 'Hola, quiero comprar' + ctxSuffix() + '. ¿Me pasas los datos para pagar por transferencia?'), true);

        } else if (/(ubicaci|direcci|d[oó]nde|c[oó]mo llego|llegar|horario|abren|mapa|sucursal|tienda)/.test(q)) {
            if (isSucursal) {
                botSay('📍 <strong>Sucursal ' + sucArea + '</strong><br>' +
                    '🕒 Martes a domingo, 4:00–8:00 PM.<br>' +
                    'Te compartimos el punto exacto y cómo llegar por WhatsApp.<br>' +
                    waCTA('Cómo llegar', 'Hola, ¿me pasan la ubicación exacta y el horario de la sucursal ' + sucArea + '?'), true);
            } else {
                botSay('📍 <strong>Sucursales</strong> (Mar–Dom, 4:00–8:00 PM):<br>' +
                    '• Atizapán de Zaragoza (Zona Esmeralda, Las Alamedas)<br>' +
                    '• Nicolás Romero (centro y alrededores)<br>' +
                    '• Naucalpan, Tlalnepantla, Cuautitlán Izcalli y Cuauhtémoc CDMX.<br>' +
                    waCTA('Ubicación y horarios', 'Hola, ¿me pasan las ubicaciones exactas y horarios de sus sucursales?'), true);
            }

        } else if (/(tenis|zapat|calzad|sneaker)/.test(q)) {
            botSay('👟 Tenemos <strong>tenis para niño</strong> en tallas <strong>12 a 16</strong>, antiderrapantes. ¡Oferta a <strong>$170</strong>!<br>' +
                waCTA('Ver tenis por WhatsApp', 'Hola, me interesan los tenis de niño ($170, tallas 12-16). ¿Qué modelos y tallas tienen?'), true);

        } else if (/(playera|oversize|camisa|remera|polo)/.test(q)) {
            botSay('👕 Nuestras <strong>playeras son unisex oversize</strong>, talla única y calce holgado. ¡Todas a <strong>$170</strong>!<br>' +
                waCTA('Ver playeras por WhatsApp', 'Hola, me interesan las playeras oversize ($170). ¿Me pasas el catálogo disponible?'), true);

        } else if (/(talla|medida|queda|grande|chico|chica|n[uú]mero)/.test(q)) {
            botSay('📏 Las <strong>playeras</strong> son talla única oversize (calce holgado). ' +
                'Los <strong>tenis de niño</strong> van en tallas <strong>12 a 16</strong>.<br>' +
                waCTA('Preguntar por mi talla', 'Hola, quiero saber sobre tallas disponibles' + ctxSuffix() + '.'), true);

        } else if (/(hola|buen[oa]s|qu[eé] tal|hey|saludos)/.test(q)) {
            botSay('¡Hola! 😊 ¿Buscas <strong>playeras</strong> o <strong>tenis de niño</strong>? Todo está a <strong>$170</strong>.', true);

        } else if (/(gracias|thanks|perfecto|excelente)/.test(q)) {
            botSay('¡Con gusto! 🙌 Cuando quieras cerramos tu pedido por WhatsApp.<br>' +
                waCTA('Escribir por WhatsApp', 'Hola, tengo una pregunta sobre sus productos' + ctxSuffix() + '.'), true);

        } else {
            if (isProducto) {
                // Fuera del flujo: reinicia la toma de pedido
                startOrder();
            } else {
                botSay('No estoy seguro de haberte entendido 🤔, pero puedo ayudarte con <strong>playeras</strong>, <strong>tenis</strong>, ' +
                    'colores, mayoreo, precios, envíos, pago o preguntas frecuentes. También te atendemos directo:<br>' +
                    waCTA('Chatear por WhatsApp', 'Hola, me gustaría más información sobre sus productos' + ctxSuffix() + '.'), true);
            }
        }
    }

    /* ── Accesos rápidos según la página ── */
    function setChips() {
        let chips;
        if (isProducto) {
            chips = [['reiniciar', '🔄 Nuevo pedido'], ['colores', '🎨 Colores'], ['precio', '🔥 Precio'], ['pago', '💳 Pago']];
        } else if (isSucursal) {
            chips = [['ubicacion', '📍 Ubicación'], ['horario', '🕒 Horario'], ['entrega', '🚚 Entrega'], ['precio', '🔥 Precios']];
        } else {
            chips = [['playeras', '👕 Playeras'], ['tenis', '👟 Tenis niño'], ['precio', '🔥 Precios'], ['envio', '🚚 Envíos']];
        }
        quick.innerHTML = chips.map(function (c) {
            return '<button class="chatbot__chip" data-q="' + c[0] + '">' + c[1] + '</button>';
        }).join('');
    }

    /* ── Saludo según la página ── */
    function greet() {
        if (greeted) return;
        greeted = true;

        if (isProducto) {
            addMessage('¡Hola! 👋 Estás viendo: ' + productName() + '.', 'bot');
            setTimeout(function () {
                addMessage('Te ayudo a cerrar tu pedido en unos pasos. ¡Todo a $170! 🔥', 'bot');
                startOrder();
            }, 500);
        } else if (isSucursal) {
            addMessage('¡Hola! 👋 Estás en nuestra sucursal de ' + sucArea + '.', 'bot');
            setTimeout(function () {
                addMessage('🕒 Horario: martes a domingo, 4:00–8:00 PM. Puedo darte la ubicación o coordinar tu entrega. Además, ¡todo a $170!', 'bot');
                scrollBottom();
            }, 500);
        } else {
            addMessage('¡Hola! 👋 Soy el asistente de Bodega de Playeras.', 'bot');
            setTimeout(function () {
                addMessage('Estamos en oferta: 🔥 todo a $170. ¿Te interesan las playeras oversize o los tenis de niño? Escribe "playeras" o "tenis".', 'bot');
                scrollBottom();
            }, 500);
        }
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

    /* ── Eventos ── */
    setChips();

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

    // Botones ✏️ para corregir un dato del resumen
    body.addEventListener('click', function (e) {
        const btn = e.target.closest('.chatbot__edit');
        if (!btn) return;
        const field = btn.getAttribute('data-edit');
        addMessage('Corregir ' + field, 'user');
        askField(field);
    });
})();
