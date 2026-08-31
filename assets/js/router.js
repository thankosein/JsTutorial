// 💡 Script path များကို Folder Structure အမှန်အတိုင်း ပြင်ဆင်ထားပါသည်
const routes = [
    { path: '#users', label: 'User Management', view: './pages/users.html', script: '../../pages/users.js' },
    { path: '#store', label: 'Store Catalog', view: './pages/store.html', script: '../../pages/store.js' },
    { path: '#todo', label: 'To-Do List', view: './pages/todo.html', script: '../../pages/todo.js' },
    { path: '#document-types', label: 'Document Types', view: './pages/document-types.html', script: '../../pages/document-types.js' }
];

// 1. Dynamic Navigation Render
function renderNavigation(currentHash) {
    const navContainer = document.getElementById('main-nav');
    if (!navContainer) return;

    navContainer.innerHTML = routes.map(route => {
        const isActive = route.path === currentHash;
        const activeClass = isActive 
            ? 'text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1' 
            : 'text-slate-500 hover:text-indigo-600';
        return `<a href="${route.path}" class="nav-link ${activeClass}">${route.label}</a>`;
    }).join('');
}

// 2. SPA Router Core
async function handleRoute() {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    let hash = window.location.hash;
    if (!hash || hash === '#') {
        window.location.hash = '#document-types';
        return;
    }

    const route = routes.find(r => r.path === hash);
    renderNavigation(hash);

    if (!route) {
        appContent.innerHTML = `<div class="p-8 text-center text-rose-500 font-medium">404 - Page Not Found</div>`;
        return;
    }

    try {
        const res = await fetch(route.view);
        if (!res.ok) throw new Error(`HTML view HTTP status ${res.status}`);
        appContent.innerHTML = await res.text();

        // Module Dynamic Import
        const pageModule = await import(route.script);
        
        if (pageModule && typeof pageModule.init === 'function') {
            pageModule.init();
        } else {
            console.warn(`Module loaded, but init() was not exported in ${route.script}`);
        }
    } catch (err) {
        console.error('Routing Execution Error:', err);
        appContent.innerHTML = `
            <div class="p-8 text-center text-rose-500 font-medium">
                Failed to load page content.<br>
                <span class="text-xs text-slate-400">${err.message}</span>
            </div>`;
    }
}

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);