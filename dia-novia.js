/* =====================================================================
   TR Florería Cartagena — ESPECIAL DÍA DE LA NOVIA
   Flyer flotante con carrusel + contador regresivo.

   VIGENCIA: hasta el 1 de agosto de 2026, 11:59:59 p.m. (hora del visitante).
   Para cambiar la fecha, edita FIN abajo.

   Al terminar la promo, de forma automática:
     · el flyer deja de aparecer,
     · las 3 tarjetas pierden el resalte y el contador,
     · el botón de filtro "Día de la Novia" se oculta,
     · el precio con descuento SE MANTIENE (los productos quedan normales).

   Sin librerías. Sólo anima transform/opacity. ~4 KB.
   ===================================================================== */
(function () {
    'use strict';

    /* ── Ventana de vigencia (mes base 0 → 6 = julio, 7 = agosto) ── */
    var INICIO = new Date(2026, 6, 28, 0, 0, 0);
    var FIN = new Date(2026, 7, 1, 23, 59, 59);

    var WA = 'https://wa.me/573052125927?text=';
    var root = document.documentElement;

    /* Los 3 arreglos del especial */
    var ITEMS = [
        {
            cod: '056',
            img: '/assets/foto56.webp',
            nombre: 'Reina de mi Vida',
            antes: '$256,000',
            ahora: '$200,000',
            wa: 'C%C3%B3digo%20056%20%E2%80%94%20Hola%2C%20quiero%20el%20especial%20D%C3%ADa%20de%20la%20Novia%3A%20Reina%20de%20mi%20Vida%20por%20%24200%2C000%20(antes%20%24256%2C000).%20%C2%BFMe%20ayudas%3F'
        },
        {
            cod: '057',
            img: '/assets/foto57.webp',
            nombre: 'Te Elegiría Mil Veces',
            antes: '$208,000',
            ahora: '$162,500',
            wa: 'C%C3%B3digo%20057%20%E2%80%94%20Hola%2C%20quiero%20el%20especial%20D%C3%ADa%20de%20la%20Novia%3A%20Te%20Elegir%C3%ADa%20Mil%20Veces%20por%20%24162%2C500%20(antes%20%24208%2C000).%20%C2%BFMe%20ayudas%3F'
        },
        {
            cod: '058',
            img: '/assets/foto58.webp',
            nombre: 'La Novia Más Linda',
            antes: '$208,000',
            ahora: '$162,500',
            wa: 'C%C3%B3digo%20058%20%E2%80%94%20Hola%2C%20quiero%20el%20especial%20D%C3%ADa%20de%20la%20Novia%3A%20La%20Novia%20M%C3%A1s%20Linda%20por%20%24162%2C500%20(antes%20%24208%2C000).%20%C2%BFMe%20ayudas%3F'
        }
    ];

    function vigente() {
        var n = new Date();
        return n >= INICIO && n <= FIN;
    }

    /* Marca el <html> cuanto antes para evitar parpadeos */
    var activo = vigente();
    root.classList.add(activo ? 'dn-activo' : 'dn-inactivo');
    if (!activo) return;

    /* ── Utilidades ─────────────────────────────────────────── */
    function dos(n) { return n < 10 ? '0' + n : '' + n; }

    function restante() {
        var ms = FIN - new Date();
        if (ms < 0) ms = 0;
        var s = Math.floor(ms / 1000);
        return {
            ms: ms,
            d: Math.floor(s / 86400),
            h: Math.floor((s % 86400) / 3600),
            m: Math.floor((s % 3600) / 60),
            s: s % 60
        };
    }

    function abrirWA(texto, etiqueta) {
        var url = WA + texto;
        if (typeof window.trackWhatsAppLead === 'function') {
            return window.trackWhatsAppLead(url, etiqueta);
        }
        window.open(url, '_blank');
        return false;
    }

    /* ── Flyer ──────────────────────────────────────────────── */
    var flyer, slides, dots, timerEl, idx = 0, autoId = null, tickId = null;

    function construirFlyer() {
        if (document.querySelector('.dn-flyer')) return;

        var slidesHTML = ITEMS.map(function (it, i) {
            return '<a class="dn-slide' + (i === 0 ? ' is-on' : '') + '" href="#" data-i="' + i + '" ' +
                'aria-label="' + it.nombre + '">' +
                '<img src="' + it.img + '" alt="' + it.nombre + ' — especial Día de la Novia" ' +
                (i === 0 ? '' : 'loading="lazy" ') + 'decoding="async" width="316" height="316"/>' +
                '<span class="dn-slide__info">' +
                '<span class="dn-slide__name">' + it.nombre + '</span>' +
                '<span class="dn-slide__price"><s>' + it.antes + '</s>' + it.ahora + '</span>' +
                '</span></a>';
        }).join('');

        var dotsHTML = ITEMS.map(function (it, i) {
            return '<button class="dn-dot' + (i === 0 ? ' is-on' : '') + '" type="button" data-i="' + i +
                '" aria-label="Ver ' + it.nombre + '"></button>';
        }).join('');

        flyer = document.createElement('aside');
        flyer.className = 'dn-flyer';
        flyer.setAttribute('role', 'complementary');
        flyer.setAttribute('aria-label', 'Especial Día de la Novia');
        flyer.innerHTML =
            '<button class="dn-flyer__close" type="button" aria-label="Cerrar">✕</button>' +
            '<div class="dn-flyer__head">' +
            '<span class="dn-flyer__kicker">💘 Día de la Novia</span>' +
            '<strong class="dn-flyer__title">Que hoy sepa que es la elegida</strong>' +
            '<span class="dn-flyer__sub">Hasta 22% menos · sólo hasta el 1 de agosto</span>' +
            '</div>' +
            '<div class="dn-car">' +
            '<div class="dn-track">' + slidesHTML + '</div>' +
            '<button class="dn-nav dn-prev" type="button" aria-label="Anterior">‹</button>' +
            '<button class="dn-nav dn-next" type="button" aria-label="Siguiente">›</button>' +
            '</div>' +
            '<div class="dn-dots">' + dotsHTML + '</div>' +
            '<div class="dn-timer">⏳ Termina en <b class="dn-t-d">00</b>d <b class="dn-t-h">00</b>h <b class="dn-t-m">00</b>m <b class="dn-t-s">00</b>s</div>' +
            '<a class="dn-cta" href="#">💬 Pedir el mío por WhatsApp</a>' +
            '<a class="dn-link" href="/catalogo.html?category=novia">Ver los 3 arreglos del especial →</a>';

        document.body.appendChild(flyer);

        slides = flyer.querySelectorAll('.dn-slide');
        dots = flyer.querySelectorAll('.dn-dot');
        timerEl = flyer.querySelector('.dn-timer');

        /* Navegación */
        flyer.querySelector('.dn-prev').addEventListener('click', function () { ir(idx - 1, true); });
        flyer.querySelector('.dn-next').addEventListener('click', function () { ir(idx + 1, true); });
        for (var i = 0; i < dots.length; i++) {
            dots[i].addEventListener('click', function () { ir(+this.getAttribute('data-i'), true); });
        }
        for (var j = 0; j < slides.length; j++) {
            slides[j].addEventListener('click', function (e) {
                e.preventDefault();
                var it = ITEMS[+this.getAttribute('data-i')];
                return abrirWA(it.wa, 'flyer_novia_' + it.cod);
            });
        }
        flyer.querySelector('.dn-cta').addEventListener('click', function (e) {
            e.preventDefault();
            return abrirWA(ITEMS[idx].wa, 'flyer_novia_cta_' + ITEMS[idx].cod);
        });
        flyer.querySelector('.dn-flyer__close').addEventListener('click', cerrar);

        /* Pausa el auto-avance mientras el mouse está encima */
        flyer.addEventListener('mouseenter', pararAuto);
        flyer.addEventListener('mouseleave', arrancarAuto);

        root.classList.add('dn-flyer-open');
        requestAnimationFrame(function () {
            requestAnimationFrame(function () { flyer.classList.add('dn-in'); });
        });
        arrancarAuto();
    }

    function ir(n, manual) {
        if (!slides || !slides.length) return;
        n = (n + slides.length) % slides.length;
        slides[idx].classList.remove('is-on');
        dots[idx].classList.remove('is-on');
        idx = n;
        slides[idx].classList.add('is-on');
        dots[idx].classList.add('is-on');
        if (manual) { pararAuto(); arrancarAuto(); }
    }

    function arrancarAuto() {
        pararAuto();
        if (document.hidden) return;
        autoId = setInterval(function () { ir(idx + 1); }, 4200);
    }

    function pararAuto() {
        if (autoId) { clearInterval(autoId); autoId = null; }
    }

    function cerrar() {
        if (!flyer) return;
        flyer.classList.remove('dn-in');
        pararAuto();
        root.classList.remove('dn-flyer-open');
        setTimeout(function () {
            if (flyer && flyer.parentNode) flyer.parentNode.removeChild(flyer);
            flyer = null;
            slides = dots = timerEl = null;
            crearPestana();
        }, 420);
        try { sessionStorage.setItem('dn-cerrado', '1'); } catch (e) {}
    }

    function crearPestana() {
        if (document.querySelector('.dn-reopen')) return;
        var b = document.createElement('button');
        b.className = 'dn-reopen';
        b.type = 'button';
        b.innerHTML = '💘 Especial<br>Día de la Novia';
        b.addEventListener('click', function () {
            b.parentNode && b.parentNode.removeChild(b);
            try { sessionStorage.removeItem('dn-cerrado'); } catch (e) {}
            idx = 0;
            construirFlyer();
        });
        document.body.appendChild(b);
    }

    /* ── Contador (una sola vez por segundo para toda la página) ── */
    function pintarContador() {
        var r = restante();

        if (r.ms <= 0) { terminar(); return; }

        if (timerEl) {
            timerEl.querySelector('.dn-t-d').textContent = dos(r.d);
            timerEl.querySelector('.dn-t-h').textContent = dos(r.h);
            timerEl.querySelector('.dn-t-m').textContent = dos(r.m);
            timerEl.querySelector('.dn-t-s').textContent = dos(r.s);
        }

        var cds = document.querySelectorAll('.dn-cd b');
        if (cds.length) {
            var txt = (r.d > 0 ? r.d + 'd ' : '') + dos(r.h) + ':' + dos(r.m) + ':' + dos(r.s);
            for (var i = 0; i < cds.length; i++) cds[i].textContent = txt;
        }
    }

    function terminar() {
        if (tickId) { clearInterval(tickId); tickId = null; }
        pararAuto();
        root.classList.remove('dn-activo', 'dn-flyer-open');
        root.classList.add('dn-inactivo');
        if (flyer && flyer.parentNode) flyer.parentNode.removeChild(flyer);
        var tab = document.querySelector('.dn-reopen');
        if (tab && tab.parentNode) tab.parentNode.removeChild(tab);
    }

    /* ── Arranque ───────────────────────────────────────────── */
    function init() {
        var cerrado = false;
        try { cerrado = sessionStorage.getItem('dn-cerrado') === '1'; } catch (e) {}

        if (cerrado) {
            crearPestana();
        } else {
            /* Aparece cuando el visitante ya bajó un poco (así no tapa el menú
               de filtros al abrir) o, si no baja, a los 5 segundos. */
            var lanzado = false;
            var lanzar = function () {
                if (lanzado) return;
                lanzado = true;
                window.removeEventListener('scroll', alBajar);
                construirFlyer();
            };
            var alBajar = function () { if (window.pageYOffset > 180) lanzar(); };
            window.addEventListener('scroll', alBajar, { passive: true });
            setTimeout(function () { alBajar(); }, 1200);
            setTimeout(lanzar, 5000);
        }

        pintarContador();
        tickId = setInterval(pintarContador, 1000);

        /* Ahorra batería/CPU cuando la pestaña no está visible */
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) pararAuto();
            else if (flyer) { arrancarAuto(); pintarContador(); }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
