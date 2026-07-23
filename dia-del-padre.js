/* =====================================================================
   SanJose Florería — Especial DÍA DEL PADRE
   Controla la vigencia de la promoción y muestra el flyer.

   VIGENCIA: solo el 13 y 14 de junio de 2026 (hora local del visitante).
   Para cambiar las fechas, edita INICIO y FIN abajo.
   Pasada la fecha:
     - El flyer no aparece.
     - La sección y el botón "Día del Padre" del catálogo quedan ocultos.
   ===================================================================== */
(function () {
    'use strict';

    // --- Ventana de vigencia (mes 5 = junio, base 0) ---
    var INICIO = new Date(2026, 5, 13, 0, 0, 0);
    var FIN    = new Date(2026, 5, 14, 23, 59, 59);

    var ahora  = new Date();
    var activo = ahora >= INICIO && ahora <= FIN;

    // Marca el documento lo antes posible para evitar parpadeos.
    var root = document.documentElement;
    root.classList.add(activo ? 'dp-activo' : 'dp-inactivo');

    function crearFlyer() {
        if (document.body.querySelector('.dp-flyer')) return;
        var f = document.createElement('div');
        f.className = 'dp-flyer';
        f.setAttribute('role', 'banner');
        f.innerHTML =
            '<div class="dp-flyer__txt">' +
                '<span class="dp-flyer__title">🎁 <b>Especial Día del Padre</b> &mdash; Regalos para sorprender a papá</span>' +
                '<span class="dp-flyer__sub">Solo hoy y mañana · 13 y 14 de junio</span>' +
            '</div>' +
            '<a class="dp-flyer__cta" href="/catalogo.html?category=padre">Ver regalos para papá</a>' +
            '<button class="dp-flyer__close" type="button" aria-label="Cerrar" title="Cerrar">✕</button>';
        document.body.insertBefore(f, document.body.firstChild);
        f.querySelector('.dp-flyer__close').addEventListener('click', function () {
            f.parentNode && f.parentNode.removeChild(f);
        });
    }

    function init() {
        if (activo) crearFlyer();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
