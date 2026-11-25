(function() {
	'use strict';

	// Поддержка мультиязычности
	Lampa.Lang.add({
		arrow: {
			ru: 'Стрелка',
			en: 'Back arrow',
			uk: 'Стрілка',
			zh: '返回箭头'
		},
		menu_icon: {
			ru: 'Меню',
			en: 'Menu icon',
			uk: 'Меню',
			zh: '菜单图标'
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
			zh: '放大版块标题'
		},
		bylampa_notice: {
			ru: 'Уведомления ByLampa',
			en: 'ByLampa notifications',
			uk: 'Сповіщення ByLampa',
			zh: 'ByLampa 通知'
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
			ru: 'Настройка шапки',
			en: 'Header settings',
			uk: 'Налаштування шапки',
			zh: '页眉设置'
		},
		plugin_description: {
			ru: 'Плагин для настройки шапки',
			en: 'Plugin for customizing the header',
			uk: 'Плагін для налаштування шапки',
			zh: '用于配置页眉的插件'
		}
	});

	function startPlugin() {
		var manifest = {
			type: 'other',
			version: '0.3.0',
			name: Lampa.Lang.translate('name_plugin'),
			description: Lampa.Lang.translate('plugin_description'),
			component: 'head_filter',
		};
		Lampa.Manifest.plugins = manifest;

		// Базовые элементы шапки (включены по умолчанию)
		var head = {
			'head_filter_show_arrow': {name: Lampa.Lang.translate('arrow'), element: '.head__backward', default: true},
			'head_filter_show_menu': {name: Lampa.Lang.translate('menu_icon'), element: '.head__menu-icon', default: true},
			'head_filter_show_source': {name: Lampa.Lang.translate('source_title'), element: '.head__title-source, .head__source', default: true},
			'head_filter_big_title': {name: Lampa.Lang.translate('big_title'), element: 'custom_big_title', default: false},
			'head_filter_show_bylampa_notice': {name: Lampa.Lang.translate('bylampa_notice'), element: '.bylampa-notice, .bylampa__notice, .open--bylampa-notice, .head__action--changelog, .bylampa-changelog', default: true},
			'head_filter_show_search': {name: Lampa.Lang.translate('search'), element: '.open--search', default: true},
			'head_filter_show_settings': {name: Lampa.Lang.translate('settings'), element: '.open--settings', default: true},
			'head_filter_show_premium': {name: Lampa.Lang.translate('premium'), element: '.open--premium', default: true},
			'head_filter_show_profile': {name: Lampa.Lang.translate('profile'), element: '.open--profile', default: true},
			'head_filter_show_feed': {name: Lampa.Lang.translate('feed'), element: '.open--feed', default: true},
			'head_filter_show_notice': {name: Lampa.Lang.translate('notice'), element: '.notice--icon', default: true},
			'head_filter_show_broadcast': {name: Lampa.Lang.translate('broadcast'), element: '.open--broadcast', default: true},
			'head_filter_show_fullscreen': {name: Lampa.Lang.translate('fullscreen'), element: '.full-screen', default: true},
			'head_filter_show_reload': {name: Lampa.Lang.translate('reload'), element: '.m-reload-screen', default: true},
			'head_filter_show_blackfriday': {name: Lampa.Lang.translate('blackfriday'), element: '.black-friday__button', default: true},
			'head_filter_show_split': {name: Lampa.Lang.translate('split'), element: '.head__split', default: true},
			'head_filter_show_time': {name: Lampa.Lang.translate('time'), element: '.head__time', default: true},
		};

		// Стили для гарантированного скрытия/показа и оформления заголовка
		var style = document.createElement('style');
		style.id = 'head-filter-custom-css';
		style.textContent = '' +
			'body.hf-hide-arrow .head__backward { display: none !important; }' +
			'body.hf-hide-menu .head__menu-icon { display: none !important; }' +
			'body.hf-hide-source .head__title-source, body.hf-hide-source .head__source { display: none !important; }' +
			'body.hf-hide-bylampa-notice .bylampa-notice, body.hf-hide-bylampa-notice .bylampa__notice, body.hf-hide-bylampa-notice .open--bylampa-notice, body.hf-hide-bylampa-notice .head__action--changelog, body.hf-hide-bylampa-notice .bylampa-changelog { display: none !important; }' +
			'body.hf-big-title .head__title { text-transform: uppercase !important; font-weight: 700 !important; font-size: 1.35em !important; letter-spacing: 0.03em !important; }';
		document.head.appendChild(style);

		// Вспомогательная функция для разделения "Раздел - Источник" в старых/кастомных шаблонах шапки
		function processTitleAndSource(showSource) {
			var titleEl = document.querySelector('.head__title');
			if (!titleEl) return;

			// Если источник уже вынесен в отдельный тег .head__title-source
			var sepSource = titleEl.querySelector('.head__title-source');
			if (sepSource) {
				sepSource.style.display = showSource ? '' : 'none';
				return;
			}

			// Если в ByLampa тире и источник склеены текстом внутри .head__title (например: "Главная - TMDB")
			var rawText = titleEl.textContent || '';
			if (rawText.indexOf(' - ') !== -1 && !titleEl.querySelector('.hf-wrapped-source')) {
				var parts = rawText.split(' - ');
				var mainPart = parts[0];
				var sourcePart = ' - ' + parts.slice(1).join(' - ');
				titleEl.innerHTML = '<span class="hf-wrapped-main">' + mainPart + '</span><span class="hf-wrapped-source">' + sourcePart + '</span>';
			}

			var wrappedSource = titleEl.querySelector('.hf-wrapped-source');
			if (wrappedSource) {
				wrappedSource.style.display = showSource ? '' : 'none';
			}
		}

		// Поиск кнопки уведомлений ByLampa в правой части шапки, если у неё кастомный класс без текста
		function processByLampaNotice(showNotice) {
			var actions = document.querySelectorAll('.head__actions .head__action');
			for (var i = 0; i < actions.length; i++) {
				var btn = actions[i];
				// Исключаем стандартные кнопки Lampa
				if (
					btn.classList.contains('open--search') ||
					btn.classList.contains('open--settings') ||
					btn.classList.contains('open--premium') ||
					btn.classList.contains('open--profile') ||
					btn.classList.contains('open--feed') ||
					btn.classList.contains('notice--icon') ||
					btn.classList.contains('open--broadcast') ||
					btn.classList.contains('full-screen') ||
					btn.classList.contains('m-reload-screen') ||
					btn.classList.contains('black-friday__button')
				) {
					continue;
				}
				// Оставшаяся кастомная кнопка в шапке ByLampa (уведомления/история изменений)
				btn.style.display = showNotice ? '' : 'none';
			}
		}

		function applyAllSettings() {
			Object.keys(head).forEach(function(key) {
				var val = Lampa.Storage.get(key, head[key].default);

				if (key === 'head_filter_show_arrow') {
					document.body.classList.toggle('hf-hide-arrow', !val);
				} else if (key === 'head_filter_show_menu') {
					document.body.classList.toggle('hf-hide-menu', !val);
				} else if (key === 'head_filter_show_source') {
					document.body.classList.toggle('hf-hide-source', !val);
					processTitleAndSource(val);
				} else if (key === 'head_filter_big_title') {
					document.body.classList.toggle('hf-big-title', Boolean(val));
				} else if (key === 'head_filter_show_bylampa_notice') {
					document.body.classList.toggle('hf-hide-bylampa-notice', !val);
					processByLampaNotice(val);
				} else {
					if (val) {
						$(head[key].element).show();
					} else {
						$(head[key].element).hide();
					}
				}
			});
		}

		Lampa.Storage.listener.follow('change', function(event) {
			if (event.name === 'activity') {
				applyAllSettings();
				setTimeout(applyAllSettings, 300);
				setTimeout(applyAllSettings, 1000);
			} else if (event.name in head) {
				applyAllSettings();
			}
		});

		// Отслеживаем динамическую перерисовку заголовка и кнопок шапки при навигации
		var headNode = document.querySelector('.head');
		if (headNode) {
			var observer = new MutationObserver(function() {
				processTitleAndSource(Lampa.Storage.get('head_filter_show_source', true));
				processByLampaNotice(Lampa.Storage.get('head_filter_show_bylampa_notice', true));
			});
			observer.observe(headNode, { childList: true, subtree: true });
		}

		Lampa.Template.add('settings_head_filter', '<div></div>');

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
				name: Lampa.Lang.translate('name_menu'),
			}
		});

		Object.keys(head).forEach(function(key) {
			Lampa.SettingsApi.addParam({
				component: 'head_filter',
				param: {
					name: key,
					type: 'trigger',
default: head[key].default
},
field: {
name: head[key].name,
}
});
});
// Применяем настройки сразу при загрузке плагина
applyAllSettings();
setTimeout(applyAllSettings, 800);
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
