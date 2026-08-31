export class DataGrid {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        this.onPageChange = options.onPageChange || (() => {});
        this.onDelete = options.onDelete || (() => {});
        this.onEdit = options.onEdit || (() => {});
        this.pagedData = { items: [], pageNumber: 1, totalPages: 1, totalCount: 0 };
        this.loading = false;
        
        this._initEvents();
    }

    render(pagedData, loading = false) {
        if (pagedData) this.pagedData = pagedData;
        this.loading = loading;
        
        const { items, pageNumber, totalPages, totalCount } = this.pagedData;

        this.container.innerHTML = `
            <div class="relative border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                ${this.loading ? `
                    <div class="absolute inset-0 bg-white/75 flex items-center justify-center z-10">
                        <div class="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ` : ''}

                <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
                    <div class="text-xs text-slate-600">
                        Total Items: <span class="font-bold text-slate-900">${totalCount}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button id="btn-prev" class="px-2 py-1 text-xs border rounded bg-white hover:bg-slate-100 disabled:opacity-40" ${pageNumber <= 1 || this.loading ? 'disabled' : ''}>❮ Previous</button>
                        <span class="text-xs font-semibold px-2">${pageNumber} / ${totalPages}</span>
                        <button id="btn-next" class="px-2 py-1 text-xs border rounded bg-white hover:bg-slate-100 disabled:opacity-40" ${pageNumber >= totalPages || this.loading ? 'disabled' : ''}>Next ❯</button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs border-collapse">
                        <thead class="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                            <tr>
                                <th class="py-3 px-4">ID</th>
                                <th class="py-3 px-4">Description</th>
                                <th class="py-3 px-4 text-center">Status</th>
                                <th class="py-3 px-4">Remark</th>
                                <th class="py-3 px-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${items.length > 0 ? items.map(item => `
                                <tr class="hover:bg-slate-50">
                                    <td class="py-3 px-4 font-semibold text-slate-800">${item.documentTypeID}</td>
                                    <td class="py-3 px-4">${item.documentTypeDesc}</td>
                                    <td class="py-3 px-4 text-center">
                                        ${item.isActive 
                                            ? `<span class="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 rounded-full">Active</span>`
                                            : `<span class="px-2 py-0.5 text-[10px] font-semibold bg-rose-100 text-rose-700 rounded-full">Inactive</span>`
                                        }
                                    </td>
                                    <td class="py-3 px-4 text-slate-500">${item.remark}</td>
                                    <td class="py-3 px-4 text-center">
                                        <button class="btn-edit text-indigo-600 hover:text-indigo-900 mr-2 font-medium" data-id="${item.documentTypeID}">Edit</button>
                                        <button class="btn-del text-rose-600 hover:text-rose-900 font-medium" data-id="${item.documentTypeID}">Delete</button>
                                    </td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="5" class="text-center py-8 text-slate-400">No records found.</td>
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
            const pageNumber = this.pagedData.pageNumber || 1;

            if (e.target.closest('#btn-prev')) {
                if (pageNumber > 1 && !this.loading) this.onPageChange(pageNumber - 1);
            }
            else if (e.target.closest('#btn-next')) {
                if (pageNumber < this.pagedData.totalPages && !this.loading) this.onPageChange(pageNumber + 1);
            }
            else if (e.target.closest('.btn-edit')) {
                const id = e.target.closest('.btn-edit').dataset.id;
                this.onEdit(id);
            }
            else if (e.target.closest('.btn-del')) {
                const id = e.target.closest('.btn-del').dataset.id;
                if (confirm(`Are you sure you want to delete ID: ${id}?`)) {
                    this.onDelete(id);
                }
            }
        });
    }
}