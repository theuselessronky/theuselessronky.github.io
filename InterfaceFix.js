(function () {
    'use strict';

    function startPlugin() {
        if (window.bylampa_tune_v2) return;
        window.bylampa_tune_v2 = true;

        var css = '' +
            /* 1. Скрываем стрелочку Назад и полностью убираем рейтинг на фоне карточки */
            '.head__backward, .head__back { display: none !important; }' +
            '.interface-info__rate, .interface-info__vote, .full-start__rate { display: none !important; }' +

            /* 2. Делаем описание ещё на пункт мельче (под масштаб интерфейса "Меньше") */
            '.interface-info__descr, .full-start__descr {' +
                'font-size: 0.78em !important;' +
                'line-height: 1.3 !important;' +
                'margin-top: 0.4em !important;' +
                'display: -webkit-box !important;' +
                '-webkit-line-clamp: 3 !important;' +
                '-webkit-box-orient: vertical !important;' +
                'overflow: hidden !important;' +
                'max-height: 3.9em !important;' +
            '}' +

            /* 3. Позиционируем статус и возрастное ограничение в верхнем правом углу фона карточки */
            '.interface-info {' +
                'position: relative !important;' +
            '}' +
            '.custom-top-right-badges {' +
                'position: absolute !important;' +
                'top: 1.2em !important;' +
                'right: 2.2em !important;' +
                'display: flex !important;' +
                'flex-direction: row !important;' +
                'align-items: center !important;' +
                'gap: 0.5em !important;' +
                'z-index: 15 !important;' +
                'font-size: 0.85em !important;' +
            '}' +
            '.custom-top-right-badges > * {' +
                'margin: 0 !important;' +
            '}' +

            /* 4. Перенос жанров и длительности на новую строку под годом и страной */
            '.interface-info__details, .full-start__details {' +
                'display: flex !important;' +
                'flex-wrap: wrap !important;' +
                'align-items: center !important;' +
                'font-size: 0.85em !important;' +
                'line-height: 1.25 !important;' +
            '}' +
            '.custom-genres-break {' +
                'flex-basis: 100% !important;' +
                'width: 100% !important;' +
                'height: 0 !important;' +
                'margin: 0 !important;' +
                'padding: 0 !important;' +
            '}' +
            '.custom-second-line {' +
                'margin-top: 0.25em !important;' +
            '}';

        var style = document.createElement('style');
        style.id = 'bylampa-tune-v2-style';
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);

        /* Динамическая перестановка элементов при смене карточки */
        function rearrangeInfo(container) {
            if (!container) return;

            var pg = container.querySelector('.interface-info__pg, .full-start__pg');
            var status = container.querySelector('.interface-info__status, .full-start__status');

            /* Если статус и возраст лежат внутри общего блока тегов без отдельных классов */
            if (!status && pg && pg.parentElement) {
                var siblings = pg.parentElement.children;
                for (var i = 0; i < siblings.length; i++) {
                    var el = siblings[i];
                    if (el !== pg && !el.classList.contains('interface-info__rate') && !el.classList.contains('full-start__rate')) {
                        if (el.textContent && el.textContent.trim().length > 0) {
                            status = el;
                            break;
                        }
                    }
                }
            }

            /* Перемещаем в верхний правый угол: сначала статус, справа от него — возраст */
            if (pg || status) {
                var badgeBox = container.querySelector('.custom-top-right-badges');
                if (!badgeBox) {
                    badgeBox = document.createElement('div');
                    badgeBox.className = 'custom-top-right-badges';
                    container.appendChild(badgeBox);
                }
                if (status && status.parentElement !== badgeBox) badgeBox.appendChild(status);
                if (pg && pg.parentElement !== badgeBox) badgeBox.appendChild(pg);
            }

            /* Переносим жанры и длительность под строку года и страны */
            var details = container.querySelector('.interface-info__details, .full-start__details');
            if (details && !details.dataset.rearranged) {
                var items = Array.prototype.slice.call(details.children);
                if (items.length >= 2) {
                    var breakEl = document.createElement('div');
                    breakEl.className = 'custom-genres-break';

                    /* Вставляем разрыв строки после года и страны (обычно первые 1-2 элемента) */
                    var insertIndex = items.length > 2 ? 2 : 1;
                    details.insertBefore(breakEl, items[insertIndex]);

                    for (var j = insertIndex; j < items.length; j++) {
                        items[j].classList.add('custom-second-line');
                    }
                    details.dataset.rearranged = 'true';
                }
            }
        }

        function scanAll() {
            var blocks = document.querySelectorAll('.interface-info, .full-start');
            for (var i = 0; i < blocks.length; i++) {
                rearrangeInfo(blocks[i]);
            }
        }

        var observer = new MutationObserver(function () {
            scanAll();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        scanAll();
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
