import { AppCore } from './core/app.core.js';
import { ToastComponent, ModalComponent } from './core/app.ui.js';
import { loadComponent } from './components/layout-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Relative Path ဖြင့် Loader ကို ခေါ်ယူပါမည်
    await Promise.all([
        loadComponent('header-slot', '../components/header.html'),
        loadComponent('footer-slot', '../components/footer.html')
    ]);

    // Active Menu Highlight ပြုလုပ်ခြင်း
    const currentPage = document.body.dataset.page;
    if (currentPage) {
        const activeNav = document.querySelector(`.nav-link[data-nav="${currentPage}"]`);
        if (activeNav) {
            activeNav.classList.remove('text-slate-500');
            activeNav.classList.add('text-indigo-600', 'font-bold', 'border-b-2', 'border-indigo-600', 'pb-1');
        }
    }

    // Header Cart Badge Subscription
    AppCore.on('cart:state-changed', (totals) => {
        const badge = document.getElementById('cart-count-badge');
        if (badge) badge.textContent = totals.qty;
    });

    // Dynamic Feature Initializations
    if (document.getElementById('user-form-feature')) {
        initUserFeature();
    }

    if (document.getElementById('product-catalog-feature')) {
        initStoreFeature();
    }
});