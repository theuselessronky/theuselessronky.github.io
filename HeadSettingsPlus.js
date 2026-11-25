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
		split: {
			ru: 'Разделитель',
			en: 'Divider',
			uk: 'Розділювач',
			zh: '分隔符'
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
			version: '0.5.0',
			name: Lampa.Lang.translate('name_plugin'),
			description: Lampa.Lang.translate('plugin_description'),
			component: 'head_filter'
		};
		Lampa.Manifest.plugins = manifest;

		var head = {
			'head_filter_show_arrow': {name: Lampa.Lang.translate('arrow'), element: '.head__backward'},
			'head_filter_show_menu': {name: Lampa.Lang.translate('menu_btn'), element: '.head__menu-icon'},
			'head_filter_show_search': {name: Lampa.Lang.translate('search'), element: '.open--search'},
			'head_filter_show_settings': {name: Lampa.Lang.translate('settings'), element: '.open--settings'}, 
			'head_filter_show_premium': {name: Lampa.Lang.translate('premium'), element: '.open--premium'}, 
			'head_filter_show_profile': {name: Lampa.Lang.translate('profile'), element: '.open--profile'}, 
			'head_filter_show_feed': {name: Lampa.Lang.translate('feed'), element: '.open--feed'}, 
			'head_filter_show_notice': {name: Lampa.Lang.translate('notice'), element: '.notice--icon'},
			'head_filter_show_broadcast': {name: Lampa.Lang.translate('broadcast'), element: '.open--broadcast'},
			'head_filter_show_fullscreen': {name: Lampa.Lang.translate('fullscreen'), element: '.full-screen'}, 
			'head_filter_show_reload': {name: Lampa.Lang.translate('reload'), element: '.m-reload-screen'},
			'head_filter_show_blackfriday': {name: Lampa.Lang.translate('blackfriday'), element: '.black-friday__button'}, 
			'head_filter_show_split': {name: Lampa.Lang.translate('split'), element: '.head__split'}
		};

		function showHideElement(selector, show) {
			var els = $(selector);
			if (!els.length) return;

			els.each(function() {
				if (show == true) {
					if (this && this.style) {
						this.style.removeProperty('display');
					}
					$(this).show();
				} else {
					if (this && this.style) {
						this.style.setProperty('display', 'none', 'important');
					} else {
						$(this).hide();
					}
				}
			});
		}

		// Отдельное управление Часами и Календарём (Да / Нет)
		function updateClockAndCalendar() {
			var timeContainer = $('.head__time');
			if (!timeContainer.length) return;

			var defaultClock = Lampa.Storage.get('head_filter_show_time', true);
			var showClock = Lampa.Storage.get('head_filter_show_clock', defaultClock);
			var showCalendar = Lampa.Storage.get('head_filter_show_calendar', true);

			var clockEl = timeContainer.find('.head__time-now');
			var dateEl = timeContainer.find('.head__time-date');

			if (!showClock && !showCalendar) {
				timeContainer.hide();
				return;
			} else {
				timeContainer.show();
			}

			if (clockEl.length) {
				if (showClock) {
					clockEl.show();
				} else {
					clockEl.hide();
				}
			}

			if (dateEl.length) {
				if (showCalendar) {
					dateEl.show();
				} else {
					dateEl.hide();
				}
			}
		}

		// Управление заголовком и источником (" - TMDB")
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

		// Поиск кнопки уведомлений ByLampa в шапке
		function getByLampaNoticeBtn() {
			var standardClasses = [
				'open--search', 'open--settings', 'open--premium', 'open--profile',
				'open--feed', 'notice--icon', 'open--broadcast', 'full-screen',
				'm-reload-screen', 'black-friday__button', 'head__backward',
				'head__menu-icon', 'head__split', 'head__time', 'head__title'
			];

			return $('.head .head__action, .head__actions > div, .head__actions > button').filter(function() {
				var el = $(this);
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
				if (this && this.style) {
					if (show) {
						this.style.removeProperty('display');
						$(this).show();
					} else {
						this.style.setProperty('display', 'none', 'important');
					}
				}
			});
		}

		function openByLampaNoticeModal() {
			var btn = getByLampaNoticeBtn();
			var domBtn = btn.get(0);

			if (domBtn) {
				if (domBtn.style && domBtn.style.getPropertyValue('display') === 'none') {
					domBtn.style.setProperty('display', 'flex', 'important');
				}

				btn.trigger('hover:enter');
				btn.trigger('click');
				if (typeof domBtn.click === 'function') {
					domBtn.click();
				}

				setTimeout(function() {
					var showNotice = Lampa.Storage.get('head_filter_show_bylampa_notice', true);
					if (!showNotice && domBtn.style) {
						domBtn.style.setProperty('display', 'none', 'important');
					}
				}, 50);
				return;
			}

			if (window.ByLampa) {
				if (typeof window.ByLampa.showNotice === 'function') window.ByLampa.showNotice();
				else if (typeof window.ByLampa.notice === 'function') window.ByLampa.notice();
			}
		}

		// Уведомления ByLampa: Да = в шапке, Нет = скрыты в шапке + пункт "Изменения" под "Консоль"
		function updateByLampaNotice() {
			var showInHeader = Lampa.Storage.get('head_filter_show_bylampa_notice', true);

			toggleByLampaBtn(showInHeader);

			var menuList = $('.menu .menu__list').first();
			if (!menuList.length) return;

			var customItem = menuList.find('.hf-bylampa-changes');

			if (!showInHeader) {
				if (!customItem.length) {
					var itemHtml = $(
						'<li class="menu__item selector hf-bylampa-changes" data-action="hf_bylampa_changes">' +
							'<div class="menu__ico">' +
								'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
									'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>' +
									'<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>' +
								'</svg>' +
							'</div>' +
							'<div class="menu__text">' + Lampa.Lang.translate('menu_changes') + '</div>' +
						'</li>'
					);

					itemHtml.on('hover:enter click', function(e) {
						if (e && e.preventDefault) e.preventDefault();
						openByLampaNoticeModal();
					});

					// Ищем "Консоль" во всех списках бокового меню и ставим "Изменения" строго под ней
					var consoleItem = $('.menu .menu__item[data-action="console"]');
					if (!consoleItem.length) {
						consoleItem = $('.menu .menu__item').filter(function() {
							var txt = $(this).find('.menu__text').text().trim();
							return txt === 'Консоль' || txt === 'Console' || txt === Lampa.Lang.translate('menu_console');
						});
					}

					if (consoleItem.length) {
						consoleItem.last().after(itemHtml);
					} else {
						menuList.append(itemHtml);
					}

					if (Lampa.Menu && typeof Lampa.Menu.update === 'function') {
						Lampa.Menu.update();
					}
				}
			} else {
				if (customItem.length) {
customItem.remove();
if (Lampa.Menu && typeof Lampa.Menu.update === 'function') {
Lampa.Menu.update();
}
}
}
}
function applyAll() {
Object.keys(head).forEach(function(key) {
var show_element = Lampa.Storage.get(key, true);
showHideElement(head[key].element, show_element);
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
var showInHeader = Lampa.Storage.get('head_filter_show_bylampa_notice', true);
toggleByLampaBtn(showInHeader);
var showBF = Lampa.Storage.get('head_filter_show_blackfriday', true);
if (!showBF) showHideElement('.black-friday__button', false);
updateClockAndCalendar();
});
headObserver.observe(headNode, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
}
Lampa.Storage.listener.follow('change', function(event) {
if (event.name == 'activity') {
setTimeout(applyAll, 300);
setTimeout(applyAll, 1000);
} else if (event.name in head) {
var show_element = Lampa.Storage.get(event.name, true);
showHideElement(head[event.name].element, show_element);
} else if (event.name === 'head_filter_show_source' || event.name === 'head_filter_big_title') {
updateHeadTitle();
} else if (event.name === 'head_filter_show_bylampa_notice') {
updateByLampaNotice();
} else if (event.name === 'head_filter_show_clock' || event.name === 'head_filter_show_calendar') {
updateClockAndCalendar();
}
});
// Регистрация оригинального пустого шаблона настроек
function registerSettingsTemplate() {
if (Lampa.Template && typeof Lampa.Template.add === 'function') {
Lampa.Template.add('settings_head_filter', '');
}
}
registerSettingsTemplate();
Lampa.SettingsApi.addParam({
component: 'interface',
param: {
type: 'button'
},
field: {
name: Lampa.Lang.translate('name_plugin'),
description: Lampa.Lang.translate('plugin_description')
},
onChange: function() {
registerSettingsTemplate();
Lampa.Settings.create('head_filter', {
onBack: function() {
Lampa.Settings.create('interface');
}
});
}
});
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
type: 'title'
},
field: {
name: Lampa.Lang.translate('name_menu')
}
});
// Стандартные переключатели элементов
Object.keys(head).forEach(function(key) {
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: key,
type: 'trigger',
default: true
},
field: {
name: head[key].name
}
});
});
// Переключатель: Часы (Да / Нет)
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
// Переключатель: Календарь (Да / Нет)
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
// Переключатель: Источник (Да / Нет)
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
// Переключатель: Увеличенное название раздела (Да / Нет)
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
// Переключатель: Уведомления ByLampa (Да / Нет -> при "Нет" переносит в меню "Изменения")
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_show_bylampa_notice',
type: 'trigger',
default: true
},
field: {
name: Lampa.Lang.translate('bylampa_notice')
}
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
