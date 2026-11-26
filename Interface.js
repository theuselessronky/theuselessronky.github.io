(function () {
'use strict';
if (typeof Lampa === 'undefined') return;
var SHOTS_KEY = 'stylish_show_shots';
function startPluginV3() {
try {
if (!Lampa.Maker || typeof Lampa.Maker.map !== 'function' || !Lampa.Utils) return;
if (window.plugin_interface_ready_v3) return;
var mainMap = Lampa.Maker.map('Main');
if (!mainMap || !mainMap.Items || !mainMap.Create) return;
window.plugin_interface_ready_v3 = true;
addStyleV3();
registerSettings();
wrap(mainMap.Items, 'onInit', function (original, args) {
if (original) original.apply(this, args);
try {
this.__newInterfaceEnabled = shouldUseNewInterface(this && this.object);
} catch (e) {}
});
wrap(mainMap.Create, 'onCreate', function (original, args) {
if (original) original.apply(this, args);
try {
if (!this.__newInterfaceEnabled) return;
ensureState(this).attach();
} catch (e) {}
});
wrap(mainMap.Create, 'onCreateAndAppend', function (original, args) {
try {
var element = Array.isArray(args) && args.length > 0 ? args.slice(0, 1).pop() : null;
if (this.__newInterfaceEnabled && element) prepareLineData(element);
} catch (e) {}
return original ? original.apply(this, args) : undefined;
});
wrap(mainMap.Items, 'onAppend', function (original, args) {
if (original) original.apply(this, args);
try {
if (!this.__newInterfaceEnabled) return;
var list = Array.isArray(args) ? args : [];
var item = list.length > 0 ? list.slice(0, 1).pop() : null;
var element = list.length > 1 ? list.slice(1, 2).pop() : null;
if (!item || !element) return;
checkAndTrackShots(item, element);
attachLineHandlers(this, item);
} catch (e) {}
});
wrap(mainMap.Items, 'onDestroy', function (original, args) {
try {
if (this.__newInterfaceState) {
this.__newInterfaceState.destroy();
delete this.__newInterfaceState;
}
delete this.__newInterfaceEnabled;
} catch (e) {}
if (original) original.apply(this, args);
});
} catch (e) {}
}
function getSetting(name, defaultValue) {
if (!Lampa.Storage || typeof Lampa.Storage.field !== 'function') return defaultValue;
var v = Lampa.Storage.field(name);
return (v === undefined || v === null) ? defaultValue : v;
}
function checkAndTrackShots(item, element) {
if (isShotsRow(item, element)) {
trackShotsRow(item);
if (getSetting(SHOTS_KEY, true) === false) hideShotsRow(item);
return;
}
setTimeout(function () {
try {
if (isShotsRow(item, element)) {
trackShotsRow(item);
if (getSetting(SHOTS_KEY, true) === false) hideShotsRow(item);
}
} catch (e) {}
}, 100);
}
function trackShotsRow(item) {
if (!window.__stylish_shots_rows) window.__stylish_shots_rows = [];
if (window.__stylish_shots_rows.indexOf(item) === -1) {
window.__stylish_shots_rows.push(item);
}
}
function hideShotsRow(item) {
var el = item && typeof item.render === 'function' ? item.render(true) : null;
if (el && el.classList) el.classList.add('shots-row-hidden');
}
function showShotsRow(item) {
var el = item && typeof item.render === 'function' ? item.render(true) : null;
if (el && el.classList) el.classList.remove('shots-row-hidden');
}
function refreshShotsVisibility() {
var show = getSetting(SHOTS_KEY, true) !== false;
if (!Array.isArray(window.__stylish_shots_rows)) return;
window.__stylish_shots_rows.forEach(function (item) {
if (show) showShotsRow(item);
else hideShotsRow(item);
});
}
function isShotsRow(line, element) {
if (!line && !element) return false;
var domTitle = '';
var el = line && typeof line.render === 'function' ? line.render(true) : null;
if (el && el.querySelector) {
var titleNode = el.querySelector('.items-line__title');
if (titleNode) domTitle = titleNode.textContent || '';
}
var candidates = [
domTitle,
line && line.title,
line && line.component,
line && line.method,
line && line.object && line.object.title,
line && line.object && line.object.component,
element && element.title,
element && element.name,
element && element.component,
element && element.method
];
var found = false;
candidates.forEach(function (val) {
if (!val || found) return;
var str = String(val).toLowerCase();
if (str.indexOf('shots') !== -1 || str.indexOf('шотс') !== -1) found = true;
});
return found;
}
function shouldUseNewInterface(object) {
if (!object) return false;
if (window.innerWidth < 767) return false;
return true;
}
function ensureState(main) {
if (main.__newInterfaceState) return main.__newInterfaceState;
var state = createInterfaceState(main);
main.__newInterfaceState = state;
return state;
}
function isEpisodeItem(data) {
if (!data) return false;
if (data.__is_episode) return true;
if (data.media_type === 'episode' || data.type === 'episode') return true;
if (data.still_path && (data.episode_number !== undefined || data.season_number !== undefined)) return true;
if (data.episode_number !== undefined || data.season_number !== undefined) return true;
return false;
}
function prepareLineData(element) {
if (!element || !Array.isArray(element.results)) return;
element.results.forEach(function (item) {
if (!item) return;
if (isEpisodeItem(item)) {
item.__is_episode = true;
if (!item.backdrop_path && item.still_path) {
item.backdrop_path = item.still_path;
}
}
});
if (typeof Lampa.Utils.extendItemsParams === 'function') {
Lampa.Utils.extendItemsParams(element.results, { style: { name: 'wide' } });
}
}
function createInterfaceState(main) {
var info = new InterfaceInfo();
info.create();
var background = document.createElement('img');
background.className = 'full-start__background';
var slideNetwork = new Lampa.Reguest();
var state = {
main: main,
info: info,
background: background,
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
attach: function () {
try {
var self = this;
if (this.attached) return;
var container = main && typeof main.render === 'function' ? main.render(true) : null;
if (!container) return;
container.classList.add('new-interface');
if (!background.parentElement) {
container.insertBefore(background, container.firstChild || null);
}
var infoNode = info.render(true);
this.infoElement = infoNode;
if (infoNode && infoNode.parentNode !== container) {
if (background.parentElement === container) {
container.insertBefore(infoNode, background.nextSibling);
} else {
container.insertBefore(infoNode, container.firstChild || null);
}
}
if (infoNode && main.scroll && typeof main.scroll.minus === 'function') {
main.scroll.minus(infoNode);
}
this.attached = true;
window.__stylish_refresh = function () {
try {
if (self.lastData) self.update(self.lastData, true);
refreshShotsVisibility();
} catch (e) {}
};
} catch (e) {}
},
update: function (data, force) {
try {
if (!data) return;
var now = Date.now();
var isSame = this.lastData && this.lastData.id === data.id;
if (!force && isSame && now - this.lastUpdateTime < 150) return;
this.lastUpdateTime = now;
var isNewItem = !this.lastData || this.lastData.id !== data.id;
this.lastData = data;
info.update(data);
this.updateBackground(data);
if (isNewItem) {
this.stopSlideshow();
this.startSlideshow(data);
}
} catch (e) {}
},
updateBackground: function (data) {
var self = this;
var imgPath = data && data.backdrop_path;
if (!imgPath && data && data.still_path) imgPath = data.still_path;
var path = imgPath && Lampa.Api && typeof Lampa.Api.img === 'function' ? Lampa.Api.img(imgPath, 'w1280') : '';
if (!path || path === this.backgroundLast) return;
clearTimeout(this.backgroundTimer);
this.backgroundTimer = setTimeout(function () {
try {
self.setBackground(path);
} catch (e) {}
}, 1000);
},
setBackground: function (path) {
if (!path || background.src === path) return;
background.classList.remove('loaded');
background.onload = function () {
background.classList.add('loaded');
};
background.onerror = function () {
background.classList.remove('loaded');
};
this.backgroundLast = path;
background.src = path;
},
startSlideshow: function (data) {
var self = this;
this.slideshowCurrentId = data.id;
this.slideshowImages = [];
this.slideshowIndex = 0;
if (!data || !data.id) return;
if (isEpisodeItem(data)) return;
if (!Lampa.TMDB || typeof Lampa.TMDB.api !== 'function' || typeof Lampa.TMDB.key !== 'function') return;
var type = data.media_type === 'tv' || data.name ? 'tv' : 'movie';
var language = Lampa.Storage.get('language');
var url = Lampa.TMDB.api(
type + '/' + data.id + '/images?api_key=' + Lampa.TMDB.key() + '&language=' + language + '&include_image_language=' + language + ',null,en'
);
slideNetwork.clear();
slideNetwork.timeout(5000);
slideNetwork.silent(url, function (images) {
try {
if (self.slideshowCurrentId !== data.id) return;
var backdrops = (images && Array.isArray(images.backdrops)) ? images.backdrops : [];
var current = data.backdrop_path ? '/' + String(data.backdrop_path).replace(/^//, '') : null;
var list = [];
backdrops.forEach(function (img) {
if (img && img.file_path && img.iso_639_1 !== 'xx' && img.file_path !== current && list.indexOf(img.file_path) === -1) {
list.push(img.file_path);
}
});
self.slideshowImages = list;
self.slideshowIndex = 0;
if (list.length > 0 && typeof Lampa.TMDB.image === 'function') {
self.slideshowTimer = setInterval(function () {
try {
if (!self.slideshowImages.length) return;
var idx = self.slideshowIndex % self.slideshowImages.length;
var next = self.slideshowImages.slice(idx, idx + 1).pop();
self.slideshowIndex++;
if (next) self.setBackground(Lampa.TMDB.image('t/p/w1280' + next));
} catch (e) {}
}, 10000);
}
} catch (e) {}
});
},
stopSlideshow: function () {
slideNetwork.clear();
if (this.slideshowTimer) {
clearInterval(this.slideshowTimer);
this.slideshowTimer = null;
}
this.slideshowImages = [];
this.slideshowIndex = 0;
this.slideshowCurrentId = null;
},
reset: function () {
clearTimeout(this.backgroundTimer);
this.backgroundTimer = null;
info.empty();
this.stopSlideshow();
},
destroy: function () {
try {
clearTimeout(this.backgroundTimer);
this.stopSlideshow();
info.destroy();
var container = main && typeof main.render === 'function' ? main.render(true) : null;
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
} catch (e) {}
}
};
return state;
}
function applyEpisodeClass(card) {
if (!card) return;
var el = typeof card.render === 'function' ? card.render(true) : null;
if (!el) return;
var isEp = isEpisodeItem(card.data) || (el.classList && el.classList.contains('card--episode'));
if (isEp && el.classList) {
el.classList.add('episode-card');
}
}
function updateCardTitle(card) {
if (!card || typeof card.render !== 'function') return;
var element = card.render(true);
if (!element) return;
if (!element.isConnected) {
clearTimeout(card.__newInterfaceLabelTimer);
card.__newInterfaceLabelTimer = setTimeout(function () {
try {
updateCardTitle(card);
} catch (e) {}
}, 50);
return;
}
clearTimeout(card.__newInterfaceLabelTimer);
var text = (card.data && (card.data.title || card.data.name || card.data.original_title || card.data.original_name))
? String(card.data.title || card.data.name || card.data.original_title || card.data.original_name).trim() : '';
var seek = element.querySelector('.new-interface-card-title');
if (!text) {
if (seek && seek.parentNode) seek.parentNode.removeChild(seek);
card.__newInterfaceLabel = null;
return;
}
var label = seek || card.__newInterfaceLabel;
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
onFocus: function () {
try { state.update(card.data); } catch (e) {}
},
onHover: function () {
try { state.update(card.data); } catch (e) {}
},
onTouch: function () {
try { state.update(card.data); } catch (e) {}
},
onVisible: function () {
try { applyEpisodeClass(card); updateCardTitle(card); } catch (e) {}
},
onUpdate: function () {
try { applyEpisodeClass(card); updateCardTitle(card); } catch (e) {}
},
onDestroy: function () {
try {
clearTimeout(card.__newInterfaceLabelTimer);
if (card.__newInterfaceLabel && card.__newInterfaceLabel.parentNode) {
card.__newInterfaceLabel.parentNode.removeChild(card.__newInterfaceLabel);
}
card.__newInterfaceLabel = null;
delete card.__newInterfaceCard;
} catch (e) {}
}
});
applyEpisodeClass(card);
updateCardTitle(card);
}
function getCardData(card, element, index) {
if (card && card.data) return card.data;
if (element && Array.isArray(element.results) && element.results.length > 0) {
var idx = index || 0;
return element.results.slice(idx, idx + 1).pop() || null;
}
return null;
}
function getDomCardData(node) {
if (!node) return null;
var current = node.jquery ? node.get(0) : node;
while (current && !current.card_data) current = current.parentNode;
return current && current.card_data ? current.card_data : null;
}
function getFocusedCardData(line) {
var container = line && typeof line.render === 'function' ? line.render(true) : null;
if (!container || !container.querySelector) return null;
var focus = container.querySelector('.selector.focus') || container.querySelector('.focus');
return getDomCardData(focus);
}
function attachLineHandlers(main, line) {
if (!line || line.__newInterfaceLine || typeof line.use !== 'function') return;
line.__newInterfaceLine = true;
var state = ensureState(main);
var applyToCard = function (card) {
try {
decorateCard(state, card);
} catch (e) {}
};
line.use({
onInstance: function (card) {
try { applyToCard(card); } catch (e) {}
},
onActive: function (card, itemData) {
try {
var current = getCardData(card, itemData, 0);
if (current) state.update(current);
} catch (e) {}
},
onToggle: function () {
setTimeout(function () {
try {
var domData = getFocusedCardData(line);
if (domData) state.update(domData);
} catch (e) {}
}, 32);
},
onMore: function () {
try { state.reset(); } catch (e) {}
},
onDestroy: function () {
try {
state.reset();
delete line.__newInterfaceLine;
} catch (e) {}
}
});
if (Array.isArray(line.items) && line.items.length) {
line.items.forEach(applyToCard);
}
if (line.last) {
var lastData = getDomCardData(line.last);
if (lastData) state.update(lastData);
}
}
function wrap(target, method, handler) {
if (!target) return;
var original = typeof target[method] === 'function' ? target[method] : null;
target[method] = function () {
var args = Array.prototype.slice.call(arguments);
return handler.call(this, original, args);
};
}
function registerSettings() {
try {
if (!Lampa.SettingsApi || window.__stylish_settings_registered) return;
window.__stylish_settings_registered = true;
Lampa.SettingsApi.addComponent({
component: 'stylish_interface',
name: 'Стильный Интерфейс',
icon: ''
});
var params = [
{ name: 'stylish_show_pg',      label: 'Возрастное ограничение', desc: 'Показывать на фоне выделенной карточки' },
{ name: 'stylish_show_runtime', label: 'Время',                 desc: 'Показывать на фоне выделенной карточки' },
{ name: 'stylish_show_rating',  label: 'Рейтинг',               desc: 'Показывать на фоне выделенной карточки' },
{ name: 'stylish_show_genres',  label: 'Жанры',                 desc: 'Показывать на фоне выделенной карточки' },
{ name: 'stylish_show_year',    label: 'Год',                   desc: 'Показывать на фоне выделенной карточки' },
{ name: 'stylish_show_country', label: 'Страна',                desc: 'Показывать на фоне выделенной карточки' },
{ name: SHOTS_KEY,              label: 'Shots',                 desc: 'Показывать блок Shots на главной странице' }
];
params.forEach(function (p) {
Lampa.SettingsApi.addParam({
component: 'stylish_interface',
param: { name: p.name, type: 'trigger', default: true },
field: { name: p.label, description: p.desc },
onChange: function () {
try {
if (window.__stylish_refresh) window.__stylish_refresh();
refreshShotsVisibility();
} catch (e) {}
}
});
});
} catch (e) {}
}
function addStyleV3() {
if (addStyleV3.added) return;
addStyleV3.added = true;
var css = [
'.new-interface { position: relative; }',
'.new-interface .card.card--wide { width: 18.3em; }',
'.new-interface-info { position: relative; z-index: 1; padding: 1.5em; height: 25.5em; margin-bottom: 2.6em; }',
'.new-interface-info__body { width: 100%; padding-top: 1.1em; display: flex; flex-direction: column; }',
'.new-interface-info__head { display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 1em; margin-bottom: 1em; font-size: 1.3em; min-height: 1em; color: rgba(255, 255, 255, 0.6); }',
'.new-interface-info__head span { color: #fff; }',
'.new-interface-info__head-left:empty, .new-interface-info__head-right:empty { display: none; }',
'.new-interface-info__head-left { display: flex; align-items: center; flex-wrap: wrap; color: rgba(255, 255, 255, 0.75); font-size: 0.95em; white-space: nowrap; }',
'.new-interface-info__head-right { display: flex; align-items: center; justify-content: flex-end; margin-left: auto; flex-wrap: wrap; color: rgba(255, 255, 255, 0.75); font-size: 0.85em; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
'.new-interface-info__head-right .full-start__pg { display: inline-flex; align-items: center; margin: 0; font-size: 0.95em; line-height: 1; color: #fff; }',
'.new-interface-info__head-left .full-start__rate { display: inline-flex; align-items: baseline; gap: 0.25em; font-size: 1em; margin: 0; }',
'.new-interface-info__head-left .full-start__rate > div:first-child { color: #fff; font-weight: 600; }',
'.new-interface-info__head-left .full-start__rate > div:last-child { color: rgba(255, 255, 255, 0.5); font-size: 0.8em; }',
'.new-interface-info__split { margin: 0 0.6em; font-size: 0.55em; color: rgba(255, 255, 255, 0.35); display: inline-block; vertical-align: middle; }',
'.new-interface-info__title { width: 80%; font-size: 4em; font-weight: 600; margin-bottom: 0.3em; overflow: hidden; text-overflow: "."; display: -webkit-box; -webkit-line-clamp: 1; line-clamp: 1; -webkit-box-orient: vertical; margin-left: -0.03em; line-height: 1.3; }',
'.new-interface-info__description { font-size: 1.0em; font-weight: 300; line-height: 1.45; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; width: 70%; overflow-wrap: anywhere; word-break: break-word; }',
'.new-interface-info__description:empty { display: none; }',
'.new-interface .card-more__box { padding-bottom: 95%; }',
'.new-interface .full-start__background { position: absolute; top: -6em; left: 0; width: 100%; height: 108%; z-index: 0; transition: opacity 0.4s ease; opacity: 0; }',
'.new-interface .full-start__background.loaded { opacity: 1; }',
'.new-interface .full-start__rate { font-size: 1.3em; margin-right: 0; }',
'.new-interface .card__promo { display: none; }',
'.new-interface .card.card--wide + .card-more .card-more__box { padding-bottom: 95%; }',
'.new-interface .card.card--wide .card-watched { display: none !important; }',
'.new-interface .card.episode-card .card__poster, .new-interface .card.card--episode .card__poster { display: none !important; }',
'.new-interface .shots-row-hidden { display: none !important; }',
'.new-interface-card-title { margin-top: 0.6em; font-size: 1.05em; font-weight: 500; color: #fff; display: block; text-align: left; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; pointer-events: none; }',
'body.light--version .new-interface-card-title { color: #111; }',
'body.light--version .new-interface-info__body { padding-top: 1.5em; }',
'body.light--version .new-interface-info__title { width: 69%; }',
'body.light--version .new-interface-info { height: 26.8em; margin-bottom: 2.6em; }',
'body.advanced--animation:not(.no--animation) .new-interface .card.card--wide.focus .card__view { animation: animation-card-focus 0.2s; }',
'body.advanced--animation:not(.no--animation) .new-interface .card.card--wide.animate-trigger-enter .card__view { animation: animation-trigger-enter 0.2s forwards; }',
'.new-interface .card__title, .new-interface .card__age { display: none; }'
].join('\n');
var style = document.createElement('style');
style.type = 'text/css';
style.textContent = css;
(document.head || document.documentElement).appendChild(style);
}
function InterfaceInfo() {
this.html = null;
this.timer = null;
this.network = new Lampa.Reguest();
this.loaded = {};
this.currentUrl = null;
}
InterfaceInfo.prototype.create = function () {
if (this.html) return;
var jq = window.jQuery || window.$;
if (!jq) return;
this.html = jq([
'',
'    ',
'        ',
'            ',
'            ',
'        ',
'        ',
'        ',
'    ',
''
].join('\n'));
};
InterfaceInfo.prototype.render = function (js) {
if (!this.html) this.create();
if (!this.html) return null;
return js ? this.html.get(0) : this.html;
};
InterfaceInfo.prototype.update = function (data) {
try {
if (!data) return;
if (!this.html) this.create();
if (!this.html) return;
this.currentUrl = null;
this.html.find('.new-interface-info__head-left').empty();
this.html.find('.new-interface-info__head-right').empty();
this.html.find('.new-interface-info__description').empty();
var title = data.title || data.name || data.original_title || data.original_name || '';
if (title) this.html.find('.new-interface-info__title').text(title);
else this.html.find('.new-interface-info__title').empty();
var overview = data.overview || '';
if (overview) {
this.html.find('.new-interface-info__description').text(this.truncateDescription(overview, 180));
}
if (Lampa.Utils && typeof Lampa.Utils.cardImgBackground === 'function' && Lampa.Background && typeof Lampa.Background.change === 'function') {
var bg = Lampa.Utils.cardImgBackground(data);
if (bg) Lampa.Background.change(bg);
}
this.load(data);
} catch (e) {}
};
InterfaceInfo.prototype.truncateDescription = function (text, maxChars) {
if (!text) return '';
var limit = maxChars || 180;
if (text.length <= limit) return text;
var cut = text.slice(0, limit);
var lastSpace = cut.lastIndexOf(' ');
if (lastSpace > limit * 0.6) cut = cut.slice(0, lastSpace);
while (cut.length > 0 && ' ,.;:!?-'.indexOf(cut.charAt(cut.length - 1)) !== -1) {
cut = cut.slice(0, -1);
}
return cut ? cut + '...' : text.slice(0, limit - 3) + '...';
};
InterfaceInfo.prototype.load = function (data) {
var self = this;
if (!data || !data.id) return;
if (isEpisodeItem(data)) return;
if (!Lampa.TMDB || typeof Lampa.TMDB.api !== 'function' || typeof Lampa.TMDB.key !== 'function') return;
var type = data.media_type === 'tv' || data.name ? 'tv' : 'movie';
var language = Lampa.Storage.get('language');
var url = Lampa.TMDB.api(type + '/' + data.id + '?api_key=' + Lampa.TMDB.key() + '&append_to_response=content_ratings,release_dates,images&language=' + language);
this.currentUrl = url;
if (this.loaded[url]) { this.draw(this.loaded[url]); return; }
clearTimeout(this.timer);
this.timer = setTimeout(function () {
try {
self.network.clear();
self.network.timeout(5000);
self.network.silent(url, function (movie) {
try {
self.loaded[url] = movie;
if (self.currentUrl === url) self.draw(movie);
} catch (e) {}
});
} catch (e) {}
}, 300);
};
InterfaceInfo.prototype.draw = function (movie) {
try {
if (!movie || !this.html) return;
var sources = Lampa.Api && Lampa.Api.sources && Lampa.Api.sources.tmdb ? Lampa.Api.sources.tmdb : null;
var create = ((movie.release_date || movie.first_air_date || '0000') + '').slice(0, 4);
var vote = parseFloat((movie.vote_average || 0) + '').toFixed(1);
var countries = sources && typeof sources.parseCountries === 'function' ? sources.parseCountries(movie) : [];
var pg = sources && typeof sources.parsePG === 'function' ? sources.parsePG(movie) : '';
var showYear = getSetting('stylish_show_year', true);
var showCountry = getSetting('stylish_show_country', true);
var showRuntime = getSetting('stylish_show_runtime', true);
var showRating = getSetting('stylish_show_rating', true);
var showPg = getSetting('stylish_show_pg', true);
var showGenres = getSetting('stylish_show_genres', true);
var leftParts = [];
if (showYear && create !== '0000') leftParts.push('' + create + '');
if (showCountry && countries && countries.length) leftParts.push('' + countries.join(', ') + '');
if (showRuntime && movie.runtime) leftParts.push('' + Lampa.Utils.secondsToTime(movie.runtime * 60, true) + '');
if (showRating && vote > 0) leftParts.push('' + vote + 'TMDB');
var leftHtml = leftParts.length ? leftParts.join('●') : '';
var rightParts = [];
if (showPg && pg) rightParts.push('' + pg + '');
if (showGenres && Array.isArray(movie.genres) && movie.genres.length) {
var genreNames = [];
movie.genres.forEach(function (i) {
if (i && i.name) genreNames.push(Lampa.Utils.capitalizeFirstLetter(i.name));
});
if (genreNames.length) {
rightParts.push('' + genreNames.join(', ') + '');
}
}
var rightHtml = rightParts.length ? rightParts.join('●') : '';
this.html.find('.new-interface-info__head-left').html(leftHtml);
this.html.find('.new-interface-info__head-right').html(rightHtml);
if (movie.images && Array.isArray(movie.images.logos) && movie.images.logos.length > 0 && typeof Lampa.TMDB.image === 'function') {
var firstLogo = null;
movie.images.logos.forEach(function (l) {
if (!firstLogo && l && l.file_path) firstLogo = l;
});
if (firstLogo) {
var rawPath = String(firstLogo.file_path || '');
if (rawPath.charAt(0) === '/') rawPath = rawPath.slice(1);
var dotIdx = rawPath.lastIndexOf('.');
var cleanLogo = (dotIdx > 0 ? rawPath.slice(0, dotIdx) : rawPath) + '.png';
this.html.find('.new-interface-info__title').html(
''
);
}
}
} catch (e) {}
};
InterfaceInfo.prototype.empty = function () {
if (!this.html) return;
this.html.find('.new-interface-info__head-left').empty();
this.html.find('.new-interface-info__head-right').empty();
this.html.find('.new-interface-info__title').empty();
this.html.find('.new-interface-info__description').empty();
};
InterfaceInfo.prototype.destroy = function () {
clearTimeout(this.timer);
this.network.clear();
this.loaded = {};
this.currentUrl = null;
if (this.html) { this.html.remove(); this.html = null; }
};
function init() {
try {
if (Lampa.Manifest && Lampa.Manifest.app_digital >= 300) {
if (Lampa.Maker && typeof Lampa.Maker.map === 'function' && Lampa.Maker.map('Main')) {
startPluginV3();
} else if (Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
Lampa.Listener.follow('activity', function (e) {
if (e && e.type === 'start' && !window.plugin_interface_ready_v3) {
startPluginV3();
}
});
}
}
} catch (e) {}
}
if (window.appready) {
init();
} else if (Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
Lampa.Listener.follow('app', function (e) {
if (e && e.type === 'ready') init();
});
} else {
init();
}
})();
