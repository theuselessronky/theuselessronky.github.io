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
		clock_only: {
			ru: 'Часы',
			en: 'Clock',
			uk: 'Годинник',
			zh: '时钟'
		},
		calendar_mode: {
			ru: 'Календарь',
			en: 'Calendar',
			uk: 'Календар',
			zh: '日历'
		},
		cal_yes: {
			ru: 'Да',
			en: 'Yes',
			uk: 'Так',
			zh: '是'
		},
		cal_no: {
			ru: 'Нет',
			en: 'No',
			uk: 'Ні',
			zh: '否'
		},
		cal_ddmmyy: {
			ru: 'DD.MM.YY',
			en: 'DD.MM.YY',
			uk: 'DD.MM.YY',
			zh: 'DD.MM.YY'
		},
		cal_mmddyy: {
			ru: 'MM.DD.YY',
			en: 'MM.DD.YY',
			uk: 'MM.DD.YY',
			zh: 'MM.DD.YY'
		},
		cal_no_year_weekday: {
			ru: 'Скрытие дня недели и года',
			en: 'Hide weekday and year',
			uk: 'Приховати день тижня та рік',
			zh: '隐藏星期和年份'
		},
		cal_no_weekday: {
			ru: 'Скрытие дня недели',
			en: 'Hide weekday',
			uk: 'Приховати день тижня',
			zh: '隐藏星期'
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
			version: '0.4.0',
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

		function showHideElement(element, show) {
			if (show == true) {
				$(element).show();
			} else {
				$(element).hide();
			}
		}

		// Раздельное управление Часами и Календарём
		function updateClockAndCalendar() {
			var timeContainer = $('.head__time');
			if (!timeContainer.length) return;

			// Совместимость со старой настройкой времени, если новая ещё не задана
			var defaultClock = Lampa.Storage.get('head_filter_show_time', true);
			var showClock = Lampa.Storage.get('head_filter_show_clock', defaultClock);
			var calMode = Lampa.Storage.get('head_filter_calendar_mode', 'yes');

			var clockEl = timeContainer.find('.head__time-now');
			var dateEl = timeContainer.find('.head__time-date');

			// Если оба элемента скрыты — прячем весь контейнер
			if (!showClock && calMode === 'no') {
				timeContainer.hide();
				return;
			} else {
				timeContainer.show();
			}

			// 1. Управление часами
			if (clockEl.length) {
				if (showClock) {
					clockEl.show();
				} else {
					clockEl.hide();
				}
			}

			// 2. Управление календарём
			if (!dateEl.length) return;

			if (calMode === 'no') {
				dateEl.hide();
				timeContainer.css({
					'display': 'flex',
					'align-items': 'center',
					'justify-content': 'center'
				});
				return;
			}

			dateEl.show();

			// Сброс выравнивания, если выбран не режим центрирования
			if (calMode === 'no_year_weekday') {
				timeContainer.css({
					'display': 'flex',
					'flex-direction': 'column',
					'align-items': 'center',
					'justify-content': 'center',
					'text-align': 'center'
				});
				dateEl.css({
					'text-align': 'center',
					'width': '100%'
				});
			} else {
				timeContainer.css({
					'display': '',
					'flex-direction': '',
					'align-items': '',
					'justify-content': '',
					'text-align': ''
				});
				dateEl.css({
					'text-align': '',
					'width': ''
				});
			}

			var now = new Date();
			var dayNum = String(now.getDate());
			var dayPad = now.getDate() < 10 ? '0' + now.getDate() : String(now.getDate());
			var monthNum = now.getMonth() + 1;
			var monthPad = monthNum < 10 ? '0' + monthNum : String(monthNum);
			var yearNum = String(now.getFullYear());

			var monthsRu = [
				'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
				'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
			];
			var weekdaysRu = [
				'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
				'Четверг', 'Пятница', 'Суббота'
			];

			var monthName = monthsRu.slice(now.getMonth(), now.getMonth() + 1).shift();
			var weekdayName = weekdaysRu.slice(now.getDay(), now.getDay() + 1).shift();

			var formattedText = '';

			if (calMode === 'yes') {
				// 25 Ноября 2026 Среда
				formattedText = dayNum + ' ' + monthName + ' ' + yearNum + ' ' + weekdayName;
			} else if (calMode === 'ddmmyy') {
				// 25.11.2026
				formattedText = dayPad + '.' + monthPad + '.' + yearNum;
			} else if (calMode === 'mmddyy') {
				// 11.25.2026
				formattedText = monthPad + '.' + dayPad + '.' + yearNum;
			} else if (calMode === 'no_year_weekday') {
				// 25 Ноября (по центру)
				formattedText = dayNum + ' ' + monthName;
			} else if (calMode === 'no_weekday') {
				// 25 Ноября 2026
				formattedText = dayNum + ' ' + monthName + ' ' + yearNum;
			}

			if (formattedText && dateEl.text() !== formattedText) {
				dateEl.text(formattedText);
			}
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
var currentMode = Lampa.Storage.get('head_filter_bylampa_notice', 'yes');
if (currentMode !== 'yes' && domBtn.style) {
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
function updateByLampaNotice() {
var mode = Lampa.Storage.get('head_filter_bylampa_notice', 'yes');
toggleByLampaBtn(mode === 'yes');
var menuList = $('.menu .menu__list').first();
if (!menuList.length) return;
var customItem = menuList.find('.hf-bylampa-changes');
if (mode === 'menu') {
if (!customItem.length) {
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
var mode = Lampa.Storage.get('head_filter_bylampa_notice', 'yes');
toggleByLampaBtn(mode === 'yes');
updateClockAndCalendar();
});
headObserver.observe(headNode, { childList: true, subtree: true });
}
// Следим за ежеминутным обновлением времени самой Лампой, чтобы формат даты не сбивался
setInterval(updateClockAndCalendar, 1000);
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
} else if (event.name === 'head_filter_show_clock' || event.name === 'head_filter_calendar_mode') {
updateClockAndCalendar();
}
});
// Оригинальный чистый вид окна настроек
Lampa.Template.add('settings_head_filter', '');
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
// Переключатель: Часы (отвязаны от календаря)
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
// Переключатель: Календарь
Lampa.SettingsApi.addParam({
component: 'head_filter',
param: {
name: 'head_filter_calendar_mode',
type: 'select',
values: {
yes: Lampa.Lang.translate('cal_yes'),
no: Lampa.Lang.translate('cal_no'),
ddmmyy: Lampa.Lang.translate('cal_ddmmyy'),
mmddyy: Lampa.Lang.translate('cal_mmddyy'),
no_year_weekday: Lampa.Lang.translate('cal_no_year_weekday'),
no_weekday: Lampa.Lang.translate('cal_no_weekday')
},
default: 'yes'
},
field: {
name: Lampa.Lang.translate('calendar_mode')
}
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
