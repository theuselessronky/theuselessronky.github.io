(function () {
    'use strict';

    function startPlugin() {
        if (window.bylampa_tune_ready) return;
        window.bylampa_tune_ready = true;

        var css = '' +
            '.head__backward, .head__back { display: none !important; }' +
            '.interface-info__details, .interface-info__details > div, .interface-info__rate, .interface-info__vote, .full-start__rate, .full-start__pg, .full-start__details { font-size: 0.85em !important; line-height: 1.2 !important; }' +
            '.interface-info__rate, .full-start__rate { padding: 0.15em 0.45em !important; }' +
            '.interface-info__descr, .full-start__descr { font-size: 0.88em !important; line-height: 1.35 !important; margin-top: 0.4em !important; display: -webkit-box !important; -webkit-line-clamp: 3 !important; -webkit-box-orient: vertical !important; overflow: hidden !important; max-height: 4.1em !important; }';

        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
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
