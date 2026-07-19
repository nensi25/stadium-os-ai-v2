/**
 * StadiumOS AI — ui-utils.js
 * Reusable UI utilities for all pages.
 * No external dependencies. Pure vanilla JavaScript.
 */

/* ============================================================
   TOAST NOTIFICATIONS
============================================================ */
export function showToast(message, type = 'info', title = '', duration = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
        success: 'fa-circle-check',
        warning: 'fa-triangle-exclamation',
        error: 'fa-circle-xmark',
        info: 'fa-circle-info'
    };

    const defaultTitles = {
        success: 'Success',
        warning: 'Warning',
        error: 'Error',
        info: 'Info'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
        <i class="fa-solid ${icons[type] || icons.info} toast-icon" aria-hidden="true"></i>
        <div class="toast-body">
            <strong>${title || defaultTitles[type]}</strong>
            <span>${message}</span>
        </div>
        <button class="toast-close" aria-label="Close notification">
            <i class="fa-solid fa-xmark"></i>
        </button>`;

    container.appendChild(toast);

    const closeToast = () => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast-close').addEventListener('click', closeToast);

    setTimeout(closeToast, duration);
}

/* ============================================================
   ANIMATED COUNTER
============================================================ */
export function animateCounter(element, target, duration = 2000, prefix = '', suffix = '') {
    if (!element) return;
    const start = 0;
    const startTime = performance.now();

    const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * eased);

        element.textContent = prefix + current.toLocaleString('en-IN') + suffix;

        if (progress < 1) requestAnimationFrame(update);
        else element.textContent = prefix + target.toLocaleString('en-IN') + suffix;
    };

    requestAnimationFrame(update);
}

/* ============================================================
   LOADING SKELETON
============================================================ */
export function showSkeleton(container, rows = 5) {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        row.className = 'skeleton-row';
        row.innerHTML = `
            <td><span class="skeleton" style="width:60px"></span></td>
            <td><span class="skeleton" style="width:${120 + Math.random() * 100}px"></span></td>
            <td><span class="skeleton" style="width:70px"></span></td>`;
        container.appendChild(row);
    }
}

export function showSkeletonCards(container, count = 4) {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.style.cssText = 'padding:20px;';
        card.innerHTML = `
            <div style="display:flex;gap:12px;margin-bottom:12px">
                <span class="skeleton" style="width:40px;height:40px;border-radius:50%;flex-shrink:0"></span>
                <div style="flex:1">
                    <span class="skeleton" style="width:80%;height:14px;display:block;margin-bottom:8px"></span>
                    <span class="skeleton" style="width:50%;height:12px;display:block"></span>
                </div>
            </div>
            <span class="skeleton" style="width:100%;height:32px;display:block"></span>`;
        container.appendChild(card);
    }
}

/* ============================================================
   EMPTY STATE
============================================================ */
export function showEmptyState(container, { icon = 'fa-inbox', title = 'No data', message = 'Nothing to show.' } = {}) {
    if (!container) return;
    container.innerHTML = `
        <div class="state-empty">
            <i class="fa-solid ${icon}" aria-hidden="true"></i>
            <h4>${title}</h4>
            <p>${message}</p>
        </div>`;
}

/* ============================================================
   ERROR STATE
============================================================ */
export function showErrorState(container, { message = 'Something went wrong. Please try again.' } = {}) {
    if (!container) return;
    container.innerHTML = `
        <div class="state-error">
            <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
            <h4>Error</h4>
            <p>${message}</p>
        </div>`;
}

/* ============================================================
   RIPPLE EFFECT
============================================================ */
export function addRipple(button) {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position:absolute;
            width:${size}px;height:${size}px;
            border-radius:50%;
            left:${x}px;top:${y}px;
            background:rgba(255,255,255,0.2);
            transform:scale(0);
            animation:rippleAnim 0.6s linear;
            pointer-events:none;`;

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
}

/* Add ripple animation to head */
if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `@keyframes rippleAnim { to { transform: scale(3); opacity: 0; } }`;
    document.head.appendChild(style);
}

