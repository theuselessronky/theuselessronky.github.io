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
		opt_no: { ru: 'Нет', en: 'No', uk: 'Ні', zh: '否' },
		opt_moved_notice: { ru: 'Да, перенесено в Уведомления', en: 'Yes, moved to Notifications', uk: 'Так, перенесено в Сповіщення', zh: '是，已移至通知' },
		tab_changes: { ru: 'Изменения', en: 'Changes', uk: 'Зміни', zh: '更新日志' },
		tab_all: { ru: 'Все', en: 'All', uk: 'Всі', zh: '全部' },
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
		if (window.head_filter_plus_started) return;
		window.head_filter_plus_started = true;

		Lampa.Manifest.plugins = {
			type: 'other',
			version: '0.4.1',
			name: Lampa.Lang.translate('name_plugin'),
			component: 'head_filter'
		};

		var standardTriggers = {
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
		style.id = 'head-filter-plus-css';
		style.textContent = '' +
			'body.hf-hide-arrow .head__backward { display: none !important; }' +
			'body.hf-hide-menu .head__menu-icon { display: none !important; }' +
			'body.hf-hide-source .head__title-source, body.hf-hide-source .head__source, body.hf-hide-source .hf-wrapped-source { display: none !important; }' +
			'body.hf-big-title .head__title { text-transform: uppercase !important; font-weight: 700 !important; font-size: 1.35em !important; letter-spacing: 0.03em !important; }' +
			'body.hf-hide-clock .hf-clock-node { display: none !important; }' +
			'body.hf-hide-calendar .hf-calendar-node { display: none !important; }' +
			'body.hf-cal-center .hf-calendar-node { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; }' +
			'.hf-cal-year-newline { display: block !important; width: 100%; text-align: right; line-height: 1.1; margin-top: 0.1em; }' +
			'.hf-notice-tabs { display: flex; flex-direction: row; gap: 0.6em; padding: 0 1.5em 1em 1.5em; border-bottom: 1px solid rgba(255,255,255,0.12); margin-bottom: 1em; }' +
			'.hf-notice-tab { padding: 0.45em 1.1em; border-radius: 0.4em; background: rgba(255,255,255,0.08); font-size: 0.95em; cursor: pointer; }' +
			'.hf-notice-tab.focus, .hf-notice-tab.active { background: #fff; color: #000; font-weight: 600; }';
		document.head.appendChild(style);

		function findByLampaNoticeBtn() {
			var explicit = document.querySelector('.bylampa-notice, .bylampa__notice, .open--bylampa-notice, .head__action--changelog, .bylampa-changelog');
			if (explicit) return explicit;

			var actions = document.querySelectorAll('.head__actions .head__action');
			for (var i = 0; i < actions.length; i++) {
				var btn = actions[i];
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
				) continue;
				return btn;
			}
			return null;
		}

		function processTitleAndSource(showSource) {
			var titleEl = document.querySelector('.head__title');
			if (!titleEl) return;

			var sepSource = titleEl.querySelector('.head__title-source');
			if (sepSource) {
				sepSource.style.display = showSource ? '' : 'none';
				return;
			}

			var rawText = titleEl.textContent || '';
			if (rawText.indexOf(' - ') !== -1 && !titleEl.querySelector('.hf-wrapped-source')) {
				var parts = rawText.split(' - ');
				titleEl.innerHTML = '<span class="hf-wrapped-main">' + parts[0] + '</span><span class="hf-wrapped-source"> - ' + parts.slice(1).join(' - ') + '</span>';
			}

			var wrappedSource = titleEl.querySelector('.hf-wrapped-source');
			if (wrappedSource) wrappedSource.style.display = showSource ? '' : 'none';
		}

		function processClockAndCalendar() {
			var timeContainer = document.querySelector('.head__time');
			if (!timeContainer) return;

			var showClock = Lampa.Storage.get('head_filter_show_clock', true);
			var calMode = Lampa.Storage.get('head_filter_calendar_mode', 'yes');

			document.body.classList.toggle('hf-hide-clock', !showClock);
			document.body.classList.toggle('hf-hide-calendar', calMode === 'no');
			document.body.classList.toggle('hf-cal-center', calMode === 'no_year_weekday');

			var clockEl = timeContainer.querySelector('.head__time-now, .time--clock, .hf-clock-node');
			var dateEl = timeContainer.querySelector('.head__time-date, .time--date, .hf-calendar-node');

			if (!clockEl || !dateEl) {
				var kids = timeContainer.children;
				for (var i = 0; i < kids.length; i++) {
					var txt = (kids[i].textContent || '').trim();
					if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(txt)) {
						kids[i].classList.add('hf-clock-node');
						clockEl = kids[i];
					} else if (txt.length > 0) {
						kids[i].classList.add('hf-calendar-node');
						dateEl = kids[i];
					}
				}
			}

			if (!clockEl && !dateEl) {
				var fullText = (timeContainer.textContent || '').trim();
				var timeMatch = fullText.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*(.*)$/);
				if (timeMatch) {
					timeContainer.innerHTML = '<div class="hf-clock-node">' + timeMatch[1] + '</div><div class="hf-calendar-node">' + timeMatch[2] + '</div>';
					clockEl = timeContainer.querySelector('.hf-clock-node');
					dateEl = timeContainer.querySelector('.hf-calendar-node');
				}
			}

			if (!dateEl) return;

			var currentText = (dateEl.textContent || '').trim();
			if (!dateEl.dataset.hfRaw || (!dateEl.dataset.hfRendered && currentText !== dateEl.dataset.hfRaw)) {
				if (currentText !== dateEl.dataset.hfLastFormatted) {
					dateEl.dataset.hfRaw = currentText;
				}
			}

			var rawCal = dateEl.dataset.hfRaw || currentText;
			if (!rawCal) return;

			if (calMode === 'no') {
				dateEl.style.display = 'none';
				return;
			} else {
				dateEl.style.display = '';
			}

'head_filter_show_blackfriday',
'head_filter_show_split'
].forEach(function(key) {
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: { name: key, type: 'trigger', default: standardTriggers[key].default },
field: { name: standardTriggers[key].name }
});
});
applyAllSettings();
setTimeout(applyAllSettings, 800);
}
if (window.appready) {
startPlugin();
} else {
Lampa.Listener.follow('app', function(e) {
if (e.type == 'ready') startPlugin();
});
}
})();
