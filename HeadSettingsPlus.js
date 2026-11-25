(function() {
	'use strict';

	function initPlugin() {
		try {
			if (window.hfp_loaded) return;
			window.hfp_loaded = true;

			Lampa.Lang.add({
				hfp_name: { ru: 'Настройка шапки+', en: 'Header settings+' },
				hfp_menu_title: { ru: 'Отображать в шапке', en: 'Display in header' },
				hfp_arrow: { ru: 'Стрелка', en: 'Back arrow' },
				hfp_menu_icon: { ru: 'Меню', en: 'Menu icon' },
				hfp_source: { ru: 'Источник', en: 'Source' },
				hfp_big_title: { ru: 'Увеличенное название раздела', en: 'Enlarged section title' },
				hfp_bylampa_notice: { ru: 'Уведомления ByLampa', en: 'ByLampa notifications' },
				hfp_bylampa_menu: { ru: 'Уведомления ByLampa в боковом меню', en: 'ByLampa notifications in side menu' },
				hfp_changes: { ru: 'Изменения', en: 'Changes' },
				hfp_clock: { ru: 'Часы', en: 'Clock' },
				hfp_cal_show: { ru: 'Календарь', en: 'Calendar' },
				hfp_cal_hide_wd: { ru: 'Календарь: скрыть день недели', en: 'Calendar: hide weekday' },
				hfp_cal_hide_m: { ru: 'Календарь: скрыть месяц', en: 'Calendar: hide month' },
				hfp_cal_hide_y: { ru: 'Календарь: скрыть год', en: 'Calendar: hide year' },
				hfp_search: { ru: 'Поиск', en: 'Search' },
				hfp_settings: { ru: 'Настройки', en: 'Settings' },
				hfp_premium: { ru: 'Премиум', en: 'Premium' },
				hfp_profile: { ru: 'Профиль', en: 'Profile' },
				hfp_feed: { ru: 'Новости', en: 'Feed' },
				hfp_notice: { ru: 'Уведомления', en: 'Notifications' },
				hfp_broadcast: { ru: 'Вещание', en: 'Broadcast' },
				hfp_fullscreen: { ru: 'Полноэкранный режим', en: 'Fullscreen mode' },
				hfp_reload: { ru: 'Обновление страницы', en: 'Page reload' },
				hfp_blackfriday: { ru: 'Черная пятница', en: 'Black Friday' },
				hfp_split: { ru: 'Разделитель', en: 'Divider' }
			});

			Lampa.Manifest.plugins = {
				type: 'other',
				version: '0.7.0',
				name: Lampa.Lang.translate('hfp_name'),
				component: 'hfp_settings'
			};

			var style = document.createElement('style');
			style.type = 'text/css';
			style.textContent = '' +
				'body.hfp-no-arrow .head__backward { display: none !important; }' +
				'body.hfp-no-menu .head__menu-icon { display: none !important; }' +
				'body.hfp-no-src .head__title-source, body.hfp-no-src .head__source, body.hfp-no-src .hfp-src-span { display: none !important; }' +
				'body.hfp-big-title .head__title { text-transform: uppercase !important; font-weight: 700 !important; font-size: 1.35em !important; }' +
				'body.hfp-no-clock .hfp-clock-part { display: none !important; }' +
				'body.hfp-no-cal .hfp-cal-part { display: none !important; }' +
				'body.hfp-cal-center .hfp-cal-part { display: block !important; text-align: center !important; width: 100% !important; }' +
				'.hfp-cal-year-br { display: block !important; text-align: right; line-height: 1.1; }';
			document.head.appendChild(style);

			var items = [
				{ key: 'hfp_search', lang: 'hfp_search', sel: '.open--search' },
				{ key: 'hfp_settings', lang: 'hfp_settings', sel: '.open--settings' },
				{ key: 'hfp_premium', lang: 'hfp_premium', sel: '.open--premium' },
				{ key: 'hfp_profile', lang: 'hfp_profile', sel: '.open--profile' },
				{ key: 'hfp_feed', lang: 'hfp_feed', sel: '.open--feed' },
				{ key: 'hfp_notice', lang: 'hfp_notice', sel: '.notice--icon' },
				{ key: 'hfp_broadcast', lang: 'hfp_broadcast', sel: '.open--broadcast' },
				{ key: 'hfp_fullscreen', lang: 'hfp_fullscreen', sel: '.full-screen' },
				{ key: 'hfp_reload', lang: 'hfp_reload', sel: '.m-reload-screen' },
				{ key: 'hfp_blackfriday', lang: 'hfp_blackfriday', sel: '.black-friday__button' },
				{ key: 'hfp_split', lang: 'hfp_split', sel: '.head__split' }
			];

			function findByLampaBtn() {
				var known = document.querySelector('.bylampa-notice, .bylampa__notice, .open--bylampa-notice, .head__action--changelog, .bylampa-changelog');
				if (known) return known;

				var actions = document.querySelectorAll('.head__actions .head__action');
				var res = null;
				Array.prototype.forEach.call(actions, function(el) {
					if (res) return;
					if (
						!el.classList.contains('open--search') &&
						!el.classList.contains('open--settings') &&
						!el.classList.contains('open--premium') &&
						!el.classList.contains('open--profile') &&
						!el.classList.contains('open--feed') &&
						!el.classList.contains('notice--icon') &&
						!el.classList.contains('open--broadcast') &&
						!el.classList.contains('full-screen') &&
						!el.classList.contains('m-reload-screen') &&
						!el.classList.contains('black-friday__button')
					) {
						res = el;
					}
				});
				return res;
			}

			function syncSideMenu(enable) {
				var old = document.querySelector('.hfp-side-changes');
				if (!enable) {
					if (old && old.parentNode) old.parentNode.removeChild(old);
					return;
				}
				if (old) return;

				var menus = document.querySelectorAll('.menu__list');
				if (!menus || !menus.length) return;
				var target = menus.item(menus.length - 1);
				if (!target) return;

				var li = document.createElement('li');
				li.className = 'menu__item selector hfp-side-changes';
				li.innerHTML = '<div class="menu__ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></div><div class="menu__text">' + Lampa.Lang.translate('hfp_changes') + '</div>';

				$(li).on('hover:enter click', function() {
					try {
						var btn = findByLampaBtn();
						if (btn) {
							btn.style.display = '';
							$(btn).trigger('hover:enter');
							setTimeout(function() {
								if (!Lampa.Storage.get('hfp_bylampa_notice', true)) {
									btn.style.display = 'none';
								}
							}, 100);
						}
					} catch (err) {}
				});

				target.appendChild(li);
			}

			function updateHeader() {
				try {
					var showArrow = Lampa.Storage.get('hfp_arrow', true);
					var showMenu = Lampa.Storage.get('hfp_menu_icon', true);
					var showSrc = Lampa.Storage.get('hfp_source', true);
					var bigTitle = Lampa.Storage.get('hfp_big_title', false);
					var showByNotice = Lampa.Storage.get('hfp_bylampa_notice', true);
					var showByMenu = Lampa.Storage.get('hfp_bylampa_menu', false);
					var showClock = Lampa.Storage.get('hfp_clock', true);
					var showCal = Lampa.Storage.get('hfp_cal_show', true);
					var hideWd = Lampa.Storage.get('hfp_cal_hide_wd', false);
					var hideM = Lampa.Storage.get('hfp_cal_hide_m', false);
					var hideY = Lampa.Storage.get('hfp_cal_hide_y', false);

					document.body.classList.toggle('hfp-no-arrow', !showArrow);
					document.body.classList.toggle('hfp-no-menu', !showMenu);
					document.body.classList.toggle('hfp-no-src', !showSrc);
					document.body.classList.toggle('hfp-big-title', Boolean(bigTitle));
					document.body.classList.toggle('hfp-no-clock', !showClock);
					document.body.classList.toggle('hfp-no-cal', !showCal);
					document.body.classList.toggle('hfp-cal-center', Boolean(showCal && hideY && hideWd && !hideM));

					var btn = findByLampaBtn();
					if (btn) btn.style.display = showByNotice ? '' : 'none';
					syncSideMenu(Boolean(showByMenu));

					var title = document.querySelector('.head__title');
					if (title) {
						var nativeSrc = title.querySelector('.head__title-source');
						if (nativeSrc) {
							nativeSrc.style.display = showSrc ? '' : 'none';
						} else {
							var txt = title.textContent || '';
							var pos = txt.indexOf(' - ');
							if (pos !== -1 && !title.querySelector('.hfp-src-span')) {
								title.innerHTML = '<span>' + txt.slice(0, pos) + '</span><span class="hfp-src-span">' + txt.slice(pos) + '</span>';
							}
							var sp = title.querySelector('.hfp-src-span');
							if (sp) sp.style.display = showSrc ? '' : 'none';
						}
					}

					var box = document.querySelector('.head__time');
					if (box) {
						var clockEl = box.querySelector('.head__time-now, .time--clock, .hfp-clock-part');
						var calEl = box.querySelector('.head__time-date, .time--date, .hfp-cal-part');

						if (!clockEl || !calEl) {
							Array.prototype.forEach.call(box.children, function(kid) {
								var t = (kid.textContent || '').trim();
								if (/^\d{1,2}:\d{2}/.test(t)) {
									kid.classList.add('hfp-clock-part');
									clockEl = kid;
								} else if (t.length > 0) {
									kid.classList.add('hfp-cal-part');
									calEl = kid;
								}
							});
						}

						if (!clockEl && !calEl) {
							var all = (box.textContent || '').trim();
							var spIdx = all.indexOf(' ');
							if (spIdx !== -1 && /^\d{1,2}:\d{2}/.test(all.slice(0, spIdx))) {
								box.innerHTML = '<div class="hfp-clock-part">' + all.slice(0, spIdx) + '</div><div class="hfp-cal-part">' + all.slice(spIdx + 1).trim() + '</div>';
								calEl = box.querySelector('.hfp-cal-part');
							}
						}

						if (calEl && showCal) {
							var cur = (calEl.textContent || '').trim();
							if (!calEl.getAttribute('data-raw') || (!calEl.getAttribute('data-done') && cur !== calEl.getAttribute('data-raw'))) {
								if (cur && cur !== calEl.getAttribute('data-last')) {
									calEl.setAttribute('data-raw', cur);
								}
							}

							var raw = calEl.getAttribute('data-raw') || cur;
							var parts = raw.replace(/,/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
							if (parts.length >= 4) {
								var d = parts.shift();
								var m = parts.shift();
								var y = parts.shift();
								var w = parts.join(' ');

								if (/^\d{1,2}$/.test(d) && /^\d{4}$/.test(y)) {
									var out = d;
									if (!hideM) out += ' ' + m;
									if (hideM && !hideWd) {
										out += ' ' + w;
										if (!hideY) {
											var wrap = (out + ' ' + y).length > 16 || box.offsetWidth < 155;
											out += wrap ? ('<span class="hfp-cal-year-br">' + y + '</span>') : (' ' + y);
										}
									} else {
										if (!hideY) out += ' ' + y;
										if (!hideWd) out += ' ' + w;
}
if (calEl.getAttribute('data-last') !== out) {
calEl.setAttribute('data-last', out);
calEl.setAttribute('data-done', '1');
calEl.innerHTML = out;
}
}
}
}
}
items.forEach(function(it) {
if (Lampa.Storage.get(it.key, true)) $(it.sel).show();
else $(it.sel).hide();
});
} catch (err) {}
}
Lampa.Template.add('settings_hfp_settings', '');
Lampa.SettingsApi.addParam({
component: 'interface',
param: { type: 'button' },
field: { name: Lampa.Lang.translate('hfp_name') },
onChange: function() {
Lampa.Settings.create('hfp_settings', {
onBack: function() { Lampa.Settings.create('interface'); }
});
}
});
Lampa.SettingsApi.addParam({
component: 'hfp_settings',
param: { type: 'title' },
field: { name: Lampa.Lang.translate('hfp_menu_title') }
});
var customTriggers = [
{ key: 'hfp_arrow', lang: 'hfp_arrow', def: true },
{ key: 'hfp_menu_icon', lang: 'hfp_menu_icon', def: true },
{ key: 'hfp_source', lang: 'hfp_source', def: true },
{ key: 'hfp_big_title', lang: 'hfp_big_title', def: false },
{ key: 'hfp_bylampa_notice', lang: 'hfp_bylampa_notice', def: true },
{ key: 'hfp_bylampa_menu', lang: 'hfp_bylampa_menu', def: false },
{ key: 'hfp_clock', lang: 'hfp_clock', def: true },
{ key: 'hfp_cal_show', lang: 'hfp_cal_show', def: true },
{ key: 'hfp_cal_hide_wd', lang: 'hfp_cal_hide_wd', def: false },
{ key: 'hfp_cal_hide_m', lang: 'hfp_cal_hide_m', def: false },
{ key: 'hfp_cal_hide_y', lang: 'hfp_cal_hide_y', def: false }
];
customTriggers.forEach(function(t) {
Lampa.SettingsApi.addParam({
component: 'hfp_settings',
param: { name: t.key, type: 'trigger', default: t.def },
field: { name: Lampa.Lang.translate(t.lang) }
});
});
items.forEach(function(it) {
Lampa.SettingsApi.addParam({
component: 'hfp_settings',
param: { name: it.key, type: 'trigger', default: true },
field: { name: Lampa.Lang.translate(it.lang) }
});
});
Lampa.Storage.listener.follow('change', function(e) {
if (e.name === 'activity') {
updateHeader();
setTimeout(updateHeader, 500);
} else if (e.name && e.name.indexOf('hfp_') === 0) {
updateHeader();
}
});
setInterval(updateHeader, 2000);
updateHeader();
setTimeout(updateHeader, 800);
} catch (e) {}
}
if (window.appready) {
initPlugin();
} else {
Lampa.Listener.follow('app', function(e) {
if (e.type === 'ready') initPlugin();
});
}
})();
