(function () {
    'use strict';
    if (typeof Lampa === 'undefined') return;

    const SHOTS_KEY = 'stylish_show_shots';
    const DESC_KEY = 'stylish_show_description';

    /* ================= ИНИЦИАЛИЗАЦИЯ ================= */

    function startPluginV3() {
        if (!Lampa.Maker || !Lampa.Maker.map || !Lampa.Utils) return;
        if (window.plugin_interface_ready_v3) return;
        window.plugin_interface_ready_v3 = true;

        addStyleV3();
        registerSettings();

        const mainMap = Lampa.Maker.map('Main');
        if (!mainMap || !mainMap.Items || !mainMap.Create) return;

        wrap(mainMap.Items, 'onInit', function (original, args) {
            if (original) original.apply(this, args);
            this.__newInterfaceEnabled = shouldUseNewInterface(this && this.object);
        });
        wrap(mainMap.Create, 'onCreate', function (original, args) {
            if (original) original.apply(this, args);
            if (!this.__newInterfaceEnabled) return;
            ensureState(this).attach();
        });
        wrap(mainMap.Create, 'onCreateAndAppend', function (original, args) {
            const element = args && args[0];
            if (this.__newInterfaceEnabled && element) prepareLineData(element);
            return original ? original.apply(this, args) : undefined;
        });
        wrap(mainMap.Items, 'onAppend', function (original, args) {
            if (original) original.apply(this, args);
            if (!this.__newInterfaceEnabled) return;
            const item = args && args[0];
            const element = args && args[1];
            if (!item || !element) return;

            if (isShotsRow(item, element)) {
                trackShotsRow(item);
                if (getSetting(SHOTS_KEY, true) === false) hideShotsRow(item);
            }

            attachLineHandlers(this, item);
        });
        wrap(mainMap.Items, 'onDestroy', function (original, args) {
            if (this.__newInterfaceState) {
                this.__newInterfaceState.destroy();
                delete this.__newInterfaceState;
            }
            delete this.__newInterfaceEnabled;
            if (original) original.apply(this, args);
        });
    }

    /* ================= ХЕЛПЕРЫ ================= */

    function getSetting(name, defaultValue) {
        const v = Lampa.Storage.field(name);
        return (v === undefined || v === null) ? defaultValue : v;
    }

    function trackShotsRow(item) {
        if (!window.__stylish_shots_rows) window.__stylish_shots_rows = [];
        if (window.__stylish_shots_rows.indexOf(item) === -1) {
            window.__stylish_shots_rows.push(item);
        }
    }

    function hideShotsRow(item) {
        const el = item && typeof item.render === 'function' ? item.render(true) : null;
        if (el) el.classList.add('shots-row-hidden');
    }

    function showShotsRow(item) {
        const el = item && typeof item.render === 'function' ? item.render(true) : null;
        if (el) el.classList.remove('shots-row-hidden');
    }

    function refreshShotsVisibility() {
        const show = getSetting(SHOTS_KEY, true) !== false;
        if (!window.__stylish_shots_rows) return;
        window.__stylish_shots_rows.forEach(function (item) {
            if (show) showShotsRow(item);
            else hideShotsRow(item);
        });
    }

    function isShotsRow(line, element) {
        if (!line && !element) return false;
        const candidates = [
            line && line.title,
            line && line.component,
            line && line.method,
            line && line.type,
            line && line.object && line.object.title,
            line && line.object && line.object.component,
            element && element.title,
            element && element.name,
            element && element.component,
            element && element.method,
            element && element.type
        ].filter(Boolean).map(function (s) { return String(s).toLowerCase(); });
        return candidates.some(function (s) {
            return s.indexOf('shots') !== -1 || s.indexOf('шотс') !== -1;
        });
    }

    function shouldUseNewInterface(object) {
        if (!object) return false;
        if (window.innerWidth < 767) return false;
        return true;
    }

    function ensureState(main) {
        if (main.__newInterfaceState) return main.__newInterfaceState;
        const state = createInterfaceState(main);
        main.__newInterfaceState = state;
        return state;
    }

    function isEpisodeItem(data) {
        if (!data || typeof data !== 'object') return false;
        if (data.media_type === 'episode') return true;
        if (data.show_id && typeof data.episode_number !== 'undefined') return true;
        return false;
    }

    function prepareLineData(element) {
        if (!element || !Array.isArray(element.results)) return;
        element.results.forEach(function (item) {
            if (!item) return;
            if (item.still_path && (item.episode_number !== undefined || item.season_number !== undefined)) {
                item.__is_episode = true;
                if (!item.backdrop_path) item.backdrop_path = item.still_path;
            }
        });
        Lampa.Utils.extendItemsParams(element.results, { style: { name: 'wide' } });
    }

    /* ================= СОСТОЯНИЕ ================= */

    function createInterfaceState(main) {
        const info = new InterfaceInfo();
        info.create();
        const background = document.createElement('img');
        background.className = 'full-start__background';

        const state = {
            main,
            info,
            background,
            infoElement: null,
            backgroundTimer: null,
            backgroundLast: '',
            attached: false,
            lastData: null,
            lastUpdateTime: 0,

            slideshowTimer: null,
            slideshowImages: [],
            slideshowIndex: 0,
            slideshowCurrentId: null,

            attach() {
                if (this.attached) return;
                const container = main.render(true);
                if (!container) return;
                container.classList.add('new-interface');
                if (!background.parentElement) {
                    container.insertBefore(background, container.firstChild || null);
                }
                const infoNode = info.render(true);
                this.infoElement = infoNode;
                if (infoNode && infoNode.parentNode !== container) {
                    if (background.parentElement === container) {
                        container.insertBefore(infoNode, background.nextSibling);
                    } else {
                        container.insertBefore(infoNode, container.firstChild || null);
                    }
                }
                main.scroll.minus(infoNode);
                this.attached = true;
                window.__stylish_refresh = () => {
                    if (this.lastData) this.update(this.lastData, true);
                    refreshShotsVisibility();
                };
            },

            update(data, force) {
                if (!data) return;
                const now = Date.now();
                const isSame = this.lastData && this.lastData.id === data.id;
                if (!force && isSame && now - this.lastUpdateTime < 150) return;
                this.lastUpdateTime = now;

                const isNewItem = !this.lastData || this.lastData.id !== data.id;
                this.lastData = data;

                info.update(data);
                this.updateBackground(data);

                if (isNewItem) {
                    this.stopSlideshow();
                    this.startSlideshow(data);
                }
            },

            updateBackground(data) {
                let imgPath = data && data.backdrop_path;
                if (!imgPath && data && data.still_path) imgPath = data.still_path;
                const path = imgPath ? Lampa.Api.img(imgPath, 'w1280') : '';
                if (!path || path === this.backgroundLast) return;
                clearTimeout(this.backgroundTimer);
                this.backgroundTimer = setTimeout(() => {
                    this.setBackground(path);
                }, 1000);
            },

            setBackground(path) {
                if (!path || background.src === path) return;
                background.classList.remove('loaded');
                background.onload = () => background.classList.add('loaded');
                background.onerror = () => background.classList.remove('loaded');
                this.backgroundLast = path;
                background.src = path;
            },

            startSlideshow(data) {
                this.slideshowCurrentId = data.id;
                this.slideshowImages = [];
                this.slideshowIndex = 0;

                if (!data || !data.id) return;
                if (isEpisodeItem(data)) return;
                if (!Lampa.TMDB || typeof Lampa.TMDB.api !== 'function' || typeof Lampa.TMDB.key !== 'function') return;

                const type = data.media_type === 'tv' || data.name ? 'tv' : 'movie';
                const language = Lampa.Storage.get('language');
                const url = Lampa.TMDB.api(
                    `${type}/${data.id}/images?api_key=${Lampa.TMDB.key()}&language=${language}&include_image_language=${language},null,en`
                );

                const network = new Lampa.Reguest();
                network.timeout(5000);
                network.silent(url, (images) => {
                    if (this.slideshowCurrentId !== data.id) return;
                    const backdrops = (images && images.backdrops) ? images.backdrops : [];
                    let list = backdrops
                        .filter((img) => img.file_path && img.iso_639_1 !== 'xx')
.map((img) => img.file_path);
const current = data.backdrop_path ? '/' + data.backdrop_path.replace(/^//, '') : null;
list = list.filter((p, i, arr) => arr.indexOf(p) === i && p !== current);
this.slideshowImages = list;
this.slideshowIndex = 0;
if (list.length > 0) {
this.slideshowTimer = setInterval(() => {
if (!this.slideshowImages.length) return;
const next = this.slideshowImages[this.slideshowIndex % this.slideshowImages.length];
this.slideshowIndex++;
this.setBackground(Lampa.TMDB.image('t/p/w1280' + next));
}, 10000);
}
});
},
stopSlideshow() {
if (this.slideshowTimer) {
clearInterval(this.slideshowTimer);
this.slideshowTimer = null;
}
this.slideshowImages = [];
this.slideshowIndex = 0;
this.slideshowCurrentId = null;
},
reset() {
clearTimeout(this.backgroundTimer);
this.backgroundTimer = null;
info.empty();
this.stopSlideshow();
},
destroy() {
clearTimeout(this.backgroundTimer);
this.stopSlideshow();
info.destroy();
const container = main.render(true);
if (container) container.classList.remove('new-interface');
if (this.infoElement && this.infoElement.parentNode) {
this.infoElement.parentNode.removeChild(this.infoElement);
}
if (background && background.parentNode) {
background.parentNode.removeChild(background);
}
this.attached = false;
this.lastData = null;
delete window.__stylish_refresh;
}
};
return state;
}
/* ================= КАРТОЧКИ ================= */
function applyEpisodeClass(card) {
if (!card || !isEpisodeItem(card.data)) return;
const el = typeof card.render === 'function' ? card.render(true) : null;
if (el) el.classList.add('episode-card');
}
function updateCardTitle(card) {
if (!card || typeof card.render !== 'function') return;
const element = card.render(true);
if (!element) return;
if (!element.isConnected) {
clearTimeout(card.__newInterfaceLabelTimer);
card.__newInterfaceLabelTimer = setTimeout(() => updateCardTitle(card), 50);
return;
}
clearTimeout(card.__newInterfaceLabelTimer);
const text = (card.data && (card.data.title || card.data.name || card.data.original_title || card.data.original_name))
? (card.data.title || card.data.name || card.data.original_title || card.data.original_name).trim() : '';
const seek = element.querySelector('.new-interface-card-title');
if (!text) {
if (seek && seek.parentNode) seek.parentNode.removeChild(seek);
card.__newInterfaceLabel = null;
return;
}
let label = seek || card.__newInterfaceLabel;
if (!label) {
label = document.createElement('div');
label.className = 'new-interface-card-title';
}
label.textContent = text;
if (!label.parentNode || label.parentNode !== element) {
if (label.parentNode) label.parentNode.removeChild(label);
element.appendChild(label);
}
card.__newInterfaceLabel = label;
}
function decorateCard(state, card) {
if (!card || card.__newInterfaceCard || typeof card.use !== 'function' || !card.data) return;
card.__newInterfaceCard = true;
card.params = card.params || {};
card.params.style = card.params.style || {};
if (!card.params.style.name) card.params.style.name = 'wide';
card.use({
onFocus() { state.update(card.data); },
onHover() { state.update(card.data); },
onTouch() { state.update(card.data); },
onVisible() { applyEpisodeClass(card); updateCardTitle(card); },
onUpdate() { applyEpisodeClass(card); updateCardTitle(card); },
onDestroy() {
clearTimeout(card.__newInterfaceLabelTimer);
if (card.__newInterfaceLabel && card.__newInterfaceLabel.parentNode) {
card.__newInterfaceLabel.parentNode.removeChild(card.__newInterfaceLabel);
}
card.__newInterfaceLabel = null;
delete card.__newInterfaceCard;
}
});
applyEpisodeClass(card);
updateCardTitle(card);
}
function getCardData(card, element, index = 0) {
if (card && card.data) return card.data;
if (element && Array.isArray(element.results)) return element.results[index] || element.results[0];
return null;
}
function getDomCardData(node) {
if (!node) return null;
let current = node && node.jquery ? node[0] : node;
while (current && !current.card_data) current = current.parentNode;
return current && current.card_data ? current.card_data : null;
}
function getFocusedCardData(line) {
const container = line && typeof line.render === 'function' ? line.render(true) : null;
if (!container || !container.querySelector) return null;
const focus = container.querySelector('.selector.focus') || container.querySelector('.focus');
return getDomCardData(focus);
}
function attachLineHandlers(main, line) {
if (!line || line.__newInterfaceLine) return;
line.__newInterfaceLine = true;
const state = ensureState(main);
const applyToCard = (card) => decorateCard(state, card);
line.use({
onInstance(card) { applyToCard(card); },
onActive(card, itemData) {
const current = getCardData(card, itemData);
if (current) state.update(current);
},
onToggle() {
setTimeout(() => {
const domData = getFocusedCardData(line);
if (domData) state.update(domData);
}, 32);
},
onMore() { state.reset(); },
onDestroy() {
state.reset();
delete line.__newInterfaceLine;
}
});
if (Array.isArray(line.items) && line.items.length) line.items.forEach(applyToCard);
if (line.last) {
const lastData = getDomCardData(line.last);
if (lastData) state.update(lastData);
}
}
function wrap(target, method, handler) {
if (!target) return;
const original = typeof target[method] === 'function' ? target[method] : null;
target[method] = function (...args) {
return handler.call(this, original, args);
};
}
/* ================= НАСТРОЙКИ ================= */
function registerSettings() {
if (window.__stylish_settings_registered) return;
window.__stylish_settings_registered = true;
Lampa.SettingsApi.addComponent({
component: 'stylish_interface',
name: 'Стильный Интерфейс',
icon: ''
});
const params = [
{ name: 'stylish_show_pg',      label: 'Возрастное ограничение', desc: 'Показывать на фоне выделенной карточки' },
{ name: 'stylish_show_runtime', label: 'Время',                 desc: 'Показывать на фоне выделенной карточки' },
{ name: 'stylish_show_rating',  label: 'Рейтинг',               desc: 'Показывать на фоне выделенной карточки' },
{ name: 'stylish_show_genres',  label: 'Жанры',                 desc: 'Показывать на фоне выделенной карточки' },
{ name: 'stylish_show_year',    label: 'Год',                   desc: 'Показывать на фоне выделенной карточки' },
{ name: 'stylish_show_country', label: 'Страна',                desc: 'Показывать на фоне выделенной карточки' },
{ name: SHOTS_KEY,              label: 'Shots',                 desc: 'Показывать блок Shots на главной странице' },
{ name: DESC_KEY,               label: 'Описание',              desc: 'Показывать описание на фоне выделенной карточки' }
];
params.forEach(function (p) {
Lampa.SettingsApi.addParam({
component: 'stylish_interface',
param: { name: p.name, type: 'trigger', default: true },
field: { name: p.label, description: p.desc },
onChange: function () {
if (window.__stylish_refresh) window.__stylish_refresh();
refreshShotsVisibility();
}
});
});
}
/* ================= СТИЛИ ================= */
function addStyleV3() {
if (addStyleV3.added) return;
addStyleV3.added = true;
Lampa.Template.add('new_interface_style_v3', `
.new-interface { position: relative; }
.new-interface .card.card--wide { width: 18.3em; }
/* Привязка информационного блока над рядами карточек (как в оригинале для корректного скролла) */
.new-interface-info {
position: relative;
z-index: 1;
padding: 1.5em;
height: 25.5em;
margin-bottom: 2.6em;
display: flex;
flex-direction: column;
justify-content: space-between;
box-sizing: border-box;
pointer-events: none;
}
/* Верхний правый угол: описание */
.new-interface-info__head {
width: 45%;
align-self: flex-end;
display: flex;
justify-content: flex-end;
padding-top: 0.5em;
}
.new-interface-info__body {
width: 100%;
display: flex;
align-items: flex-end;
justify-content: space-between;
gap: 1.5em;
position: relative;
}
/* Левая нижняя колонка: год/страна -> название -> жанры */
.new-interface-info__left-bottom {
display: flex;
flex-direction: column;
align-items: flex-start;
gap: 0.35em;
max-width: 70%;
min-width: 0;
}
/* Правая нижняя строка: длительность • pg • рейтинг */
.new-interface-info__right-bottom {
display: flex;
align-items: center;
justify-content: flex-end;
gap: 0.6em;
font-size: 0.95em;
color: rgba(255, 255, 255, 0.85);
text-shadow: 0 2px 6px rgba(0, 0, 0, 0.95), 0 0 2px rgba(0, 0, 0, 0.8);
white-space: nowrap;
flex-shrink: 0;
}
/* Описание */
.new-interface-info__description {
font-size: 0.95em;
font-weight: 300;
line-height: 1.4;
color: #fff;
text-shadow: 0 2px 8px rgba(0, 0, 0, 0.95), 0 0 2px rgba(0, 0, 0, 0.8);
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 3;
line-clamp: 3;
-webkit-box-orient: vertical;
max-height: 4.2em;
min-height: 0;
text-align: right;
width: 100%;
overflow-wrap: anywhere;
word-break: break-word;
}
.new-interface-info__description:empty { display: none; }
/* Название / Лого */
.new-interface-info__title {
font-size: 3.4em;
font-weight: 600;
line-height: 1.15;
color: #fff;
text-shadow: 0 2px 8px rgba(0, 0, 0, 0.95), 0 0 2px rgba(0, 0, 0, 0.8);
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
max-width: 100%;
margin-left: -0.03em;
}
.new-interface-info__title img {
max-height: 1.8em;
max-width: 6.8em;
margin-top: 0.2em;
margin-bottom: 0.1em;
display: block;
}
/* Год • Страна */
.new-interface-info__meta-top {
font-size: 0.95em;
color: rgba(255, 255, 255, 0.75);
text-shadow: 0 2px 6px rgba(0, 0, 0, 0.95), 0 0 2px rgba(0, 0, 0, 0.8);
display: flex;
align-items: center;
gap: 0.4em;
}
/* Жанры */
.new-interface-info__genres {
font-size: 0.9em;
color: rgba(255, 255, 255, 0.8);
text-shadow: 0 2px 6px rgba(0, 0, 0, 0.95), 0 0 2px rgba(0, 0, 0, 0.8);
margin-top: 0.15em;
}
/* Разделители */
.new-interface-info__split {
margin: 0 0.4em;
font-size: 0.6em;
color: rgba(255, 255, 255, 0.45);
display: inline-block;
vertical-align: middle;
}
/* Рейтинг */
.new-interface-info__rate {
display: inline-flex;
align-items: baseline;
gap: 0.25em;
}
.new-interface-info__rate > div:first-child {
color: #fff;
font-weight: 600;
text-shadow: 0 2px 6px rgba(0, 0, 0, 0.95);
}
.new-interface-info__rate > div:last-child {
color: rgba(255, 255, 255, 0.55);
font-size: 0.8em;
}
/* Фон */
.new-interface .full-start__background {
position: absolute;
top: -6em;
left: 0;
width: 100%;
height: 108%;
z-index: 0;
object-fit: cover;
transition: opacity 0.4s ease;
opacity: 0;
}
.new-interface .full-start__background.loaded { opacity: 1; }
.new-interface .card-more__box { padding-bottom: 95%; }
.new-interface .full-start__rate { font-size: 1.3em; margin-right: 0; }
.new-interface .card__promo { display: none; }
.new-interface .card.card--wide + .card-more .card-more__box { padding-bottom: 95%; }
.new-interface .card.card--wide .card-watched { display: none !important; }
.new-interface .card__title,
.new-interface .card__age { display: none; }
.new-interface .card.episode-card .card__poster,
.new-interface .card.episode-card .card__img,
.new-interface .card.episode-card .card__view > img { display: none !important; }
.new-interface .card.episode-card .card__view {
background-size: cover;
background-position: center;
}
.new-interface .shots-row-hidden { display: none !important; }
.new-interface-card-title {
margin-top: 0.6em;
font-size: 1.05em;
font-weight: 500;
color: #fff;
display: block;
text-align: left;
max-width: 100%;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
pointer-events: none;
}
body.light--version .new-interface-card-title { color: #111; }
body.light--version .new-interface-info { height: 26.8em; margin-bottom: 2.6em; }
body.advanced--animation:not(.no--animation) .new-interface .card.card--wide.focus .card__view {
animation: animation-card-focus 0.2s;
}
body.advanced--animation:not(.no--animation) .new-interface .card.card--wide.animate-trigger-enter .card__view {
animation: animation-trigger-enter 0.2s forwards;
}
/* Светлая тема — инвертированная тень */
body.light--version .new-interface-info__description,
body.light--version .new-interface-info__title,
body.light--version .new-interface-info__meta-top,
body.light--version .new-interface-info__genres,
body.light--version .new-interface-info__right-bottom {
color: #111;
text-shadow: 0 1px 6px rgba(255, 255, 255, 0.9), 0 0 2px rgba(255, 255, 255, 0.8);
}
body.light--version .new-interface-info__rate > div:first-child {
color: #111;
text-shadow: 0 1px 4px rgba(255, 255, 255, 0.9);
}
body.light--version .new-interface-info__rate > div:last-child {
color: rgba(0, 0, 0, 0.55);
}
`);
$('body').append(Lampa.Template.get('new_interface_style_v3', {}, true));
}
/* ================= INFO PANEL ================= */
class InterfaceInfo {
constructor() {
this.html = null;
this.timer = null;
this.network = new Lampa.Reguest();
this.loaded = {};
this.currentUrl = null;
}
create() {
if (this.html) return;
this.html = $(<div class="new-interface-info"> <div class="new-interface-info__head"> <div class="new-interface-info__description"></div> </div> <div class="new-interface-info__body"> <div class="new-interface-info__left-bottom"> <div class="new-interface-info__meta-top"></div> <div class="new-interface-info__title"></div> <div class="new-interface-info__genres"></div> </div> <div class="new-interface-info__right-bottom"></div> </div> </div>);
}
render(js) {
if (!this.html) this.create();
return js ? this.html[0] : this.html;
}
cleanOverview(text) {
if (!text) return '';
const clean = String(text).trim();
const noDesc = Lampa.Lang && typeof Lampa.Lang.translate === 'function' ? Lampa.Lang.translate('nofind_movie') : '';
if (clean === 'Без описания' || (noDesc && clean === noDesc)) return '';
return clean;
}
clear() {
if (!this.html) return;
this.html.find('.new-interface-info__description').empty();
this.html.find('.new-interface-info__title').empty();
this.html.find('.new-interface-info__meta-top').empty();
this.html.find('.new-interface-info__genres').empty();
this.html.find('.new-interface-info__right-bottom').empty();
}
update(data) {
if (!data) return;
if (!this.html) this.create();
this.currentUrl = null;
this.clear();
const title = data.title || data.name || data.original_title || data.original_name || '';
if (title) this.html.find('.new-interface-info__title').text(title);
const showDesc = getSetting(DESC_KEY, true);
if (showDesc && !isEpisodeItem(data)) {
const overview = this.cleanOverview(data.overview);
if (overview) {
this.html.find('.new-interface-info__description').text(this.truncateDescription(overview));
}
}
const bg = Lampa.Utils.cardImgBackground(data);
if (bg) Lampa.Background.change(bg);
this.load(data);
}
truncateDescription(text, maxChars = 180) {
if (!text) return '';
if (text.length <= maxChars) return text;
let cut = text.slice(0, maxChars);
const lastSpace = cut.lastIndexOf(' ');
if (lastSpace > maxChars * 0.6) cut = cut.slice(0, lastSpace);
cut = cut.replace(/[\s,.;:!?-]+$/, '');
return cut ? cut + '…' : text.slice(0, maxChars - 1) + '…';
}
load(data) {
if (!data || !data.id) return;
if (isEpisodeItem(data)) return;
if (!Lampa.TMDB || typeof Lampa.TMDB.api !== 'function' || typeof Lampa.TMDB.key !== 'function') return;
const type = data.media_type === 'tv' || data.name ? 'tv' : 'movie';
const language = Lampa.Storage.get('language');
const url = Lampa.TMDB.api(${type}/${data.id}?api_key=${Lampa.TMDB.key()}&append_to_response=content_ratings,release_dates,images&language=${language});
this.currentUrl = url;
if (this.loaded[url]) { this.draw(this.loaded[url]); return; }
clearTimeout(this.timer);
this.timer = setTimeout(() => {
this.network.clear();
this.network.timeout(5000);
this.network.silent(url, (movie) => {
this.loaded[url] = movie;
if (this.currentUrl === url) this.draw(movie);
});
}, 300);
}
draw(movie) {
if (!movie || !this.html) return;
const sources = Lampa.Api && Lampa.Api.sources && Lampa.Api.sources.tmdb ? Lampa.Api.sources.tmdb : null;
const create = ((movie.release_date || movie.first_air_date || '0000') + '').slice(0, 4);
const vote = parseFloat((movie.vote_average || 0) + '').toFixed(1);
const countries = sources && typeof sources.parseCountries === 'function' ? sources.parseCountries(movie) : [];
const pg = sources && typeof sources.parsePG === 'function' ? sources.parsePG(movie) : '';
const showYear = getSetting('stylish_show_year', true);
const showCountry = getSetting('stylish_show_country', true);
const showRuntime = getSetting('stylish_show_runtime', true);
const showRating = getSetting('stylish_show_rating', true);
const showPg = getSetting('stylish_show_pg', true);
const showGenres = getSetting('stylish_show_genres', true);
const showDesc = getSetting(DESC_KEY, true);
// Год • Страна
const metaParts = [];
if (showYear && create !== '0000') metaParts.push(create);
if (showCountry && countries && countries.length) metaParts.push(countries.join(', '));
if (metaParts.length) {
this.html.find('.new-interface-info__meta-top').html(metaParts.join('●'));
}
// Жанры
if (showGenres && Array.isArray(movie.genres) && movie.genres.length) {
const genresText = movie.genres.map((i) => Lampa.Utils.capitalizeFirstLetter(i.name)).join(', ');
this.html.find('.new-interface-info__genres').text(genresText);
}
// Правая нижняя строка: длительность • PG • рейтинг
const rightParts = [];
if (showRuntime && movie.runtime) {
rightParts.push({ html: Lampa.Utils.secondsToTime(movie.runtime * 60, true), isRate: false });
}
if (showPg && pg) {
rightParts.push({ html: pg, isRate: false });
}
if (showRating && vote > 0) {
rightParts.push({
html: <div class="new-interface-info__rate"><div>${vote}</div><div>TMDB</div></div>,
isRate: true
});
}
if (rightParts.length) {
const html = rightParts.map(function (part, index) {
if (index === 0) return part.html;
return '●' + part.html;
}).join('');
this.html.find('.new-interface-info__right-bottom').html(html);
}
// Описание из TMDB (если включено и не заполнилось сразу из карточки)
if (showDesc) {
const overview = this.cleanOverview(movie.overview);
if (overview && !this.html.find('.new-interface-info__description').text()) {
this.html.find('.new-interface-info__description').text(this.truncateDescription(overview));
}
}
// Логотип заменяет текстовое название
if (movie.images && movie.images.logos && movie.images.logos.length > 0) {
const logoPath = movie.images.logos[0].file_path;
if (logoPath) {
this.html.find('.new-interface-info__title').html(
''
);
}
}
}
empty() {
this.clear();
}
destroy() {
clearTimeout(this.timer);
this.network.clear();
this.loaded = {};
this.currentUrl = null;
if (this.html) { this.html.remove(); this.html = null; }
}
}
/* ================= ЗАПУСК ================= */
if (Lampa.Manifest.app_digital >= 300) {
startPluginV3();
return;
}
})();
