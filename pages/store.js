import { initLayout } from '../assets/js/components/layout-loader.js';
import { AppCore } from '../assets/js/core/app.core.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Header/Footer Layout တင်မည်
    await initLayout('store');

    // 2. Header Cart Badge Listener
    AppCore.on('cart:state-changed', (totals) => {
        const badge = document.getElementById('cart-count-badge');
        if (badge) badge.textContent = totals.qty;
    });

    // 3. Store Data State
    let productsState = [
        { id: 101, title: 'Wireless Ergonomic Mouse', price: 45.00 },
        { id: 102, title: 'Mechanical Keyboard RGB', price: 120.00 },
        { id: 103, title: 'Ultra-Wide Monitor 34"', price: 450.00 }
    ];
    let cartState = [];

    const catalogContainer = document.getElementById('product-list-container');
    const cartList = document.getElementById('cart-items-container');

    // Catalog HTML Render ပြုလုပ်သည့် Function
    function renderCatalog() {
        if (!catalogContainer) return;
        catalogContainer.innerHTML = productsState.map(product => `
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <h3 class="font-semibold text-slate-800 text-sm">${product.title}</h3>
                    <span class="text-xs text-slate-400">$${product.price.toFixed(2)}</span>
                </div>
                <button class="btn-add-to-cart bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-2 rounded-lg" data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `).join('');
    }

    // Cart HTML Render ပြုလုပ်သည့် Function
    function renderCart() {
        if (!cartList) return;
        if (cartState.length === 0) {
            cartList.innerHTML = `<div class="py-4 text-center text-slate-400 text-xs">Cart is empty.</div>`;
        } else {
            cartList.innerHTML = cartState.map(item => `
                <div class="cart-item-row py-2 flex items-center justify-between border-b" data-id="${item.id}">
                    <div>
                        <h4 class="font-medium text-slate-800 text-xs">${item.title}</h4>
                        <span class="text-xs text-slate-500">$${item.price.toFixed(2)} × ${item.quantity}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                        <button class="btn-qty-decrease text-xs px-2 py-0.5 bg-slate-100">-</button>
                        <span class="text-xs font-semibold px-1">${item.quantity}</span>
                        <button class="btn-qty-increase text-xs px-2 py-0.5 bg-slate-100">+</button>
                    </div>
                </div>
            `).join('');
        }

        const totals = cartState.reduce((acc, item) => {
            acc.qty += item.quantity;
            acc.price += item.price * item.quantity;
            return acc;
        }, { qty: 0, price: 0 });

        const qtyEl = document.getElementById('cart-total-qty');
        const priceEl = document.getElementById('cart-total-price');
        if (qtyEl) qtyEl.textContent = totals.qty;
        if (priceEl) priceEl.textContent = `$${totals.price.toFixed(2)}`;
        
        AppCore.emit('cart:state-changed', totals);
    }

    // 🔥 [ADD RANDOM ITEM BUTTON EVENT HANDLER]
    document.getElementById('btn-add-dynamic-product')?.addEventListener('click', () => {
        const randomId = Math.floor(100 + Math.random() * 900);
        const randomPrice = (Math.random() * 100 + 10).toFixed(2);
        
        // Random Item အသစ် ထည့်သွင်းခြင်း
        productsState.push({
            id: randomId,
            title: `Dynamic Gadget #${randomId}`,
            price: parseFloat(randomPrice)
        });
        
        // UI ကို ပြန်လည် Render လုပ်ပေးခြင်း
        renderCatalog();
    });

    // Add to Cart Event Delegation
    AppCore.delegate('#product-list-container', 'click', '.btn-add-to-cart', (e, target) => {
        const id = Number(target.dataset.id);
        const product = productsState.find(p => p.id === id);
        if (product) {
            const existing = cartState.find(item => item.id === product.id);
            if (existing) existing.quantity++;
            else cartState.push({ ...product, quantity: 1 });
            renderCart();
        }
    });

    // Cart Quantity (+) Button Event Delegation
    AppCore.delegate('#cart-items-container', 'click', '.btn-qty-increase', (e, target) => {
        const id = Number(target.closest('.cart-item-row').dataset.id);
        const item = cartState.find(i => i.id === id);
        if (item) { item.quantity++; renderCart(); }
    });

    // Cart Quantity (-) Button Event Delegation
    AppCore.delegate('#cart-items-container', 'click', '.btn-qty-decrease', (e, target) => {
        const id = Number(target.closest('.cart-item-row').dataset.id);
        const item = cartState.find(i => i.id === id);
        if (item) {
            item.quantity--;
            if (item.quantity <= 0) cartState = cartState.filter(i => i.id !== id);
            renderCart();
        }
    });

    // Initial Render
    renderCatalog();
    renderCart();
});