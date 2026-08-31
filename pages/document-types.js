import { DocumentTypeService } from '../assets/js/services/document-type.service.js';
import { DocumentType, PagedResult } from '../assets/js/models/vts/document-type.model.js';
import { DataGridWithPagination } from '../assets/js/components/datagrid-with-pagination.js';
import { ModalComponent } from '../assets/js/components/modal.js';

export function init() {
    let currentPage = 1;
    let currentEditId = null; // 👉 Edit လုပ်နေတဲ့ ID ကို ဒီမှာ လုံခြုံစွာ သိမ်းထားမည် (User manual ပြင်လို့မရပါ)

    // 1. Initialize Reusable Modal Component (ID field ကို ဖြုတ်ထားပါ)
    const documentModal = new ModalComponent({
        title: 'Document Type',
        fields: [
            { name: 'documentTypeDesc', label: 'Document Type Description', required: true, placeholder: 'Enter description...' },
            { name: 'isActive', label: 'Is Active', type: 'checkbox', defaultValue: true },
            { name: 'remark', label: 'Remark', placeholder: 'Enter remark (optional)' }
        ],
        onSubmit: async (formData) => {
            const isEditing = currentEditId !== null;
            let res;

            if (isEditing) {
                // 👉 Update လုပ်တဲ့အခါ Code ထဲက လုံခြုံတဲ့ `currentEditId` ကို Payload ထဲ ထည့်ပေးမည်
                const payload = {
                    documentTypeID: Number(currentEditId),
                    ...formData
                };
                res = await DocumentTypeService.updateDocumentType(currentEditId, payload);
            } else {
                // Add New အတွက်
                res = await DocumentTypeService.createDocumentType(formData);
            }

            if (res.success) {
                documentModal.close();
                loadData(currentPage);
            } else {
                alert(res.error || 'Operation failed.');
            }
        }
    });

    // 2. DataGrid Initialization
    const grid = new DataGridWithPagination({
        container: '#document-grid-container',
        rowKeyField: 'documentTypeID',
        pageSize: 10,
        columns: [
            { key: 'documentTypeID', label: 'ID', align: 'left' },
            { key: 'documentTypeDesc', label: 'Document Type Description', align: 'left' },
            { 
                key: 'isActive', 
                label: 'Status', 
                align: 'center',
                render: (val) => `
                    <span class="px-2 py-0.5 text-xs rounded-full ${val ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}">
                        ${val ? 'Active' : 'Inactive'}
                    </span>
                `
            },
            { key: 'remark', label: 'Remark', align: 'left' }
        ],
        onPageChange: (newPage) => {
            currentPage = newPage;
            loadData(currentPage);
        },
        onEdit: async (id) => {
            currentEditId = id; // 👉 Edit နှိပ်လိုက်တဲ့ ID ကို ဤနေရာတွင် သတ်မှတ်သည်
            console.log('Edit ID:', id);
            
            const res = await DocumentTypeService.getById(id);
            if (res.success && res.data) {
                documentModal.open(res.data, true);
            } else {
                alert(`Failed to fetch record for ID: ${id}`);
            }
        },
        onDelete: async (id) => {
            grid.render({ loading: true });
            const res = await DocumentTypeService.deleteDocumentType(id);
            if (res.success) {
                loadData(currentPage);
            } else {
                alert(res.error || 'Failed to delete record.');
                loadData(currentPage);
            }
        }
    });

    async function loadData(page = 1) {
        grid.render({ loading: true });
        const res = await DocumentTypeService.getReport(page, 10);
        
        if (res.success) {
            const pagedResult = new PagedResult(res.data, DocumentType);
            grid.render({ pagedData: pagedResult, loading: false });
        } else {
            alert(res.error);
            grid.render({ loading: false });
        }
    }

    loadData(currentPage);

    // Add New Button Event
    const addNewBtn = document.getElementById('btn-add-new');
    if (addNewBtn) {
        addNewBtn.addEventListener('click', () => {
            currentEditId = null; // 👉 Add New လုပ်လျှင် ID ကို null ပေးမည်
            documentModal.open({ documentTypeDesc: '', isActive: true, remark: '' }, false);
        });
    }

    // Refresh Button Event
    const refreshBtn = document.getElementById('btn-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            currentPage = 1;
            loadData(currentPage);
        });
    }
}