/* ============================================================
   DEBOUNCE
============================================================ */
export function debounce(fn, wait = 300) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
}

/* ============================================================
   PROGRESS BAR ANIMATION
============================================================ */
export function animateProgress(element, targetWidth, delay = 0) {
    if (!element) return;
    element.style.width = '0%';
    setTimeout(() => {
        element.style.width = targetWidth;
    }, delay);
}

export function animateAllProgress() {
    document.querySelectorAll('.js-progress').forEach(bar => {
        const target = bar.getAttribute('data-width') || '0%';
        animateProgress(bar, target, 300);
    });
}

/* ============================================================
   PROGRESS RING (SVG)
============================================================ */
export function animateRing(ringElement, percentage, radius = 42) {
    if (!ringElement) return;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    ringElement.style.strokeDasharray = `${circumference}`;
    ringElement.style.strokeDashoffset = circumference;

    setTimeout(() => {
        ringElement.style.transition = 'stroke-dashoffset 1.5s ease';
        ringElement.style.strokeDashoffset = offset;
    }, 300);
}

/* ============================================================
   THEME MANAGER
============================================================ */
export const ThemeManager = {
    key: 'stadium_os_settings',

    get() {
        try { return JSON.parse(localStorage.getItem(this.key)) || {}; }
        catch { return {}; }
    },

    set(key, value) {
        const data = this.get();
        data[key] = value;
        localStorage.setItem(this.key, JSON.stringify(data));
    },

    applyAll() {
        const s = this.get();
        const root = document.documentElement;
        const body = document.body;

        // Theme
        const themes = ['dark-theme', 'light-theme', 'cyber-blue-theme', 'neon-purple-theme', 'emerald-green-theme', 'theme-light', 'theme-cyber', 'theme-purple', 'theme-green'];
        themes.forEach(t => { body.classList.remove(t); root.classList.remove(t); });

        if (s.theme) {
            body.classList.add(s.theme);
            root.classList.add(s.theme);
        } else {
            body.classList.add('dark-theme');
        }

        // Accent
        if (s.accent) {
            const accents = {
                cyan: { primary: '#00E5FF', glow: 'rgba(0,229,255,0.35)', secondary: '#00B8FF' },
                blue: { primary: '#448AFF', glow: 'rgba(68,138,255,0.35)', secondary: '#0056FF' },
                green: { primary: '#00E676', glow: 'rgba(0,230,118,0.35)', secondary: '#00CC60' },
                purple: { primary: '#D500F9', glow: 'rgba(213,0,249,0.35)', secondary: '#B000E0' },
                red: { primary: '#FF4D6D', glow: 'rgba(255,77,109,0.35)', secondary: '#E0003A' },
                orange: { primary: '#FF9F00', glow: 'rgba(255,159,0,0.35)', secondary: '#D68500' }
            };
            const c = accents[s.accent];
            if (c) {
                root.style.setProperty('--primary', c.primary);
                root.style.setProperty('--primary-glow', c.glow);
                root.style.setProperty('--secondary', c.secondary);
            }
        }

        // Font size
        if (s.fontSize) {
            const sizes = { normal: '14px', large: '16px', xlarge: '18px' };
            document.body.style.fontSize = sizes[s.fontSize] || '14px';
        }

        // High contrast
        if (s.highContrast) body.classList.add('high-contrast');
        else body.classList.remove('high-contrast');

        // Reduced motion
        if (s.reducedMotion) {
            const style = document.getElementById('reduced-motion-style') || document.createElement('style');
            style.id = 'reduced-motion-style';
            style.textContent = `*, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }`;
            document.head.appendChild(style);
        } else {
            const el = document.getElementById('reduced-motion-style');
            if (el) el.remove();
        }
    }
};

