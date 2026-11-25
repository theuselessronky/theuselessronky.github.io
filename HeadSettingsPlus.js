(function() {
	'use strict';

	Lampa.Lang.add({
		name_plugin: { ru: 'Настройка шапки+', en: 'Header settings+', uk: 'Налаштування шапки+', zh: '页眉设置+' },
		name_menu: { ru: 'Отображать в шапке', en: 'Display in header', uk: 'Відображати у шапці', zh: '在标题中显示' },
		arrow: { ru: 'Стрелка', en: 'Back arrow', uk: 'Стрілка', zh: '返回箭头' },
		menu_icon: { ru: 'Меню', en: 'Menu icon', uk: 'Меню', zh: '菜单图标' },
		source_title: { ru: 'Источник', en: 'Source', uk: 'Джерело', zh: '来源' },
		big_title: { ru: 'Увеличенное название раздела', en: 'Enlarged section title', uk: 'Збільшена назва розділу', zh: '放大版块标题' },
		bylampa_notice: { ru: 'Уведомления ByLampa', en: 'ByLampa notifications', uk: 'Сповіщення ByLampa', zh: 'ByLampa 通知' },
		opt_yes: { ru: 'Да', en: 'Yes', uk: 'Так', zh: '是' },
		opt_menu: { ru: 'Перенесено в боковое меню', en: 'Moved to side menu', uk: 'Перенесено в бічне меню', zh: '已移至侧边菜单' },
		opt_no: { ru: 'Нет', en: 'No', uk: 'Ні', zh: '否' },
		menu_changes: { ru: 'Изменения', en: 'Changes', uk: 'Зміни', zh: '更新日志' },
		clock: { ru: 'Часы', en: 'Clock', uk: 'Годинник', zh: '时钟' },
		calendar: { ru: 'Календарь', en: 'Calendar', uk: 'Календар', zh: '日历' },
		cal_yes: { ru: 'Да', en: 'Yes', uk: 'Так', zh: '是' },
		cal_no_weekday: { ru: 'Скрывает день недели', en: 'Hides weekday', uk: 'Приховує день тижня', zh: '隐藏星期' },
		cal_no_month: { ru: 'Скрывает месяц', en: 'Hides month', uk: 'Приховує місяць', zh: '隐藏月份' },
		cal_no_year: { ru: 'Скрывает год', en: 'Hides year', uk: 'Приховує рік', zh: '隐藏年份' },
		cal_no_year_weekday: { ru: 'Скрывает год и день недели', en: 'Hides year and weekday', uk: 'Приховує рік і день тижня', zh: '隐藏年份和星期' },
		cal_no: { ru: 'Нет', en: 'No', uk: 'Ні', zh: '否' },
		search: { ru: 'Поиск', en: 'Search', uk: 'Пошук', zh: '搜索' },
		settings: { ru: 'Настройки', en: 'Settings', uk: 'Налаштування', zh: '设置' },
		premium: { ru: 'Премиум', en: 'Premium', uk: 'Преміум', zh: '高级' },
		profile: { ru: 'Профиль', en: 'Profile', uk: 'Профіль', zh: '个人资料' },
		feed: { ru: 'Новости', en: 'Feed', uk: 'Новини', zh: '饲料' },
		notice: { ru: 'Уведомления', en: 'Notifications', uk: 'Сповіщення', zh: '通知' },
		broadcast: { ru: 'Вещание', en: 'Broadcast', uk: 'Мовлення', zh: '广播' },
		fullscreen: { ru: 'Полноэкранный режим', en: 'Fullscreen mode', uk: 'Повноекранний режим', zh: '全屏模式' },
		reload: { ru: 'Обновление страницы', en: 'Page reload', uk: 'Оновлення сторінки', zh: '页面重新加载' },
		blackfriday: { ru: 'Черная пятница', en: 'Black Friday', uk: 'Чорна п’ятниця', zh: '黑色星期五' },
		split: { ru: 'Разделитель', en: 'Divider', uk: 'Розділювач', zh: '分隔符' }
	});

	function startPlugin() {
		if (window.head_filter_plus_ready) return;
		window.head_filter_plus_ready = true;

		Lampa.Manifest.plugins = {
			type: 'other',
			version: '0.5.1',
			name: Lampa.Lang.translate('name_plugin'),
			component: 'head_filter'
		};

		var triggers = {
			'head_filter_show_arrow': { name: Lampa.Lang.translate('arrow'), default: true },
			'head_filter_show_menu': { name: Lampa.Lang.translate('menu_icon'), default: true },
			'head_filter_show_source': { name: Lampa.Lang.translate('source_title'), default: true },
			'head_filter_big_title': { name: Lampa.Lang.translate('big_title'), default: false },
			'head_filter_show_clock': { name: Lampa.Lang.translate('clock'), default: true },
			'head_filter_show_search': { name: Lampa.Lang.translate('search'), element: '.open--search', default: true },
			'head_filter_show_settings': { name: Lampa.Lang.translate('settings'), element: '.open--settings', default: true },
			'head_filter_show_premium': { name: Lampa.Lang.translate('premium'), element: '.open--premium', default: true },
			'head_filter_show_profile': { name: Lampa.Lang.translate('profile'), element: '.open--profile', default: true },
			'head_filter_show_feed': { name: Lampa.Lang.translate('feed'), element: '.open--feed', default: true },
			'head_filter_show_notice': { name: Lampa.Lang.translate('notice'), element: '.notice--icon', default: true },
			'head_filter_show_broadcast': { name: Lampa.Lang.translate('broadcast'), element: '.open--broadcast', default: true },
			'head_filter_show_fullscreen': { name: Lampa.Lang.translate('fullscreen'), element: '.full-screen', default: true },
			'head_filter_show_reload': { name: Lampa.Lang.translate('reload'), element: '.m-reload-screen', default: true },
			'head_filter_show_blackfriday': { name: Lampa.Lang.translate('blackfriday'), element: '.black-friday__button', default: true },
			'head_filter_show_split': { name: Lampa.Lang.translate('split'), element: '.head__split', default: true }
		};

		var style = document.createElement('style');
		style.id = 'head-filter-plus-style';
		style.textContent = '' +
			'body.hf-hide-arrow .head__backward { display: none !important; }' +
			'body.hf-hide-menu .head__menu-icon { display: none !important; }' +
			'body.hf-hide-source .head__title-source, body.hf-hide-source .head__source, body.hf-hide-source .hf-wrapped-source { display: none !important; }' +
			'body.hf-big-title .head__title { text-transform: uppercase !important; font-weight: 700 !important; font-size: 1.35em !important; letter-spacing: 0.03em !important; }' +
			'body.hf-hide-clock .hf-clock-node { display: none !important; }' +
			'body.hf-hide-calendar .hf-calendar-node { display: none !important; }' +
			'body.hf-cal-center .hf-calendar-node { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; }' +
			'.hf-cal-year-newline { display: block !important; width: 100%; text-align: right; line-height: 1.1; margin-top: 0.1em; }';
		document.head.appendChild(style);

		function findByLampaNoticeBtn() {
			var explicit = document.querySelector('.bylampa-notice, .bylampa__notice, .open--bylampa-notice, .head__action--changelog, .bylampa-changelog');
			if (explicit) return explicit;

			var actions = document.querySelectorAll('.head__actions .head__action');
			var found = null;
			Array.prototype.forEach.call(actions, function(btn) {
				if (found) return;
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
				) return;
				found = btn;
			});
			return found;
		}

		function syncSideMenuItem(showInMenu) {
			var existingItem = document.querySelector('.hf-menu-bylampa-changes');
			if (!showInMenu) {
				if (existingItem) existingItem.remove();
				return;
			}
			if (existingItem) return;

			var menuLists = document.querySelectorAll('.menu__list');
			if (!menuLists || !menuLists.length) return;

			var targetList = menuLists.item(menuLists.length - 1);
			if (!targetList) return;

			var item = document.createElement('li');
			item.className = 'menu__item selector hf-menu-bylampa-changes';
			item.innerHTML = '' +
				'<div class="menu__ico">' +
					'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
						'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>' +
						'<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>' +
					'</svg>' +
				'</div>' +
				'<div class="menu__text">' + Lampa.Lang.translate('menu_changes') + '</div>';

			$(item).on('hover:enter click', function() {
				var originBtn = findByLampaNoticeBtn();
				if (originBtn) {
					originBtn.style.display = '';
					$(originBtn).trigger('hover:enter');
					if (typeof originBtn.click === 'function') originBtn.click();
					setTimeout(function() {
						var mode = Lampa.Storage.get('head_filter_bylampa_notice_mode', 'yes');
						if (mode === 'menu' || mode === 'no') originBtn.style.display = 'none';
					}, 60);
				}
			});

			targetList.appendChild(item);
		}

		function updateByLampaNotice() {
			var mode = Lampa.Storage.get('head_filter_bylampa_notice_mode', 'yes');
			var showInHeader = (mode === 'yes');
			var showInMenu = (mode === 'menu');

			var known = document.querySelectorAll('.bylampa-notice, .bylampa__notice, .open--bylampa-notice, .head__action--changelog, .bylampa-changelog');
			Array.prototype.forEach.call(known, function(el) {
				el.style.display = showInHeader ? '' : 'none';
			});

			var btn = findByLampaNoticeBtn();
			if (btn) btn.style.display = showInHeader ? '' : 'none';

			syncSideMenuItem(showInMenu);
		}

		function updateTitleAndSource(showSource) {
			var titleEl = document.querySelector('.head__title');
			if (!titleEl) return;

			var sepSource = titleEl.querySelector('.head__title-source');
			if (sepSource) {
				sepSource.style.display = showSource ? '' : 'none';
				return;
			}

			var rawText = titleEl.textContent || '';
			var dashPos = rawText.indexOf(' - ');
			if (dashPos !== -1 && !titleEl.querySelector('.hf-wrapped-source')) {
				var mainPart = rawText.slice(0, dashPos);
				var sourcePart = rawText.slice(dashPos);
				titleEl.innerHTML = '<span class="hf-wrapped-main">' + mainPart + '</span><span class="hf-wrapped-source">' + sourcePart + '</span>';
			}

			var wrappedSource = titleEl.querySelector('.hf-wrapped-source');
			if (wrappedSource) wrappedSource.style.display = showSource ? '' : 'none';
		}

		function updateClockAndCalendar() {
			var timeContainer = document.querySelector('.head__time');
			if (!timeContainer) return;

			var showClock = Lampa.Storage.get('head_filter_show_clock', true);
			var calMode = Lampa.Storage.get('head_filter_calendar_mode', 'yes');

			document.body.classList.toggle('hf-hide-clock', !showClock);
param: {
name: 'head_filter_bylampa_notice_mode',
type: 'select',
values: {
yes: Lampa.Lang.translate('opt_yes'),
menu: Lampa.Lang.translate('opt_menu'),
no: Lampa.Lang.translate('opt_no')
},
default: 'yes'
},
field: { name: Lampa.Lang.translate('bylampa_notice') }
});
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: { name: 'head_filter_show_clock', type: 'trigger', default: true },
field: { name: Lampa.Lang.translate('clock') }
});
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_calendar_mode',
type: 'select',
values: {
yes: Lampa.Lang.translate('cal_yes'),
no_weekday: Lampa.Lang.translate('cal_no_weekday'),
no_month: Lampa.Lang.translate('cal_no_month'),
no_year: Lampa.Lang.translate('cal_no_year'),
no_year_weekday: Lampa.Lang.translate('cal_no_year_weekday'),
no: Lampa.Lang.translate('cal_no')
},
default: 'yes'
},
field: { name: Lampa.Lang.translate('calendar') }
});
[
'head_filter_show_search',
'head_filter_show_settings',
'head_filter_show_premium',
'head_filter_show_profile',
'head_filter_show_feed',
'head_filter_show_notice',
'head_filter_show_broadcast',
'head_filter_show_fullscreen',
'head_filter_show_reload',
'head_filter_show_blackfriday',
'head_filter_show_split'
].forEach(function(key) {
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: { name: key, type: 'trigger', default: triggers[key].default },
field: { name: triggers[key].name }
});
});
applyAll();
setTimeout(applyAll, 1000);
}
if (window.appready) {
startPlugin();
} else {
Lampa.Listener.follow('app', function(e) {
if (e.type == 'ready') startPlugin();
});
}
})();
