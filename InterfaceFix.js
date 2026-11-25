(function () {
    'use strict';

    function startPlugin() {
        if (window.bylampa_135_tune) return;
        window.bylampa_135_tune = true;

        var css = '' +
            /* 1. Полностью убираем стрелочку «Назад» в верхнем левом углу */
            'body .head__backward, body .head__back, body .head__action--back { display: none !important; opacity: 0 !important; width: 0 !important; margin: 0 !important; padding: 0 !important; pointer-events: none !important; }' +

            /* 2. Полностью скрываем рейтинг на фоне карточки и в витрине */
            'body .full-start__rate, body .full-start-new__rate, body .interface-info__rate, body .interface-info__vote, body .card-more__rate, body .info__rate { display: none !important; }' +

            /* 3. Делаем описание ещё мельче на один пункт (под настройку размера "Меньше") */
            'body .full-start__descr, body .full-start-new__descr, body .interface-info__descr, body .info__descr {' +
                'font-size: 0.72em !important;' +
                'line-height: 1.28 !important;' +
                'margin-top: 0.35em !important;' +
                'display: -webkit-box !important;' +
                '-webkit-line-clamp: 3 !important;' +
                '-webkit-box-orient: vertical !important;' +
                'overflow: hidden !important;' +
                'max-height: 3.85em !important;' +
            '}' +

            /* 4. Правый верхний угол фона карточки: Статус слева, Возраст справа */
            'body .full-start, body .full-start-new, body .full-start__box, body .interface-info {' +
                'position: relative !important;' +
            '}' +
            'body .custom-tr-badges {' +
                'position: absolute !important;' +
                'top: 1.5em !important;' +
                'right: 2.5em !important;' +
                'display: flex !important;' +
                'flex-direction: row !important;' +
                'align-items: center !important;' +
                'gap: 0.5em !important;' +
                'z-index: 30 !important;' +
                'font-size: 0.8em !important;' +
            '}' +
            'body .custom-tr-badges > * {' +
                'margin: 0 !important;' +
            '}' +

            /* 5. Перенос жанров и длительности под строку года и страны */
            'body .full-start__details, body .full-start-new__details, body .interface-info__details, body .info__details {' +
                'display: flex !important;' +
                'flex-wrap: wrap !important;' +
                'align-items: center !important;' +
                'font-size: 0.82em !important;' +
                'line-height: 1.25 !important;' +
            '}' +
            'body .custom-line-break {' +
                'flex-basis: 100% !important;' +
                'width: 100% !important;' +
                'height: 0 !important;' +
                'margin: 0 !important;' +
                'padding: 0 !important;' +
            '}' +
            'body .custom-sub-line {' +
                'margin-top: 0.25em !important;' +
            '}';

        function injectStyle() {
            if (!document.getElementById('bylampa-135-tune-css')) {
                var style = document.createElement('style');
                style.id = 'bylampa-135-tune-css';
                style.type = 'text/css';
                style.appendChild(document.createTextNode(css));
                (document.body || document.head).appendChild(style);
            }
        }

        function processBlock(container) {
            if (!container) return;

            /* Поиск возрастного ограничения и статуса в разметке ByLampa 1.3.5 */
            var pg = container.querySelector('.full-start__pg, .full-start-new__pg, .interface-info__pg, .info__pg');
            var status = container.querySelector('.full-start__status, .full-start-new__status, .interface-info__status, .info__status');

            /* Если элементы лежат в общем контейнере тегов или инфо-строке без своих классов */
            if (!pg || !status) {
                var nodes = container.querySelectorAll('.full-start__tags > *, .full-start-new__tags > *, .full-start__info > *, .interface-info__head > *, .interface-info__tags > *, .info__tags > *');
                for (var i = 0; i < nodes.length; i++) {
                    var el = nodes[i];
                    if (el.children.length > 0 && el.tagName !== 'SPAN') continue;
                    var text = (el.textContent || '').trim();
                    if (!text) continue;

                    if (!pg && /^(\d{1,2}\+|PG(-\d{1,2})?|R|NC-17|G|TV-[A-Z0-9]+)$/i.test(text)) {
                        pg = el;
                    } else if (!status && /(выпущен|в эфире|заверш|анонс|производств|отмен|released|ended|returning|planned)/i.test(text)) {
                        status = el;
                    }
                }
            }

            /* Перемещаем в правый верхний угол: Статус -> Возраст */
            if (pg || status) {
                var box = container.querySelector('.custom-tr-badges');
                if (!box) {
                    box = document.createElement('div');
                    box.className = 'custom-tr-badges';
                    container.appendChild(box);
                }
                if (status && status.parentElement !== box) box.appendChild(status);
                if (pg && pg.parentElement !== box) box.appendChild(pg);
            }

            /* Переносим жанры и длительность под строку года и страны */
            var details = container.querySelector('.full-start__details, .full-start-new__details, .interface-info__details, .info__details');
            if (details && !details.dataset.fixed135) {
                var children = Array.prototype.slice.call(details.children);

                /* Если элементы разделены на дочерние теги (Год, Страна, Жанры, Длительность) */
                if (children.length >= 3) {
                    var br = document.createElement('div');
                    br.className = 'custom-line-break';
                    details.insertBefore(br, children[2]);
                    for (var j = 2; j < children.length; j++) {
                        children[j].classList.add('custom-sub-line');
                    }
                    details.dataset.fixed135 = 'true';
                }
                /* Если строка склеена текстом через точку "·" или разделитель "/" */
                else if (children.length <= 1) {
                    var raw = details.textContent || '';
                    var sep = raw.indexOf('·') !== -1 ? '·' : (raw.indexOf('/') !== -1 ? '/' : '');
                    if (sep) {
                        var parts = raw.split(sep);
                        if (parts.length >= 3) {
                            var topRow = parts.slice(0, 2).join(' ' + sep + ' ').trim();
                            var bottomRow = parts.slice(2).join(' ' + sep + ' ').trim();
                            details.innerHTML = '<span>' + topRow + '</span><div class="custom-line-break"></div><span class="custom-sub-line">' + bottomRow + '</span>';
                            details.dataset.fixed135 = 'true';
                        }
                    }
                }
            }
        }

        function updateAll() {
            injectStyle();
            var targets = document.querySelectorAll('.full-start, .full-start-new, .interface-info, .info');
            for (var i = 0; i < targets.length; i++) {
                processBlock(targets[i]);
            }
        }

        var observer = new MutationObserver(function () {
            updateAll();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        updateAll();
    }

    if (window.Lampa && Lampa.Manifest) {
        Lampa.Manifest.plugins = {
            type: 'other',
            version: '1.3.5-fix',
            name: 'ByLampa 1.3.5 UI Fix',
            description: 'Кастомная карточка 1080p (масштаб Меньше)'
        };
    }

    if (window.appready) {
        startPlugin();
    } else if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') startPlugin();
        });
    } else {
        document.addEventListener('DOMContentLoaded', startPlugin);
    }
})();
