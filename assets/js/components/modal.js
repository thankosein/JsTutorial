export class ModalComponent {
    constructor(options = {}) {
        this.title = options.title || 'Modal';
        this.fields = options.fields || []; // Form fields configuration
        this.onSubmit = options.onSubmit || (() => {});
        this.modalElement = null;
        this._createModalDOM();
    }

    _createModalDOM() {
        const div = document.createElement('div');
        div.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 hidden';
        div.innerHTML = `
            <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all">
                <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h3 class="text-base font-bold text-slate-800 modal-title">${this.title}</h3>
                    <button type="button" class="modal-close text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                </div>
                <form class="modal-form p-6 space-y-4">
                    <div class="modal-body-fields space-y-4"></div>
                    <div class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                        <button type="button" class="modal-cancel px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" class="modal-submit px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">Save</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(div);
        this.modalElement = div;

        // Event Listeners
        this.modalElement.querySelector('.modal-close').addEventListener('click', () => this.close());
        this.modalElement.querySelector('.modal-cancel').addEventListener('click', () => this.close());
        this.modalElement.querySelector('.modal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            // Convert checkbox value to boolean
            this.fields.forEach(f => {
                if (f.type === 'checkbox') {
                    data[f.name] = e.target.elements[f.name].checked;
                }
            });
            this.onSubmit(data);
        });
    }

    open(data = {}, isEdit = false) {
        this.modalElement.querySelector('.modal-title').textContent = isEdit ? `Edit ${this.title}` : `Add New ${this.title}`;
        
        const fieldsContainer = this.modalElement.querySelector('.modal-body-fields');
        fieldsContainer.innerHTML = this.fields.map(field => {
            const val = data[field.name] !== undefined ? data[field.name] : (field.defaultValue || '');
            if (field.type === 'checkbox') {
                return `
                    <div class="flex items-center space-x-2 pt-2">
                        <input type="checkbox" id="field_${field.name}" name="${field.name}" ${val ? 'checked' : ''} class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500">
                        <label for="field_${field.name}" class="text-xs font-semibold text-slate-700">${field.label}</label>
                    </div>
                `;
            }
            return `
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">${field.label} ${field.required ? '<span class="text-rose-500">*</span>' : ''}</label>
                    <input type="${field.type || 'text'}" name="${field.name}" value="${val}" ${field.required ? 'required' : ''} class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500" placeholder="${field.placeholder || ''}">
                </div>
            `;
        }).join('');

        this.modalElement.classList.remove('hidden');
    }

    close() {
        this.modalElement.classList.add('hidden');
    }   
}