(function() {
	'use strict';
	if (window.plugin_head_filter_plus_ready) return;
	window.plugin_head_filter_plus_ready = true;

	var LANG = {
		arrow: { ru: 'Стрелка', en: 'Back arrow', uk: 'Стрілка', zh: '返回箭头' },
		menu_btn: { ru: 'Меню', en: 'Menu', uk: 'Меню', zh: '菜单' },
		source_title: { ru: 'Источник', en: 'Source', uk: 'Джерело', zh: '来源' },
		big_title: { ru: 'Увеличенное название раздела', en: 'Enlarged section title', uk: 'Збільшена назва розділу', zh: '放大标题' },
		bylampa_notice: { ru: 'Уведомления ByLampa', en: 'ByLampa Notifications', uk: 'Сповіщення ByLampa', zh: 'ByLampa 通知' },
		bylampa_notice_yes: { ru: 'Да', en: 'Yes', uk: 'Так', zh: '是' },
		bylampa_notice_moved: { ru: 'Перенесено в боковое меню', en: 'Moved to side menu', uk: 'Перенесено в бічне меню', zh: '移至侧边菜单' },
		menu_changes: { ru: 'Изменения', en: 'Changes', uk: 'Зміни', zh: '更新日志' },
		clock_only: { ru: 'Часы', en: 'Clock', uk: 'Годинник', zh: '时钟' },
		calendar_only: { ru: 'Календарь', en: 'Calendar', uk: 'Календар', zh: '日历' },
		network_indicator: { ru: 'Сеть', en: 'Network', uk: 'Мережа', zh: '网络' },
		search: { ru: 'Поиск', en: 'Search', uk: 'Пошук', zh: '搜索' },
		settings: { ru: 'Настройки', en: 'Settings', uk: 'Налаштування', zh: '设置' },
		premium: { ru: 'Премиум', en: 'Premium', uk: 'Преміум', zh: '高级' },
		profile: { ru: 'Профиль', en: 'Profile', uk: 'Профіль', zh: '个人资料' },
		feed: { ru: 'Новости', en: 'Feed', uk: 'Новини', zh: '饲料' },
		notice: { ru: 'Уведомления', en: 'Notifications', uk: 'Сповіщення', zh: '通知' },
		broadcast: { ru: 'Вещание', en: 'Broadcast', uk: 'Мовлення', zh: '广播' },
		fullscreen: { ru: 'Полноэкранный режим', en: 'Fullscreen mode', uk: 'Повноэкранний режим', zh: '全屏模式' },
		blackfriday: { ru: 'Черная пятница', en: 'Black Friday', uk: 'Чорна п’ятниця', zh: '黑色星期五' },
		secured: { ru: 'Защита', en: 'Protection', uk: 'Захист', zh: '保护' },
		name_menu: { ru: 'Отображать в шапке', en: 'Display in header', uk: 'Відображати у шапці', zh: '在标题中显示' },
		name_plugin: { ru: 'Настройка шапки+', en: 'Header settings+', uk: 'Налаштування шапки+', zh: '标题设置+' },
		plugin_description: { ru: 'Плагин для настройки шапки', en: 'Plugin for customizing the header', uk: 'Плагін для налаштування шапки', zh: '用于配置上限的插件' }
	};

	function t(key, fallback) {
		try {
			if (window.Lampa && Lampa.Lang && typeof Lampa.Lang.translate === 'function') {
				var r = Lampa.Lang.translate(key);
				if (r && r !== key) return r;
			}
		} catch (e) {}
		return fallback || key;
	}

	function startPlugin() {
		if (!window.Lampa || !window.$) return;
		if (window.plugin_head_filter_plus_lang_ready !== true && Lampa.Lang && typeof Lampa.Lang.add === 'function') {
			window.plugin_head_filter_plus_lang_ready = true;
			try { Lampa.Lang.add(LANG); } catch (e) {}
		}

		var busy = false;
		var splitting = false;
		var rafPending = false;
		var tick = null;
		var pending = {};

		function markPending(key, v) {
			pending[key] = v;
			setTimeout(function() { delete pending[key]; }, 600);
		}

		try {
			if (Lampa.Manifest) {
				var self = {
					type: 'other', version: '2.7.0',
					name: t('name_plugin', 'Настройка шапки+'),
					description: t('plugin_description', 'Плагин для настройки шапки'),
					component: 'head_filter'
				};
				var cur = Lampa.Manifest.plugins;
				if (Array.isArray(cur)) Lampa.Manifest.plugins = cur.concat([self]);
				else if (cur && typeof cur === 'object') Lampa.Manifest.plugins = Object.assign({}, cur, { head_filter: self });
				else Lampa.Manifest.plugins = self;
			}
		} catch (e) {}

		var standardHead = {
			head_filter_show_search:     { l: 'search',     f: 'Поиск',               s: '.open--search' },
			head_filter_show_settings:   { l: 'settings',   f: 'Настройки',           s: '.open--settings' },
			head_filter_show_premium:    { l: 'premium',    f: 'Премиум',             s: '.open--premium, [data-action="premium"]' },
			head_filter_show_profile:    { l: 'profile',    f: 'Профиль',             s: '.open--profile, [data-action="profile"]' },
			head_filter_show_feed:       { l: 'feed',       f: 'Новости',             s: '.open--feed, [data-action="feed"]' },
			head_filter_show_notice:     { l: 'notice',     f: 'Уведомления',         s: '.notice--icon' },
			head_filter_show_broadcast:  { l: 'broadcast',  f: 'Вещание',             s: '.open--broadcast, [data-action="broadcast"]' },
			head_filter_show_fullscreen: { l: 'fullscreen', f: 'Полноэкранный режим', s: '.full--screen, .full-screen, .fullscreen, .head__fullscreen, [data-action="fullscreen"], [data-action="full-screen"]' },
			head_filter_show_blackfriday:{ l: 'blackfriday',f: 'Черная пятница',      s: '.black-friday__button' },
			head_filter_show_secured:    { l: 'secured',    f: 'Защита',              s: '#secured.head__action, .head__action#secured, #secured.proto, #secured' }
		};
		var topHead = {
			head_filter_show_arrow: { l: 'arrow',    f: 'Стрелка', s: '.head__backward' },
			head_filter_show_menu:  { l: 'menu_btn', f: 'Меню',    s: '.head__menu-icon' }
		};
		var alwaysVisible = {
			head_filter_show_clock: true, head_filter_show_calendar: true,
			head_filter_show_source: true, head_filter_big_title: true,
			head_filter_show_network: true,
			head_filter_show_fullscreen: true,
			head_filter_show_premium: true,
			head_filter_show_profile: true,
			head_filter_show_feed: true,
			head_filter_show_broadcast: true
		};

		function getBool(key, def) {
			if (key in pending) return pending[key];
			try {
				if (!Lampa.Storage || typeof Lampa.Storage.get !== 'function') return def;
				var v = Lampa.Storage.get(key, def);
				if (v === false || v === 'false' || v === 0 || v === '0') return false;
				if (v === true || v === 'true' || v === 1 || v === '1') return true;
				return typeof v === 'boolean' ? v : Boolean(def);
			} catch (e) { return def; }
		}
		function isByLampaInHeader() { return getBool('head_filter_bylampa_notice_v2', true); }

		function setVisible(el, show) {
			if (!el || !el.style) return;
			try {
				var hidden = el.getAttribute && el.getAttribute('data-hf-hidden') === '1';
				if (show) {
					if (hidden) {
						var o = el.getAttribute('data-hf-orig-display');
						if (o && o !== 'none') el.style.setProperty('display', o, 'important');
						else el.style.removeProperty('display');
						el.removeAttribute('data-hf-hidden');
						el.removeAttribute('data-hf-orig-display');
					} else if (el.style.display === 'none') {
						el.style.removeProperty('display');
					}
				} else {
					if (!hidden) {
						var curD = el.style.getPropertyValue('display');
						if (curD && curD !== 'none') el.setAttribute('data-hf-orig-display', curD);
						el.style.setProperty('display', 'none', 'important');
						if (el.setAttribute) el.setAttribute('data-hf-hidden', '1');
					}
				}
			} catch (e) {}
		}
		function hideShowAll(map) {
			Object.keys(map).forEach(function(k) {
				var els = document.querySelectorAll(map[k].s);
				var show = getBool(k, true);
				for (var i = 0; i < els.length; i++) setVisible(els[i], show);
			});
		}
		function applyStatic() { hideShowAll(topHead); hideShowAll(standardHead); }

		var envCache = null;
		function hasByLampaEnv() {
			if (envCache !== null) return envCache;
			try {
				if (window.ByLampa) { envCache = true; return true; }
				var ss = document.getElementsByTagName('script');
				for (var i = 0; i < ss.length; i++) if ((ss[i].src || '').toLowerCase().indexOf('bylampa') !== -1) { envCache = true; return true; }
				var ls = document.getElementsByTagName('link');
				for (var j = 0; j < ls.length; j++) if ((ls[j].href || '').toLowerCase().indexOf('bylampa') !== -1) { envCache = true; return true; }
			} catch (e) {}
			envCache = false; return false;
		}

		var BYLAMPA_EXCLUDE = ['open--search','open--settings','open--premium','open--profile','open--feed','notice--icon','open--broadcast','full--screen','full-screen','m-reload-screen','black-friday__button','head__backward','head__menu-icon'];
		function findByLampaBtn() {
			try {
				var ex = $('.head .bylampa--notice, .head .bylampa-notice, .head [data-action="bylampa_notice"], .head [data-bylampa-notice]');
				if (ex.length) return ex;
				if (!hasByLampaEnv()) return $();
				return $('.head .head__action, .head__actions > div, .head__actions > button').filter(function() {
					var el = $(this);
					if (!el.hasClass('selector') && !el.hasClass('head__action')) return false;
					for (var i = 0; i < BYLAMPA_EXCLUDE.length; i++) if (el.hasClass(BYLAMPA_EXCLUDE[i])) return false;
					var cls = (this.className || '').toString().toLowerCase();
					if (/bookmark|torr|cub|tmdb|radio|shot|sync|theme|lang|exit|power/.test(cls)) return false;
					if (this.id === 'secured') return false;
					var a = (el.attr('data-action') || '').toLowerCase();
					if (a && a.indexOf('bylampa') === -1 && a.indexOf('notice') === -1 && a.indexOf('change') === -1) return false;
					return el.find('svg').length > 0 || el.find('img').length > 0;
				});
			} catch (e) { return $(); }
		}
		function hasByLampaBtn() { return findByLampaBtn().length > 0; }

		function openByLampa() {
			try {
				var $b = findByLampaBtn();
				var b = $b.get(0);
				if (b) {
					if (b.style && b.style.display === 'none') b.style.setProperty('display', 'flex', 'important');
					try { $b.trigger('hover:enter'); } catch (e1) {}
					try { $b.trigger('click'); } catch (e2) {}
					setTimeout(function() { if (b && b.parentNode && !isByLampaInHeader()) setVisible(b, false); }, 50);
					return;
				}
				if (window.ByLampa) {
					if (typeof window.ByLampa.showNotice === 'function') window.ByLampa.showNotice();
					else if (typeof window.ByLampa.notice === 'function') window.ByLampa.notice();
				}
			} catch (e) {}
		}
		function refreshMenuCtrl() {
			try {
				if (!Lampa.Controller || typeof Lampa.Controller.enabled !== 'function') return;
				var c = Lampa.Controller.enabled();
				if (c && c.name === 'menu' && typeof Lampa.Controller.collectionSet === 'function') {
					var m = $('.menu'); if (m.length) Lampa.Controller.collectionSet(m);
				}
			} catch (e) {}
		}

		function refreshByLampa() {
			try {
				var items = $('.hf-bylampa-changes');
				if (!hasByLampaBtn()) {
					if (items.length) { items.remove(); refreshMenuCtrl(); }
					return;
				}
				var inHeader = isByLampaInHeader();
				findByLampaBtn().each(function() { setVisible(this, inHeader); });

				if (inHeader) {
					if (items.length) { items.remove(); refreshMenuCtrl(); }
					return;
				}
				var valid = items.filter('[data-action="hf_bylampa_changes"]');
				if (items.length > valid.length) items.not(valid).remove();
				if (valid.length === 1) return;
				valid.remove();

				var console = $('.menu__item[data-action="console"]');
				if (!console.length) console = $('.menu__item').filter(function() {
					var x = $(this).find('.menu__text').text().trim();
					return x === 'Консоль' || x === 'Console' || x === t('menu_console', 'Консоль');
				});
				if (!console.length && !$('.menu__list').length) return;

				var bell = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
				var node;
				if (console.length) {
					node = console.first().clone(false);
					node.removeClass('focus active select').addClass('hf-bylampa-changes')
						.attr('data-action', 'hf_bylampa_changes');
					node.find('.menu__ico').html(bell);
					node.find('.menu__text').text(t('menu_changes', 'Изменения'));
					node.find('.menu__counter, .menu__badge').remove();
				} else {
					node = $('<div class="menu__item selector hf-bylampa-changes" data-action="hf_bylampa_changes"><div class="menu__ico">' + bell + '</div><div class="menu__text">' + t('menu_changes', 'Изменения') + '</div></div>');
				}
				node.on('hover:enter.hfb click.hfb', function(e) { if (e && e.preventDefault) e.preventDefault(); openByLampa(); });

				if (console.length) console.first().after(node);
				else {
					var lists = $('.menu__list');
					if (lists.length > 1) lists.last().prepend(node);
					else if (lists.length) lists.first().append(node);
				}
				refreshMenuCtrl();
			} catch (e) {}
		}

		function isNetworkLike(cls, tag) {
			return cls.indexOf('net') !== -1 || cls.indexOf('wifi') !== -1 || cls.indexOf('speed') !== -1 ||
				cls.indexOf('conn') !== -1 || cls.indexOf('signal') !== -1 || cls.indexOf('lan') !== -1 ||
				cls.indexOf('marker') !== -1 || tag === 'svg';
		}
		function isDateString(x) {
			return !!x && /\d{1,2}[./-]\d{1,2}|янв|фев|мар|апр|мая|июн|июл|авг|сен|окт|ноя|дек|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec|\b(май|may)\b|понедельник|вторник|среда|четверг|пятница|суббота|воскресенье|\b(пн|вт|ср|чт|пт|сб|вс|mon|tue|wed|thu|fri|sat|sun)\b/i.test(x);
		}
		function isTimeString(x) { return /^\d{1,2}:\d{2}(:\d{2})?$/.test(x); }

		function ensureSpan(container, cls, txt) {
			var last = cls.split(' ').pop();
			var span = container.querySelector(':scope > .' + last) || container.querySelector('.' + last);
			if (!span) { span = document.createElement('div'); span.className = cls; container.appendChild(span); }
			if (span.textContent !== txt) span.textContent = txt;
			return span;
		}
		function splitText(host, container) {
			if (!host || !container) return;
			var nodes = [], ch = host.childNodes;
			for (var i = 0; i < ch.length; i++) if (ch[i].nodeType === 3) nodes.push(ch[i]);
			for (var j = 0; j < nodes.length; j++) {
				var node = nodes[j], raw = (node.nodeValue || '').trim();
				if (!raw) continue;
				var m = raw.match(/\d{1,2}:\d{2}(:\d{2})?/);
				var time = m ? m[0] : '';
				var rest = time ? raw.replace(time, '') : raw;
				var date = rest.replace(/^[\s•|\-\/,]+|[\s•|\-\/,]+$/g, '').trim();
				if (time && date && isDateString(date)) {
					setVisible(ensureSpan(container, 'head__time-now hf-clock-wrap', time), getBool('head_filter_show_clock', true));
					setVisible(ensureSpan(container, 'time--date hf-date-wrap', date), getBool('head_filter_show_calendar', true));
					try { host.removeChild(node); } catch (e) {}
				} else if (!time && date && isDateString(date)) {
					setVisible(ensureSpan(container, 'time--date hf-date-wrap', date), getBool('head_filter_show_calendar', true));
					try { host.removeChild(node); } catch (e) {}
				}
			}
		}
		function maybeSplit() {
			if (splitting) return;
			splitting = true;
			try {
				var c = document.querySelector('.head__time');
				if (!c) return;
				splitText(c, c);
				var inner = c.querySelector('.head__time-now:not(.hf-clock-wrap)');
				if (inner) {
					splitText(inner, c);
					if (!inner.textContent.trim() && inner.children.length === 0 && inner.parentNode) inner.parentNode.removeChild(inner);
				}
			} catch (e) {} finally { splitting = false; }
		}

		function collectNet() {
			if (tick && tick.net && tick.net.length) {
				var allLive = true;
				for (var z = 0; z < tick.net.length; z++) {
					if (!tick.net[z] || !tick.net[z].isConnected) { allLive = false; break; }
				}
				if (allLive) return tick.net;
			}
			var out = [];
			try {
				var markers = document.querySelectorAll('.head__markers, .head .head__markers');
				for (var m = 0; m < markers.length; m++) {
					if (markers[m] && out.indexOf(markers[m]) === -1) out.push(markers[m]);
				}
				var sel = [
					'.head [class*="network"]', '.head [class*="wifi"]', '.head [class*="speed"]',
					'.head [class*="online"]', '.head [class*="conn"]', '.head [class*="signal"]',
					'.head [class*="lan"]', '.head [class*="markers"]',
					'.head [id*="net"]', '.head [id*="wifi"]',
					'.head__network', '.head__wifi', '.head__speed', '.head__online', '.head__connection',
					'.head__markers'
				].join(',');
				var els = document.querySelectorAll(sel);
				for (var i = 0; i < els.length; i++) {
					var el = els[i];
					if (el.classList.contains('head') || el.classList.contains('head__body') || el.classList.contains('head__actions')) continue;
					if (el.classList.contains('head__action') || el.classList.contains('selector')) {
						if (out.indexOf(el) === -1) out.push(el);
						continue;
					}
					var parent = el.closest('.head__action, .head__markers');
					if (parent) {
						if (out.indexOf(parent) === -1) out.push(parent);
						continue;
					}
					if (el.closest('.head__title')) continue;
					if (out.indexOf(el) === -1) out.push(el);
				}
				var tc = document.querySelector('.head__time');
				if (tc) {
					var all = tc.querySelectorAll('*');
					for (var k = 0; k < all.length; k++) {
						var n = all[k];
						if (n.classList && (n.classList.contains('hf-clock-wrap') || n.classList.contains('hf-date-wrap'))) continue;
						var tag = n.tagName.toLowerCase();
						var txt = (n.textContent || '').trim();
						if (tag === 'svg' || /мбит|mbps|kbps|kb\/s|ping|мс|ms/i.test(txt)) {
							var target = (tag === 'svg' && n.parentElement && n.parentElement !== tc && n.parentElement.children.length === 1) ? n.parentElement : n;
							if (out.indexOf(target) === -1) out.push(target);
						}
					}
				}
			} catch (e) {}
			tick = tick || {}; tick.net = out;
			return out;
		}

		function collectClocks() {
			if (tick && tick.clock) {
				var ok = true;
				for (var z = 0; z < tick.clock.length; z++) { if (!tick.clock[z] || !tick.clock[z].isConnected) { ok = false; break; } }
				if (ok) return tick.clock;
			}
			var out = [];
			try {
				maybeSplit();
				var net = collectNet();
				var c = document.querySelector('.head__time');
				var q = document.querySelectorAll('.head__clock, .time--clock, .head__time-now');
				for (var i = 0; i < q.length; i++) {
					var el = q[i];
					if (el.closest('.head__title, .head__action')) continue;
					if (net.indexOf(el) === -1 && out.indexOf(el) === -1) out.push(el);
				}
				if (c && c.children) {
					for (var j = 0; j < c.children.length; j++) {
						var ch = c.children[j];
						if (net.indexOf(ch) !== -1) continue;
						var cls = (ch.className || '').toString().toLowerCase();
						var tag = ch.tagName.toLowerCase();
						if (isNetworkLike(cls, tag)) continue;
						var txt = (ch.textContent || '').trim();
						if (!txt || /мбит|mbps|kbps|kb\/s|ping|мс|ms/i.test(txt)) continue;
						if ((cls.indexOf('clock') !== -1 || (ch.classList && (ch.classList.contains('head__time-now') || ch.classList.contains('time--clock'))) || isTimeString(txt)) && out.indexOf(ch) === -1) out.push(ch);
					}
					if (!out.length && c.children.length === 0 && isTimeString((c.textContent || '').trim())) out.push(c);
				}
			} catch (e) {}
			tick = tick || {}; tick.clock = out;
			return out;
		}

		function collectDates() {
			if (tick && tick.cal) {
				var ok = true;
				for (var z = 0; z < tick.cal.length; z++) { if (!tick.cal[z] || !tick.cal[z].isConnected) { ok = false; break; } }
				if (ok) return tick.cal;
			}
			var out = [];
			try {
				maybeSplit();
				var net = collectNet();
				var c = document.querySelector('.head__time');
				var q = document.querySelectorAll('.head__date, .head__calendar, .time--date, .head [class*="calendar"], .head [class*="date"]');
				for (var i = 0; i < q.length; i++) {
					var el = q[i];
					if (el === c) continue;
					if (el.closest('.head__action, .head__title')) continue;
					if (net.indexOf(el) !== -1) continue;
					var txt = (el.textContent || '').trim();
					if (txt && !/\d{1,2}:\d{2}/.test(txt) && isDateString(txt) && out.indexOf(el) === -1) out.push(el);
				}
				if (c && c.children) {
					for (var j = 0; j < c.children.length; j++) {
						var ch = c.children[j];
						if (net.indexOf(ch) !== -1) continue;
						var cls = (ch.className || '').toString().toLowerCase();
						var tag = ch.tagName.toLowerCase();
						if (isNetworkLike(cls, tag)) continue;
						var t2 = (ch.textContent || '').trim();
						if (!t2 || /мбит|mbps|kbps|kb\/s|ping|мс|ms/i.test(t2)) continue;
						var clock = cls.indexOf('clock') !== -1 || (ch.classList && (ch.classList.contains('head__time-now') || ch.classList.contains('time--clock'))) || isTimeString(t2);
						var date = cls.indexOf('date') !== -1 || cls.indexOf('cal') !== -1 || (ch.classList && ch.classList.contains('time--date')) || (!clock && isDateString(t2));
						if (date && out.indexOf(ch) === -1) out.push(ch);
					}
					if (!out.length && c.children.length === 0 && isDateString((c.textContent || '').trim())) out.push(c);
				}
			} catch (e) {}
			tick = tick || {}; tick.cal = out;
			return out;
		}

		function applyNetGap(showNet) {
			try {
				var existing = document.querySelector('.hf-net-gap');
				if (existing && !existing.isConnected) existing = null;
				var markers = document.querySelector('.head__markers');
				if (showNet || !markers) {
					if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
					return;
				}
				var parent = markers.parentNode;
				if (!parent) return;
				if (existing && existing.parentNode === parent) return;
				if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
				var gap = document.createElement('span');
				gap.className = 'hf-net-gap';
				gap.style.display = 'inline-block';
				gap.style.width = '12px';
				gap.style.flex = '0 0 auto';
				gap.style.pointerEvents = 'none';
				if (markers.nextSibling) parent.insertBefore(gap, markers.nextSibling);
				else parent.appendChild(gap);
			} catch (e) {}
		}

		function refreshTimeSection(override) {
			try {
				var showClock = (override && typeof override.clock === 'boolean') ? override.clock : getBool('head_filter_show_clock', true);
				var showCal = (override && typeof override.cal === 'boolean') ? override.cal : getBool('head_filter_show_calendar', true);
				var showNet = (override && typeof override.net === 'boolean') ? override.net : getBool('head_filter_show_network', true);
				applyNetGap(showNet);
				var clocks = collectClocks();
				var dates = collectDates();
				var net = collectNet();
				for (var i = 0; i < clocks.length; i++) setVisible(clocks[i], showClock);
				for (var j = 0; j < dates.length; j++) setVisible(dates[j], showCal);
				for (var k = 0; k < net.length; k++) setVisible(net[k], showNet);
				var c = document.querySelector('.head__time');
				if (!c || typeof c.contains !== 'function') return;
				if (clocks.indexOf(c) !== -1 || dates.indexOf(c) !== -1) return;
				var hasC = clocks.some(function(x) { return c.contains(x); });
				var hasD = dates.some(function(x) { return c.contains(x); });
				var hasN = net.some(function(x) { return c.contains(x); });
				var kids = c.children;
				for (var s = 0; s < kids.length; s++) {
					if (/^[•|\-\/]$/.test((kids[s].textContent || '').trim())) setVisible(kids[s], showClock && showCal);
				}
				if (!hasC && !hasD && !hasN) return;
				setVisible(c, (hasC && showClock) || (hasD && showCal) || (hasN && showNet));
			} catch (e) {}
		}

		function refreshTitle() {
			try {
				var el = $('.head__title');
				if (!el.length) return;
				var cur = el.text();
				var orig = el.attr('data-hf-orig');
				var stripped = el.attr('data-hf-stripped');
				if (!orig) {
					orig = cur;
					el.attr('data-hf-orig', orig);
				}
				if (!stripped) {
					var parts = orig.split(' - ');
					stripped = parts.length === 2 ? parts[0] : orig;
					el.attr('data-hf-stripped', stripped);
				}
				if (cur !== orig && cur !== stripped) {
					orig = cur;
					el.attr('data-hf-orig', orig);
					var p2 = orig.split(' - ');
					stripped = p2.length === 2 ? p2[0] : orig;
					el.attr('data-hf-stripped', stripped);
				}
				var target = getBool('head_filter_show_source', true) ? orig : stripped;
				if (el.text() !== target) el.text(target);
				if (getBool('head_filter_big_title', false)) el.css({ 'font-weight': 'bold', 'text-transform': 'uppercase' });
				else el.css({ 'font-weight': '', 'text-transform': '' });
			} catch (e) {}
		}

		var labelCache = null;
		function labels() {
			if (labelCache) return labelCache;
			var m = {};
			m.head_filter_bylampa_notice_v2 = t('bylampa_notice', 'Уведомления ByLampa');
			m.head_filter_show_clock = t('clock_only', 'Часы');
			m.head_filter_show_calendar = t('calendar_only', 'Календарь');
			m.head_filter_show_network = t('network_indicator', 'Сеть');
			m.head_filter_show_source = t('source_title', 'Источник');
			m.head_filter_big_title = t('big_title', 'Увеличенное название раздела');
			Object.keys(topHead).forEach(function(k) { m[k] = t(topHead[k].l, topHead[k].f); });
			Object.keys(standardHead).forEach(function(k) { m[k] = t(standardHead[k].l, standardHead[k].f); });
			labelCache = m;
			return m;
		}
		function labelToKey() {
			var m = labels(), inv = {};
			Object.keys(m).forEach(function(k) { inv[m[k]] = k; });
			return inv;
		}
		function isAvailable(name) {
			if (name in alwaysVisible) return true;
			if (name === 'head_filter_bylampa_notice_v2') return hasByLampaBtn();
			if (name in topHead) return document.querySelector(topHead[name].s) !== null;
			if (name in standardHead) return document.querySelector(standardHead[name].s) !== null;
			return true;
		}
		function resolveName(row, inv) {
			var n = row.attr('data-name') || row.data('name');
			if (!n) {
				var x = row.find('.settings-param__name').text().trim();
				if (x && inv[x]) { n = inv[x]; row.attr('data-name', n); }
			}
			return n;
		}
		function refreshSettingsVisibility() {
			try {
				var rows = $('.settings-param');
				if (!rows.length) return;
				var ctrl = (Lampa.Controller && typeof Lampa.Controller.enabled === 'function') ? Lampa.Controller.enabled() : null;
				var inv = labelToKey(), lbl = labels();
				var changed = false, lost = false, seen = 0;
				rows.each(function() {
					var row = $(this);
					if (row.hasClass('settings-param--title')) {
						if (row.attr('data-hf-title') === '1') {
							var want = t('name_menu', 'Отображать в шапке');
							var tn = row.find('.settings-param__name');
							if (tn.length && tn.text().trim() !== want) tn.text(want);
						}
						return;
					}
					var name = resolveName(row, inv);
					if (!name || name.indexOf('head_filter_') !== 0) return;
					seen++;
					if (seen === 1) {
						var p = row.prevAll('.settings-param--title').first();
						if (p.length) p.attr('data-hf-title', '1');
					}
					if (lbl[name]) {
						var ne = row.find('.settings-param__name');
						if (ne.length && ne.text().trim() !== lbl[name]) ne.text(lbl[name]);
					}
					var ok = isAvailable(name);
					if (ok) {
						if (this.style.display === 'none') { row.css('display', ''); if (row.attr('data-hf-was-selector') === '1') row.addClass('selector'); changed = true; }
					} else if (this.style.display !== 'none') {
						if (row.hasClass('selector')) row.attr('data-hf-was-selector', '1');
						if (row.hasClass('focus')) lost = true;
						row.css('display', 'none').removeClass('selector focus');
						changed = true;
					}
				});
				if (seen && changed && ctrl && ctrl.name === 'settings_param' && typeof Lampa.Controller.collectionSet === 'function') {
					var body = $('.settings__body');
					if (body.length) {
						var vis = body.find('.selector').filter(function() { return this.style.display !== 'none'; });
						var f = vis.filter('.focus').get(0);
						if (!f || lost) f = vis.first().get(0);
						Lampa.Controller.collectionSet(body);
						if (f && typeof Lampa.Controller.collectionFocus === 'function') Lampa.Controller.collectionFocus(f, body);
					}
				}
			} catch (e) {}
		}
		function refreshByLampaRow() {
			try {
				if (!$('.settings-param').length) return;
				refreshSettingsVisibility();
				if (!hasByLampaBtn()) return;
				var lbl = isByLampaInHeader() ? t('bylampa_notice_yes', 'Да') : t('bylampa_notice_moved', 'Перенесено в боковое меню');
				var row = $('.settings-param[data-name="head_filter_bylampa_notice_v2"]');
				if (!row.length) {
					var tt = t('bylampa_notice', 'Уведомления ByLampa');
					row = $('.settings-param').filter(function() { return $(this).find('.settings-param__name').text().trim() === tt; });
				}
				if (!row.length) return;
				var v = row.find('.settings-param__value');
				if (v.text() !== lbl) v.text(lbl);
				if (!row.attr('data-hf-bound')) {
					row.attr('data-hf-bound', '1');
					row.on('hover:enter.hfb click.hfb', function() { setTimeout(function() { refreshByLampa(); refreshByLampaRow(); }, 60); });
				}
			} catch (e) {}
		}

		function positionComponent() {
			try {
				var iface = $('[data-component="interface"]');
				var more = $('[data-component="more"]');
				var hf = $('[data-component="head_filter"]');
				var moved = false;
				if (hf.length) {
					var nm = hf.find('.settings-folder__name, .settings__name').first();
					var want = t('name_plugin', 'Настройка шапки+');
					if (nm.length && nm.text().trim() !== want) nm.text(want);

					var iconEl = hf.find('.settings-folder__icon, .settings__icon').first();
					var hasSvg = iconEl.length && iconEl.find('svg').length > 0;
					if (!hasSvg) {
						var clone = null;
						if (more.length) {
							more.children().each(function() {
								if (clone) return false;
								var $c = $(this);
								if ($c.find('svg').length) clone = $c.find('svg').first().parent().clone();
							});
							if (!clone) {
								var mi = more.find('.settings-folder__icon, .settings__icon').first();
								if (mi.length && mi.find('svg').length) clone = mi.clone();
							}
						}
						if (!clone) {
							var fallbackSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>';
							clone = $('<div class="settings-folder__icon">' + fallbackSvg + '</div>');
						}
						if (iconEl.length) iconEl.replaceWith(clone);
						else hf.prepend(clone);
						if (hf.find('svg').length > 0) hf.addClass('hf-icon-fixed');
					} else {
						hf.addClass('hf-icon-fixed');
					}

					if (iface.length && iface.next().attr('data-component') !== 'head_filter') {
						iface.after(hf);
						moved = true;
					}
				}
				if (moved && Lampa.Controller && typeof Lampa.Controller.enabled === 'function') {
					var c = Lampa.Controller.enabled();
					if (c && c.name === 'settings_component' && typeof Lampa.Controller.collectionSet === 'function') {
						var body = $('.settings__body');
						if (body.length) {
							var f = body.find('.selector.focus').get(0);
							Lampa.Controller.collectionSet(body);
							if (f && typeof Lampa.Controller.collectionFocus === 'function') Lampa.Controller.collectionFocus(f, body);
						}
					}
				}
			} catch (e) {}
		}

		function withTick(fn) {
			if (busy) return;
			busy = true; tick = {};
			try { fn(); } finally { busy = false; }
		}
		function applyAll() {
			withTick(function() { applyStatic(); refreshTitle(); refreshByLampa(); refreshTimeSection(); });
		}

		try {
			var tn = document.querySelector('.head__title');
			if (tn && window.MutationObserver) new MutationObserver(function() {
				if (busy) return;
				busy = true;
				try { refreshTitle(); } finally { busy = false; }
			}).observe(tn, { childList: true, characterData: true, subtree: true });
		} catch (e) {}

		try {
			var hn = document.querySelector('.head');
			if (hn && window.MutationObserver) new MutationObserver(function() {
				if (busy || rafPending) return;
				rafPending = true;
				var run = function() {
					rafPending = false;
					withTick(function() {
						applyStatic();
						if (hasByLampaBtn() && !isByLampaInHeader()) findByLampaBtn().each(function() { setVisible(this, false); });
						refreshTimeSection();
					});
				};
				if (window.requestAnimationFrame) requestAnimationFrame(run); else setTimeout(run, 16);
			}).observe(hn, { childList: true, subtree: true });
		} catch (e) {}

		setInterval(function() {
			if (busy) return;
			if (!document.querySelector('.head') && !document.querySelector('.settings-param')) return;
			withTick(function() {
				applyStatic();
				if (hasByLampaBtn() && !isByLampaInHeader() && !$('.hf-bylampa-changes').length) refreshByLampa();
				var c = (Lampa.Controller && typeof Lampa.Controller.enabled === 'function') ? Lampa.Controller.enabled() : null;
				if (c && c.name === 'settings_param') refreshByLampaRow();
			});
		}, 2000);

		if (Lampa.Controller && Lampa.Controller.listener && typeof Lampa.Controller.listener.follow === 'function') {
			Lampa.Controller.listener.follow('toggle', function(e) {
				if (!e) return;
				if (e.name === 'menu') refreshByLampa();
				else if (e.name === 'settings_component') { positionComponent(); setTimeout(positionComponent, 30); }
				else if (e.name === 'settings_param') { refreshByLampaRow(); setTimeout(refreshByLampaRow, 40); setTimeout(refreshByLampaRow, 200); }
			});
		}

		if (Lampa.Storage && Lampa.Storage.listener && typeof Lampa.Storage.listener.follow === 'function') {
			Lampa.Storage.listener.follow('change', function(e) {
				if (!e) return;
				if (e.name == 'activity') { setTimeout(applyAll, 300); setTimeout(applyAll, 1000); return; }
				if (e.name === 'language' || e.name === 'lang') { labelCache = null; return; }
				if (e.name in topHead) {
					var showT = getBool(e.name, true);
					var elsT = document.querySelectorAll(topHead[e.name].s);
					for (var i = 0; i < elsT.length; i++) setVisible(elsT[i], showT);
					return;
				}
				if (e.name in standardHead) {
					var showS = getBool(e.name, true);
					var elsS = document.querySelectorAll(standardHead[e.name].s);
					for (var j = 0; j < elsS.length; j++) setVisible(elsS[j], showS);
					return;
				}
				if (e.name === 'head_filter_show_source' || e.name === 'head_filter_big_title') { refreshTitle(); return; }
				if (e.name === 'head_filter_bylampa_notice_v2') { setTimeout(function() { refreshByLampa(); refreshByLampaRow(); }, 30); return; }
				if (e.name === 'head_filter_show_clock') { tick = {}; refreshTimeSection({ clock: getBool(e.name, true) }); return; }
				if (e.name === 'head_filter_show_calendar') { tick = {}; refreshTimeSection({ cal: getBool(e.name, true) }); return; }
				if (e.name === 'head_filter_show_network') { tick = {}; refreshTimeSection({ net: getBool(e.name, true) }); return; }
			});
		}

		if (Lampa.SettingsApi && typeof Lampa.SettingsApi.addComponent === 'function') {
			Lampa.SettingsApi.addComponent({ component: 'head_filter', name: t('name_plugin', 'Настройка шапки+'), icon: '', after: 'interface' });
		}

		if (Lampa.Settings && Lampa.Settings.listener && typeof Lampa.Settings.listener.follow === 'function') {
			Lampa.Settings.listener.follow('open', function(e) {
				if (!e) return;
				if (e.name === 'main') { positionComponent(); setTimeout(positionComponent, 50); setTimeout(positionComponent, 200); }
				else if (e.name === 'head_filter') { refreshByLampaRow(); setTimeout(refreshByLampaRow, 30); setTimeout(refreshByLampaRow, 150); setTimeout(refreshByLampaRow, 350); }
			});
		}

		if (Lampa.SettingsApi && typeof Lampa.SettingsApi.addParam === 'function') {
			Lampa.SettingsApi.addParam({ component: 'head_filter', param: { type: 'title' }, field: { name: t('name_menu', 'Отображать в шапке') } });
			function addToggle(key, label, onChange) {
				Lampa.SettingsApi.addParam({
					component: 'head_filter',
					param: { name: key, type: 'trigger', default: key !== 'head_filter_big_title' },
					field: { name: label },
					onChange: function(value) {
						var v;
						if (typeof value === 'boolean') v = value;
						else {
							try {
								var raw = (Lampa.Storage && typeof Lampa.Storage.get === 'function') ? Lampa.Storage.get(key) : undefined;
								if (raw === false || raw === 'false' || raw === 0 || raw === '0') v = false;
								else if (raw === true || raw === 'true' || raw === 1 || raw === '1') v = true;
								else v = !getBool(key, true);
							} catch (err) { v = !getBool(key, true); }
						}
						markPending(key, v);
						onChange(v);
					}
				});
			}
			addToggle('head_filter_bylampa_notice_v2', t('bylampa_notice', 'Уведомления ByLampa'), function() {
				refreshByLampa(); refreshByLampaRow();
			});
			addToggle('head_filter_show_clock', t('clock_only', 'Часы'), function(v) {
				tick = {}; refreshTimeSection({ clock: v });
			});
			addToggle('head_filter_show_calendar', t('calendar_only', 'Календарь'), function(v) {
				tick = {}; refreshTimeSection({ cal: v });
			});
			addToggle('head_filter_show_network', t('network_indicator', 'Сеть'), function(v) {
				tick = {}; refreshTimeSection({ net: v });
			});
			addToggle('head_filter_show_source', t('source_title', 'Источник'), function() { refreshTitle(); });
			addToggle('head_filter_big_title', t('big_title', 'Увеличенное название раздела'), function() { refreshTitle(); });
			Object.keys(topHead).forEach(function(k) {
				addToggle(k, t(topHead[k].l, topHead[k].f), function(v) {
					var els = document.querySelectorAll(topHead[k].s);
					for (var i = 0; i < els.length; i++) setVisible(els[i], v);
				});
			});
			Object.keys(standardHead).forEach(function(k) {
				addToggle(k, t(standardHead[k].l, standardHead[k].f), function(v) {
					var els = document.querySelectorAll(standardHead[k].s);
					for (var i = 0; i < els.length; i++) setVisible(els[i], v);
				});
			});
		}

		setTimeout(applyAll, 300);
		setTimeout(applyAll, 1000);
		setTimeout(applyAll, 2500);
	}

	if (window.appready) startPlugin();
	else if (window.Lampa && Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
		Lampa.Listener.follow('app', function(e) { if (e && e.type == 'ready') startPlugin(); });
	} else {
		var tries = 0, rc = setInterval(function() {
			tries++;
			if (tries > 300) { clearInterval(rc); return; }
			if (window.appready) { clearInterval(rc); startPlugin(); }
			else if (window.Lampa && Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
				clearInterval(rc);
				Lampa.Listener.follow('app', function(e) { if (e && e.type == 'ready') startPlugin(); });
			}
		}, 100);
	}
})();