/* ============================================================
   SORTABLE TABLE
============================================================ */
export function makeSortable(tableElement) {
    if (!tableElement) return;
    const headers = tableElement.querySelectorAll('th[data-sort]');
    headers.forEach(th => {
        th.style.cursor = 'pointer';
        th.addEventListener('click', () => {
            const col = th.getAttribute('data-sort');
            const tbody = tableElement.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const idx = Array.from(th.parentElement.children).indexOf(th);
            const asc = th.classList.toggle('sorted-asc');
            th.parentElement.querySelectorAll('th').forEach(h => { if (h !== th) { h.classList.remove('sorted-asc', 'sorted-desc'); } });
            if (!asc) th.classList.add('sorted-desc');

            rows.sort((a, b) => {
                const av = a.cells[idx]?.textContent.trim() || '';
                const bv = b.cells[idx]?.textContent.trim() || '';
                const an = parseFloat(av.replace(/[^0-9.-]/g, ''));
                const bn = parseFloat(bv.replace(/[^0-9.-]/g, ''));
                if (!isNaN(an) && !isNaN(bn)) return asc ? an - bn : bn - an;
                return asc ? av.localeCompare(bv) : bv.localeCompare(av);
            });

            rows.forEach(r => tbody.appendChild(r));
        });
    });
}

/* ============================================================
   TABLE SEARCH FILTER
============================================================ */
export function filterTable(tableBody, searchValue) {
    if (!tableBody) return;
    const rows = tableBody.querySelectorAll('tr:not(.skeleton-row)');
    const q = searchValue.toLowerCase().trim();
    let visible = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (!q || text.includes(q)) {
            row.style.display = '';
            visible++;
        } else {
            row.style.display = 'none';
        }
    });

    return visible;
}

/* ============================================================
   GLOBAL SEARCH
============================================================ */
export function initGlobalSearch(inputEl, resultsEl) {
    if (!inputEl || !resultsEl) return;

    const searchData = [
        { label: 'Dashboard', desc: 'Main overview panel', view: 'dashboard', icon: 'fa-border-all' },
        { label: 'Live Stadium', desc: 'Live cameras & gate status', view: 'live', icon: 'fa-tower-broadcast' },
        { label: 'Crowd Analytics', desc: 'Heatmap & visitor trends', view: 'crowd', icon: 'fa-users-viewfinder' },
        { label: 'AI Predictions', desc: 'Attendance & risk predictions', view: 'predictions', icon: 'fa-brain' },
        { label: 'Security', desc: 'Threat level & incidents', view: 'security', icon: 'fa-shield-halved' },
        { label: 'Parking', desc: 'Zone map & availability', view: 'parking', icon: 'fa-car' },
        { label: 'Weather', desc: 'Current & forecast data', view: 'weather', icon: 'fa-cloud-sun-rain' },
        { label: 'Tickets & Booking', desc: 'Sales, QR & seat map', view: 'tickets', icon: 'fa-ticket' },
        { label: 'Settings', desc: 'Theme, profile & preferences', view: 'settings', icon: 'fa-gear' },
        { label: 'Gate 12 Alert', desc: 'High crowd density at Gate 12', view: 'security', icon: 'fa-triangle-exclamation' },
        { label: 'Camera 04', desc: 'Offline camera – requires attention', view: 'live', icon: 'fa-video-slash' },
        { label: 'Parking Zone A', desc: 'Near capacity – 93% full', view: 'parking', icon: 'fa-square-parking' },
    ];

    const handleSearch = debounce((e) => {
        const q = e.target.value.trim().toLowerCase();
        if (!q) { resultsEl.classList.remove('open'); return; }

        const matches = searchData.filter(item =>
            item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
        );

        if (!matches.length) {
            resultsEl.innerHTML = `<div class="search-no-results"><i class="fa-solid fa-magnifying-glass"></i> No results for "${q}"</div>`;
        } else {
            resultsEl.innerHTML = matches.slice(0, 8).map(item => `
                <div class="search-result-item" data-view="${item.view}" role="option" tabindex="0" aria-label="${item.label}">
                    <div class="result-icon"><i class="fa-solid ${item.icon}"></i></div>
                    <div class="result-text">
                        <strong>${item.label}</strong>
                        <span>${item.desc}</span>
                    </div>
                </div>`).join('');

            resultsEl.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const view = item.getAttribute('data-view');
                    if (window.switchToView) window.switchToView(view);
                    inputEl.value = '';
                    resultsEl.classList.remove('open');
                });

                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') item.click();
                });
            });
        }

        resultsEl.classList.add('open');
    }, 200);

    inputEl.addEventListener('input', handleSearch);

    document.addEventListener('click', (e) => {
        if (!inputEl.contains(e.target) && !resultsEl.contains(e.target)) {
            resultsEl.classList.remove('open');
        }
    });
}

