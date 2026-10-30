/* --- SCRIPT PRINCIPAL DEL PORTAFOLIO DIGITAL --- */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Actualizar año en el pie de página
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear().toString();
    }

    // 2. Tema claro/oscuro con persistencia
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
    const themeLabel = themeToggle ? themeToggle.querySelector('.theme-label') : null;

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeIcon) themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        if (themeLabel) themeLabel.textContent = theme === 'dark' ? 'Oscuro' : 'Claro';
        try { localStorage.setItem('theme', theme); } catch (e) { /* ignore */ }
    };

    let savedTheme = 'dark';
    try { savedTheme = localStorage.getItem('theme') || 'dark'; } catch (e) { /* ignore */ }
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            applyTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // 3. Panel lateral (sidebar)
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const overlay = document.getElementById('overlay');

    const openSidebar = () => {
        if (!sidebar) return;
        sidebar.classList.add('active');
        if (overlay) overlay.classList.add('active');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
        if (!sidebar) return;
        sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    if (menuToggle) menuToggle.addEventListener('click', openSidebar);
    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    const navLinks = document.querySelectorAll('.sidebar-links a');
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) closeSidebar();
        });
    });

    // 4. Marcar enlace activo según scroll (solo en index)
    const sections = document.querySelectorAll('section[id]');
    if (sections.length && navLinks.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        navLinks.forEach((link) => {
                            const target = link.getAttribute('data-section') || link.getAttribute('href');
                            const isActive = target && target.endsWith('#' + entry.target.id) || target === entry.target.id;
                            link.classList.toggle('active', isActive);
                        });
                    }
                });
            },
            { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
        );
        sections.forEach((section) => observer.observe(section));
    }

    // 6. Bitácora dinámica (dev log) por proyecto
    const devlogContainer = document.getElementById('devlogEntries');
    const devlogForm = document.getElementById('devlogForm');
    const devlogInput = document.getElementById('devlogInput');
    const devlogSection = document.querySelector('.devlog');

    if (devlogContainer && devlogSection) {
        const projectKey = 'devlog:' + (devlogSection.getAttribute('data-project') || 'default');

        const loadEntries = () => {
            try {
                const raw = localStorage.getItem(projectKey);
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                return null;
            }
        };

        const saveEntries = (entries) => {
            try { localStorage.setItem(projectKey, JSON.stringify(entries)); } catch (e) { /* ignore */ }
        };

        const renderEntries = (entries) => {
            devlogContainer.innerHTML = '';
            if (!entries || entries.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'devlog-intro';
                empty.textContent = 'Aún no hay notas. ¡Agrega la primera!';
                devlogContainer.appendChild(empty);
                return;
            }
            entries.forEach((entry) => {
                const div = document.createElement('div');
                div.className = 'devlog-entry';
                const date = document.createElement('span');
                date.className = 'entry-date';
                date.textContent = entry.date;
                const text = document.createElement('p');
                text.className = 'entry-text';
                text.textContent = entry.text;
                div.appendChild(date);
                div.appendChild(text);
                devlogContainer.appendChild(div);
            });
        };

        let entries = loadEntries();
        if (!entries) {
            entries = [
                { date: new Date().toLocaleDateString('es-ES'), text: 'Inicio del proyecto. Definiendo alcance y objetivos.' }
            ];
            saveEntries(entries);
        }
        renderEntries(entries);

        if (devlogForm) {
            devlogForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = (devlogInput.value || '').trim();
                if (!text) return;
                entries.unshift({ date: new Date().toLocaleDateString('es-ES'), text: text });
                saveEntries(entries);
                renderEntries(entries);
                devlogInput.value = '';
            });
        }
    }
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );
        revealEls.forEach((el) => revealObserver.observe(el));
    }
});