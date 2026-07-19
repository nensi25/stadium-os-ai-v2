/**
 * StadiumOS AI — script.js
 * Modular Vanilla JavaScript for the premium enterprise dashboard.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       MODULE 1 — SIDEBAR TOGGLE
    ============================================================ */
    const sidebar = document.getElementById('sidebar');
    const sidebarOpenBtn = document.getElementById('sidebarOpenBtn');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

    sidebarOpenBtn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('mobile-open');
        } else {
            sidebar.classList.toggle('collapsed');
        }
    });

    sidebarCloseBtn.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
    });

    // Active nav item & SPA Routing
    const navItems = document.querySelectorAll('.nav-links a');
    
    window.switchToView = function (targetView) {
        if (!targetView) return;

        // Remove active class from all nav list items
        document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));

        // Highlight the matched sidebar link if it exists
        navItems.forEach(item => {
            if (item.getAttribute('data-view') === targetView) {
                item.parentElement.classList.add('active');
            }
        });

        // Toggle visibility of all view sections
        const viewSections = document.querySelectorAll('.view-section');
        viewSections.forEach(sec => {
            sec.classList.remove('active');
            sec.classList.add('hidden');
        });

        const activeSec = document.getElementById('view-' + targetView);
        if (activeSec) {
            activeSec.classList.remove('hidden');
            activeSec.classList.add('active');
        }
    };

    // Listen for click events on elements with data-view attribute (e.g. sidebar, profile dropdown, quick-actions)
    document.addEventListener('click', function (e) {
        const trigger = e.target.closest('[data-view]');
        if (trigger) {
            e.preventDefault();
            const targetView = trigger.getAttribute('data-view');
            window.switchToView(targetView);
        }
    });

    // STADIUMOS SETTINGS PERSISTENCE INTEGRATION
    function applySavedSettings() {
        try {
            const data = localStorage.getItem('stadium_os_settings');
            if (!data) return;
            const s = JSON.parse(data);
            const root = document.documentElement;
            const body = document.body;

            // 1. Theme Selection
            if (s.theme) {
                const THEME_CLASSES = ['dark-theme', 'light-theme', 'cyber-blue-theme', 'neon-purple-theme', 'emerald-green-theme', 'orange-theme'];
                THEME_CLASSES.forEach(c => {
                    body.classList.remove(c);
                    root.classList.remove(c);
                });
                body.classList.add(s.theme);
                root.classList.add(s.theme);
            }

            // 2. Accent Color Selection
            if (s.accent) {
                const ACCENTS_MAP = {
                    blue: { primary: '#00B8FF', glow: 'rgba(0, 184, 255, 0.35)', secondary: '#0088FF' },
                    green: { primary: '#00FF99', glow: 'rgba(0, 255, 153, 0.35)', secondary: '#00CC7A' },
                    purple: { primary: '#BD00FF', glow: 'rgba(189, 0, 255, 0.35)', secondary: '#9900CC' },
                    red: { primary: '#FF3D71', glow: 'rgba(255, 61, 113, 0.35)', secondary: '#E02956' },
                    orange: { primary: '#FF9F00', glow: 'rgba(255, 159, 0, 0.35)', secondary: '#D68500' },
                    cyan: { primary: '#00E5FF', glow: 'rgba(0, 229, 255, 0.35)', secondary: '#00B8FF' }
                };
                const colors = ACCENTS_MAP[s.accent];
                if (colors) {
                    root.style.setProperty('--primary', colors.primary);
                    root.style.setProperty('--primary-glow', colors.glow);
                    root.style.setProperty('--secondary', colors.secondary);
                }
            }

            // 3. Font Size Scaling
            if (s.fontSize) {
                const sizes = { small: '14px', medium: '16px', large: '18px' };
                if (sizes[s.fontSize]) {
                    root.style.setProperty('--base-font-size', sizes[s.fontSize]);
                    root.style.fontSize = sizes[s.fontSize];
                }
            }

            // 4. Sidebar configuration
            if (s.sidebar && sidebar) {
                if (s.sidebar.collapse || s.sidebar.iconsOnly) {
                    sidebar.classList.add('collapsed');
                } else {
                    sidebar.classList.remove('collapsed');
                }
                if (s.sidebar.animate === false) {
                    sidebar.style.transition = 'none';
                } else {
                    sidebar.style.transition = '';
                }
            }

            // 5. Dashboard widgets toggle
            if (s.dashboardWidgets) {
                const widgetIdMap = {
                    weather: ['view-weather', 'weather-dashboard'],
                    parking: ['view-parking', 'parking-grid'],
                    crowdAnalytics: ['view-crowd', 'crowd-dashboard'],
                    security: ['view-security', 'security-dashboard'],
                    tickets: ['view-tickets'],
                    liveStadium: ['twinMap', 'live-stadium-panel'],
                    aiPrediction: ['crowdPredictions']
                };
                Object.keys(s.dashboardWidgets).forEach(wk => {
                    const val = s.dashboardWidgets[wk];
                    const ids = widgetIdMap[wk];
                    if (ids) {
                        ids.forEach(id => {
                            const els = document.querySelectorAll(`#${id}, .${id}`);
                            els.forEach(el => {
                                if (!val) {
                                    el.style.display = 'none';
                                } else {
                                    el.style.display = '';
                                }
                            });
                        });
                    }
                });
            }

            // 6. AI Assistant Buttons Visibility
            if (s.ai) {
                const val = s.ai.assistant;
                const askAIBtns = document.querySelectorAll('.btn-ai, #aiCopilotContainer, #aiCopilotOverlay');
                askAIBtns.forEach(el => {
                    el.style.display = val ? '' : 'none';
                });
                
                const voiceVal = s.ai.voiceCommands;
                const voiceBtn = document.getElementById('aiVoiceBtn');
                if (voiceBtn) {
                    voiceBtn.style.display = voiceVal ? '' : 'none';
                }

                const chatSugVal = s.ai.chatSuggestions;
                const suggestionsWrapper = document.querySelector('.ai-suggested-prompts-wrapper');
                if (suggestionsWrapper) {
                    suggestionsWrapper.style.display = chatSugVal ? '' : 'none';
                }
            }

            // 7. Accessibility High Contrast / Reduce Motion
            if (s.accessibility) {
                if (s.accessibility.highContrast) root.classList.add('high-contrast');
                else root.classList.remove('high-contrast');

                if (s.accessibility.reduceMotion) root.classList.add('reduce-motion');
                else root.classList.remove('reduce-motion');
            }

            // 8. Profile sync in navbar
            if (s.profile) {
                const navAvatar = document.querySelector('.avatar-container img');
                const navName = document.querySelector('.profile-name');
                const navRole = document.querySelector('.profile-role');
                if (navAvatar && s.profile.photo) navAvatar.src = s.profile.photo;
                if (navName && s.profile.name) navName.textContent = s.profile.name;
                if (navRole && s.profile.role) navRole.textContent = s.profile.role;
            }

        } catch (e) {
            console.error("Error applying stored settings", e);
        }
    }

    // Run on boot
    applySavedSettings();

    // Listen for updates from React settings context
    window.addEventListener('stadiumos-settings-changed', (e) => {
        applySavedSettings();
    });


    /* ============================================================
       MODULE 2 — LIVE CLOCK & DATE
    ============================================================ */
    const elDay = document.getElementById('currentDay');
    const elDate = document.getElementById('currentDateFull');
    const elTime = document.getElementById('liveTimeDigital');

    const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    function pad(n) { return String(n).padStart(2, '0'); }

    function updateClock() {
        const now = new Date();
        if (elDay) elDay.textContent = DAYS[now.getDay()];
        if (elDate) elDate.textContent = `${pad(now.getDate())} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
        if (elTime) elTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    /* ============================================================
       MODULE 3 — NOTIFICATION POPUP
    ============================================================ */
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPopup = document.getElementById('notificationPopup');
    const notifBadge = document.getElementById('notifBadge');

    function togglePopup(popup, btn) {
        const isHidden = popup.classList.contains('hidden');
        // Close all popups first
        closeAllPopups();
        if (isHidden) {
            popup.classList.remove('hidden');
            btn.classList.add('open');
        }
    }

    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePopup(notificationPopup, notificationBtn);
        // Reset badge when opened
        notifBadge.textContent = '0';
        notifBadge.style.background = '#555';
    });

    // Bell shake on new notification (triggered by live data module)
    function shakeBell() {
        notificationBtn.classList.remove('shake-on-new');
        void notificationBtn.offsetWidth; // reflow to restart animation
        notificationBtn.classList.add('shake-on-new');
    }

    /* ============================================================
       MODULE 4 — PROFILE DROPDOWN
    ============================================================ */
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePopup(profileDropdown, profileBtn);
        profileBtn.classList.toggle('open');
    });

    /* ============================================================
       MODULE 5 — CLOSE ALL POPUPS ON OUTSIDE CLICK
    ============================================================ */
    function closeAllPopups() {
        [notificationPopup, profileDropdown].forEach(p => p.classList.add('hidden'));
        profileBtn.classList.remove('open');
        notificationBtn.classList.remove('open');
    }

    document.addEventListener('click', closeAllPopups);

    /* ============================================================
       MODULE 7 — QUICK ACTION BUTTONS
    ============================================================ */
    const quickBtns = document.querySelectorAll('.quick-actions .icon-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('title');
            if (title === 'Fullscreen') {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => { });
                    btn.querySelector('i').className = 'fa-solid fa-compress';
                } else {
                    document.exitFullscreen().catch(() => { });
                    btn.querySelector('i').className = 'fa-solid fa-expand';
                }
            }
            if (title === 'Refresh Dashboard') {
                btn.querySelector('i').style.animation = 'none';
                btn.querySelector('i').style.transition = 'transform 0.6s';
                btn.querySelector('i').style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    btn.querySelector('i').style.transform = '';
                    // Re-render live data
                    generateHeatmap();
                    renderParking();
                    renderAlerts();
                }, 700);
            }
        });
    });

    /* ============================================================
       MODULE 8 — RIPPLE EFFECT (all ripple-btn class)
    ============================================================ */
    const rippleBtns = document.querySelectorAll('.ripple-btn');
    rippleBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position:absolute;
                width:100px;height:100px;
                background:rgba(255,255,255,0.35);
                border-radius:50%;
                left:${e.clientX - rect.left}px;
                top:${e.clientY - rect.top}px;
                transform:translate(-50%,-50%) scale(0);
                animation:rippleAnim 0.6s linear;
                pointer-events:none;
            `;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    /* ============================================================
       MODULE 9 — SEARCH FILTER
    ============================================================ */
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim()) {
                searchInput.style.borderColor = 'var(--success)';
                searchInput.style.boxShadow = '0 0 15px rgba(0,255,153,0.4)';
                setTimeout(() => {
                    searchInput.style.borderColor = '';
                    searchInput.style.boxShadow = '';
                    searchInput.value = '';
                }, 1200);
            }
        });
    }

    /* ============================================================
       MODULE 10 — ANIMATED COUNTERS
    ============================================================ */
    const counters = document.querySelectorAll('.counter');

    function animateCounter(el) {
        const target = +el.getAttribute('data-target');
        let current = 0;
        const step = target / 60;
        const tick = () => {
            current += step;
            if (current < target) {
                el.textContent = Math.ceil(current).toLocaleString();
                requestAnimationFrame(tick);
            } else {
                el.textContent = target.toLocaleString();
            }
        };
        requestAnimationFrame(tick);
    }

    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    /* ============================================================
       MODULE 11 — PROGRESS BAR ANIMATION
    ============================================================ */
    const progressBars = document.querySelectorAll('.js-progress');
    const progressObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.width = entry.target.getAttribute('data-width');
                }, 400);
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    progressBars.forEach(p => progressObserver.observe(p));

    /* ============================================================
       MODULE 12 — CROWD HEATMAP (20×20)
    ============================================================ */
    const heatmapGrid = document.getElementById('heatmapGrid');

    function generateHeatmap() {
        if (!heatmapGrid) return;
        heatmapGrid.innerHTML = '';
        for (let i = 0; i < 400; i++) {
            const block = document.createElement('div');
            block.className = 'heat-block';
            setHeatColor(block);
            heatmapGrid.appendChild(block);
        }
    }

    function setHeatColor(el) {
        const r = Math.random();
        if (r > 0.92) el.style.backgroundColor = 'var(--danger)';
        else if (r > 0.78) el.style.backgroundColor = '#FF7B00';
        else if (r > 0.48) el.style.backgroundColor = 'var(--warning)';
        else if (r > 0.18) el.style.backgroundColor = 'var(--success)';
        else el.style.backgroundColor = 'rgba(255,255,255,0.04)';
    }

    generateHeatmap();

    // Smooth partial update every 3s
    setInterval(() => {
        const blocks = document.querySelectorAll('.heat-block');
        for (let i = 0; i < 80; i++) {
            setHeatColor(blocks[Math.floor(Math.random() * 400)]);
        }
    }, 3000);

    /* ============================================================
       MODULE 13 — REVENUE CHART
    ============================================================ */
    const revenueChart = document.getElementById('revenueChart');
    const revenueLabels = document.getElementById('revenueLabels');

    function initChart() {
        if (!revenueChart) return;
        revenueChart.innerHTML = '';
        revenueLabels.innerHTML = '';
        const data = [
            { time: '18:00', pct: 40, label: '$600k' },
            { time: '19:00', pct: 65, label: '$975k' },
            { time: '20:00', pct: 50, label: '$750k' },
            { time: '21:00', pct: 85, label: '$1.2M' },
            { time: '22:00', pct: 100, label: '$1.5M' }
        ];
        data.forEach((d, i) => {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.setAttribute('data-val', d.label);
            bar.style.height = '0%';
            revenueChart.appendChild(bar);

            const lbl = document.createElement('span');
            lbl.textContent = d.time;
            revenueLabels.appendChild(lbl);

            setTimeout(() => { bar.style.height = d.pct + '%'; }, 300 + i * 150);
        });
    }

    const chartObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { initChart(); chartObs.disconnect(); }
    }, { threshold: 0.5 });
    if (revenueChart) chartObs.observe(revenueChart);

    /* ============================================================
       MODULE 14 — PARKING GRID
    ============================================================ */
    const parkingGrid = document.getElementById('parkingGrid');
    const ZONES = [
        { name: 'A1', fixed: null }, { name: 'A2', fixed: null },
        { name: 'B1', fixed: null }, { name: 'B2', fixed: null },
        { name: 'C1', fixed: null }, { name: 'VIP', fixed: 'limit' },
        { name: 'STAFF', fixed: 'avail' }, { name: 'EV', fixed: null }
    ];
    const TYPES = ['avail', 'limit', 'full'];
    const TXTS = ['AVAILABLE', 'LIMITED', 'FULL'];

    function renderParking() {
        if (!parkingGrid) return;
        parkingGrid.innerHTML = '';
        ZONES.forEach(z => {
            const slot = document.createElement('div');
            let type, txt;
            if (z.fixed) {
                type = z.fixed;
                txt = z.fixed === 'avail' ? 'AVAILABLE' : 'RESERVED';
            } else {
                const idx = Math.random() > 0.6 ? 0 : Math.random() > 0.4 ? 1 : 2;
                type = TYPES[idx]; txt = TXTS[idx];
            }
            slot.className = `park-slot park-${type}`;
            slot.innerHTML = `${z.name}<span class="park-status-txt">${txt}</span>`;
            parkingGrid.appendChild(slot);
        });
    }
    renderParking();
    setInterval(renderParking, 10000);

    /* ============================================================
       MODULE 15 — SECURITY ALERTS
    ============================================================ */
    const securityAlertsCont = document.getElementById('securityAlerts');
    const kpiAlerts = document.getElementById('kpiAlerts');

    let activeAlerts = [
        { type: 'danger', icon: 'fa-triangle-exclamation', title: 'Unauthorized Access Attempt', desc: 'Gate 4 — VIP Section. Security dispatched.', time: 'Just now' },
        { type: 'warning', icon: 'fa-fire', title: 'High Temp Detected', desc: 'Server Room 3. Cooling system check required.', time: '2m ago' },
        { type: 'success', icon: 'fa-check-double', title: 'Perimeter Secured', desc: 'All exterior checkpoints reporting normal.', time: '15m ago' }
    ];

    const NEW_ALERTS = [
        { type: 'warning', icon: 'fa-people-arrows', title: 'Crowd Density High', desc: 'Sector B Concourse approaching density limits.' },
        { type: 'danger', icon: 'fa-bolt', title: 'Power Fluctuation', desc: 'Grid 2 voltage drop. Auto-switching to backup.' },
        { type: 'success', icon: 'fa-shield-check', title: 'System Optimised', desc: 'AI successfully re-routed network traffic.' },
        { type: 'danger', icon: 'fa-video-slash', title: 'Camera 04 Offline', desc: 'CCTV feed lost. Maintenance team dispatched.' },
        { type: 'warning', icon: 'fa-car-burst', title: 'Parking Incident', desc: 'Zone A3 minor collision. Medics en route.' }
    ];

    function renderAlerts() {
        if (!securityAlertsCont) return;
        securityAlertsCont.innerHTML = '';
        activeAlerts.forEach(a => {
            const card = document.createElement('div');
            card.className = `alert-card ${a.type}`;
            card.innerHTML = `
                <div class="alert-icon"><i class="fa-solid ${a.icon}"></i></div>
                <div class="alert-text">
                    <h4>${a.title}</h4>
                    <p>${a.desc}</p>
                    <span class="alert-time">${a.time}</span>
                </div>`;
            securityAlertsCont.appendChild(card);
        });
        if (kpiAlerts) {
            const count = activeAlerts.filter(a => a.type !== 'success').length;
            kpiAlerts.textContent = count;
        }
    }
    renderAlerts();

    /* ============================================================
       MODULE 16 — RECENT ACTIVITY TABLE
    ============================================================ */
    const activityBody = document.getElementById('activityTableBody');
    let activityLog = [
        { time: '19:42:15', desc: 'AI auto-adjusted climate control (Sector A)', status: 'OK', code: 'status-ok' },
        { time: '19:35:00', desc: 'Payment gateway sync completed', status: 'OK', code: 'status-ok' },
        { time: '19:28:44', desc: 'Turnstile 12 malfunction detected', status: 'WARN', code: 'status-warn' },
        { time: '19:15:10', desc: 'Facial Rec: banned individual flagged at Gate 4', status: 'ERR', code: 'status-err' }
    ];

    function renderActivity() {
        if (!activityBody) return;
        activityBody.innerHTML = '';
        activityLog.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="time-col">${item.time}</td>
                <td>${item.desc}</td>
                <td><span class="badge-status ${item.code}">${item.status}</span></td>`;
            activityBody.appendChild(tr);
        });
    }
    renderActivity();

    /* ============================================================
       MODULE 17 — FAKE LIVE DATA (every 5 seconds)
    ============================================================ */
    const liveCrowdVal = document.getElementById('liveCrowdVal');

    setInterval(() => {
        // Crowd fluctuation
        if (liveCrowdVal) {
            let cur = parseInt(liveCrowdVal.textContent.replace(/,/g, ''));
            const delta = Math.floor(Math.random() * 80) - 20;
            if (cur + delta > 0 && cur + delta <= 90000) {
                liveCrowdVal.textContent = (cur + delta).toLocaleString();
                liveCrowdVal.style.textShadow = '0 0 25px var(--primary)';
                setTimeout(() => { liveCrowdVal.style.textShadow = ''; }, 600);
            }
        }

        // Random new alert (15% chance)
        if (Math.random() > 0.85) {
            const pick = NEW_ALERTS[Math.floor(Math.random() * NEW_ALERTS.length)];
            const now = new Date();
            const ts = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
            activeAlerts.unshift({ ...pick, time: 'Just now' });
            if (activeAlerts.length > 5) activeAlerts.pop();
            renderAlerts();
            shakeBell();

            // Update notification badge
            const cur = parseInt(notifBadge.textContent) || 0;
            notifBadge.textContent = cur + 1;
            notifBadge.style.background = 'var(--danger)';

            // Add to activity log
            const sMap = { danger: 'ERR', warning: 'WARN', success: 'OK' };
            const cMap = { danger: 'status-err', warning: 'status-warn', success: 'status-ok' };
            activityLog.unshift({
                time: ts, desc: `${pick.title}: ${pick.desc}`,
                status: sMap[pick.type], code: cMap[pick.type]
            });
            if (activityLog.length > 8) activityLog.pop();
            renderActivity();
        }
    }, 5000);

    /* ============================================================
       MODULE 18 — WEATHER UPDATE (every 30 seconds)
    ============================================================ */
    const weatherData = [
        { temp: '18°C', cond: 'Clear Night', hum: '45%', wind: '12 km/h', rain: '5%' },
        { temp: '17°C', cond: 'Partly Cloudy', hum: '52%', wind: '18 km/h', rain: '15%' },
        { temp: '19°C', cond: 'Breezy', hum: '40%', wind: '24 km/h', rain: '8%' }
    ];

    setInterval(() => {
        const d = weatherData[Math.floor(Math.random() * weatherData.length)];
        const tEl = document.querySelector('.temp .deg');
        const cEl = document.querySelector('.temp .cond');
        const humEl = document.getElementById('wHum');
        const wdEl = document.getElementById('wWind');
        const rEl = document.getElementById('wRain');
        if (tEl) tEl.textContent = d.temp;
        if (cEl) cEl.textContent = d.cond;
        if (humEl) humEl.textContent = 'Humidity: ' + d.hum;
        if (wdEl) wdEl.textContent = 'Wind: ' + d.wind;
        if (rEl) rEl.textContent = 'Rain Prob: ' + d.rain;
    }, 30000);

    /* ============================================================
       MODULE 19 — ADVANCED AI STADIUM COPILOT (V2)
    ============================================================ */
    const aiBtnV2 = document.querySelector('.btn-ai');
    const aiOverlayV2 = document.getElementById('aiCopilotOverlay');
    const aiContainer = document.getElementById('aiCopilotContainer');
    const aiCloseBtn = document.getElementById('aiCloseBtn');
    const aiExpandBtn = document.getElementById('aiExpandBtn');

    // UI Elements
    const personaSelect = document.getElementById('aiPersonaSelect');
    const currentPersonaDisplay = document.getElementById('currentPersonaDisplay');
    const suggestedPrompts = document.getElementById('aiSuggestedPrompts');
    const chatInput = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('aiSendBtn');
    const chatHistory = document.getElementById('aiChatHistory');
    const typingIndicator = document.getElementById('aiTypingIndicator');
    const clearChatBtn = document.getElementById('aiClearChatBtn');
    const voiceBtn = document.getElementById('aiVoiceBtn');
    const exportBtn = document.getElementById('aiExportBtn');

    // Accessibility
    const toggleHighContrast = document.getElementById('toggleHighContrast');
    const toggleLargeText = document.getElementById('toggleLargeText');

    // Personas Data
    const personas = {
        organizer: {
            name: "Organizer Assistant",
            prompts: ["Generate executive report", "Predict food demand", "Revenue summary", "Volunteer availability"]
        },
        security: {
            name: "Security Commander",
            prompts: ["Show live incidents", "Activate emergency mode", "Increase security in Section C", "Gate D crowd status"]
        },
        fan: {
            name: "Fan Assistant",
            prompts: ["Where is Gate C?", "Find nearest parking", "Food queue status", "Best exit route"]
        },
        volunteer: {
            name: "Volunteer Coordinator",
            prompts: ["How many volunteers are free?", "Assign 5 to Gate B", "Medical team status"]
        },
        medical: {
            name: "Medical Assistant",
            prompts: ["Locate nearest medical team", "Dispatch medics to Sector 4", "Emergency response time"]
        },
        transport: {
            name: "Transport Manager",
            prompts: ["Optimize parking", "Predict parking occupancy", "Traffic around stadium"]
        },
        accessibility: {
            name: "Accessibility Assistant",
            prompts: ["Wheelchair accessible route", "Elevator status", "Sign language support"]
        },
        sustainability: {
            name: "Sustainability Advisor",
            prompts: ["Energy consumption", "Generate sustainability report", "Water usage"]
        }
    };

    // Open/Close
    function openCopilot() {
        if (!aiOverlayV2 || !aiContainer) return;
        aiOverlayV2.classList.remove('hidden');
        aiContainer.classList.remove('hidden');
        if (chatInput) setTimeout(() => chatInput.focus(), 100);
    }

    function closeCopilot() {
        if (!aiOverlayV2 || !aiContainer) return;
        aiOverlayV2.classList.add('hidden');
        aiContainer.classList.add('hidden');
        if (aiContainer.classList.contains('expanded')) {
            aiContainer.classList.remove('expanded');
        }
    }

    if (aiBtnV2) aiBtnV2.addEventListener('click', openCopilot);
    if (aiCloseBtn) aiCloseBtn.addEventListener('click', closeCopilot);
    if (aiOverlayV2) aiOverlayV2.addEventListener('click', closeCopilot);

    // Expand
    if (aiExpandBtn) {
        aiExpandBtn.addEventListener('click', () => {
            aiContainer.classList.toggle('expanded');
            aiExpandBtn.innerHTML = aiContainer.classList.contains('expanded')
                ? '<i class="fa-solid fa-compress"></i>'
                : '<i class="fa-solid fa-expand"></i>';
        });
    }

    // Change Persona
    if (personaSelect) {
        personaSelect.addEventListener('change', (e) => {
            const personaKey = e.target.value;
            const pData = personas[personaKey];
            currentPersonaDisplay.textContent = pData.name;

            // Re-render chips
            suggestedPrompts.innerHTML = '';
            pData.prompts.forEach(p => {
                const btn = document.createElement('button');
                btn.className = 'ai-prompt-chip';
                btn.textContent = p;
                btn.addEventListener('click', () => {
                    chatInput.value = p;
                    handleSend();
                });
                suggestedPrompts.appendChild(btn);
            });

            // Add system message
            appendMessage('system', `Persona switched to <strong>${pData.name}</strong>. Ready for specialized tasks.`);
        });

        // Trigger initial load
        personaSelect.dispatchEvent(new Event('change'));
    }

    // Chat Logic
    function appendMessage(role, text) {
        const bubble = document.createElement('div');
        bubble.className = `ai-chat-bubble ${role === 'user' ? 'user-msg' : 'ai-system-msg'} slide-up`;

        const icon = role === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';

        bubble.innerHTML = `
            <div class="bubble-avatar">${icon}</div>
            <div class="bubble-content">
                <p>${text}</p>
            </div>
        `;

        // Insert before typing indicator
        if (typingIndicator && typingIndicator.parentNode === chatHistory) {
    chatHistory.insertBefore(bubble, typingIndicator);
} else {
    chatHistory.appendChild(bubble);
}
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Show toast for specific events
    function showCopilotToast(msg, type = 'info') {
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        t.innerHTML = `<i class="fa-solid fa-info-circle"></i> <span>${msg}</span>`;
        document.getElementById('toastContainer').appendChild(t);
        setTimeout(() => t.remove(), 4000);
    }

    function simulateGenAIResponse(input) {
        typingIndicator.classList.remove('hidden');
        chatHistory.scrollTop = chatHistory.scrollHeight;

        const lowerInput = input.toLowerCase();
        let response = "I've analyzed the current stadium telemetry. All systems nominal. How else can I assist?";
        let delay = 1500;

        // Smart Responses based on keywords
        if (lowerInput.includes('emergency')) {
            response = `<strong class="text-danger">EMERGENCY MODE ACTIVATED.</strong> <br><br>Initiating Level 1 Evacuation protocols. Nearest exits highlighted on main displays. 12 Medical teams deployed to Sectors C and D. All gates opened. Public announcements broadcasting.`;
            delay = 2000;
            setTimeout(triggerEmergencyOverride, 1000);
        }
        else if (lowerInput.includes('gate') && lowerInput.includes('open')) {
            response = "Command confirmed. Opening specified gates. I've redirected crowd flow displays to balance density. Estimated density reduction: 31%.";
        }
        else if (lowerInput.includes('report')) {
            response = "Generating comprehensive executive report... <br><br><strong>Match Day Summary:</strong><br>- Attendance: 94%<br>- Revenue: +12% vs avg<br>- Incidents: 2 (resolved)<br><a href='#' class='neon-text-cyan'>Download PDF Report</a>";
            delay = 2500;
        }
        else if (lowerInput.includes('volunteer')) {
            response = "Currently, 42 volunteers are available in the reserve pool. Deploying 5 to Gate B as requested. ETA 3 minutes.";
        }
        else if (lowerInput.includes('food') || lowerInput.includes('queue')) {
            response = "Food queue at Counter 6 is currently at 87% capacity (High). I recommend deploying additional staff or opening temporary kiosk 6B.";
        }
        else if (lowerInput.includes('parking')) {
            response = "Parking Zone A is full. Zone B at 85%. Zone C at 40%. Redirecting incoming traffic to Zone C via dynamic road signage.";
        }
        else if (lowerInput.includes('incident') || lowerInput.includes('video')) {
            response = "Accessing live CCTV feeds... Found 1 minor altercation at Section 402. Security Team Alpha is already en route (ETA 1 min).";
        }

        setTimeout(() => {
            typingIndicator.classList.add('hidden');
            appendMessage('system', response);
        }, delay);
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage('user', text);
        chatInput.value = '';

        simulateGenAIResponse(text);
    }

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (chatInput) chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Emergency Override Logic
    function triggerEmergencyOverride() {
        document.body.style.setProperty('--bg-dark', '#2a0a0a');
        document.body.style.setProperty('--card-bg', '#3a0c0c');
        document.body.style.setProperty('--primary', '#ff3d71');
        document.body.style.setProperty('--primary-glow', 'rgba(255,61,113,0.5)');

        const topbar = document.querySelector('.topbar');
        if (topbar) topbar.style.borderBottom = "2px solid #ff3d71";

        document.querySelectorAll('.insight-card').forEach(c => {
            c.style.borderColor = "#ff3d71";
            c.style.background = "rgba(255,0,0,0.1)";
        });

        const riskBadge = document.getElementById('riskBadge');
        if (riskBadge) {
            riskBadge.textContent = 'CRITICAL';
            riskBadge.className = 'badge badge-danger';
        }

        const crowdStatus = document.getElementById('crowdStatusValue');
        if (crowdStatus) {
            crowdStatus.textContent = 'EVACUATE';
            crowdStatus.style.color = '#ff3d71';
        }

        showCopilotToast('EMERGENCY MODE ACTIVATED ACROSS ALL SYSTEMS', 'danger');
    }

    // Right panel action buttons
    document.querySelectorAll('.execute-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            chatInput.value = `Execute action: ${action}`;
            handleSend();
            e.target.innerHTML = '<i class="fa-solid fa-check"></i> Executed';
            e.target.classList.add('disabled');
            e.target.style.background = 'var(--success)';
            e.target.style.color = '#000';
            e.target.style.borderColor = 'var(--success)';
        });
    });

    // Header Actions
    if (clearChatBtn) clearChatBtn.addEventListener('click', () => {
        const msgs = chatHistory.querySelectorAll('.ai-chat-bubble:not(.ai-system-msg:first-child):not(.ai-typing)');
        msgs.forEach(m => m.remove());
        showCopilotToast('Conversation history cleared.');
    });

    if (exportBtn) exportBtn.addEventListener('click', () => {
        showCopilotToast('Generating PDF Report...', 'info');
        setTimeout(() => showCopilotToast('PDF Report downloaded.', 'success'), 2000);
    });

    if (voiceBtn) voiceBtn.addEventListener('click', () => {
        voiceBtn.classList.toggle('recording');
        if (voiceBtn.classList.contains('recording')) {
            showCopilotToast('Listening...', 'info');
            chatInput.placeholder = "Listening...";
        } else {
            chatInput.placeholder = "Enter command or ask a question...";
            chatInput.value = "Activate emergency mode";
            setTimeout(() => handleSend(), 500);
        }
    });

    // Accessibility Toggles
    if (toggleHighContrast) toggleHighContrast.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        toggleHighContrast.classList.toggle('active');
    });

    if (toggleLargeText) toggleLargeText.addEventListener('click', () => {
        document.body.classList.toggle('large-text');
        toggleLargeText.classList.toggle('active');
    });

    /* ============================================================
       MODULE X — NEW SPA WIDGETS DATA
    ============================================================ */
    // Parking Map
    const parkingMap = document.getElementById('premiumParkingMap');
    if (parkingMap) {
        const zones = [
            { name: 'Zone A (VIP)', cap: '92%', status: 'warning' },
            { name: 'Zone B', cap: '100%', status: 'full' },
            { name: 'Zone C', cap: '45%', status: '' },
            { name: 'Zone D', cap: '78%', status: '' }
        ];
        parkingMap.innerHTML = zones.map((z, idx) => `
            <div class="parking-zone-box ${z.status}" data-zone="${z.name}" style="cursor: pointer;">
                <div class="zone-name">${z.name}</div>
                <div class="zone-capacity">${z.cap}</div>
                <div class="zone-fill" style="height: ${z.cap}"></div>
            </div>
        `).join('');

        const zoneDetailsContainer = document.getElementById('zoneDetailsContainer');
        const activeZoneTitle = document.getElementById('activeZoneTitle');
        const zoneGridDetails = document.getElementById('zoneGridDetails');
        const closeZoneDetailsBtn = document.getElementById('closeZoneDetailsBtn');

        if (closeZoneDetailsBtn) {
            closeZoneDetailsBtn.addEventListener('click', () => {
                zoneDetailsContainer.style.display = 'none';
                zoneDetailsContainer.classList.add('hidden');
            });
        }

        const zoneBoxes = parkingMap.querySelectorAll('.parking-zone-box');
        zoneBoxes.forEach(box => {
            box.addEventListener('click', () => {
                const zoneName = box.getAttribute('data-zone');
                activeZoneTitle.textContent = zoneName;
                zoneDetailsContainer.style.display = 'block';
                zoneDetailsContainer.classList.remove('hidden');

                // Generate random parking spots layout
                let html = '<div class="detailed-parking-layout">';

                // Car Spots (larger boxes)
                html += '<h4>Car Parking</h4><div class="spot-group car-spots">';
                for (let i = 0; i < 40; i++) {
                    const isTaken = Math.random() > 0.4;
                    html += `<div class="spot car-spot ${isTaken ? 'taken' : 'empty'}"></div>`;
                }
                html += '</div>';

                // 2-Wheeler Spots (small rounded boxes)
                html += '<h4 class="mt-3">2-Wheeler Parking</h4><div class="spot-group bike-spots">';
                for (let i = 0; i < 60; i++) {
                    const isTaken = Math.random() > 0.3;
                    html += `<div class="spot bike-spot ${isTaken ? 'taken' : 'empty'}"></div>`;
                }
                html += '</div>';

                // Cab/Auto Spots (different color)
                html += '<h4 class="mt-3">Cab / Auto Drop-off</h4><div class="spot-group cab-spots">';
                for (let i = 0; i < 15; i++) {
                    const isTaken = Math.random() > 0.7;
                    html += `<div class="spot cab-spot ${isTaken ? 'taken' : 'empty'}"></div>`;
                }
                html += '</div>';

                html += '</div>';
                zoneGridDetails.innerHTML = html;

                // Scroll to details
                zoneDetailsContainer.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    /* ============================================================
       AI SECURITY COMMAND CENTER (SOC) IMPLEMENTATION
    ============================================================ */

    // 1. Data Definitions
    const CAMERAS_DATA = [
        { id: "CAM-01", name: "Perimeter Fence East", resolution: "4K UHD", fps: 30.0, type: "Perimeter Breach", source: "Sector A", alertActive: true, isOnline: true },
        { id: "CAM-02", name: "Gate A Turnstiles", resolution: "1080p HD", fps: 29.9, type: "Crowd Flow", source: "Gate A", alertActive: false, isOnline: true },
        { id: "CAM-03", name: "VIP Main Lobby", resolution: "1080p HD", fps: 30.0, type: "Suspicious Object", source: "VIP Lobby", alertActive: true, isOnline: true },
        { id: "CAM-04", name: "Parking Lot North", resolution: "1440p QHD", fps: 29.8, type: "Vehicle Tracking", source: "Parking N", alertActive: false, isOnline: true },
        { id: "CAM-05", name: "East stand Seating", resolution: "1080p HD", fps: 30.0, type: "Crowd Density", source: "East Stand", alertActive: false, isOnline: true },
        { id: "CAM-06", name: "Player Tunnel Gate", resolution: "1080p HD", fps: 29.9, type: "Access Control", source: "Tunnel", alertActive: false, isOnline: true },
        { id: "CAM-07", name: "Main Server Room", resolution: "1080p HD", fps: 30.0, type: "Fire/Smoke Alert", source: "Server Rm", alertActive: true, isOnline: true },
        { id: "CAM-08", name: "Food Concourse 3", resolution: "1080p HD", fps: 29.7, type: "Queue Monitoring", source: "Concourse", alertActive: false, isOnline: false }, // Simulated offline
        { id: "CAM-09", name: "Gate F Emergency Exit", resolution: "1080p HD", fps: 30.0, type: "Door Status", source: "Gate F", alertActive: false, isOnline: true },
        { id: "CAM-10", name: "Press Box & Media", resolution: "1080p HD", fps: 29.9, type: "Occupancy Count", source: "Media Rm", alertActive: false, isOnline: true },
        { id: "CAM-11", name: "Medical Center Entry", resolution: "1080p HD", fps: 30.0, type: "Medical Emergency", source: "Medical Rm", alertActive: true, isOnline: true },
        { id: "CAM-12", name: "Drone Patrol SkyCam", resolution: "1440p QHD", fps: 30.0, type: "Air Intrusion", source: "Drone 01", alertActive: true, isOnline: true }
    ];

    const THREATS_DATA = [
        { id: "threat-1", label: "Unauthorized Access", risk: "CRITICAL", conf: 98.2, time: "Just Now", camera: "CAM-01", source: "Fence East", action: "Deploy Security Guard Team A", css: "critical" },
        { id: "threat-2", label: "Suspicious Object", risk: "WARNING", conf: 91.5, time: "2 min ago", camera: "CAM-03", source: "VIP Lounge Lobby", action: "Isolate Zone & Send Drone Patrol", css: "warning" },
        { id: "threat-3", label: "Fire/Smoke Detected", risk: "CRITICAL", conf: 97.8, time: "5 min ago", camera: "CAM-07", source: "Server Room A", action: "Activate Cooling Override & Call Fire Team", css: "critical" },
        { id: "threat-4", label: "Medical Incident", risk: "WARNING", conf: 94.2, time: "8 min ago", camera: "CAM-11", source: "Medical Entrance Gate", action: "Dispatch Ambulatory Unit 2", css: "warning" }
    ];

    const TIMELINE_DATA = [
        { time: "17:40:12", desc: "Drone Intrusion: Unidentified drone detected near South Outer Perimeter", severity: "active", location: "South Gate", x: 400, y: 530 },
        { time: "17:38:05", desc: "Unauthorized Entry: Gate 4 perimeter fence breach alarm triggered", severity: "active", location: "Fence East", x: 740, y: 300 },
        { time: "17:35:50", desc: "Suspicious Object: Unattended backpack spotted near VIP Entrance Lobby", severity: "active", location: "VIP Lobby", x: 220, y: 220 },
        { time: "17:28:44", desc: "Power Fluctuation: Sector B cooling systems reporting load drop", severity: "resolved", location: "Server Room", x: 400, y: 230 },
        { time: "17:15:10", desc: "Medical Dispatch: Vol. Team 3 dispatched to help disabled fan at Gate F", severity: "resolved", location: "Gate F", x: 100, y: 300 }
    ];

    const PERSONNEL_COUNTS = {
        guards: { label: "Security Guards", val: 42, max: 50, color: "var(--primary)" },
        police: { label: "Police Officers", val: 18, max: 20, color: "var(--secondary)" },
        medical: { label: "Medical Responders", val: 12, max: 15, color: "var(--success)" },
        fire: { label: "Fire Crew", val: 8, max: 10, color: "var(--warning)" },
        volunteers: { label: "Volunteers", val: 85, max: 100, color: "var(--primary)" },
        robots: { label: "AI Ground Robots", val: 6, max: 8, color: "var(--primary)" },
        drones: { label: "Patrol Drones", val: 4, max: 6, color: "var(--secondary)" }
    };

    const ANALYTICS_DATA = [
        { label: "AI Face Detection Accuracy", pct: 99.4, css: "glow-bar-cyan" },
        { label: "Gate Crowd Congestion Index", pct: 84.1, css: "glow-bar-yellow" },
        { label: "Perimeter Vehicle Scan Rate", pct: 95.8, css: "glow-bar-green" },
        { label: "Left Bag Identification rate", pct: 91.2, css: "glow-bar-cyan" },
        { label: "Anomalous Sound / Violence Detect", pct: 15.4, css: "glow-bar-cyan" },
        { label: "Grid Thermal / Smoke Profiling", pct: 12.0, css: "glow-bar-cyan" },
        { label: "Personal Safety Gear Compliance", pct: 98.7, css: "glow-bar-green" }
    ];

    const RECOMMENDATIONS = [
        "AI ALERT: Crowd density at Gate 4 concourse exceeds optimal limit. Opening auxiliary gates recommended.",
        "AI ALERT: Drone Battery at 18% on unit Drone-02. Routing back to central landing deck.",
        "AI ALERT: VIP parking bay congestion high. Redirect incoming VIP cabs to Zone C.",
        "AI ALERT: Intrusion attempt flagged on Camera 01 (Fence East). Security Guard Team A dispatch recommended.",
        "AI ALERT: Ambient server temperature spiking. Auto-initiating HVAC backup loop."
    ];

    // Map landmarks coordinate mapping for incident highlights
    const MAP_COORDS = {
        "South Gate": { x: 400, y: 530 },
        "Fence East": { x: 740, y: 300 },
        "VIP Lobby": { x: 220, y: 220 },
        "Server Room": { x: 400, y: 230 },
        "Gate F": { x: 100, y: 300 }
    };

    // 2. DOM Rendering & Logic Setup
    const camGrid = document.getElementById('securityCameraGrid');
    const threatContainer = document.getElementById('activeThreatsContainer');
    const timelineContainer = document.getElementById('incidentTimelineContainer');
    const analyticsList = document.getElementById('smartCameraAnalyticsList');
    const personnelCounters = document.getElementById('personnelCountersGrid');
    const telemetryList = document.getElementById('socMetricsList');
    const advisorBody = document.getElementById('advisorRecommendationBody');
    const toggleHeatmap = document.getElementById('toggleHeatmapBtn');

    // Canvas drawing contexts collection for loops
    const canvasContexts = {};

    function initCCTVGrid() {
        if (!camGrid) return;

        // Per-camera AI detection confidence profiles (randomized but seeded per cam)
        const AI_PROFILES = {
            "CAM-01": { face: 97.4, crowd: 62, vehicle: 5, suspicious: 0.8, fire: 0, smoke: 0, violence: 0, unauthorized: 98.2 },
            "CAM-02": { face: 91.2, crowd: 84, vehicle: 2, suspicious: 1.2, fire: 0, smoke: 0, violence: 0, unauthorized: 0.4 },
            "CAM-03": { face: 88.0, crowd: 45, vehicle: 0, suspicious: 91.5, fire: 0, smoke: 0, violence: 3.2, unauthorized: 11.0 },
            "CAM-04": { face: 4.1, crowd: 30, vehicle: 95.8, suspicious: 2.0, fire: 0, smoke: 0, violence: 0, unauthorized: 0.2 },
            "CAM-05": { face: 73.2, crowd: 93, vehicle: 0, suspicious: 5.1, fire: 0, smoke: 0, violence: 2.1, unauthorized: 0.6 },
            "CAM-06": { face: 99.1, crowd: 22, vehicle: 0, suspicious: 0.3, fire: 0, smoke: 0, violence: 0, unauthorized: 0.1 },
            "CAM-07": { face: 12.0, crowd: 8, vehicle: 0, suspicious: 44.0, fire: 97.8, smoke: 92.1, violence: 0, unauthorized: 8.0 },
            "CAM-08": { face: 0, crowd: 0, vehicle: 0, suspicious: 0, fire: 0, smoke: 0, violence: 0, unauthorized: 0 },
            "CAM-09": { face: 55.0, crowd: 40, vehicle: 0, suspicious: 0.5, fire: 0, smoke: 0, violence: 0, unauthorized: 0.3 },
            "CAM-10": { face: 82.3, crowd: 60, vehicle: 0, suspicious: 1.0, fire: 0, smoke: 0, violence: 0, unauthorized: 0.2 },
            "CAM-11": { face: 94.2, crowd: 35, vehicle: 8, suspicious: 2.0, fire: 0, smoke: 0, violence: 0, unauthorized: 0.5 },
            "CAM-12": { face: 68.0, crowd: 55, vehicle: 12, suspicious: 9.0, fire: 0, smoke: 2.0, violence: 0, unauthorized: 0 }
        };

        // Per-camera extra metadata
        const CAM_META = {
            "CAM-01": { latency: "12ms", aiConf: 98.2, health: 100, mode: "" },
            "CAM-02": { latency: "9ms", aiConf: 94.6, health: 98, mode: "" },
            "CAM-03": { latency: "11ms", aiConf: 91.5, health: 97, mode: "" },
            "CAM-04": { latency: "14ms", aiConf: 89.3, health: 99, mode: "" },
            "CAM-05": { latency: "8ms", aiConf: 87.2, health: 100, mode: "" },
            "CAM-06": { latency: "10ms", aiConf: 96.4, health: 99, mode: "" },
            "CAM-07": { latency: "15ms", aiConf: 97.8, health: 94, mode: "thermal-mode" },
            "CAM-08": { latency: "—", aiConf: 0, health: 0, mode: "" },
            "CAM-09": { latency: "7ms", aiConf: 92.1, health: 100, mode: "" },
            "CAM-10": { latency: "11ms", aiConf: 88.5, health: 97, mode: "" },
            "CAM-11": { latency: "13ms", aiConf: 94.2, health: 98, mode: "" },
            "CAM-12": { latency: "6ms", aiConf: 99.1, health: 100, mode: "nightvision-mode" }
        };

        let html = '';
        CAMERAS_DATA.forEach(cam => {
            const statusClass = cam.isOnline ? "rec-active" : "";
            const isAlert = cam.alertActive ? "alert-active" : "";
            const statusLabel = cam.isOnline ? "⬤ LIVE" : "⬤ OFFLINE";
            const meta = CAM_META[cam.id] || { latency: "—", aiConf: 0, health: 0, mode: "" };
            const modeClass = meta.mode;
            const healthClass = meta.health > 90 ? "good" : meta.health > 70 ? "warn" : "crit";
            const latencyClass = cam.isOnline ? "info" : "";
            const aiConf = cam.isOnline ? meta.aiConf.toFixed(1) + "%" : "N/A";
            const healthStr = cam.isOnline ? meta.health + "%" : "OFFLINE";
            const prof = AI_PROFILES[cam.id] || {};

            // AI detection confidence pct color helper
            const pctClass = v => v >= 80 ? "ai-pct-alert" : v >= 40 ? "ai-pct-mid" : v >= 10 ? "ai-pct-low" : "ai-pct-low";
            const pct = v => `<span class="${pctClass(v)}">${v.toFixed(1)}%</span>`;

            html += `
                <div class="cam-feed-item ${modeClass}" id="feed-${cam.id}" data-id="${cam.id}">
                    <div class="cam-header">
                        <span class="cam-id"><i class="fa-solid fa-camera" style="font-size:0.6rem;margin-right:3px;"></i>${cam.id}</span>
                        <span class="cam-rec-status ${statusClass}" style="font-size:0.62rem;font-family:'Orbitron',sans-serif;">${statusLabel}</span>
                    </div>
                    <div class="cam-video-screen">
                        ${cam.isOnline ? `
                            <canvas class="cctv-scene" id="canvas-${cam.id}"></canvas>
                            <div class="cctv-overlay-scanlines"></div>
                            <div class="cctv-overlay-noise"></div>
                            <div class="cctv-overlay-nightvision"></div>
                            <div class="cctv-overlay-thermal"></div>
                            <div class="cctv-overlay-grid"></div>
                            <!-- AI Detection Hover Overlay -->
                            <div class="cctv-ai-overlay">
                                <div class="cctv-ai-grid">
                                    <div class="cctv-ai-stat"><span>Face Detect</span>${pct(prof.face)}</div>
                                    <div class="cctv-ai-stat"><span>Crowd Density</span>${pct(prof.crowd)}</div>
                                    <div class="cctv-ai-stat"><span>Vehicle Detect</span>${pct(prof.vehicle)}</div>
                                    <div class="cctv-ai-stat"><span>Suspicious Obj</span>${pct(prof.suspicious)}</div>
                                    <div class="cctv-ai-stat"><span>Fire Risk</span>${pct(prof.fire)}</div>
                                    <div class="cctv-ai-stat"><span>Smoke Alert</span>${pct(prof.smoke)}</div>
                                    <div class="cctv-ai-stat"><span>Violence</span>${pct(prof.violence)}</div>
                                    <div class="cctv-ai-stat"><span>Unauthorized</span>${pct(prof.unauthorized)}</div>
                                </div>
                            </div>
                        ` : `
                            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--danger); font-family:'Orbitron'; font-size:0.7rem; text-shadow:0 0 5px var(--danger); gap:6px;">
                                <i class="fa-solid fa-triangle-exclamation" style="font-size:1.2rem;"></i>
                                <span>FEED LOST</span>
                                <span style="font-size:0.55rem; color:var(--text-muted); font-family:'Rajdhani';">Signal disconnected</span>
                            </div>
                        `}
                    </div>
                    <div class="cam-footer">
                        <div class="cam-meta-left">
                            <span class="cam-badge-ai ${isAlert}">${cam.type}</span>
                            <div class="cam-meta-stats">
                                <span class="cam-stat-chip info" id="fps-${cam.id}" title="Frame Rate">${cam.fps} FPS</span>
                                <span class="cam-stat-chip ${latencyClass}" title="Latency">${meta.latency}</span>
                                <span class="cam-stat-chip" title="Resolution" style="color:var(--text-muted)">${cam.resolution}</span>
                                <span class="cam-stat-chip info" title="AI Confidence">AI ${aiConf}</span>
                                <span class="cam-stat-chip ${healthClass}" title="Camera Health">HLT ${healthStr}</span>
                            </div>
                        </div>
                        <div class="cam-meta-right">
                            <button class="cam-action-btn cam-snap-btn snap-btn" title="Snapshot"><i class="fa-solid fa-camera-rotate"></i></button>
                            <button class="cam-action-btn cam-zoom-btn" title="Zoom"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
                            <button class="cam-action-btn cam-full-btn" title="Fullscreen"><i class="fa-solid fa-maximize"></i></button>
                        </div>
                    </div>
                </div>
            `;
        });
        camGrid.innerHTML = html;

        // Snapshot button flash effect
        document.querySelectorAll('.cam-snap-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.cam-feed-item');
                card.classList.add('snap-flash');
                setTimeout(() => card.classList.remove('snap-flash'), 420);
                const camId = card.getAttribute('data-id');
                showToastMessage(`📸 Snapshot captured: ${camId} — saved to evidence log`, "success");
            });
        });

        // Zoom button
        document.querySelectorAll('.cam-zoom-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.cam-feed-item');
                card.classList.toggle('selected-focus');
            });
        });

        // Fullscreen button
        document.querySelectorAll('.cam-full-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.cam-feed-item');
                card.classList.toggle('fullscreen-cctv');
                const icon = btn.querySelector('i');
                if (card.classList.contains('fullscreen-cctv')) {
                    icon.className = 'fa-solid fa-minimize';
                } else {
                    icon.className = 'fa-solid fa-maximize';
                }
            });
        });

        // Initialize Canvas Contexts
        CAMERAS_DATA.forEach(cam => {
            if (cam.isOnline) {
                const canvas = document.getElementById(`canvas-${cam.id}`);
                if (canvas) {
                    canvas.width = 320;
                    canvas.height = 180;
                    canvasContexts[cam.id] = canvas.getContext('2d');
                }
            }
        });
    }

    function initThreatCards() {
        if (!threatContainer) return;
        threatContainer.innerHTML = THREATS_DATA.map(t => `
            <div class="threat-card ${t.css}" id="${t.id}">
                <div class="threat-card-header">
                    <span class="threat-label"><i class="fa-solid fa-triangle-exclamation"></i> ${t.label}</span>
                    <span class="threat-confidence text-danger">${t.conf}% CONFIDENCE</span>
                </div>
                <div class="threat-details">Source: <strong>${t.camera}</strong> (${t.source}) - Status: Active</div>
                <div class="threat-reco">AI recommendation: <em>${t.action}</em></div>
                <div class="threat-footer">
                    <span>Risk: <strong>${t.risk}</strong></span>
                    <span>Detected: ${t.time}</span>
                </div>
            </div>
        `).join('');
    }

    function initIncidentTimeline() {
        if (!timelineContainer) return;
        timelineContainer.innerHTML = TIMELINE_DATA.map(node => {
            const sevClass = node.severity === 'active' ? 'active' : 'resolved';
            const statusLabel = node.severity === 'active' ? 'ACTIVE' : 'RESOLVED';
            const statusClass = node.severity === 'active' ? 'status-active' : 'status-resolved';
            return `
                <div class="timeline-node ${sevClass}" data-loc="${node.location}">
                    <div class="timeline-time">${node.time}</div>
                    <div class="timeline-content">
                        <div class="timeline-desc">${node.desc}</div>
                        <span class="timeline-status ${statusClass}">${statusLabel}</span>
                    </div>
                </div>
            `;
        }).join('');

        // Highlight event on map when timeline node clicked
        document.querySelectorAll('.timeline-node').forEach(node => {
            node.addEventListener('click', () => {
                const loc = node.getAttribute('data-loc');
                highlightMapLocation(loc);
            });
        });
    }

    function initPersonnelCounters() {
        if (!personnelCounters) return;
        let html = '';
        Object.keys(PERSONNEL_COUNTS).forEach(key => {
            const item = PERSONNEL_COUNTS[key];
            const isActive = item.val > 0 ? "active" : "";
            let icon = 'fa-user-shield';
            if (key === 'police') icon = 'fa-car-side';
            if (key === 'medical') icon = 'fa-truck-medical';
            if (key === 'fire') icon = 'fa-fire-extinguisher';
            if (key === 'volunteers') icon = 'fa-hands-helping';
            if (key === 'robots') icon = 'fa-robot';
            if (key === 'drones') icon = 'fa-helicopter';

            html += `
                <div class="personnel-item ${isActive}">
                    <div class="personnel-icon-wrap" style="background:rgba(0, 229, 255, 0.1); border:1px solid rgba(0,229,255,0.25); color:${item.color};">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div class="personnel-data">
                        <span class="personnel-label">${item.label}</span>
                        <span class="personnel-val live-count" id="count-${key}">${item.val}</span>
                    </div>
                </div>
            `;
        });
        personnelCounters.innerHTML = html;
    }

    function initAnalyticsList() {
        if (!analyticsList) return;
        analyticsList.innerHTML = ANALYTICS_DATA.map(bar => `
            <div class="analytics-bar-item">
                <div class="analytics-bar-header">
                    <span>${bar.label}</span>
                    <span class="text-primary" id="pct-${bar.label.replace(/\s+/g, '')}">${bar.pct}%</span>
                </div>
                <div class="progress-track-soc">
                    <div class="progress-fill-soc ${bar.css}" style="width: ${bar.pct}%"></div>
                </div>
            </div>
        `).join('');
    }

    function initSOCMetrics() {
        if (!telemetryList) return;
        const metrics = [
            { label: "Today's Security Incidents", val: 5, color: "text-danger" },
            { label: "Critical Threat Overrides", val: 1, color: "text-warning" },
            { label: "Average Response Time", val: "18 sec", color: "text-success" },
            { label: "Active Camera Uptime", val: "99.85%", color: "text-success" },
            { label: "AI Classifier Accuracy", val: "98.92%", color: "text-primary" },
            { label: "SOC Network Status", val: "Nominal", color: "text-success" }
        ];

        telemetryList.innerHTML = metrics.map(m => `
            <div class="soc-metric-row">
                <div class="soc-metric-info">
                    <span class="soc-metric-lbl">${m.label}</span>
                    <span class="soc-metric-val ${m.color}">${m.val}</span>
                </div>
            </div>
        `).join('');
    }

    // 3. Dynamic Vector Stadium Map Initialization
    const mapSvgContainer = document.getElementById('securityMapSvgContainer');
    function initSecurityMap() {
        if (!mapSvgContainer) return;

        mapSvgContainer.innerHTML = `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%;">
                <defs>
                    <radialGradient id="stadiumInnerGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.2" />
                        <stop offset="100%" stop-color="var(--primary)" stop-opacity="0" />
                    </radialGradient>
                    <linearGradient id="stadiumPitchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="rgba(0, 255, 153, 0.15)" />
                        <stop offset="100%" stop-color="rgba(0, 255, 153, 0.05)" />
                    </linearGradient>
                </defs>
                
                <!-- Cyber Space Grid Lines -->
                <g stroke="rgba(0, 229, 255, 0.04)" stroke-width="1">
                    ${Array.from({ length: 30 }).map((_, i) => `
                        <line x1="${i * 30}" y1="0" x2="${i * 30}" y2="600" />
                        <line x1="0" y1="${i * 25}" x2="800" y2="${i * 25}" />
                    `).join('')}
                </g>

                <!-- Concentric Stadium Outline Rings -->
                <ellipse cx="400" cy="300" rx="360" ry="240" fill="none" stroke="rgba(0, 229, 255, 0.15)" stroke-width="2" />
                <ellipse cx="400" cy="300" rx="330" ry="215" fill="none" stroke="rgba(0, 229, 255, 0.2)" stroke-width="1.5" />
                <ellipse cx="400" cy="300" rx="300" ry="190" fill="url(#stadiumInnerGlow)" stroke="rgba(0, 229, 255, 0.3)" stroke-width="3" />

                <!-- Seating Stands Outer Borders -->
                <path d="M 180 160 Q 400 110 620 160" fill="none" stroke="rgba(0, 229, 255, 0.4)" stroke-width="8" />
                <path d="M 180 440 Q 400 490 620 440" fill="none" stroke="rgba(0, 229, 255, 0.4)" stroke-width="8" />
                <path d="M 630 180 Q 675 300 630 420" fill="none" stroke="rgba(0, 229, 255, 0.4)" stroke-width="8" />
                <path d="M 170 180 Q 125 300 170 420" fill="none" stroke="rgba(0, 229, 255, 0.4)" stroke-width="8" />

                <!-- Soccer Field Grid (Center) -->
                <g transform="translate(280, 210)">
                    <rect x="0" y="0" width="240" height="180" fill="url(#stadiumPitchGrad)" stroke="var(--success)" stroke-width="2" />
                    <!-- Center Line -->
                    <line x1="120" y1="0" x2="120" y2="180" stroke="var(--success)" stroke-width="1.5" />
                    <!-- Center Circle -->
                    <circle cx="120" cy="90" r="35" fill="none" stroke="var(--success)" stroke-width="1.5" />
                    <!-- Center Spot -->
                    <circle cx="120" cy="90" r="3" fill="var(--success)" />
                    <!-- Penalty Area Left -->
                    <rect x="0" y="45" width="40" height="90" fill="none" stroke="var(--success)" stroke-width="1.5" />
                    <rect x="0" y="65" width="15" height="50" fill="none" stroke="var(--success)" stroke-width="1" />
                    <path d="M 40 75 A 25 25 0 0 1 40 105" fill="none" stroke="var(--success)" stroke-width="1.5" />
                    <!-- Penalty Area Right -->
                    <rect x="200" y="45" width="40" height="90" fill="none" stroke="var(--success)" stroke-width="1.5" />
                    <rect x="225" y="65" width="15" height="50" fill="none" stroke="var(--success)" stroke-width="1" />
                    <path d="M 200 75 A 25 25 0 0 0 200 105" fill="none" stroke="var(--success)" stroke-width="1.5" />
                </g>

                <!-- Heatmap Overlay Node circles -->
                <g id="heatmapNodesGroup" opacity="0.6">
                    <circle cx="680" cy="300" r="60" fill="rgba(255, 61, 113, 0.45)" class="heatmap-risk-ring" stroke="var(--danger)" stroke-width="1.5" />
                    <circle cx="210" cy="180" r="50" fill="rgba(255, 193, 7, 0.35)" class="heatmap-risk-ring" stroke="var(--warning)" stroke-width="1.5" />
                    <circle cx="400" cy="130" r="65" fill="rgba(0, 255, 136, 0.2)" class="heatmap-risk-ring" stroke="var(--success)" stroke-width="1.5" />
                </g>

                <!-- Camera nodes icons overlays -->
                <g id="cameraNodesGroup">
                    <!-- Represented by Cyan flashing circles with labels -->
                </g>

                <!-- Stadium Gates -->
                <g id="gateNodesGroup">
                    <!-- Custom icons -->
                </g>

                <!-- Emergency Exit layout nodes -->
                <g id="emergencyExitNodesGroup">
                </g>

                <!-- Patrol Assets: Drones, Guards, Police cars -->
                <g id="activeAssetsGroup">
                </g>

                <!-- Interactive Timeline Highlight Ring -->
                <circle id="timelineHighlightCircle" cx="0" cy="0" r="0" fill="none" stroke="var(--danger)" stroke-width="3" opacity="0">
                    <animate attributeName="r" values="0;40;0" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
            </svg>
        `;

        drawCameraNodes();
        drawGateNodes();
        drawEmergencyExits();
        drawActiveAssets();
    }

    function drawCameraNodes() {
        const group = document.getElementById('cameraNodesGroup');
        if (!group) return;
        // 12 camera spots on the map coordinates
        const cameraCoordinates = [
            { id: "CAM-01", x: 700, y: 300 },
            { id: "CAM-02", x: 200, y: 150 },
            { id: "CAM-03", x: 260, y: 220 },
            { id: "CAM-04", x: 500, y: 100 },
            { id: "CAM-05", x: 620, y: 250 },
            { id: "CAM-06", x: 260, y: 380 },
            { id: "CAM-07", x: 400, y: 180 },
            { id: "CAM-08", x: 580, y: 350 },
            { id: "CAM-09", x: 100, y: 300 },
            { id: "CAM-10", x: 540, y: 380 },
            { id: "CAM-11", x: 300, y: 440 },
            { id: "CAM-12", x: 400, y: 300 }
        ];

        let html = '';
        cameraCoordinates.forEach(coord => {
            const data = CAMERAS_DATA.find(c => c.id === coord.id);
            const statusColor = data && data.alertActive ? "var(--danger)" : "var(--primary)";
            const animPulse = data && data.alertActive ? "map-alert-pulse" : "";

            html += `
                <g class="map-camera-node ${animPulse}" id="map-node-${coord.id}" transform="translate(${coord.x}, ${coord.y})" data-id="${coord.id}">
                    <circle r="7" fill="${statusColor}" opacity="0.8" />
                    <circle r="12" fill="none" stroke="${statusColor}" stroke-width="1" opacity="0.5">
                        <animate attributeName="r" values="7;15;7" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text y="-12" font-size="8" fill="#fff" font-family="Orbitron" text-anchor="middle" font-weight="bold">${coord.id}</text>
                </g>
            `;
        });
        group.innerHTML = html;

        // Handle clicking map camera -> scrolls to CCTV feed
        document.querySelectorAll('.map-camera-node').forEach(node => {
            node.addEventListener('click', () => {
                const camId = node.getAttribute('data-id');
                const feed = document.getElementById(`feed-${camId}`);
                if (feed) {
                    feed.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    feed.classList.add('selected-focus');
                    setTimeout(() => feed.classList.remove('selected-focus'), 3000);
                }
            });
        });
    }

    function drawGateNodes() {
        const group = document.getElementById('gateNodesGroup');
        if (!group) return;
        const gates = [
            { name: "Gate A", x: 180, y: 130 },
            { name: "Gate B", x: 400, y: 90 },
            { name: "Gate C", x: 620, y: 130 },
            { name: "Gate D", x: 680, y: 220 },
            { name: "Gate E", x: 680, y: 380 },
            { name: "Gate F", x: 120, y: 220 },
            { name: "Gate G", x: 120, y: 380 },
            { name: "Gate H", x: 400, y: 510 }
        ];

        group.innerHTML = gates.map(g => `
            <g class="map-gate-node" transform="translate(${g.x}, ${g.y})">
                <rect x="-18" y="-7" width="36" height="14" rx="3" fill="var(--card-bg)" stroke="var(--primary)" stroke-width="1" />
                <text y="3" font-size="7" fill="var(--primary)" font-family="Rajdhani" text-anchor="middle" font-weight="bold">${g.name}</text>
            </g>
        `).join('');
    }

    function drawEmergencyExits() {
        const group = document.getElementById('emergencyExitNodesGroup');
        if (!group) return;
        const exits = [
            { id: "EX-1", x: 150, y: 100 },
            { id: "EX-2", x: 650, y: 100 },
            { id: "EX-3", x: 650, y: 500 },
            { id: "EX-4", x: 150, y: 500 }
        ];

        group.innerHTML = exits.map(ex => `
            <g class="map-exit-node" transform="translate(${ex.x}, ${ex.y})">
                <circle r="6" fill="var(--success)" />
                <rect x="-8" y="-8" width="16" height="16" fill="none" stroke="var(--success)" stroke-width="1" />
                <text y="3" font-size="8" fill="var(--success)" font-family="FontAwesome" text-anchor="middle">🚪</text>
            </g>
        `).join('');
    }

    function drawActiveAssets() {
        const group = document.getElementById('activeAssetsGroup');
        if (!group) return;

        // Drones, guards, police patrol positions
        group.innerHTML = `
            <!-- Guards -->
            <g id="asset-guard-1" class="patrol-guard" transform="translate(180, 160)">
                <circle r="5" fill="var(--primary)" />
                <text font-family="FontAwesome" font-size="8" y="2.5" text-anchor="middle" fill="#fff">👮</text>
            </g>
            <g id="asset-guard-2" class="patrol-guard" transform="translate(620, 160)">
                <circle r="5" fill="var(--primary)" />
                <text font-family="FontAwesome" font-size="8" y="2.5" text-anchor="middle" fill="#fff">👮</text>
            </g>
            <g id="asset-guard-3" class="patrol-guard" transform="translate(620, 440)">
                <circle r="5" fill="var(--primary)" />
                <text font-family="FontAwesome" font-size="8" y="2.5" text-anchor="middle" fill="#fff">👮</text>
            </g>
            <g id="asset-guard-4" class="patrol-guard" transform="translate(180, 440)">
                <circle r="5" fill="var(--primary)" />
                <text font-family="FontAwesome" font-size="8" y="2.5" text-anchor="middle" fill="#fff">👮</text>
            </g>

            <!-- Drones -->
            <g id="asset-drone-1" class="patrol-drone" transform="translate(400, 150)">
                <circle r="6" fill="var(--secondary)" />
                <text font-family="FontAwesome" font-size="8" y="2" text-anchor="middle" fill="#fff">🛸</text>
            </g>
            <g id="asset-drone-2" class="patrol-drone" transform="translate(300, 300)">
                <circle r="6" fill="var(--secondary)" />
                <text font-family="FontAwesome" font-size="8" y="2" text-anchor="middle" fill="#fff">🛸</text>
            </g>

            <!-- Emergency vehicle -->
            <g id="asset-vehicle-1" class="emergency-vehicle" transform="translate(500, 520)">
                <circle r="6" fill="var(--danger)" />
                <text font-family="FontAwesome" font-size="9" y="3" text-anchor="middle" fill="#fff">🚑</text>
            </g>
        `;
    }

    // Highlight timeline selection node on security map
    function highlightMapLocation(locationName) {
        const coords = MAP_COORDS[locationName];
        const highlightCircle = document.getElementById('timelineHighlightCircle');
        if (coords && highlightCircle) {
            highlightCircle.setAttribute('cx', coords.x);
            highlightCircle.setAttribute('cy', coords.y);
            highlightCircle.setAttribute('opacity', '1');
            highlightCircle.setAttribute('r', '30');

            // Scroll the map container smoothly if overflowed
            const mapWrapper = document.querySelector('.security-map-wrapper');
            if (mapWrapper) {
                mapWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Create toaster notification
            showToastMessage(`LOCATING: High alert node identified at ${locationName}`, "warning");
        }
    }

    // Helper Toast message
    function showToastMessage(msg, type = "info") {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.style.borderLeft = `4px solid ${type === 'warning' ? 'var(--warning)' : type === 'danger' ? 'var(--danger)' : 'var(--success)'}`;
        toast.innerHTML = `<strong>🛡️ Security Alert</strong><br>${msg}`;
        const tc = document.getElementById('toastContainer');
        if (tc) {
            tc.appendChild(toast);
            setTimeout(() => toast.remove(), 4000);
        }
    }

    // Toggle Heatmap Overlay
    if (toggleHeatmap) {
        toggleHeatmap.addEventListener('click', () => {
            const group = document.getElementById('heatmapNodesGroup');
            if (group) {
                const isHidden = group.getAttribute('opacity') === '0';
                group.setAttribute('opacity', isHidden ? '0.6' : '0');
                toggleHeatmap.classList.toggle('active');
            }
        });
    }

    // 4. Emergency Control Center Action Overrides
    document.querySelectorAll('.emerg-control-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            const desc = btn.getAttribute('data-desc');

            // Re-use confirm modal
            const overlay = document.getElementById('emergModalOverlay');
            const title = document.getElementById('modalTitle');
            const descEl = document.getElementById('modalDesc');

            if (overlay && title && descEl) {
                title.textContent = `CRITICAL OVERRIDE: ${action.toUpperCase()}`;
                descEl.textContent = desc;
                overlay.classList.remove('hidden');

                // Bind yes/no
                const yesBtn = document.getElementById('modalYes');
                const noBtn = document.getElementById('modalNo');

                const cleanHandlers = () => {
                    yesBtn.replaceWith(yesBtn.cloneNode(true));
                    noBtn.replaceWith(noBtn.cloneNode(true));
                };

                document.getElementById('modalYes').addEventListener('click', () => {
                    overlay.classList.add('hidden');
                    cleanHandlers();
                    triggerEmergencyAction(action);
                });

                document.getElementById('modalNo').addEventListener('click', () => {
                    overlay.classList.add('hidden');
                    cleanHandlers();
                });
            }
        });
    });

    function triggerEmergencyAction(action) {
        showToastMessage(`COMMAND INITIATED: ${action}`, "danger");

        // Add to timeline
        const now = new Date();
        const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        TIMELINE_DATA.unshift({
            time: timeString,
            desc: `EMERGENCY COMMAND: User initiated lock/evac mode [${action}]`,
            severity: "active",
            location: "South Gate",
            x: 400,
            y: 530
        });
        initIncidentTimeline();

        if (action === "Lock Stadium" || action === "Activate Evacuation") {
            document.body.classList.add('soc-emergency-active');
            // Sound alarm visual alert
            showToastMessage("GLOBAL STADIUM LOCKDOWN PROTOCOL ACTIVE", "danger");
        } else if (action === "Open Emergency Gates") {
            document.body.classList.remove('soc-emergency-active');
            showToastMessage("All emergency egress points forced open.", "success");
        }
    }

    // 5. Floating AI Recommendations typed updates
    let activeRecIndex = 0;
    function cycleRecommendations() {
        if (!advisorBody) return;
        const msg = RECOMMENDATIONS[activeRecIndex % RECOMMENDATIONS.length];

        advisorBody.innerHTML = '';
        let i = 0;
        const typeWriter = () => {
            if (i < msg.length) {
                advisorBody.innerHTML += msg.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        };
        typeWriter();
        activeRecIndex++;
    }

    // Initial and periodic cycles
    cycleRecommendations();
    setInterval(cycleRecommendations, 12000);

    // 6. Live Asset Path Animators & Video canvas rendering loop
    let tickTime = 0;
    function renderSecuritySOCFrame() {
        tickTime += 0.02;

        // A. Move Assets on Security Map
        const guard1 = document.getElementById('asset-guard-1');
        const guard2 = document.getElementById('asset-guard-2');
        const guard3 = document.getElementById('asset-guard-3');
        const guard4 = document.getElementById('asset-guard-4');
        const drone1 = document.getElementById('asset-drone-1');
        const drone2 = document.getElementById('asset-drone-2');
        const vehicle1 = document.getElementById('asset-vehicle-1');

        if (guard1) guard1.setAttribute('transform', `translate(${240 + Math.sin(tickTime * 0.5) * 60}, 160)`);
        if (guard2) guard2.setAttribute('transform', `translate(620, ${250 + Math.cos(tickTime * 0.4) * 60})`);
        if (guard3) guard3.setAttribute('transform', `translate(${450 + Math.sin(tickTime * 0.6) * 100}, 440)`);
        if (guard4) guard4.setAttribute('transform', `translate(180, ${300 + Math.sin(tickTime * 0.3) * 80})`);

        if (drone1) {
            const dx = 400 + Math.cos(tickTime) * 120;
            const dy = 300 + Math.sin(tickTime * 2) * 60;
            drone1.setAttribute('transform', `translate(${dx}, ${dy})`);
        }
        if (drone2) {
            const dx = 400 + Math.sin(tickTime * 0.7) * 200;
            const dy = 300 + Math.cos(tickTime * 0.7) * 120;
            drone2.setAttribute('transform', `translate(${dx}, ${dy})`);
        }
        if (vehicle1) {
            // Circle patrol
            const vx = 400 + Math.cos(tickTime * 0.2) * 310;
            const vy = 300 + Math.sin(tickTime * 0.2) * 200;
            vehicle1.setAttribute('transform', `translate(${vx}, ${vy})`);
        }

        // B. Render Canvas Feeds for active cameras
        CAMERAS_DATA.forEach(cam => {
            if (!cam.isOnline) return;
            const ctx = canvasContexts[cam.id];
            if (!ctx) return;

            // Clear frame
            ctx.clearRect(0, 0, 320, 180);

            // Draw background night-vision style shading
            ctx.fillStyle = cam.id === "CAM-12" ? "#031d0b" : "#020712";
            ctx.fillRect(0, 0, 320, 180);

            // Draw customized scenes to avoid empty boxes
            ctx.strokeStyle = cam.id === "CAM-12" ? "rgba(0,255,100,0.15)" : "rgba(0, 229, 255, 0.08)";
            ctx.lineWidth = 1;

            // Feed grids
            for (let x = 20; x < 320; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0); ctx.lineTo(x, 180);
                ctx.stroke();
            }
            for (let y = 20; y < 180; y += 30) {
                ctx.beginPath();
                ctx.moveTo(0, y); ctx.lineTo(320, y);
                ctx.stroke();
            }

            // Draw specific camera elements
            if (cam.id === "CAM-01") { // Perimeter Breach
                // Draw Fence
                ctx.strokeStyle = "rgba(255,255,255,0.2)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(10, 150); ctx.lineTo(310, 150);
                ctx.stroke();

                // Silhouette
                const sx = 100 + (tickTime * 20) % 120;
                ctx.fillStyle = "rgba(0, 229, 255, 0.6)";
                ctx.beginPath();
                ctx.arc(sx, 120, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(sx - 3, 126, 6, 18);

                // Pulsing alert bounding box
                ctx.strokeStyle = "var(--danger)";
                ctx.lineWidth = 1.5;
                ctx.strokeRect(sx - 12, 110, 24, 38);

                ctx.fillStyle = "var(--danger)";
                ctx.font = "8px Orbitron";
                ctx.fillText("BREACH ALERT [98.2%]", sx - 12, 105);
            }
            else if (cam.id === "CAM-02") { // Turnstiles
                ctx.strokeStyle = "#555";
                ctx.strokeRect(40, 50, 240, 80);
                // Draw circles pushing through
                for (let k = 0; k < 6; k++) {
                    const cx = 80 + k * 35 + Math.sin(tickTime + k) * 5;
                    const cy = 90 + Math.cos(tickTime + k) * 4;
                    ctx.fillStyle = "var(--success)";
                    ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
                    ctx.strokeStyle = "var(--success)";
                    ctx.strokeRect(cx - 7, cy - 7, 14, 25);
                }
            }
            else if (cam.id === "CAM-03") { // VIP Lobby
                ctx.strokeStyle = "rgba(255, 220, 0, 0.3)";
                ctx.strokeRect(60, 40, 200, 100);

                // Suspicious Object
                ctx.fillStyle = "var(--warning)";
                ctx.fillRect(150, 120, 12, 10);
                ctx.strokeStyle = "var(--warning)";
                ctx.strokeRect(145, 112, 22, 22);
                ctx.font = "6px Orbitron";
                ctx.fillText("OBJECT FLAG", 140, 107);
            }
            else if (cam.id === "CAM-04") { // Parking North
                ctx.strokeStyle = "#333";
                ctx.beginPath();
                ctx.moveTo(0, 90); ctx.lineTo(320, 90);
                ctx.stroke();

                // Drawing moving vehicle rectangle
                const vx = 40 + (tickTime * 15) % 240;
                ctx.fillStyle = "rgba(0, 184, 255, 0.4)";
                ctx.fillRect(vx, 75, 30, 16);
                ctx.strokeStyle = "var(--primary)";
                ctx.strokeRect(vx - 2, 73, 34, 20);
                ctx.font = "6px Orbitron";
                ctx.fillStyle = "var(--primary)";
                ctx.fillText("VEHICLE SCAN", vx - 2, 69);
            }
            else if (cam.id === "CAM-07") { // Server Room Smoke
                // Green status lights
                for (let r = 0; r < 4; r++) {
                    for (let c = 0; c < 3; c++) {
                        const pulseColor = (Math.random() > 0.9) ? "var(--danger)" : "var(--success)";
                        ctx.fillStyle = pulseColor;
                        ctx.beginPath();
                        ctx.arc(80 + r * 60, 50 + c * 30, 2.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                // Draw flashing override box
                if (Math.floor(tickTime * 2) % 2 === 0) {
                    ctx.strokeStyle = "var(--danger)";
                    ctx.strokeRect(5, 5, 310, 170);
                    ctx.fillStyle = "var(--danger)";
                    ctx.font = "10px Orbitron";
                    ctx.fillText("THERMAL EXCEEDED", 100, 25);
                }
            }
            else if (cam.id === "CAM-12") { // Skycam Nightvision
                // Draw sweeps & crosshair
                ctx.strokeStyle = "rgba(0,255,100,0.4)";
                ctx.beginPath();
                ctx.arc(160, 90, 60 + Math.sin(tickTime) * 10, 0, Math.PI * 2);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(160, 20); ctx.lineTo(160, 160);
                ctx.moveTo(80, 90); ctx.lineTo(240, 90);
                ctx.stroke();

                ctx.font = "8px monospace";
                ctx.fillStyle = "rgba(0,255,100,0.8)";
                ctx.fillText(`ALT: ${(220 + Math.sin(tickTime) * 5).toFixed(1)} M`, 20, 30);
                ctx.fillText("SYS: GNSS ACTIVE", 20, 42);
            }
            else { // Default placeholder patterns
                ctx.fillStyle = "rgba(255,255,255,0.05)";
                ctx.fillRect(100 + Math.sin(tickTime) * 20, 60, 120, 60);
                ctx.font = "8px monospace";
                ctx.fillText("AI TELEMETRY OPTIMAL", 110, 95);
            }

            // Fluctuating FPS count
            const fpsEl = document.getElementById(`fps-${cam.id}`);
            if (fpsEl && Math.random() > 0.95) {
                const diff = (Math.random() * 0.6 - 0.3).toFixed(1);
                fpsEl.textContent = `${(parseFloat(cam.fps) + parseFloat(diff)).toFixed(1)} FPS`;
            }
        });

        // Loop next frame
        requestAnimationFrame(renderSecuritySOCFrame);
    }

    // 7. Initialization Exec
    initCCTVGrid();
    initThreatCards();
    initIncidentTimeline();
    initPersonnelCounters();
    initAnalyticsList();
    initSOCMetrics();
    initSecurityMap();
    requestAnimationFrame(renderSecuritySOCFrame);

    // Minor status simulation intervals (random increments)
    setInterval(() => {
        // Change counters randomly
        Object.keys(PERSONNEL_COUNTS).forEach(key => {
            const item = PERSONNEL_COUNTS[key];
            const el = document.getElementById(`count-${key}`);
            if (el && Math.random() > 0.7) {
                const diff = Math.random() > 0.5 ? 1 : -1;
                if (item.val + diff >= 0 && item.val + diff <= item.max) {
                    item.val += diff;
                    el.textContent = item.val;
                }
            }
        });
    }, 4000);


    // Seat Map & Booking Logic
    const seatMap = document.getElementById('interactiveSeatMap');
    const checkoutPanel = document.getElementById('bookingCheckoutPanel');
    const selectedSeatCount = document.getElementById('selectedSeatCount');
    const totalPriceDisplay = document.getElementById('totalPrice');
    const confirmBtn = document.getElementById('confirmBookingBtn');

    let selectedSeats = [];

    // Base prices in Rupees
    const PRICES = { standard: 4500, premium: 9800, vip: 35000 };

    if (seatMap) {
        let seatHtml = '<div class="stage-area">PITCH</div>';
        for (let r = 0; r < 6; r++) {
            seatHtml += '<div class="seat-row">';
            for (let c = 0; c < 18; c++) {
                let sClass = 'standard';
                if (Math.random() > 0.7) sClass = 'taken';
                else if (r < 2) sClass = 'vip';
                else if (r < 4) sClass = 'premium';

                seatHtml += `<div class="seat ${sClass}" data-type="${sClass}"></div>`;
            }
            seatHtml += '</div>';
        }
        seatMap.innerHTML = seatHtml;

        // Interactive clicking
        seatMap.addEventListener('click', (e) => {
            if (e.target.classList.contains('seat') && !e.target.classList.contains('taken')) {
                e.target.classList.toggle('selected');
                updateBookingSummary();
            }
        });
    }

    function updateBookingSummary() {
        const selected = document.querySelectorAll('.seat.selected');
        selectedSeats = Array.from(selected);

        if (selectedSeats.length > 0) {
            checkoutPanel.style.display = 'block';
        } else {
            checkoutPanel.style.display = 'none';
        }

        let total = 0;
        selectedSeats.forEach(seat => {
            const type = seat.getAttribute('data-type');
            if (PRICES[type]) total += PRICES[type];
            else total += PRICES.standard; // default fallback
        });

        if (selectedSeatCount) selectedSeatCount.textContent = selectedSeats.length;
        if (totalPriceDisplay) totalPriceDisplay.textContent = '₹' + total.toLocaleString('en-IN');
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            alert('Successfully booked ' + selectedSeats.length + ' seats for ' + totalPriceDisplay.textContent);
            // Mark them as taken
            selectedSeats.forEach(seat => {
                seat.classList.remove('selected');
                seat.classList.add('taken');
            });
            updateBookingSummary();
        });
    }

    // Weather Forecast
    const hourlyWeather = document.getElementById('hourlyForecast');
    if (hourlyWeather) {
        const hours = [
            { t: '18:00', icon: 'fa-cloud-sun', temp: 30, rain: '5%' },
            { t: '19:00', icon: 'fa-sun', temp: 29, rain: '2%' },
            { t: '20:00', icon: 'fa-moon', temp: 27, rain: '3%' },
            { t: '21:00', icon: 'fa-cloud-moon', temp: 25, rain: '10%' },
            { t: '22:00', icon: 'fa-cloud-rain', temp: 23, rain: '55%' },
            { t: '23:00', icon: 'fa-cloud-showers-heavy', temp: 21, rain: '70%' },
            { t: '00:00', icon: 'fa-cloud-rain', temp: 19, rain: '40%' },
            { t: '01:00', icon: 'fa-cloud', temp: 18, rain: '15%' },
        ];
        hourlyWeather.innerHTML = hours.map(h => `
            <div class="hourly-card">
                <div class="h-time">${h.t}</div>
                <i class="fa-solid ${h.icon}"></i>
                <div class="h-temp">${h.temp}°C</div>
                <div class="h-rain text-small" style="color:var(--info)">${h.rain} 🌧</div>
            </div>
        `).join('');
    }

    // Weather 7-day extended forecast (if container exists)
    const weatherDash = document.querySelector('.weather-dashboard');
    if (weatherDash && !document.getElementById('sevenDayForecast')) {
        const ext = document.createElement('section');
        ext.className = 'glass-card weather-timeline';
        ext.style.marginTop = '1.5rem';
        ext.innerHTML = `
        <div class="panel-header">
            <h2><i class="fa-solid fa-calendar-days neon-text"></i> 7-Day Forecast</h2>
        </div>
        <div id="sevenDayForecast" class="hourly-forecast-row"></div>`;
        weatherDash.appendChild(ext);

        const days = [
            { d: 'Today', icon: 'fa-cloud-moon', hi: 30, lo: 18, cond: 'Rain tonight' },
            { d: 'Wed', icon: 'fa-cloud-sun', hi: 32, lo: 21, cond: 'Partly cloudy' },
            { d: 'Thu', icon: 'fa-sun', hi: 34, lo: 23, cond: 'Sunny' },
            { d: 'Fri', icon: 'fa-cloud-showers-heavy', hi: 27, lo: 19, cond: 'Heavy rain' },
            { d: 'Sat', icon: 'fa-cloud', hi: 28, lo: 20, cond: 'Overcast' },
            { d: 'Sun', icon: 'fa-sun', hi: 33, lo: 22, cond: 'Sunny' },
            { d: 'Mon', icon: 'fa-cloud-sun', hi: 31, lo: 21, cond: 'Partly cloudy' },
        ];
        document.getElementById('sevenDayForecast').innerHTML = days.map(d => `
            <div class="hourly-card" style="min-width:120px;">
                <div class="h-time" style="font-weight:600">${d.d}</div>
                <i class="fa-solid ${d.icon}"></i>
                <div class="h-temp">${d.hi}°<span class="text-muted" style="font-size:0.85rem">/${d.lo}°</span></div>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:5px">${d.cond}</div>
            </div>
        `).join('');

        // Impact box
        const impact = document.createElement('section');
        impact.className = 'glass-card weather-timeline';
        impact.style.marginTop = '1.5rem';
        impact.innerHTML = `
        <div class="panel-header">
            <h2><i class="fa-solid fa-bolt neon-text"></i> Event Impact Analysis</h2>
        </div>
        <div style="padding: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="insight-card cyber-border">
                <div class="insight-header"><span class="insight-title">Attendance Impact</span><span class="badge badge-warning">MODERATE</span></div>
                <p style="font-size:0.9rem; margin-top:8px;">Rain expected after 22:00. Predicted 8% earlier exits. Open covered walkways.</p>
            </div>
            <div class="insight-card cyber-border">
                <div class="insight-header"><span class="insight-title">Roof Status</span><span class="badge badge-success">OPEN</span></div>
                <p style="font-size:0.9rem; margin-top:8px;">Retractable roof set to auto-close at rain probability > 60%.</p>
            </div>
            <div class="insight-card cyber-border">
                <div class="insight-header"><span class="insight-title">Wind Speed</span><span class="badge badge-success">SAFE</span></div>
                <p style="font-size:0.9rem; margin-top:8px;">12 km/h — Safe for displays & drone ops.</p>
            </div>
            <div class="insight-card cyber-border">
                <div class="insight-header"><span class="insight-title">Lightning Risk</span><span class="badge badge-success">NONE</span></div>
                <p style="font-size:0.9rem; margin-top:8px;">No storm cells detected within 50 km radius.</p>
            </div>
        </div>`;
        weatherDash.appendChild(impact);
    }

    // Pricing Tiers
    const pricing = document.getElementById('pricingTiers');
    if (pricing) {
        const tiers = [
            { name: 'Standard', zone: 'Upper Tiers (Rows 20–40)', price: '4,500', icon: 'fa-ticket', border: '', avail: 1240 },
            { name: 'Premium', zone: 'Lower Tiers (Rows 5–19)', price: '9,800', icon: 'fa-star', border: '', avail: 320 },
            { name: 'VIP Field', zone: 'Pitch Side + Hospitality Lounge', price: '35,000', icon: 'fa-crown', border: 'border-color: var(--warning);', avail: 48 },
        ];
        pricing.innerHTML = tiers.map(t => `
            <div class="tier-card" style="${t.border}">
                <div>
                    <h4><i class="fa-solid ${t.icon}" style="margin-right:6px; color:var(--primary)"></i>${t.name}</h4>
                    <span style="font-size:0.85rem; color: var(--text-muted)">${t.zone}</span><br>
                    <span class="text-small text-success"><i class="fa-solid fa-circle-check"></i> ${t.avail} seats available</span>
                </div>
                <div style="text-align:right">
                    <div class="price">₹${t.price}</div>
                    <span class="text-small text-muted">per seat</span>
                </div>
            </div>
        `).join('');
    }

    /* ============================================================
       MODULE XI — CROWD ANALYTICS
    ============================================================ */

    // Crowd KPI Cards
    const crowdKpiGrid = document.getElementById('crowdKpiGrid');
    if (crowdKpiGrid) {
        const kpis = [
            { icon: 'fa-users', color: 'text-primary', label: 'Current Crowd', val: '84,250', sub: '↑ 4.5% vs last event', subColor: 'text-success' },
            { icon: 'fa-person-walking-arrow-right', color: 'text-secondary', label: 'Entry Rate', val: '1,240/min', sub: '↑ Peak hour active', subColor: 'text-warning' },
            { icon: 'fa-door-closed', color: 'text-warning', label: 'Exit Rate', val: '340/min', sub: 'Below average', subColor: 'text-success' },
            { icon: 'fa-gauge-high', color: 'text-danger', label: 'Crowd Density', val: '93%', sub: '⚠ Near capacity', subColor: 'text-danger' },
            { icon: 'fa-clock', color: 'text-success', label: 'Avg Wait Time', val: '4.2 min', sub: 'Gate 12 has 8 min', subColor: 'text-warning' },
            { icon: 'fa-face-smile', color: 'text-primary', label: 'Sentiment Score', val: '87%', sub: '😊 Positive', subColor: 'text-success' },
        ];
        crowdKpiGrid.innerHTML = kpis.map(k => `
            <div class="kpi-card glass-card fade-in">
                <div class="kpi-icon ${k.color}"><i class="fa-solid ${k.icon}"></i></div>
                <div class="kpi-info">
                    <h3>${k.label}</h3>
                    <div class="kpi-value">${k.val}</div>
                    <p class="kpi-desc ${k.subColor}">${k.sub}</p>
                </div>
            </div>
        `).join('');
    }

    // Crowd Bar Chart (hourly attendance)
    const crowdBarChart = document.getElementById('crowdBarChart');
    if (crowdBarChart) {
        const hourData = [
            { h: '14:00', v: 12000 }, { h: '15:00', v: 28000 }, { h: '16:00', v: 45000 },
            { h: '17:00', v: 61000 }, { h: '18:00', v: 74000 }, { h: '19:00', v: 84250 },
            { h: '20:00', v: 87000 }, { h: '21:00', v: 82000 }, { h: '22:00', v: 65000 },
        ];
        const max = 90000;
        crowdBarChart.innerHTML = `
            <div class="crowd-chart-inner">
                ${hourData.map(d => `
                    <div class="crowd-chart-col">
                        <div class="crowd-chart-bar-wrap" title="${d.h}: ${d.v.toLocaleString('en-IN')}">
                            <div class="crowd-chart-bar" style="height: ${Math.round((d.v / max) * 100)}%">
                                <span class="bar-val">${(d.v / 1000).toFixed(0)}K</span>
                            </div>
                        </div>
                        <div class="bar-label">${d.h}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Demographics rings
    const demoRings = document.getElementById('demoRings');
    if (demoRings) {
        const demos = [
            { label: 'Male', pct: 62, color: 'var(--primary)' },
            { label: 'Female', pct: 31, color: 'var(--secondary)' },
            { label: 'Youth (<18)', pct: 7, color: 'var(--success)' },
        ];
        const ageGroups = [
            { label: '18–25', pct: 28, color: 'var(--primary)' },
            { label: '26–35', pct: 35, color: 'var(--secondary)' },
            { label: '36–50', pct: 25, color: 'var(--success)' },
            { label: '50+', pct: 12, color: 'var(--warning)' },
        ];
        demoRings.innerHTML = `
            <div style="padding: 15px;">
                <h5 style="color:var(--text-muted); margin-bottom:12px;">Gender Distribution</h5>
                ${demos.map(d => `
                    <div style="margin-bottom: 12px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <span>${d.label}</span><span style="color:${d.color}; font-weight:600">${d.pct}%</span>
                        </div>
                        <div class="progress-track">
                            <div class="progress-fill js-progress" style="width:${d.pct}%; background:${d.color}; height:8px; border-radius:4px; transition: width 1.5s ease;"></div>
                        </div>
                    </div>
                `).join('')}
                <h5 style="color:var(--text-muted); margin: 18px 0 12px;">Age Groups</h5>
                ${ageGroups.map(d => `
                    <div style="margin-bottom: 12px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <span>${d.label}</span><span style="color:${d.color}; font-weight:600">${d.pct}%</span>
                        </div>
                        <div class="progress-track">
                            <div class="progress-fill js-progress" style="width:${d.pct}%; background:${d.color}; height:8px; border-radius:4px; transition: width 1.5s ease;"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Gate Pressure
    const gatePressureList = document.getElementById('gatePressureList');
    if (gatePressureList) {
        const gates = [
            { name: 'Gate 1 (Main)', flow: 95, status: 'danger' },
            { name: 'Gate 4 (East)', flow: 78, status: 'warning' },
            { name: 'Gate 8 (South)', flow: 60, status: '' },
            { name: 'Gate 12 (North)', flow: 88, status: 'warning' },
            { name: 'Gate 16 (West)', flow: 35, status: '' },
            { name: 'Gate 24 (VIP)', flow: 100, status: 'danger' },
        ];
        gatePressureList.innerHTML = `<div style="padding:15px;">` + gates.map(g => `
            <div style="margin-bottom:14px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>${g.name}</span>
                    <span class="${g.status === 'danger' ? 'text-danger' : g.status === 'warning' ? 'text-warning' : 'text-success'}" style="font-weight:600">${g.flow}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width:${g.flow}%; background:${g.status === 'danger' ? 'var(--danger)' : g.status === 'warning' ? 'var(--warning)' : 'var(--success)'}; height:10px; border-radius:5px; transition: width 1.5s ease;"></div>
                </div>
            </div>
        `).join('') + `</div>`;
    }

    // Social Sentiment Feed
    const sentimentContainer = document.getElementById('sentimentContainer');
    if (sentimentContainer) {
        const tweets = [
            { user: '@RajFan2026', text: 'Incredible atmosphere at the stadium tonight! 🔥🏟️ #StadiumOS', mood: '😊', color: 'text-success' },
            { user: '@PriyaK', text: 'Gate 12 queue is too long, need more staff here! #Crowd', mood: '😤', color: 'text-warning' },
            { user: '@SportsBuzz', text: 'The floodlights and audio are absolutely next level! 👏', mood: '😍', color: 'text-primary' },
            { user: '@ViralBharat', text: 'Parking Zone B is completely full. Go to Zone C! 🚗', mood: '⚠️', color: 'text-warning' },
            { user: '@AnonymousFan', text: 'Food service is amazingly fast today. 5 stars! ⭐⭐⭐⭐⭐', mood: '😊', color: 'text-success' },
        ];
        let si = 0;
        const renderTweet = () => {
            const t = tweets[si % tweets.length];
            const div = document.createElement('div');
            div.className = 'sentiment-card';
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <strong style="color: var(--primary)">${t.user}</strong>
                    <span style="font-size:1.2rem">${t.mood}</span>
                </div>
                <p style="font-size:0.9rem; color: var(--text-muted)">${t.text}</p>
            `;
            sentimentContainer.prepend(div);
            if (sentimentContainer.children.length > 5) sentimentContainer.removeChild(sentimentContainer.lastChild);
            si++;
        };
        renderTweet();
        setInterval(renderTweet, 4000);
    }

    // Zone Crowd Density
    const crowdZoneDensity = document.getElementById('crowdZoneDensity');
    if (crowdZoneDensity) {
        const zones = [
            { name: 'North Stand', pct: 82, risk: 'Low', rc: 'text-success' },
            { name: 'South Stand', pct: 91, risk: 'Medium', rc: 'text-warning' },
            { name: 'East Stand', pct: 87, risk: 'Medium', rc: 'text-warning' },
            { name: 'West Stand', pct: 74, risk: 'Low', rc: 'text-success' },
            { name: 'VIP Zone', pct: 100, risk: 'Full', rc: 'text-danger' },
            { name: 'Food Court', pct: 68, risk: 'Normal', rc: 'text-success' },
        ];
        crowdZoneDensity.innerHTML = `<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:15px;">` +
            zones.map(z => {
                const bg = z.pct > 90 ? 'var(--danger)' : z.pct > 80 ? 'var(--warning)' : 'var(--success)';
                return `<div class="glass-card" style="padding:15px; background:rgba(255,255,255,0.03);">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <strong>${z.name}</strong>
                        <span class="${z.rc}">${z.risk}</span>
                    </div>
                    <div style="font-size:1.8rem; font-weight:800; color:${bg}; margin-bottom:8px;">${z.pct}%</div>
                    <div class="progress-track">
                        <div style="width:${z.pct}%; background:${bg}; height:6px; border-radius:3px; transition: width 1.5s ease;"></div>
                    </div>
                </div>`;
            }).join('') + `</div>`;
    }

    // AI Crowd Predictions
    const crowdPredictions = document.getElementById('crowdPredictions');
    if (crowdPredictions) {
        const preds = [
            { time: 'Next 15 min', icon: 'fa-arrow-trend-up', color: 'text-warning', msg: 'Crowd surge expected at North Stand +2,400 people', conf: '96%' },
            { time: 'Next 30 min', icon: 'fa-triangle-exclamation', color: 'text-danger', msg: 'Gate 12 risk of overcrowding — recommend opening Gate 13', conf: '91%' },
            { time: 'Halftime', icon: 'fa-utensils', color: 'text-primary', msg: 'Food court expected to peak at 85% — activate Counter 6', conf: '98%' },
            { time: 'Post Match', icon: 'fa-car', color: 'text-success', msg: 'Mass exit predicted — activate overflow Parking Zone C & D', conf: '99%' },
        ];
        crowdPredictions.innerHTML = `<div style="padding:15px; display:flex; flex-direction:column; gap:12px;">` +
            preds.map(p => `
                <div class="incident-item" style="border-left-color: ${p.color.includes('danger') ? 'var(--danger)' : p.color.includes('warning') ? 'var(--warning)' : 'var(--primary)'}; background: rgba(255,255,255,0.02);">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span class="${p.color}"><i class="fa-solid ${p.icon}"></i> ${p.time}</span>
                        <span class="badge-status status-ok">${p.conf} confidence</span>
                    </div>
                    <div style="font-size:0.9rem">${p.msg}</div>
                </div>
            `).join('') + `</div>`;
    }

    // Confirm Booking — use toast instead of alert
    if (confirmBtn) {
        confirmBtn.removeEventListener('click', confirmBtn._handler);
        const handler = () => {
            if (selectedSeats.length === 0) return;
            const cnt = selectedSeats.length;
            const price = totalPriceDisplay.textContent;
            selectedSeats.forEach(seat => {
                seat.classList.remove('selected');
                seat.classList.add('taken');
            });
            updateBookingSummary();
            // Show toast
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.style.borderLeftColor = 'var(--success)';
            toast.innerHTML = `<strong>✅ Booking Confirmed!</strong><br>${cnt} seat(s) booked for ${price}. Check your email for ticket.`;
            const tc = document.getElementById('toastContainer');
            if (tc) { tc.appendChild(toast); setTimeout(() => toast.remove(), 5000); }
        };
        confirmBtn._handler = handler;
        confirmBtn.addEventListener('click', handler);
    }

});
async function loadDashboard() {
    try {
        const response = await fetch("http://localhost:5000/api/dashboard");
        const data = await response.json();

        console.log(data);

        document.getElementById("visitors").innerText =
            data.visitors.toLocaleString();

        document.getElementById("occupancy").innerText =
            data.occupancy + "%";

        document.getElementById("parking").innerText =
            data.parking;

        document.getElementById("alerts").innerText =
            data.alerts;

        document.getElementById("revenue").innerText =
            "₹" + data.revenue.toLocaleString();

    } catch (err) {
        console.error(err);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});
