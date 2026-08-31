// Toast Notification Engine
export const ToastComponent = {
    show(type = 'info', message = '', title = '') {
        const container = document.getElementById('global-toast-slot');
        if (!container) return;

        const styles = {
            success: 'bg-emerald-800 border-emerald-600',
            info: 'bg-sky-800 border-sky-600',
            error: 'bg-rose-800 border-rose-600',
            warning: 'bg-amber-800 border-amber-600'
        };

        const toast = document.createElement('div');
        toast.className = `toast-enter ${styles[type] || styles.info} text-white border-l-4 p-4 rounded-lg shadow-lg flex items-start justify-between space-x-3 pointer-events-auto`;
        
        toast.innerHTML = `
            <div class="flex items-start space-x-3">
                <div>
                    <h5 class="font-bold text-xs">${title || type.toUpperCase()}</h5>
                    <p class="text-xs text-slate-200 mt-0.5">${message}</p>
                </div>
            </div>
            <button class="btn-close-toast text-slate-300 hover:text-white text-xs">✕</button>
        `;

        container.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.classList.remove('toast-enter');
            toast.classList.add('toast-show');
        });

        const dismiss = () => {
            toast.classList.add('toast-enter');
            toast.classList.remove('toast-show');
            setTimeout(() => toast.remove(), 300);
        };

        const timer = setTimeout(dismiss, 4000);
        toast.querySelector('.btn-close-toast').addEventListener('click', () => {
            clearTimeout(timer);
            dismiss();
        });
    },

    success(msg, title) { this.show('success', msg, title); },
    info(msg, title) { this.show('info', msg, title); },
    error(msg, title) { this.show('error', msg, title); },
    warning(msg, title) { this.show('warning', msg, title); }
};

// Modal Engine (သီးသန့် export လုပ်ရပါမည်)
export const ModalComponent = {
    open(options) {
        const modalSlot = document.getElementById('global-modal-slot');
        if (!modalSlot) return;

        const config = {
            title: 'Modal Dialog',
            body: '',
            confirmText: 'Save Changes',
            cancelText: 'Cancel',
            onConfirm: () => {},
            onCancel: () => {},
            ...options
        };

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden">
                <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h4 class="font-bold text-slate-900 text-sm">${config.title}</h4>
                    <button class="btn-modal-close text-slate-400 text-sm">✕</button>
                </div>
                <div class="p-5 text-xs text-slate-600 space-y-2">${config.body}</div>
                <div class="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                    <button class="btn-modal-cancel bg-white border border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg">${config.cancelText}</button>
                    <button class="btn-modal-confirm bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm">${config.confirmText}</button>
                </div>
            </div>
        `;

        modalSlot.appendChild(modal);

        const close = () => modal.remove();
        modal.querySelector('.btn-modal-confirm').addEventListener('click', () => { config.onConfirm(modal); close(); });
        modal.querySelector('.btn-modal-cancel').addEventListener('click', () => { config.onCancel(modal); close(); });
        modal.querySelector('.btn-modal-close').addEventListener('click', () => { config.onCancel(modal); close(); });
    }
};