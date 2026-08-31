export class DataGridWithPagination {
    constructor(options = {}) {
        this.container = typeof options.container === 'string' 
            ? document.querySelector(options.container) 
            : options.container;

        if (!this.container) {
            throw new Error('DataGridWithPagination: Target container element not found.');
        }

        this.columns = options.columns || [];
        this.onPageChange = options.onPageChange || (() => {});
        this.onEdit = options.onEdit || null;
        this.onDelete = options.onDelete || null;
        this.rowKeyField = options.rowKeyField || 'id';
        this.pageSize = Number(options.pageSize) || 10;

        this.pagedData = { items: [], pageNumber: 1, totalPages: 1, totalCount: 0 };
        this.loading = false;
        this.confirmId = null;

        this._initEvents();
    }

    render({ pagedData, loading = false }) {
        if (pagedData) this.pagedData = pagedData;
        this.loading = loading;
        this._draw();
    }

    _draw() {
        const data = this.pagedData || {};
        const items = Array.isArray(data.items) ? data.items : [];
        const pageNumber = Number(data.pageNumber) || 1;
        const totalPages = Number(data.totalPages) || 1;
        const totalCount = Number(data.totalCount) || 0;

        const startIndex = (pageNumber - 1) * this.pageSize;
        const displayStart = totalCount > 0 ? startIndex + 1 : 0;
        const displayEnd = Math.min(startIndex + items.length, totalCount);

        const showActions = !!this.onEdit || !!this.onDelete;

        this.container.innerHTML = `
            <div class="relative border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                ${this.loading ? `
                    <div class="absolute inset-0 bg-white/75 flex items-center justify-center z-10">
                        <div class="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ` : ''}

                <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
                    <div class="text-xs text-slate-500 font-medium">
                        Showing <span class="text-slate-900 font-bold">${displayStart}</span> to <span class="text-slate-900 font-bold">${displayEnd}</span> of <span class="text-slate-900 font-bold">${totalCount}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="btn-prev px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded disabled:opacity-30 disabled:hover:bg-transparent" ${pageNumber <= 1 || this.loading ? 'disabled' : ''}>
                            ❮
                        </button>
                        <div class="px-3 py-0.5 text-xs font-bold text-slate-700 border-x border-slate-200 min-w-[50px] text-center">
                            ${pageNumber} / ${totalPages}
                        </div>
                        <button class="btn-next px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded disabled:opacity-30 disabled:hover:bg-transparent" ${pageNumber >= totalPages || this.loading ? 'disabled' : ''}>
                            ❯
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs border-collapse">
                        <thead class="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                            <tr>
                                ${this.columns.map(col => `
                                    <th class="py-3 px-4" style="text-align: ${col.align || 'left'}">
                                        ${this._escape(col.label)}
                                    </th>
                                `).join('')}
                                ${showActions ? `<th class="py-3 px-4 text-center w-24">Actions</th>` : ''}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-slate-700">
                            ${items.length > 0 ? items.map((item) => {
                                const currentId = item[this.rowKeyField];
                                const isDeleting = this.confirmId === currentId;

                                return `
                                    <tr class="hover:bg-slate-50/80 transition-colors ${isDeleting ? 'bg-red-50 hover:bg-red-50' : ''}">
                                        ${this.columns.map(col => {
                                            const rawVal = item[col.key];
                                            const renderedContent = col.render 
                                                ? col.render(rawVal, item) 
                                                : (rawVal !== undefined && rawVal !== null ? this._escape(rawVal) : '-');

                                            return `
                                                <td class="py-3 px-4 align-middle" style="text-align: ${col.align || 'left'}">
                                                    ${renderedContent}
                                                </td>
                                            `;
                                        }).join('')}

                                        ${showActions ? `
                                            <td class="py-2 px-4 text-center align-middle">
                                                ${isDeleting ? `
                                                    <div class="flex items-center justify-center space-x-1">
                                                        <button class="btn-confirm-del bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded text-xs leading-none" data-id="${currentId}">✓</button>
                                                        <button class="btn-cancel-del bg-slate-400 hover:bg-slate-500 text-white p-1 rounded text-xs leading-none">✕</button>
                                                    </div>
                                                ` : `
                                                    <div class="flex items-center justify-center space-x-3">
                                                        ${this.onEdit ? `<span class="btn-edit text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium" data-id="${currentId}">✏️</span>` : ''}
                                                        ${this.onDelete ? `<span class="btn-delete text-rose-500 hover:text-rose-700 cursor-pointer font-medium" data-id="${currentId}">🗑️</span>` : ''}
                                                    </div>
                                                `}
                                            </td>
                                        ` : ''}
                                    </tr>
                                `;
                            }).join('') : `
                                <tr>
                                    <td colSpan="${this.columns.length + (showActions ? 1 : 0)}" class="text-center py-10">
                                        <div class="text-slate-300 text-3xl mb-1">📥</div>
                                        <div class="text-xs text-slate-400">No records found.</div>
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    _initEvents() {
        this.container.addEventListener('click', (e) => {
            const pageNumber = Number(this.pagedData.pageNumber) || 1;

            if (e.target.closest('.btn-prev')) {
                if (pageNumber > 1 && !this.loading) this.onPageChange(pageNumber - 1);
            }
            else if (e.target.closest('.btn-next')) {
                const totalPages = Number(this.pagedData.totalPages) || 1;
                if (pageNumber < totalPages && !this.loading) this.onPageChange(pageNumber + 1);
            }
            else if (e.target.closest('.btn-edit')) {
                const id = e.target.closest('.btn-edit').dataset.id;
                if (this.onEdit) this.onEdit(id);
            }
            else if (e.target.closest('.btn-delete')) {
                const id = e.target.closest('.btn-delete').dataset.id;
                this.confirmId = id;
                this._draw();
            }
            else if (e.target.closest('.btn-confirm-del')) {
                const id = e.target.closest('.btn-confirm-del').dataset.id;
                this.confirmId = null;
                if (this.onDelete) this.onDelete(id);
            }
            else if (e.target.closest('.btn-cancel-del')) {
                this.confirmId = null;
                this._draw();
            }
        });
    }

    _escape(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}