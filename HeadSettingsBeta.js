(function() {
	'use strict';

	if (window.plugin_head_filter_plus_ready) return;
	window.plugin_head_filter_plus_ready = true;

	function initLang() {
		if (!window.Lampa || !Lampa.Lang || typeof Lampa.Lang.add !== 'function') return;
		Lampa.Lang.add({
			arrow: {
				ru: 'Стрелка',
				en: 'Back arrow',
				uk: 'Стрілка',
				zh: '返回箭头'
			},
			menu_btn: {
				ru: 'Меню',
				en: 'Menu',
				uk: 'Меню',
				zh: '菜单'
			},
			source_title: {
				ru: 'Источник',
				en: 'Source',
				uk: 'Джерело',
				zh: '来源'
			},
			big_title: {
				ru: 'Увеличенное название раздела',
				en: 'Enlarged section title',
				uk: 'Збільшена назва розділу',
				zh: '放大标题'
			},
			bylampa_notice: {
				ru: 'Уведомления ByLampa',
				en: 'ByLampa Notifications',
				uk: 'Сповіщення ByLampa',
				zh: 'ByLampa 通知'
			},
			bylampa_notice_yes: {
				ru: 'Да',
				en: 'Yes',
				uk: 'Так',
				zh: '是'
			},
			bylampa_notice_moved: {
				ru: 'Перенесено в боковое меню',
				en: 'Moved to side menu',
				uk: 'Перенесено в бічне меню',
				zh: '移至侧边菜单'
			},
			menu_changes: {
				ru: 'Изменения',
				en: 'Changes',
				uk: 'Зміни',
				zh: '更新日志'
			},
			clock_only: {
				ru: 'Часы',
				en: 'Clock',
				uk: 'Годинник',
				zh: '时钟'
			},
			calendar_only: {
				ru: 'Календарь',
				en: 'Calendar',
				uk: 'Календар',
				zh: '日历'
			},
			network_indicator: {
				ru: 'Сеть',
				en: 'Network',
				uk: 'Мережа',
				zh: '网络'
			},
			search: {
				ru: 'Поиск',
				en: 'Search',
				uk: 'Пошук',
				zh: '搜索'
			},
			settings: {
				ru: 'Настройки',
				en: 'Settings',
				uk: 'Налаштування',
				zh: '设置'
			},
			premium: {
				ru: 'Премиум',
				en: 'Premium',
				uk: 'Преміум',
				zh: '高级'
			},
			profile: {
				ru: 'Профиль',
				en: 'Profile',
				uk: 'Профіль',
				zh: '个人资料'
			},
			feed: {
				ru: 'Новости',
				en: 'Feed',
				uk: 'Новини',
				zh: '饲料'
			},
			notice: {
				ru: 'Уведомления',
				en: 'Notifications',
				uk: 'Сповіщення',
				zh: '通知'
			},
			broadcast: {
				ru: 'Вещание',
				en: 'Broadcast',
				uk: 'Мовлення',
				zh: '广播'
			},
			fullscreen: {
				ru: 'Полноэкранный режим',
				en: 'Fullscreen mode',
				uk: 'Повноекранний режим',
				zh: '全屏模式'
			},
			reload: {
				ru: 'Обновление страницы',
				en: 'Page reload',
				uk: 'Оновлення сторінки',
				zh: '页面重新加载'
			},
			blackfriday: {
				ru: 'Черная пятница',
				en: 'Black Friday',
				uk: 'Чорна п’ятниця',
				zh: '黑色星期五'
			},
			name_menu: {
				ru: 'Отображать в шапке',
				en: 'Display in header',
				uk: 'Відображати у шапці',
				zh: '在标题中显示'
			},
			name_plugin: {
				ru: 'Настройка шапки+',
				en: 'Header settings+',
				uk: 'Налаштування шапки+',
				zh: '标题设置+'
			},
			plugin_description: {
				ru: 'Плагин для настройки шапки',
				en: 'Plugin for customizing the header',
				uk: 'Плагін для налаштування шапки',
				zh: '用于配置上限的插件'
			}
		});
	}

	function t(key, fallback) {
		try {
			if (window.Lampa && Lampa.Lang && typeof Lampa.Lang.translate === 'function') {
				var res = Lampa.Lang.translate(key);
				if (res && res !== key) return res;
			}
		} catch (err) {}
		return fallback || key;
	}

	function startPlugin() {
		if (!window.Lampa || !window.$) return;

		initLang();

		var isUpdatingHead = false;

		try {
			if (Lampa.Manifest) {
				Lampa.Manifest.plugins = {
					type: 'other',
					version: '1.8.1',
					name: t('name_plugin', 'Настройка шапки+'),
					description: t('plugin_description', 'Плагин для настройки шапки'),
					component: 'head_filter'
				};
			}
		} catch (err) {}

		var standardHead = {
			'head_filter_show_search': {langKey: 'search', fallback: 'Поиск', element: '.open--search'},
			'head_filter_show_settings': {langKey: 'settings', fallback: 'Настройки', element: '.open--settings'},
			'head_filter_show_premium': {langKey: 'premium', fallback: 'Премиум', element: '.open--premium'},
			'head_filter_show_profile': {langKey: 'profile', fallback: 'Профиль', element: '.open--profile'},
			'head_filter_show_feed': {langKey: 'feed', fallback: 'Новости', element: '.open--feed'},
			'head_filter_show_notice': {langKey: 'notice', fallback: 'Уведомления', element: '.notice--icon'},
			'head_filter_show_broadcast': {langKey: 'broadcast', fallback: 'Вещание', element: '.open--broadcast'},
			'head_filter_show_fullscreen': {langKey: 'fullscreen', fallback: 'Полноэкранный режим', element: '.full-screen'},
			'head_filter_show_reload': {langKey: 'reload', fallback: 'Обновление страницы', element: '.m-reload-screen'},
			'head_filter_show_blackfriday': {langKey: 'blackfriday', fallback: 'Черная пятница', element: '.black-friday__button'}
		};

		var topHead = {
			'head_filter_show_arrow': {langKey: 'arrow', fallback: 'Стрелка', element: '.head__backward'},
			'head_filter_show_menu': {langKey: 'menu_btn', fallback: 'Меню', element: '.head__menu-icon'}
		};

		var alwaysVisibleParams = {
			'head_filter_show_clock': true,
			'head_filter_show_calendar': true,
			'head_filter_show_settings': true,
			'head_filter_show_search': true,
			'head_filter_show_notice': true,
			'head_filter_show_arrow': true,
			'head_filter_show_blackfriday': true,
			'head_filter_show_menu': true,
			'head_filter_show_source': true,
			'head_filter_big_title': true,
			'head_filter_show_profile': true,
			'head_filter_show_network': true
		};

		function getParamLabelByKey(key) {
			if (key === 'head_filter_bylampa_notice_v2') return t('bylampa_notice', 'Уведомления ByLampa');
			if (key === 'head_filter_show_clock') return t('clock_only', 'Часы');
			if (key === 'head_filter_show_calendar') return t('calendar_only', 'Календарь');
			if (key === 'head_filter_show_network') return t('network_indicator', 'Сеть');
			if (key === 'head_filter_show_source') return t('source_title', 'Источник');
			if (key === 'head_filter_big_title') return t('big_title', 'Увеличенное название раздела');
			if (key in topHead) return t(topHead[key].langKey, topHead[key].fallback);
			if (key in standardHead) return t(standardHead[key].langKey, standardHead[key].fallback);
			return '';
		}

		function buildParamTitleMap() {
			var map = {};
			var keys = [
				'head_filter_bylampa_notice_v2',
				'head_filter_show_clock',
				'head_filter_show_calendar',
				'head_filter_show_network',
				'head_filter_show_source',
				'head_filter_big_title'
			].concat(Object.keys(topHead), Object.keys(standardHead));

			for (var i = 0; i < keys.length; i++) {
				var k = keys[i];
				var lbl = getParamLabelByKey(k);
				if (lbl) map[lbl] = k;
			}
			return map;
		}

		function getStorageBool(key, defVal) {
			try {
				if (!Lampa.Storage || typeof Lampa.Storage.get !== 'function') return defVal;
				var val = Lampa.Storage.get(key, defVal);
				if (val === false || val === 'false' || val === 0 || val === '0') return false;
				if (val === true || val === 'true' || val === 1 || val === '1') return true;
				return Boolean(defVal);
			} catch (err) {
				return defVal;
			}
		}

		function setElementVisible(el, show) {
			if (!el || !el.style) return;
			try {
				if (show) {
					if (el.getAttribute && el.getAttribute('data-hf-hidden') === '1') {
						el.style.removeProperty('display');
						el.removeAttribute('data-hf-hidden');
					} else if (el.style.display === 'none') {
						el.style.removeProperty('display');
					}
				} else {
					if (el.style.display !== 'none') {
						el.style.setProperty('display', 'none', 'important');
						if (el.setAttribute) el.setAttribute('data-hf-hidden', '1');
					}
				}
			} catch (err) {}
		}

		function showHideElement(selector, show) {
			try {
				var els = $(selector);
				if (!els.length) return;
				els.each(function() {
					setElementVisible(this, Boolean(show));
				});
			} catch (err) {}
		}

		function applyStaticButtonsVisibility() {
			try {
				Object.keys(topHead).forEach(function(key) {
					var show_element = getStorageBool(key, true);
					showHideElement(topHead[key].element, show_element);
				});
				Object.keys(standardHead).forEach(function(key) {
					var show_element = getStorageBool(key, true);
					showHideElement(standardHead[key].element, show_element);
				});
			} catch (err) {}
		}

		function isByLampaNoticeInHeader() {
			return getStorageBool('head_filter_bylampa_notice_v2', true);
		}

		function detectByLampaEnvironment() {
			try {
				if (window.ByLampa) return true;
				var scripts = document.getElementsByTagName('script');
				for (var i = 0; i < scripts.length; i++) {
					var src = (scripts[i].src || '').toLowerCase();
					if (src.indexOf('bylampa') !== -1) return true;
				}
				var links = document.getElementsByTagName('link');
				for (var j = 0; j < links.length; j++) {
					var href = (links[j].href || '').toLowerCase();
					if (href.indexOf('bylampa') !== -1) return true;
				}
			} catch (err) {}
			return false;
		}

		// --- 1. УВЕДОМЛЕНИЯ BYLAMPA ---
		function getByLampaNoticeBtn() {
			try {
				var standardClasses = [
					'open--search', 'open--settings', 'open--premium', 'open--profile',
					'open--feed', 'notice--icon', 'open--broadcast', 'full-screen',
					'm-reload-screen', 'black-friday__button', 'head__backward',
					'head__menu-icon', 'head__split', 'head__time', 'head__title',
					'head__network', 'head__wifi', 'head__speed', 'head__online', 'head__connection'
				];

				var explicitBtn = $('.head .bylampa--notice, .head .bylampa-notice, .head [data-action="bylampa_notice"], .head [data-bylampa-notice]');
				if (explicitBtn.length) return explicitBtn;

				if (!detectByLampaEnvironment()) return $();

				return $('.head .head__action, .head__actions > div, .head__actions > button').filter(function() {
					var el = $(this);
					if (!el.hasClass('selector') && !el.hasClass('head__action')) return false;

					for (var i = 0; i < standardClasses.length; i++) {
						if (el.hasClass(standardClasses[i])) return false;
					}

var clsStr = (this.className || '').toString().toLowerCase();
if (/bookmark|torr|cub|tmdb|radio|shot|sync|theme|lang|exit|power/.test(clsStr)) {
return false;
}
var action = (el.attr('data-action') || '').toLowerCase();
if (action && action.indexOf('bylampa') === -1 && action.indexOf('notice') === -1 && action.indexOf('change') === -1) {
return false;
}
if (!el.find('svg').length) return false;
return true;
});
} catch (err) {
return $();
}
}
function hasByLampaNoticeFeature() {
return getByLampaNoticeBtn().length > 0;
}
function toggleByLampaBtn(show) {
try {
var btn = getByLampaNoticeBtn();
if (!btn.length) return;
btn.each(function() {
setElementVisible(this, Boolean(show));
});
} catch (err) {}
}
function openByLampaNoticeModal() {
try {
var btn = getByLampaNoticeBtn();
var domBtn = btn.get(0);
if (domBtn) {
var wasHidden = domBtn.style && domBtn.style.display === 'none';
if (wasHidden) {
domBtn.style.setProperty('display', 'flex', 'important');
}
try { btn.trigger('hover:enter'); } catch (e1) {}
try { btn.trigger('click'); } catch (e2) {}
setTimeout(function() {
if (!isByLampaNoticeInHeader()) {
setElementVisible(domBtn, false);
}
}, 50);
return;
}
if (window.ByLampa) {
if (typeof window.ByLampa.showNotice === 'function') window.ByLampa.showNotice();
else if (typeof window.ByLampa.notice === 'function') window.ByLampa.notice();
}
} catch (err) {}
}
function safeRefreshMenuController() {
try {
if (Lampa.Controller && typeof Lampa.Controller.enabled === 'function') {
var activeCtrl = Lampa.Controller.enabled();
if (activeCtrl && activeCtrl.name === 'menu' && typeof Lampa.Controller.collectionSet === 'function') {
var menuEl = $('.menu');
if (menuEl.length) Lampa.Controller.collectionSet(menuEl);
}
}
} catch (err) {}
}
function updateByLampaNotice() {
try {
var existingItems = $('.hf-bylampa-changes');
if (!hasByLampaNoticeFeature()) {
if (existingItems.length) {
existingItems.remove();
safeRefreshMenuController();
}
return;
}
var showInHeader = isByLampaNoticeInHeader();
toggleByLampaBtn(showInHeader);
if (!showInHeader) {
if (existingItems.length > 1) {
existingItems.slice(1).remove();
}
if (existingItems.length === 1) return;
var consoleItem = $('.menu__item[data-action="console"]');
if (!consoleItem.length) {
consoleItem = $('.menu__item').filter(function() {
var txt = $(this).find('.menu__text').text().trim();
return txt === 'Консоль' || txt === 'Console' || txt === t('menu_console', 'Консоль');
});
}
if (!consoleItem.length && !$('.menu__list').length) return;
var bellSvg = '' +
'' +
'' +
'';
var itemHtml;
if (consoleItem.length) {
itemHtml = consoleItem.first().clone(false);
itemHtml.removeClass('focus active select');
itemHtml.addClass('hf-bylampa-changes');
itemHtml.attr('data-action', 'hf_bylampa_changes');
itemHtml.find('.menu__ico').html(bellSvg);
itemHtml.find('.menu__text').text(t('menu_changes', 'Изменения'));
itemHtml.find('.menu__counter, .menu__badge').remove();
} else {
itemHtml = $(
'' +
'' + bellSvg + '' +
'' + t('menu_changes', 'Изменения') + '' +
''
);
}
itemHtml.on('hover:enter click', function(e) {
if (e && e.preventDefault) e.preventDefault();
openByLampaNoticeModal();
});
if (consoleItem.length) {
consoleItem.first().after(itemHtml);
} else {
var lists = $('.menu__list');
if (lists.length > 1) {
lists.last().prepend(itemHtml);
} else {
lists.first().append(itemHtml);
}
}
safeRefreshMenuController();
} else {
if (existingItems.length) {
existingItems.remove();
safeRefreshMenuController();
}
}
} catch (err) {}
}
// --- 2. ИНДИКАТОР СЕТИ ---
function getNetworkNodes() {
var nodes = [];
try {
$('.head [class*="net"], .head [class*="wifi"], .head [class*="speed"], .head [class*="online"], .head [class*="conn"], .head [class*="signal"], .head [class*="lan"], .head [id*="net"], .head [id*="wifi"]').each(function() {
var el = $(this);
if (el.hasClass('head') || el.hasClass('head__body') || el.hasClass('head__actions') || el.closest('.head__action, .head__title').length) return;
if (nodes.indexOf(this) === -1) nodes.push(this);
});
var timeContainer = $('.head__time').get(0);
if (timeContainer) {
var allTimeChildren = timeContainer.querySelectorAll('*');
for (var i = 0; i < allTimeChildren.length; i++) {
var node = allTimeChildren.item(i);
if (!node) continue;
var tag = (node.tagName || '').toLowerCase();
var txt = (node.textContent || '').trim();
if (tag === 'svg' || /мбит|mbps|kbps|kb/s|ping|мс|ms/i.test(txt)) {
var target = (tag === 'svg' && node.parentElement && node.parentElement !== timeContainer && node.parentElement.children.length === 1) ? node.parentElement : node;
if (nodes.indexOf(target) === -1) nodes.push(target);
}
}
}
} catch (err) {}
return nodes;
}
function updateNetworkIndicator() {
try {
var showNet = getStorageBool('head_filter_show_network', true);
var netNodes = getNetworkNodes();
for (var i = 0; i < netNodes.length; i++) {
setElementVisible(netNodes[i], showNet);
}
} catch (err) {}
}
// --- 3. РАЗДЕЛЕНИЕ ЧАСОВ И КАЛЕНДАРЯ ---
function isDateString(txt) {
if (!txt) return false;
return /\d{1,2}[./-]\d{1,2}|янв|фев|мар|апр|мая|июн|июл|авг|сен|окт|ноя|дек|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec|\b(май|may)\b|понедельник|вторник|среда|четверг|пятница|суббота|воскресенье|\b(пн|вт|ср|чт|пт|сб|вс|mon|tue|wed|thu|fri|sat|sun)\b/i.test(txt);
}
function splitInlineTextInside(hostEl, parentContainer) {
if (!hostEl || !parentContainer) return;
var textNodes = [];
var childList = hostEl.childNodes;
for (var i = 0; i < childList.length; i++) {
var n = childList.item(i);
if (n && n.nodeType === 3) textNodes.push(n);
}
for (var j = 0; j < textNodes.length; j++) {
var node = textNodes[j];
var rawText = (node.nodeValue || '').trim();
if (!rawText) continue;
var timeMatch = rawText.match(/\d{1,2}:\d{2}(:\d{2})?/);
var timeStr = timeMatch ? String(timeMatch.slice(0, 1)) : '';
var dateStr = timeStr ? rawText.replace(timeStr, '').replace(/^[\s•|-/,]+|[\s•|-/,]+$/g, '').trim() : rawText.replace(/^[\s•|-/,]+|[\s•|-/,]+$/g, '').trim();
if (timeStr && dateStr && isDateString(dateStr)) {
var clockSpan = parentContainer.querySelector('.hf-clock-wrap') || document.createElement('div');
clockSpan.className = 'head__time-now hf-clock-wrap';
clockSpan.textContent = timeStr;
var dateSpan = parentContainer.querySelector('.hf-date-wrap') || document.createElement('div');
dateSpan.className = 'time--date hf-date-wrap';
dateSpan.textContent = dateStr;
if (!clockSpan.parentNode) parentContainer.appendChild(clockSpan);
if (!dateSpan.parentNode) parentContainer.appendChild(dateSpan);
hostEl.removeChild(node);
setElementVisible(clockSpan, getStorageBool('head_filter_show_clock', true));
setElementVisible(dateSpan, getStorageBool('head_filter_show_calendar', true));
} else if (!timeStr && dateStr && isDateString(dateStr)) {
var onlyDateSpan = parentContainer.querySelector('.hf-date-wrap') || document.createElement('div');
onlyDateSpan.className = 'time--date hf-date-wrap';
onlyDateSpan.textContent = dateStr;
if (!onlyDateSpan.parentNode) {
parentContainer.appendChild(onlyDateSpan);
}
hostEl.removeChild(node);
setElementVisible(onlyDateSpan, getStorageBool('head_filter_show_calendar', true));
}
}
}
function splitInlineTimeAndDate() {
try {
var container = $('.head__time').get(0);
if (!container) return;
splitInlineTextInside(container, container);
var innerClock = container.querySelector('.head__time-now:not(.hf-clock-wrap)');
if (innerClock) {
splitInlineTextInside(innerClock, container);
if (!innerClock.textContent.trim() && innerClock.children.length === 0 && innerClock.parentNode) {
innerClock.parentNode.removeChild(innerClock);
}
}
} catch (err) {}
}
function getClockNodes() {
var clockNodes = [];
try {
splitInlineTimeAndDate();
var container = $('.head__time').get(0);
var netNodes = getNetworkNodes();
$('.head__clock, .time--clock, .head__time-now').each(function() {
if ($(this).closest('.head__title, .head__action').length) return;
if (netNodes.indexOf(this) === -1 && clockNodes.indexOf(this) === -1) {
clockNodes.push(this);
}
});
if (container) {
var children = container.children;
for (var i = 0; i < children.length; i++) {
var child = children.item(i);
if (!child || netNodes.indexOf(child) !== -1) continue;
var cls = (child.className || '').toString().toLowerCase();
if (cls.indexOf('net') !== -1 || cls.indexOf('wifi') !== -1 || cls.indexOf('speed') !== -1 || cls.indexOf('conn') !== -1 || (child.tagName || '').toLowerCase() === 'svg') {
continue;
}
var txt = (child.textContent || '').trim();
if (!txt || /мбит|mbps|kbps|kb/s|ping|мс|ms/i.test(txt)) continue;
var isClock = cls.indexOf('clock') !== -1 ||
(child.classList && (child.classList.contains('head__time-now') || child.classList.contains('time--clock'))) ||
/^\d{1,2}:\d{2}(:\d{2})?$/.test(txt);
if (isClock && clockNodes.indexOf(child) === -1) {
clockNodes.push(child);
}
}
if (!clockNodes.length && children.length === 0) {
var rawText = (container.textContent || '').trim();
if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(rawText)) {
clockNodes.push(container);
}
}
}
} catch (err) {}
return clockNodes;
}
function getCalendarNodes() {
var calendarNodes = [];
try {
splitInlineTimeAndDate();
var container = $('.head__time').get(0);
var netNodes = getNetworkNodes();
$('.head__date, .head__calendar, .time--date, .head [class*="calendar"]').each(function() {
if (this === container) return;
if ($(this).closest('.head__action, .head__title').length) return;
if (netNodes.indexOf(this) !== -1) return;
if (calendarNodes.indexOf(this) === -1) {
calendarNodes.push(this);
}
});
$('.head [class*="date"]').each(function() {
if (this === container) return;
if ($(this).closest('.head__action, .head__title').length) return;
if (netNodes.indexOf(this) !== -1) return;
var txt = ($(this).text() || '').trim();
if (txt && !/\d{1,2}:\d{2}/.test(txt) && isDateString(txt) && calendarNodes.indexOf(this) === -1) {
calendarNodes.push(this);
}
});
if (container) {
var children = container.children;
for (var i = 0; i < children.length; i++) {
var child = children.item(i);
if (!child || netNodes.indexOf(child) !== -1) continue;
var cls = (child.className || '').toString().toLowerCase();
if (cls.indexOf('net') !== -1 || cls.indexOf('wifi') !== -1 || cls.indexOf('speed') !== -1 || cls.indexOf('conn') !== -1 || (child.tagName || '').toLowerCase() === 'svg') {
continue;
}
var txt = (child.textContent || '').trim();
if (!txt || /мбит|mbps|kbps|kb/s|ping|мс|ms/i.test(txt)) continue;
var isClock = cls.indexOf('clock') !== -1 ||
(child.classList && (child.classList.contains('head__time-now') || child.classList.contains('time--clock'))) ||
/^\d{1,2}:\d{2}(:\d{2})?$/.test(txt);
var isDate = cls.indexOf('date') !== -1 ||
cls.indexOf('cal') !== -1 ||
(child.classList && child.classList.contains('time--date')) ||
(!isClock && isDateString(txt));
if (isDate && calendarNodes.indexOf(child) === -1) {
calendarNodes.push(child);
}
}
if (!calendarNodes.length && children.length === 0) {
var rawText = (container.textContent || '').trim();
if (rawText && !/\d{1,2}:\d{2}/.test(rawText) && isDateString(rawText)) {
calendarNodes.push(container);
}
}
}
} catch (err) {}
return calendarNodes;
}
function updateClock() {
try {
var showClock = getStorageBool('head_filter_show_clock', true);
var clockNodes = getClockNodes();
for (var i = 0; i < clockNodes.length; i++) {
setElementVisible(clockNodes[i], showClock);
}
updateTimeContainerVisibility(clockNodes, null);
} catch (err) {}
}
function updateCalendar() {
try {
var showCalendar = getStorageBool('head_filter_show_calendar', true);
var calNodes = getCalendarNodes();
for (var i = 0; i < calNodes.length; i++) {
setElementVisible(calNodes[i], showCalendar);
}
updateTimeContainerVisibility(null, calNodes);
} catch (err) {}
}
function updateTimeContainerVisibility(preClockNodes, preCalNodes) {
try {
var container = $('.head__time').get(0);
if (!container) return;
var clockNodes = preClockNodes || getClockNodes();
var calNodes = preCalNodes || getCalendarNodes();
var netNodes = getNetworkNodes();
if (clockNodes.indexOf(container) !== -1 || calNodes.indexOf(container) !== -1) return;
var hasClockInside = false;
for (var i = 0; i < clockNodes.length; i++) {
if (container.contains(clockNodes[i])) hasClockInside = true;
}
var hasCalInside = false;
for (var j = 0; j < calNodes.length; j++) {
if (container.contains(calNodes[j])) hasCalInside = true;
}
var hasNetInside = false;
for (var k = 0; k < netNodes.length; k++) {
if (container.contains(netNodes[k])) hasNetInside = true;
}
var showClock = getStorageBool('head_filter_show_clock', true);
var showCal = getStorageBool('head_filter_show_calendar', true);
var showNet = getStorageBool('head_filter_show_network', true);
var children = container.children;
for (var s = 0; s < children.length; s++) {
var sep = children.item(s);
if (!sep) continue;
var sepTxt = (sep.textContent || '').trim();
if (/^[•|-/]$/.test(sepTxt)) {
setElementVisible(sep, showClock && showCal);
}
}
if (!hasClockInside && !hasCalInside && !hasNetInside) return;
var anyVisible = (hasClockInside && showClock) || (hasCalInside && showCal) || (hasNetInside && showNet);
setElementVisible(container, anyVisible);
} catch (err) {}
}
// --- 4. ЗАГОЛОВОК И ИСТОЧНИК ---
function updateHeadTitle() {
try {
var titleEl = $('.head__title');
if (!titleEl.length) return;
var showSource = getStorageBool('head_filter_show_source', true);
var bigTitle = getStorageBool('head_filter_big_title', false);
var currentText = titleEl.text();
var origText = titleEl.data('hf-orig');
var baseOrig = origText ? origText.split(' - ').shift() : '';
if (!origText || (currentText && currentText !== baseOrig && currentText !== origText)) {
origText = currentText;
titleEl.data('hf-orig', origText);
}
if (origText) {
if (showSource) {
if (titleEl.text() !== origText) titleEl.text(origText);
} else {
var cleanText = origText.split(' - ').shift();
if (titleEl.text() !== cleanText) titleEl.text(cleanText);
}
}
if (bigTitle) {
titleEl.css({
'font-weight': 'bold',
'text-transform': 'uppercase'
});
} else {
titleEl.css({
'font-weight': '',
'text-transform': ''
});
}
} catch (err) {}
}
// --- 5. ПРОВЕРКА ДОСТУПНОСТИ ПЕРЕКЛЮЧАТЕЛЕЙ В МЕНЮ ---
function isSettingParamAvailable(paramName) {
try {
if (alwaysVisibleParams[paramName]) {
return true;
}
if (paramName === 'head_filter_bylampa_notice_v2') {
return hasByLampaNoticeFeature();
}
if (paramName in topHead) {
return $(topHead[paramName].element).length > 0;
}
if (paramName in standardHead) {
return $(standardHead[paramName].element).length > 0;
}
} catch (err) {}
return true;
}
function resolveParamNameFromRow(row, titleMap) {
var name = row.attr('data-name') || row.data('name');
if (!name) {
var titleTxt = row.find('.settings-param__name').text().trim();
if (titleTxt && titleMap[titleTxt]) {
name = titleMap[titleTxt];
row.attr('data-name', name);
}
}
return name;
}
function updateSettingsMenuVisibility() {
try {
var allParams = $('.settings-param');
if (!allParams.length) return;
var activeCtrl = (Lampa.Controller && typeof Lampa.Controller.enabled === 'function') ? Lampa.Controller.enabled() : null;
var titleMap = buildParamTitleMap();
var changed = false;
var focusLost = false;
var matchedCount = 0;
allParams.each(function() {
var row = $(this);
if (row.hasClass('settings-param--title')) {
if (row.attr('data-hf-title') === '1') {
var expectedTitle = t('name_menu', 'Отображать в шапке');
var tEl = row.find('.settings-param__name');
if (tEl.length && tEl.text().trim() !== expectedTitle) {
tEl.text(expectedTitle);
}
}
return;
}
var name = resolveParamNameFromRow(row, titleMap);
if (!name || name.indexOf('head_filter_') !== 0) return;
matchedCount++;
if (matchedCount === 1) {
var prevTitle = row.prev('.settings-param--title');
if (prevTitle.length) prevTitle.attr('data-hf-title', '1');
}
var expectedLabel = getParamLabelByKey(name);
if (expectedLabel) {
var nameEl = row.find('.settings-param__name');
if (nameEl.length && nameEl.text().trim() !== expectedLabel) {
nameEl.text(expectedLabel);
}
}
var available = isSettingParamAvailable(name);
if (available) {
if (this.style.display === 'none') {
row.css('display', '');
if (row.attr('data-hf-was-selector') === '1') {
row.addClass('selector');
}
changed = true;
}
} else {
if (this.style.display !== 'none') {
if (row.hasClass('selector')) {
row.attr('data-hf-was-selector', '1');
}
if (row.hasClass('focus')) {
focusLost = true;
}
row.css('display', 'none');
row.removeClass('selector focus');
changed = true;
}
}
});
if (matchedCount > 0 && changed && activeCtrl && activeCtrl.name === 'settings_param' && typeof Lampa.Controller.collectionSet === 'function') {
var body = $('.settings__body');
if (body.length) {
var visibleSelectors = body.find('.selector').filter(function() {
return this.style.display !== 'none';
});
var focusedEl = visibleSelectors.filter('.focus').get(0);
if (!focusedEl || focusLost) {
focusedEl = visibleSelectors.first().get(0);
}
Lampa.Controller.collectionSet(body);
if (focusedEl && typeof Lampa.Controller.collectionFocus === 'function') {
Lampa.Controller.collectionFocus(focusedEl, body);
}
}
}
} catch (err) {}
}
function refreshByLampaSettingRow() {
try {
if (!$('.settings-param').length) return;
updateSettingsMenuVisibility();
if (!hasByLampaNoticeFeature()) return;
var label = isByLampaNoticeInHeader() ? t('bylampa_notice_yes', 'Да') : t('bylampa_notice_moved', 'Перенесено в боковое меню');
var row = $('.settings-param[data-name="head_filter_bylampa_notice_v2"]');
if (!row.length) {
var titleText = t('bylampa_notice', 'Уведомления ByLampa');
row = $('.settings-param').filter(function() {
return $(this).find('.settings-param__name').text().trim() === titleText;
});
}
if (row.length) {
var valEl = row.find('.settings-param__value');
if (valEl.text() !== label) {
valEl.text(label);
}
if (!row.attr('data-hf-bound')) {
row.attr('data-hf-bound', '1');
row.on('hover:enter click', function() {
setTimeout(function() {
updateByLampaNotice();
refreshByLampaSettingRow();
}, 60);
});
}
}
} catch (err) {}
}
function positionSettingsComponent() {
try {
var interfaceItem = $('[data-component="interface"]');
var moreItem = $('[data-component="more"]');
var headFilterItem = $('[data-component="head_filter"]');
var moved = false;
if (headFilterItem.length) {
var compNameEl = headFilterItem.find('.settings-folder__name, .settings__name').first();
var expectedCompName = t('name_plugin', 'Настройка шапки+');
if (compNameEl.length && compNameEl.text().trim() !== expectedCompName) {
compNameEl.text(expectedCompName);
}
if (!headFilterItem.hasClass('hf-icon-fixed')) {
var clonedIcon = null;
if (moreItem.length) {
var moreIconEl = moreItem.find('.settings-folder__icon, .settings__icon').first();
if (!moreIconEl.length) moreIconEl = moreItem.children().first();
if (moreIconEl.length && moreIconEl.find('svg').length) {
clonedIcon = moreIconEl.clone();
}
}
if (!clonedIcon) {
clonedIcon = $('');
}
var targetIconEl = headFilterItem.find('.settings-folder__icon, .settings__icon').first();
if (targetIconEl.length) {
targetIconEl.replaceWith(clonedIcon);
} else {
headFilterItem.prepend(clonedIcon);
}
headFilterItem.addClass('hf-icon-fixed');
}
if (interfaceItem.length && interfaceItem.next().attr('data-component') !== 'head_filter') {
interfaceItem.after(headFilterItem);
moved = true;
}
}
if (moved && Lampa.Controller && typeof Lampa.Controller.enabled === 'function') {
var activeCtrl = Lampa.Controller.enabled();
if (activeCtrl && activeCtrl.name === 'settings_component' && typeof Lampa.Controller.collectionSet === 'function') {
var settingsBody = $('.settings__body');
if (settingsBody.length) {
var focusedComp = settingsBody.find('.selector.focus').get(0);
Lampa.Controller.collectionSet(settingsBody);
if (focusedComp && typeof Lampa.Controller.collectionFocus === 'function') {
Lampa.Controller.collectionFocus(focusedComp, settingsBody);
}
}
}
}
} catch (err) {}
}
function applyAll() {
if (isUpdatingHead) return;
isUpdatingHead = true;
try {
applyStaticButtonsVisibility();
updateHeadTitle();
updateByLampaNotice();
updateClock();
updateCalendar();
updateNetworkIndicator();
refreshByLampaSettingRow();
} finally {
isUpdatingHead = false;
}
}
try {
var headTitleNode = document.querySelector('.head__title');
if (headTitleNode && window.MutationObserver) {
var titleObserver = new MutationObserver(function() {
if (isUpdatingHead) return;
isUpdatingHead = true;
try {
updateHeadTitle();
} finally {
isUpdatingHead = false;
}
});
titleObserver.observe(headTitleNode, { childList: true, characterData: true, subtree: true });
}
} catch (err) {}
try {
var headNode = document.querySelector('.head');
if (headNode && window.MutationObserver) {
var headObserver = new MutationObserver(function() {
if (isUpdatingHead) return;
isUpdatingHead = true;
try {
applyStaticButtonsVisibility();
if (hasByLampaNoticeFeature() && !isByLampaNoticeInHeader()) {
toggleByLampaBtn(false);
}
updateClock();
updateCalendar();
updateNetworkIndicator();
} finally {
isUpdatingHead = false;
}
});
headObserver.observe(headNode, {
childList: true,
characterData: true,
subtree: true
});
}
} catch (err) {}
setInterval(function() {
if (isUpdatingHead) return;
isUpdatingHead = true;
try {
applyStaticButtonsVisibility();
if (hasByLampaNoticeFeature() && !isByLampaNoticeInHeader() && !$('.hf-bylampa-changes').length) {
updateByLampaNotice();
}
if ($('.settings-param').length) {
refreshByLampaSettingRow();
}
} finally {
isUpdatingHead = false;
}
}, 1200);
if (Lampa.Controller && Lampa.Controller.listener && typeof Lampa.Controller.listener.follow === 'function') {
Lampa.Controller.listener.follow('toggle', function(e) {
if (!e) return;
if (e.name === 'menu') {
updateByLampaNotice();
} else if (e.name === 'settings_component') {
positionSettingsComponent();
setTimeout(positionSettingsComponent, 30);
} else if (e.name === 'settings_param') {
refreshByLampaSettingRow();
setTimeout(refreshByLampaSettingRow, 40);
setTimeout(refreshByLampaSettingRow, 200);
}
});
}
if (Lampa.Storage && Lampa.Storage.listener && typeof Lampa.Storage.listener.follow === 'function') {
Lampa.Storage.listener.follow('change', function(event) {
if (!event) return;
if (event.name == 'activity') {
setTimeout(applyAll, 300);
setTimeout(applyAll, 1000);
} else if (event.name in topHead) {
var show_top = getStorageBool(event.name, true);
showHideElement(topHead[event.name].element, show_top);
} else if (event.name in standardHead) {
var show_std = getStorageBool(event.name, true);
showHideElement(standardHead[event.name].element, show_std);
} else if (event.name === 'head_filter_show_source' || event.name === 'head_filter_big_title') {
updateHeadTitle();
} else if (event.name === 'head_filter_bylampa_notice_v2') {
setTimeout(function() {
updateByLampaNotice();
refreshByLampaSettingRow();
}, 30);
} else if (event.name === 'head_filter_show_clock') {
updateClock();
} else if (event.name === 'head_filter_show_calendar') {
updateCalendar();
} else if (event.name === 'head_filter_show_network') {
updateNetworkIndicator();
updateClock();
updateCalendar();
}
});
}
if (Lampa.SettingsApi && typeof Lampa.SettingsApi.addComponent === 'function') {
Lampa.SettingsApi.addComponent({
component: 'head_filter',
name: t('name_plugin', 'Настройка шапки+'),
icon: '',
after: 'interface'
});
}
if (Lampa.Settings && Lampa.Settings.listener && typeof Lampa.Settings.listener.follow === 'function') {
Lampa.Settings.listener.follow('open', function(e) {
if (!e) return;
if (e.name === 'main') {
positionSettingsComponent();
setTimeout(positionSettingsComponent, 50);
setTimeout(positionSettingsComponent, 200);
} else if (e.name === 'head_filter') {
refreshByLampaSettingRow();
setTimeout(refreshByLampaSettingRow, 30);
setTimeout(refreshByLampaSettingRow, 150);
setTimeout(refreshByLampaSettingRow, 350);
}
});
}
if (Lampa.SettingsApi && typeof Lampa.SettingsApi.addParam === 'function') {
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
type: 'title'
},
field: {
name: t('name_menu', 'Отображать в шапке')
}
});
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_bylampa_notice_v2',
type: 'trigger',
default: true
},
field: {
name: t('bylampa_notice', 'Уведомления ByLampa')
},
onChange: function() {
setTimeout(function() {
updateByLampaNotice();
refreshByLampaSettingRow();
}, 30);
}
});
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_show_clock',
type: 'trigger',
default: true
},
field: {
name: t('clock_only', 'Часы')
},
onChange: function() {
setTimeout(updateClock, 15);
}
});
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_show_calendar',
type: 'trigger',
default: true
},
field: {
name: t('calendar_only', 'Календарь')
},
onChange: function() {
setTimeout(updateCalendar, 15);
}
});
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_show_network',
type: 'trigger',
default: true
},
field: {
name: t('network_indicator', 'Сеть')
},
onChange: function() {
setTimeout(function() {
updateNetworkIndicator();
updateClock();
updateCalendar();
}, 15);
}
});
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_show_source',
type: 'trigger',
default: true
},
field: {
name: t('source_title', 'Источник')
},
onChange: function() {
setTimeout(updateHeadTitle, 15);
}
});
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_big_title',
type: 'trigger',
default: false
},
field: {
name: t('big_title', 'Увеличенное название раздела')
},
onChange: function() {
setTimeout(updateHeadTitle, 15);
}
});
Object.keys(topHead).forEach(function(key) {
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: key,
type: 'trigger',
default: true
},
field: {
name: t(topHead[key].langKey, topHead[key].fallback)
},
onChange: function() {
setTimeout(function() {
var show_top = getStorageBool(key, true);
showHideElement(topHead[key].element, show_top);
}, 15);
}
});
});
Object.keys(standardHead).forEach(function(key) {
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: key,
type: 'trigger',
default: true
},
field: {
name: t(standardHead[key].langKey, standardHead[key].fallback)
},
onChange: function() {
setTimeout(function() {
var show_std = getStorageBool(key, true);
showHideElement(standardHead[key].element, show_std);
}, 15);
}
});
});
}
setTimeout(applyAll, 300);
setTimeout(applyAll, 1000);
setTimeout(applyAll, 2500);
}
if (window.appready) {
startPlugin();
} else if (window.Lampa && Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
Lampa.Listener.follow('app', function(e) {
if (e && e.type == 'ready') {
startPlugin();
}
});
} else {
var attempts = 0;
var readyCheck = setInterval(function() {
attempts++;
if (attempts > 300) {
clearInterval(readyCheck);
return;
}
if (window.appready) {
clearInterval(readyCheck);
startPlugin();
} else if (window.Lampa && Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
clearInterval(readyCheck);
Lampa.Listener.follow('app', function(e) {
if (e && e.type == 'ready') {
startPlugin();
}
});
}
}, 100);
}
})();
