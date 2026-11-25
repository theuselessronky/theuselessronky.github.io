(function() {
	'use strict';

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

	function startPlugin() {
		var manifest = {
			type: 'other',
			version: '1.3.0',
			name: Lampa.Lang.translate('name_plugin'),
			description: Lampa.Lang.translate('plugin_description'),
			component: 'head_filter'
		};
		Lampa.Manifest.plugins = manifest;

		var standardHead = {
			'head_filter_show_search': {name: Lampa.Lang.translate('search'), element: '.open--search'},
			'head_filter_show_settings': {name: Lampa.Lang.translate('settings'), element: '.open--settings'}, 
			'head_filter_show_premium': {name: Lampa.Lang.translate('premium'), element: '.open--premium'}, 
			'head_filter_show_profile': {name: Lampa.Lang.translate('profile'), element: '.open--profile'}, 
			'head_filter_show_feed': {name: Lampa.Lang.translate('feed'), element: '.open--feed'}, 
			'head_filter_show_notice': {name: Lampa.Lang.translate('notice'), element: '.notice--icon'},
			'head_filter_show_broadcast': {name: Lampa.Lang.translate('broadcast'), element: '.open--broadcast'},
			'head_filter_show_fullscreen': {name: Lampa.Lang.translate('fullscreen'), element: '.full-screen'}, 
			'head_filter_show_reload': {name: Lampa.Lang.translate('reload'), element: '.m-reload-screen'},
			'head_filter_show_blackfriday': {name: Lampa.Lang.translate('blackfriday'), element: '.black-friday__button'}
		};

		var topHead = {
			'head_filter_show_arrow': {name: Lampa.Lang.translate('arrow'), element: '.head__backward'},
			'head_filter_show_menu': {name: Lampa.Lang.translate('menu_btn'), element: '.head__menu-icon'}
		};

		function setElementVisible(el, show) {
			if (!el) return;
			if (show) {
				if (el.style && el.style.display === 'none') {
					el.style.removeProperty('display');
				}
			} else {
				if (el.style && el.style.display !== 'none') {
					el.style.setProperty('display', 'none', 'important');
				}
			}
		}

		function showHideElement(selector, show) {
			var els = $(selector);
			if (!els.length) return;
			els.each(function() {
				setElementVisible(this, show == true);
			});
		}

		// true = "Да" (кнопка в шапке), false = "Перенесено в боковое меню"
		function isByLampaNoticeInHeader() {
			var val = Lampa.Storage.get('head_filter_show_bylampa_notice', true);
			if (val === false || val === 'false' || val === 'no' || val === 'moved' || val === 0 || val === '0') {
				return false;
			}
			return true;
		}

		function updateNetworkIndicator() {
			var showNet = Lampa.Storage.get('head_filter_show_network', true);

			$('.head [class*="net"], .head [class*="wifi"], .head [class*="speed"], .head [class*="online"], .head [class*="conn"], .head [class*="signal"], .head [class*="lan"], .head [id*="net"], .head [id*="wifi"]').each(function() {
				if ($(this).hasClass('head') || $(this).hasClass('head__body') || $(this).hasClass('head__actions')) return;
				setElementVisible(this, showNet);
			});

			var timeContainer = $('.head__time').get(0);
			if (timeContainer) {
				var allTimeChildren = timeContainer.querySelectorAll('*');
				for (var i = 0; i < allTimeChildren.length; i++) {
					var node = allTimeChildren.item(i);
					if (!node) continue;
					var tag = node.tagName.toLowerCase();
					var txt = (node.textContent || '').trim();

					if (tag === 'svg' || /мбит|mbps|kbps|kb\/s|ping|мс|ms/i.test(txt)) {
						var target = (tag === 'svg' && node.parentElement && node.parentElement !== timeContainer && node.parentElement.children.length === 1) ? node.parentElement : node;
						setElementVisible(target, showNet);
					}
				}
			}
		}

		function updateClockAndCalendar() {
			var timeContainer = $('.head__time').get(0);
			if (!timeContainer) return;

			var showClock = Lampa.Storage.get('head_filter_show_clock', true);
			var showCalendar = Lampa.Storage.get('head_filter_show_calendar', true);
			var showNet = Lampa.Storage.get('head_filter_show_network', true);

			if (!showClock && !showCalendar && !showNet) {
				setElementVisible(timeContainer, false);
				return;
			} else {
				setElementVisible(timeContainer, true);
			}

			var children = timeContainer.children;
			for (var i = 0; i < children.length; i++) {
				var child = children.item(i);
				if (!child) continue;

				var cls = (child.className || '').toString().toLowerCase();
				if (cls.indexOf('net') !== -1 || cls.indexOf('wifi') !== -1 || cls.indexOf('speed') !== -1 || cls.indexOf('conn') !== -1 || child.tagName.toLowerCase() === 'svg') {
					continue;
				}

				var txt = (child.textContent || '').trim();
				if (txt.indexOf(':') !== -1 || child.classList.contains('head__time-now') || child.classList.contains('time--clock')) {
					setElementVisible(child, showClock);
				} else if (txt.length > 0 && !/мбит|mbps|kbps|kb\/s|ping|мс|ms/i.test(txt)) {
					setElementVisible(child, showCalendar);
				}
			}

			updateNetworkIndicator();
		}

		function updateHeadTitle() {
			var titleEl = $('.head__title');
			if (!titleEl.length) return;

			var showSource = Lampa.Storage.get('head_filter_show_source', true);
			var bigTitle = Lampa.Storage.get('head_filter_big_title', false);

			var currentText = titleEl.text();
			var origText = titleEl.data('hf-orig');

			if (!origText || (currentText && currentText !== origText.split(' - ').shift() && currentText !== origText)) {
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
		}

		function getByLampaNoticeBtn() {
			var standardClasses = [
				'open--search', 'open--settings', 'open--premium', 'open--profile',
				'open--feed', 'notice--icon', 'open--broadcast', 'full-screen',
				'm-reload-screen', 'black-friday__button', 'head__backward',
				'head__menu-icon', 'head__split', 'head__time', 'head__title',
				'head__network', 'head__wifi', 'head__speed', 'head__online', 'head__connection'
			];

			return $('.head .head__action, .head__actions > div, .head__actions > button').filter(function() {
				var el = $(this);
				if (!el.hasClass('selector') && !el.hasClass('head__action')) return false;
				for (var i = 0; i < standardClasses.length; i++) {
					var cls = standardClasses.slice(i, i + 1).shift();
					if (el.hasClass(cls)) return false;
				}
				return true;
			});
		}

		function toggleByLampaBtn(show) {
			var btn = getByLampaNoticeBtn();
			if (!btn.length) return;

			btn.each(function() {
				setElementVisible(this, show);
			});
		}

		function openByLampaNoticeModal() {
			var btn = getByLampaNoticeBtn();
			var domBtn = btn.get(0);

			if (domBtn) {
				var wasHidden = domBtn.style && domBtn.style.display === 'none';
				if (wasHidden) {
					domBtn.style.setProperty('display', 'flex', 'important');
				}

				btn.trigger('hover:enter');
				btn.trigger('click');
				if (typeof domBtn.click === 'function') {
					domBtn.click();
				}

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
}
// Точная вставка ОДНОГО пункта "Изменения" под "Консоль" (как в рабочей версии 0.8.0)
function updateByLampaNotice() {
var showInHeader = isByLampaNoticeInHeader();
toggleByLampaBtn(showInHeader);
var menuContainer = $('.menu');
if (!menuContainer.length) menuContainer = $('body');
var existingItems = menuContainer.find('.hf-bylampa-changes');
if (!showInHeader) {
if (existingItems.length > 1) {
existingItems.slice(1).remove();
}
if (existingItems.length === 1) return;
var itemHtml = $(
'' +
'' +
'' +
'' +
'' +
'' +
'' +
'' + Lampa.Lang.translate('menu_changes') + '' +
''
);
itemHtml.on('hover:enter click', function(e) {
if (e && e.preventDefault) e.preventDefault();
openByLampaNoticeModal();
});
// Точный поиск "Консоль" по .menu__text (как в v0.8.0!)
var consoleItem = menuContainer.find('.menu__item[data-action="console"]');
if (!consoleItem.length) {
consoleItem = menuContainer.find('.menu__item').filter(function() {
var txt = $(this).find('.menu__text').text().trim();
return txt === 'Консоль' || txt === 'Console' || txt === Lampa.Lang.translate('menu_console');
});
}
if (consoleItem.length) {
consoleItem.first().after(itemHtml);
} else {
var firstList = menuContainer.find('.menu__list').first();
if (firstList.length) firstList.append(itemHtml);
}
if (Lampa.Menu && typeof Lampa.Menu.update === 'function') {
Lampa.Menu.update();
}
} else {
if (existingItems.length) {
existingItems.remove();
if (Lampa.Menu && typeof Lampa.Menu.update === 'function') {
Lampa.Menu.update();
}
}
}
}
function refreshByLampaSettingRow() {
var label = isByLampaNoticeInHeader() ? Lampa.Lang.translate('bylampa_notice_yes') : Lampa.Lang.translate('bylampa_notice_moved');
var row = $('.settings-param[data-name="head_filter_show_bylampa_notice"]');
if (!row.length) {
var titleText = Lampa.Lang.translate('bylampa_notice');
row = $('.settings-param').filter(function() {
return $(this).find('.settings-param__name').text().trim() === titleText;
});
}
if (row.length) {
row.find('.settings-param__value').text(label);
}
}
function positionSettingsComponent() {
var interfaceItem = $('[data-component="interface"]');
var moreItem = $('[data-component="more"]');
var headFilterItem = $('[data-component="head_filter"]');
if (headFilterItem.length) {
if (!headFilterItem.hasClass('hf-icon-fixed') && moreItem.length) {
var moreIconEl = moreItem.find('.settings-folder__icon, .settings__icon').first();
if (!moreIconEl.length) {
moreIconEl = moreItem.children().first();
}
if (moreIconEl.length) {
var clonedIcon = moreIconEl.clone();
var targetIconEl = headFilterItem.find('.settings-folder__icon, .settings__icon').first();
if (targetIconEl.length) {
targetIconEl.replaceWith(clonedIcon);
} else {
headFilterItem.prepend(clonedIcon);
}
headFilterItem.addClass('hf-icon-fixed');
}
}
if (interfaceItem.length && interfaceItem.next().attr('data-component') !== 'head_filter') {
interfaceItem.after(headFilterItem);
}
}
}
function applyAll() {
Object.keys(topHead).forEach(function(key) {
var show_element = Lampa.Storage.get(key, true);
showHideElement(topHead[key].element, show_element);
});
Object.keys(standardHead).forEach(function(key) {
var show_element = Lampa.Storage.get(key, true);
showHideElement(standardHead[key].element, show_element);
});
updateHeadTitle();
updateByLampaNotice();
updateClockAndCalendar();
}
var headTitleNode = document.querySelector('.head__title');
if (headTitleNode && window.MutationObserver) {
var titleObserver = new MutationObserver(function() {
updateHeadTitle();
});
titleObserver.observe(headTitleNode, { childList: true, characterData: true, subtree: true });
}
var headNode = document.querySelector('.head');
if (headNode && window.MutationObserver) {
var headObserver = new MutationObserver(function() {
if (!isByLampaNoticeInHeader()) toggleByLampaBtn(false);
var showBF = Lampa.Storage.get('head_filter_show_blackfriday', true);
if (!showBF) showHideElement('.black-friday__button', false);
updateClockAndCalendar();
});
headObserver.observe(headNode, { childList: true, subtree: true });
}
// Проверка при смене контроллера и раз в секунду, чтобы пункт "Изменения" никогда не пропадал
setInterval(function() {
if (!isByLampaNoticeInHeader() && $('.menu__item').length && !$('.hf-bylampa-changes').length) {
updateByLampaNotice();
}
}, 1000);
if (Lampa.Controller && Lampa.Controller.listener) {
Lampa.Controller.listener.follow('toggle', function(e) {
if (e.name === 'menu') {
updateByLampaNotice();
} else if (e.name === 'settings_component') {
positionSettingsComponent();
setTimeout(positionSettingsComponent, 30);
} else if (e.name === 'settings_param') {
refreshByLampaSettingRow();
}
});
}
Lampa.Storage.listener.follow('change', function(event) {
if (event.name == 'activity') {
setTimeout(applyAll, 300);
setTimeout(applyAll, 1000);
} else if (event.name in topHead) {
var show_top = Lampa.Storage.get(event.name, true);
showHideElement(topHead[event.name].element, show_top);
} else if (event.name in standardHead) {
var show_std = Lampa.Storage.get(event.name, true);
showHideElement(standardHead[event.name].element, show_std);
} else if (event.name === 'head_filter_show_source' || event.name === 'head_filter_big_title') {
updateHeadTitle();
} else if (event.name === 'head_filter_show_bylampa_notice') {
setTimeout(function() {
updateByLampaNotice();
refreshByLampaSettingRow();
}, 30);
} else if (event.name === 'head_filter_show_clock' || event.name === 'head_filter_show_calendar' || event.name === 'head_filter_show_network') {
updateClockAndCalendar();
}
});
if (Lampa.SettingsApi && typeof Lampa.SettingsApi.addComponent === 'function') {
Lampa.SettingsApi.addComponent({
component: 'head_filter',
name: Lampa.Lang.translate('name_plugin'),
icon: '',
after: 'interface'
});
}
if (Lampa.Settings && Lampa.Settings.listener) {
Lampa.Settings.listener.follow('open', function(e) {
if (e.name === 'main') {
positionSettingsComponent();
setTimeout(positionSettingsComponent, 50);
setTimeout(positionSettingsComponent, 200);
} else if (e.name === 'head_filter') {
refreshByLampaSettingRow();
setTimeout(refreshByLampaSettingRow, 30);
setTimeout(refreshByLampaSettingRow, 150);
}
});
}
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
type: 'title'
},
field: {
name: Lampa.Lang.translate('name_menu')
}
});
// 1. Уведомления ByLampa
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_show_bylampa_notice',
type: 'trigger',
default: true
},
field: {
name: Lampa.Lang.translate('bylampa_notice')
},
onChange: function() {
setTimeout(function() {
updateByLampaNotice();
refreshByLampaSettingRow();
}, 50);
}
});
// 2. Часы
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_show_clock',
type: 'trigger',
default: true
},
field: {
name: Lampa.Lang.translate('clock_only')
}
});
// 3. Календарь
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_show_calendar',
type: 'trigger',
default: true
},
field: {
name: Lampa.Lang.translate('calendar_only')
}
});
// 4. Сеть
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_show_network',
type: 'trigger',
default: true
},
field: {
name: Lampa.Lang.translate('network_indicator')
}
});
// 5. Источник
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_show_source',
type: 'trigger',
default: true
},
field: {
name: Lampa.Lang.translate('source_title')
}
});
// 6. Увеличенное название раздела
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_big_title',
type: 'trigger',
default: false
},
field: {
name: Lampa.Lang.translate('big_title')
}
});
// 7-8. Стрелка и Меню
Object.keys(topHead).forEach(function(key) {
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: key,
type: 'trigger',
default: true
},
field: {
name: topHead[key].name
}
});
});
// Остальные стандартные переключатели
Object.keys(standardHead).forEach(function(key) {
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: key,
type: 'trigger',
default: true
},
field: {
name: standardHead[key].name
}
});
});
setTimeout(applyAll, 300);
setTimeout(applyAll, 1000);
setTimeout(applyAll, 2500);
}
if (window.appready) {
startPlugin();
} else {
Lampa.Listener.follow('app', function(e) {
if (e.type == 'ready') {
startPlugin();
}
});
}
})();
