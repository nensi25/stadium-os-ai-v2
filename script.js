/**
 * StadiumOS AI — script.js
 * Modular Vanilla JavaScript for the premium enterprise dashboard.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       MODULE 1 — SIDEBAR TOGGLE
    ============================================================ */
    const sidebar        = document.getElementById('sidebar');
    const sidebarOpenBtn = document.getElementById('sidebarOpenBtn');
    const sidebarCloseBtn= document.getElementById('sidebarCloseBtn');

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
    const viewSections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Remove active from all nav items
            document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
            
            // Add active to current
            this.parentElement.classList.add('active');
            
            // Routing
            const targetView = this.getAttribute('data-view');
            if(targetView) {
                viewSections.forEach(sec => {
                    sec.classList.remove('active');
                    sec.classList.add('hidden');
                });
                
                const activeSec = document.getElementById('view-' + targetView);
                if(activeSec) {
                    activeSec.classList.remove('hidden');
                    activeSec.classList.add('active');
                }
            }
        });
    });


    /* ============================================================
       MODULE 2 — LIVE CLOCK & DATE
    ============================================================ */
    const elDay  = document.getElementById('currentDay');
    const elDate = document.getElementById('currentDateFull');
    const elTime = document.getElementById('liveTimeDigital');

    const DAYS   = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

    function pad(n) { return String(n).padStart(2, '0'); }

    function updateClock() {
        const now = new Date();
        if (elDay)  elDay.textContent  = DAYS[now.getDay()];
        if (elDate) elDate.textContent = `${pad(now.getDate())} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
        if (elTime) elTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    /* ============================================================
       MODULE 3 — NOTIFICATION POPUP
    ============================================================ */
    const notificationBtn   = document.getElementById('notificationBtn');
    const notificationPopup = document.getElementById('notificationPopup');
    const notifBadge        = document.getElementById('notifBadge');

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
    const profileBtn      = document.getElementById('profileBtn');
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
                    document.documentElement.requestFullscreen().catch(() => {});
                    btn.querySelector('i').className = 'fa-solid fa-compress';
                } else {
                    document.exitFullscreen().catch(() => {});
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
                searchInput.style.boxShadow  = '0 0 15px rgba(0,255,153,0.4)';
                setTimeout(() => {
                    searchInput.style.borderColor = '';
                    searchInput.style.boxShadow   = '';
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
        let current  = 0;
        const step   = target / 60;
        const tick   = () => {
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
        if      (r > 0.92) el.style.backgroundColor = 'var(--danger)';
        else if (r > 0.78) el.style.backgroundColor = '#FF7B00';
        else if (r > 0.48) el.style.backgroundColor = 'var(--warning)';
        else if (r > 0.18) el.style.backgroundColor = 'var(--success)';
        else               el.style.backgroundColor = 'rgba(255,255,255,0.04)';
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
    const revenueChart  = document.getElementById('revenueChart');
    const revenueLabels = document.getElementById('revenueLabels');

    function initChart() {
        if (!revenueChart) return;
        revenueChart.innerHTML  = '';
        revenueLabels.innerHTML = '';
        const data = [
            { time: '18:00', pct: 40, label: '$600k' },
            { time: '19:00', pct: 65, label: '$975k' },
            { time: '20:00', pct: 50, label: '$750k' },
            { time: '21:00', pct: 85, label: '$1.2M' },
            { time: '22:00', pct: 100, label: '$1.5M' }
        ];
        data.forEach((d, i) => {
            const bar   = document.createElement('div');
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
        { name:'A1', fixed: null }, { name:'A2', fixed: null },
        { name:'B1', fixed: null }, { name:'B2', fixed: null },
        { name:'C1', fixed: null }, { name:'VIP', fixed:'limit' },
        { name:'STAFF', fixed:'avail' }, { name:'EV', fixed: null }
    ];
    const TYPES = ['avail','limit','full'];
    const TXTS  = ['AVAILABLE','LIMITED','FULL'];

    function renderParking() {
        if (!parkingGrid) return;
        parkingGrid.innerHTML = '';
        ZONES.forEach(z => {
            const slot = document.createElement('div');
            let type, txt;
            if (z.fixed) {
                type = z.fixed;
                txt  = z.fixed === 'avail' ? 'AVAILABLE' : 'RESERVED';
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
    const kpiAlerts          = document.getElementById('kpiAlerts');

    let activeAlerts = [
        { type:'danger',  icon:'fa-triangle-exclamation', title:'Unauthorized Access Attempt', desc:'Gate 4 — VIP Section. Security dispatched.',        time:'Just now' },
        { type:'warning', icon:'fa-fire',                 title:'High Temp Detected',          desc:'Server Room 3. Cooling system check required.',      time:'2m ago' },
        { type:'success', icon:'fa-check-double',         title:'Perimeter Secured',           desc:'All exterior checkpoints reporting normal.',          time:'15m ago' }
    ];

    const NEW_ALERTS = [
        { type:'warning', icon:'fa-people-arrows',  title:'Crowd Density High',   desc:'Sector B Concourse approaching density limits.'   },
        { type:'danger',  icon:'fa-bolt',            title:'Power Fluctuation',    desc:'Grid 2 voltage drop. Auto-switching to backup.'   },
        { type:'success', icon:'fa-shield-check',   title:'System Optimised',     desc:'AI successfully re-routed network traffic.'       },
        { type:'danger',  icon:'fa-video-slash',    title:'Camera 04 Offline',    desc:'CCTV feed lost. Maintenance team dispatched.'     },
        { type:'warning', icon:'fa-car-burst',      title:'Parking Incident',     desc:'Zone A3 minor collision. Medics en route.'        }
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
        { time:'19:42:15', desc:'AI auto-adjusted climate control (Sector A)', status:'OK',   code:'status-ok'  },
        { time:'19:35:00', desc:'Payment gateway sync completed',                status:'OK',   code:'status-ok'  },
        { time:'19:28:44', desc:'Turnstile 12 malfunction detected',             status:'WARN', code:'status-warn' },
        { time:'19:15:10', desc:'Facial Rec: banned individual flagged at Gate 4',status:'ERR', code:'status-err'  }
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
            let cur = parseInt(liveCrowdVal.textContent.replace(/,/g,''));
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
            const now  = new Date();
            const ts   = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
            activeAlerts.unshift({ ...pick, time: 'Just now' });
            if (activeAlerts.length > 5) activeAlerts.pop();
            renderAlerts();
            shakeBell();

            // Update notification badge
            const cur = parseInt(notifBadge.textContent) || 0;
            notifBadge.textContent = cur + 1;
            notifBadge.style.background = 'var(--danger)';

            // Add to activity log
            const sMap = { danger:'ERR', warning:'WARN', success:'OK' };
            const cMap = { danger:'status-err', warning:'status-warn', success:'status-ok' };
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
        { temp:'18°C', cond:'Clear Night',   hum:'45%', wind:'12 km/h', rain:'5%'  },
        { temp:'17°C', cond:'Partly Cloudy', hum:'52%', wind:'18 km/h', rain:'15%' },
        { temp:'19°C', cond:'Breezy',        hum:'40%', wind:'24 km/h', rain:'8%'  }
    ];

    setInterval(() => {
        const d = weatherData[Math.floor(Math.random() * weatherData.length)];
        const tEl  = document.querySelector('.temp .deg');
        const cEl  = document.querySelector('.temp .cond');
        const humEl= document.getElementById('wHum');
        const wdEl = document.getElementById('wWind');
        const rEl  = document.getElementById('wRain');
        if (tEl)  tEl.textContent  = d.temp;
        if (cEl)  cEl.textContent  = d.cond;
        if (humEl)humEl.textContent= 'Humidity: ' + d.hum;
        if (wdEl) wdEl.textContent = 'Wind: '     + d.wind;
        if (rEl)  rEl.textContent  = 'Rain Prob: '+ d.rain;
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
        chatHistory.insertBefore(bubble, typingIndicator);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Show toast for specific events
    function showCopilotToast(msg, type='info') {
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
    if(parkingMap) {
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

        if(closeZoneDetailsBtn) {
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
                for(let i = 0; i < 40; i++) {
                    const isTaken = Math.random() > 0.4;
                    html += `<div class="spot car-spot ${isTaken ? 'taken' : 'empty'}"></div>`;
                }
                html += '</div>';

                // 2-Wheeler Spots (small rounded boxes)
                html += '<h4 class="mt-3">2-Wheeler Parking</h4><div class="spot-group bike-spots">';
                for(let i = 0; i < 60; i++) {
                    const isTaken = Math.random() > 0.3;
                    html += `<div class="spot bike-spot ${isTaken ? 'taken' : 'empty'}"></div>`;
                }
                html += '</div>';

                // Cab/Auto Spots (different color)
                html += '<h4 class="mt-3">Cab / Auto Drop-off</h4><div class="spot-group cab-spots">';
                for(let i = 0; i < 15; i++) {
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

    // Camera Grid
    const camGrid = document.getElementById('securityCameraGrid');
    if(camGrid) {
        let html = '';
        for(let i=1; i<=6; i++) {
            html += `<div class="cam-feed">
                <div class="cam-overlay">
                    <span>CAM-0${i}</span>
                    ${i === 2 ? '<span class="rec-dot">● REC</span>' : ''}
                </div>
            </div>`;
        }
        camGrid.innerHTML = html;
    }

    // Incident Log
    const incidentLog = document.getElementById('incidentLogList');
    if(incidentLog) {
        incidentLog.innerHTML = `
            <div class="incident-item high">
                <div class="incident-time">19:42:10</div>
                <div class="incident-title">Unidentified bag near Gate 4</div>
                <div class="text-small">Security dispatched.</div>
            </div>
            <div class="incident-item medium">
                <div class="incident-time">19:35:00</div>
                <div class="incident-title">Crowd surge at North Entrance</div>
                <div class="text-small">Redirecting to East Entrance.</div>
            </div>
            <div class="incident-item">
                <div class="incident-time">19:15:22</div>
                <div class="incident-title">Routine Patrol Completed - Sector B</div>
                <div class="text-small">All clear.</div>
            </div>
        `;
    }

    // Seat Map & Booking Logic
    const seatMap = document.getElementById('interactiveSeatMap');
    const checkoutPanel = document.getElementById('bookingCheckoutPanel');
    const selectedSeatCount = document.getElementById('selectedSeatCount');
    const totalPriceDisplay = document.getElementById('totalPrice');
    const confirmBtn = document.getElementById('confirmBookingBtn');

    let selectedSeats = [];
    
    // Base prices in Rupees
    const PRICES = { standard: 4500, premium: 9800, vip: 35000 };

    if(seatMap) {
        let seatHtml = '<div class="stage-area">PITCH</div>';
        for(let r=0; r<6; r++) {
            seatHtml += '<div class="seat-row">';
            for(let c=0; c<18; c++) {
                let sClass = 'standard';
                if(Math.random() > 0.7) sClass = 'taken';
                else if(r < 2) sClass = 'vip';
                else if(r < 4) sClass = 'premium';
                
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
        
        if(selectedSeats.length > 0) {
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

        if(selectedSeatCount) selectedSeatCount.textContent = selectedSeats.length;
        if(totalPriceDisplay) totalPriceDisplay.textContent = '₹' + total.toLocaleString('en-IN');
    }

    if(confirmBtn) {
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
    if(hourlyWeather) {
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
    if(weatherDash && !document.getElementById('sevenDayForecast')) {
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
    if(pricing) {
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
    if(crowdKpiGrid) {
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
    if(crowdBarChart) {
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
                                <span class="bar-val">${(d.v/1000).toFixed(0)}K</span>
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
    if(demoRings) {
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
    if(gatePressureList) {
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
    if(sentimentContainer) {
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
            if(sentimentContainer.children.length > 5) sentimentContainer.removeChild(sentimentContainer.lastChild);
            si++;
        };
        renderTweet();
        setInterval(renderTweet, 4000);
    }

    // Zone Crowd Density
    const crowdZoneDensity = document.getElementById('crowdZoneDensity');
    if(crowdZoneDensity) {
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
    if(crowdPredictions) {
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
    if(confirmBtn) {
        confirmBtn.removeEventListener('click', confirmBtn._handler);
        const handler = () => {
            if(selectedSeats.length === 0) return;
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
            if(tc) { tc.appendChild(toast); setTimeout(() => toast.remove(), 5000); }
        };
        confirmBtn._handler = handler;
        confirmBtn.addEventListener('click', handler);
    }

});
