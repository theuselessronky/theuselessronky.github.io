(function() {
	'use strict';

	// Adding multi-language support
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
		bylampa_notice_no: {
			ru: 'Нет',
			en: 'No',
			uk: 'Ні',
			zh: '否'
		},
		bylampa_notice_menu: {
			ru: 'Да, перенесено в боковое меню',
			en: 'Yes, moved to side menu',
			uk: 'Так, перенесено в бічне меню',
			zh: '是，移至侧边菜单'
		},
		menu_changes: {
			ru: 'Изменения',
			en: 'Changes',
			uk: 'Зміни',
			zh: '更新日志'
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
		time: {
			ru: 'Время',
			en: 'Time',
			uk: 'Годинник',
			zh: '时间'
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
			version: '0.3.1',
			name: Lampa.Lang.translate('name_plugin'),
			description: Lampa.Lang.translate('plugin_description'),
			component: 'head_filter',
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
			'head_filter_show_split': {name: Lampa.Lang.translate('split'), element: '.head__split'}, 
			'head_filter_show_time': {name: Lampa.Lang.translate('time'), element: '.head__time'}, 
		};

		function showHideElement(element, show) {
			if (show == true) {
				$(element).show();
			} else {
				$(element).hide();
			}
		}

		// Обработка заголовка: скрытие источника (" - TMDB") и стиль заглавных букв
		function updateHeadTitle() {
			var titleEl = $('.head__title');
			if (!titleEl.length) return;

			var showSource = Lampa.Storage.get('head_filter_show_source', true);
			var bigTitle = Lampa.Storage.get('head_filter_big_title', false);

			var currentText = titleEl.text();
			var origText = titleEl.data('hf-orig');

			if (!origText || (currentText && currentText !== origText.split(' - ') && currentText !== origText)) {
				origText = currentText;
				titleEl.data('hf-orig', origText);
			}

			if (origText) {
				if (showSource) {
					if (titleEl.text() !== origText) titleEl.text(origText);
				} else {
					var cleanText = origText.split(' - ');
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

		// Точный поиск кнопки уведомлений ByLampa (исключая все стандартные кнопки Lampa)
		function getByLampaNoticeBtn() {
			var standardClasses = [
				'open--search', 'open--settings', 'open--premium', 'open--profile',
				'open--feed', 'notice--icon', 'open--broadcast', 'full-screen',
				'm-reload-screen', 'black-friday__button'
			];

			var btn = $('.head__actions .head__action, .head__actions > div, .head__actions > button').filter(function() {
				var el = $(this);
				if (el.hasClass('head__split') || el.hasClass('head__time')) return false;
				
				for (var i = 0; i < standardClasses.length; i++) {
					if (el.hasClass(standardClasses[i])) return false;
				}
				return true;
			});

			return btn;
		}

		// Принудительное скрытие / показ кнопки ByLampa
		function toggleByLampaBtn(show) {
			var btn = getByLampaNoticeBtn();
			if (!btn.length) return;

			btn.each(function() {
				if (show) {
					this.style.removeProperty('display');
					$(this).show();
				} else {
					this.style.setProperty('display', 'none', 'important');
				}
			});
		}

		// Открытие окна уведомлений ByLampa
		function openByLampaNoticeModal() {
			var btn = getByLampaNoticeBtn();
			if (btn.length) {
				var domBtn = btn[0];
				// Временно убираем скрытие, если Lampa проверяет видимость при клике
				var prevDisplay = domBtn.style.getPropertyValue('display');
				if (prevDisplay === 'none') {
					domBtn.style.setProperty('display', 'flex', 'important');
				}

				// Запускаем все типы событий, на которые может быть подписан скрипт ByLampa
				btn.trigger('hover:enter');
				btn.trigger('click');
				if (typeof domBtn.click === 'function') domBtn.click();

				// Возвращаем скрытие обратно
				setTimeout(function() {
					var currentMode = Lampa.Storage.get('head_filter_bylampa_notice', 'yes');
					if (currentMode !== 'yes') {
						domBtn.style.setProperty('display', 'none', 'important');
					}
				}, 50);
				return;
			}

			// Резервный вызов, если кнопка не найдена в DOM
			if (window.ByLampa) {
				if (typeof window.ByLampa.showNotice === 'function') window.ByLampa.showNotice();
				else if (typeof window.ByLampa.notice === 'function') window.ByLampa.notice();
			}
		}

		// Управление отображением кнопки ByLampa и пункта "Изменения" в боковом меню
		function updateByLampaNotice() {
			var mode = Lampa.Storage.get('head_filter_bylampa_notice', 'yes');

			toggleByLampaBtn(mode === 'yes');

			var menuList = $('.menu .menu__list').first();
			if (!menuList.length) return;

			var customItem = menuList.find('.hf-bylampa-changes');

			if (mode === 'menu') {
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
						e.preventDefault();
						openByLampaNoticeModal();
					});

					// Ищем раздел "Консоль", чтобы вставить "Изменения" строго под ним
					var consoleItem = menuList.find('.menu__item[data-action="console"]');
					if (!consoleItem.length) {
						consoleItem = menuList.find('.menu__item').filter(function() {
							var txt = $(this).find('.menu__text').text().trim();
							return txt === 'Консоль' || txt === 'Console' || txt === Lampa.Lang.translate('menu_console');
						});
					}

					if (consoleItem.length) {
						consoleItem.after(itemHtml);
					} else {
						menuList.append(itemHtml);
					}

					// Обновляем контроллер бокового меню Lampa, чтобы пульт видел новый пункт
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
		}

		// Следим за изменением заголовка шапки
var headTitleNode = document.querySelector('.head__title');
if (headTitleNode && window.MutationObserver) {
var titleObserver = new MutationObserver(function() {
updateHeadTitle();
});
titleObserver.observe(headTitleNode, { childList: true, characterData: true, subtree: true });
}
// Следим за добавлением кнопки ByLampa в блок действий шапки (если она грузится с задержкой)
var headActionsNode = document.querySelector('.head__actions');
if (headActionsNode && window.MutationObserver) {
var actionsObserver = new MutationObserver(function() {
var mode = Lampa.Storage.get('head_filter_bylampa_notice', 'yes');
toggleByLampaBtn(mode === 'yes');
});
actionsObserver.observe(headActionsNode, { childList: true, subtree: true });
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
} else if (event.name === 'head_filter_bylampa_notice') {
updateByLampaNotice();
}
});
// github.com
Lampa.Template.add('settings_head_filter', <div></div>);
Lampa.SettingsApi.addParam({
component: 'interface',
param: {
type: 'button'
},
field: {
name: Lampa.Lang.translate('name_plugin'),
description: Lampa.Lang.translate('plugin_description')
},
onChange: () => {
Lampa.Settings.create('head_filter', {
onBack: () => {
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
name: Lampa.Lang.translate('name_menu'),
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
name: head[key].name,
}
});
});
// Переключатель: Источник
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
// Переключатель: Увеличенное название раздела
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
// Переключатель с выбором: Уведомления ByLampa
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_bylampa_notice',
type: 'select',
values: {
yes: Lampa.Lang.translate('bylampa_notice_yes'),
no: Lampa.Lang.translate('bylampa_notice_no'),
menu: Lampa.Lang.translate('bylampa_notice_menu')
},
default: 'yes'
},
field: {
name: Lampa.Lang.translate('bylampa_notice')
}
});
// Первичная инициализация
setTimeout(applyAll, 500);
setTimeout(applyAll, 1500);
setTimeout(applyAll, 3000);
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