/* ============================================================
   NOTIFICATION MANAGER
============================================================ */
export const NotificationManager = {
    notifications: [],
    unreadCount: 0,

    init() {
        this.notifications = [
            { id: 1, type: 'warning', title: 'Gate 12 – High Crowd', desc: '2 min ago', unread: true },
            { id: 2, type: 'danger', title: 'Camera 04 Offline', desc: '5 min ago', unread: true },
            { id: 3, type: 'warning', title: 'Parking Zone A Full', desc: '8 min ago', unread: true },
            { id: 4, type: 'info', title: 'Weather Updated', desc: '15 min ago', unread: false },
            { id: 5, type: 'success', title: 'AI Scan Complete', desc: '20 min ago', unread: false },
        ];
        this.unreadCount = this.notifications.filter(n => n.unread).length;
        this.updateBadge();
        this.render();
    },

    updateBadge() {
        const badge = document.getElementById('notifBadge');
        if (!badge) return;
        if (this.unreadCount > 0) {
            badge.textContent = this.unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    },

    markAllRead() {
        this.notifications.forEach(n => n.unread = false);
        this.unreadCount = 0;
        this.updateBadge();
        this.render();
    },

    clearAll() {
        this.notifications = [];
        this.unreadCount = 0;
        this.updateBadge();
        this.render();
    },

    render() {
        const list = document.getElementById('notificationList');
        if (!list) return;

        const icons = { warning: 'fa-triangle-exclamation', danger: 'fa-video-slash', info: 'fa-circle-info', success: 'fa-circle-check' };

        if (!this.notifications.length) {
            list.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px">
                <i class="fa-solid fa-bell-slash" style="font-size:24px;margin-bottom:8px;display:block"></i>No notifications</div>`;
            return;
        }

        list.innerHTML = this.notifications.map(n => `
            <li class="notif-item ${n.unread ? 'unread' : ''}" data-id="${n.id}" role="listitem">
                ${n.unread ? '<span class="unread-dot"></span>' : ''}
                <div class="notif-icon ${n.type}"><i class="fa-solid ${icons[n.type] || icons.info}"></i></div>
                <div class="notif-content">
                    <strong>${n.title}</strong>
                    <span>${n.desc}</span>
                </div>
            </li>`).join('');

        list.querySelectorAll('.notif-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.getAttribute('data-id'));
                const notif = this.notifications.find(n => n.id === id);
                if (notif && notif.unread) {
                    notif.unread = false;
                    this.unreadCount = Math.max(0, this.unreadCount - 1);
                    this.updateBadge();
                    this.render();
                }
            });
        });
    }
};

/* ============================================================
   REPORT GENERATOR
============================================================ */
export function generateReport(type = 'json', filename = 'stadiumos-report') {
    const data = {
        generated: new Date().toISOString(),
        stadium: 'StadiumOS AI — International Stadium',
        report_type: 'Dashboard Summary',
        visitors: 84250,
        occupancy: '93.6%',
        revenue: '₹12,45,800',
        security_alerts: 3,
        parking_available: 428,
        weather: 'Clear Night, 18°C',
        gates_open: '22/24',
        cameras_online: 126,
        ai_confidence: '98.7%',
        zones: [
            { name: 'North Stand', occupancy: '82%', risk: 'Low' },
            { name: 'South Stand', occupancy: '91%', risk: 'Medium' },
            { name: 'East Stand', occupancy: '87%', risk: 'Medium' },
            { name: 'West Stand', occupancy: '74%', risk: 'Low' },
            { name: 'VIP Box', occupancy: '100%', risk: 'None' },
        ]
    };

    if (type === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadBlob(blob, `${filename}.json`);
        showToast('JSON report downloaded successfully.', 'success', 'Report Generated');
    } else if (type === 'csv') {
        const headers = Object.keys(data).filter(k => typeof data[k] !== 'object');
        const values = headers.map(h => `"${data[h]}"`);
        const csv = headers.join(',') + '\n' + values.join(',');
        const blob = new Blob([csv], { type: 'text/csv' });
        downloadBlob(blob, `${filename}.csv`);
        showToast('CSV report downloaded successfully.', 'success', 'Report Generated');
    }
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/* ============================================================
   CHART RENDERER (Pure Canvas)
============================================================ */
export function drawBarChart(canvas, labels, data, options = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight || 200;
    ctx.clearRect(0, 0, w, h);

    const {
        color = '#00E5FF',
        colorGlow = 'rgba(0,229,255,0.3)',
        paddingLeft = 40,
        paddingBottom = 30,
        paddingTop = 20,
    } = options;

    const chartW = w - paddingLeft - 20;
    const chartH = h - paddingBottom - paddingTop;
    const max = Math.max(...data) * 1.15;
    const barW = chartW / labels.length - 8;

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = paddingTop + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(w - 20, y);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(max - (max / 4) * i).toLocaleString(), paddingLeft - 6, y + 4);
    }

    // Bars
    data.forEach((val, i) => {
        const barH = (val / max) * chartH;
        const x = paddingLeft + i * (barW + 8);
        const y = paddingTop + chartH - barH;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barH);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, colorGlow);
        ctx.fillStyle = gradient;

        // Rounded top
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
        ctx.fill();

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x + barW / 2, h - 8);
    });
}

export function drawLineChart(canvas, labels, data, options = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight || 180;
    ctx.clearRect(0, 0, w, h);

    const {
        color = '#00E5FF',
        fillColor = 'rgba(0,229,255,0.08)',
        paddingLeft = 10,
        paddingRight = 10,
        paddingTop = 20,
        paddingBottom = 20,
    } = options;

    const chartW = w - paddingLeft - paddingRight;
    const chartH = h - paddingTop - paddingBottom;
    const max = Math.max(...data) * 1.1;
    const step = chartW / (data.length - 1);

    const points = data.map((val, i) => ({
        x: paddingLeft + i * step,
        y: paddingTop + chartH - (val / max) * chartH
    }));

    // Fill area
    ctx.beginPath();
    ctx.moveTo(points[0].x, h - paddingBottom);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, h - paddingBottom);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        const cp1x = points[i - 1].x + step / 2;
        const cp1y = points[i - 1].y;
        const cp2x = points[i].x - step / 2;
        const cp2y = points[i].y;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[i].x, points[i].y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Dots
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    });
}

/* ============================================================
   SIMPLE QR PLACEHOLDER (Canvas pattern)
============================================================ */
export function drawQRPlaceholder(canvas, size = 140) {
    if (!canvas) return;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Generate random QR-like dots
    ctx.fillStyle = '#000000';
    const cell = size / 20;

    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 20; col++) {
            // Fixed corners (finder patterns)
            const isTopLeft = row < 7 && col < 7;
            const isTopRight = row < 7 && col > 12;
            const isBottomLeft = row > 12 && col < 7;

            if (isTopLeft || isTopRight || isBottomLeft) {
                const border = (row === 0 || row === 6 || col === 0 || col === 6) ||
                    (isTopLeft && row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
                    (isTopRight && row >= 2 && row <= 4 && col >= 14 && col <= 18) ||
                    (isBottomLeft && row >= 14 && row <= 18 && col >= 2 && col <= 4);
                if (border) ctx.fillRect(col * cell, row * cell, cell, cell);
            } else if (Math.random() > 0.45) {
                ctx.fillRect(col * cell, row * cell, cell - 0.5, cell - 0.5);
            }
        }
    }
}
