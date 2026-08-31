import { initLayout } from '../assets/js/components/layout-loader.js';
import { ToastComponent, ModalComponent } from '../assets/js/core/app.ui.js';
import { createDataGrid } from '../assets/js/components/datagrid.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Layout Load လုပ်မည်
    await initLayout('users');

    // 2. User Page Logic များကို ဤနေရာတွင် တိုက်ရိုက် ရေးသားမည်
    let usersData = [
        { id: 1, name: 'Kyaw Kyaw', role: 'Frontend Developer', status: 'Full-Time' },
        { id: 2, name: 'Su Su', role: 'UI/UX Designer', status: 'Contract' }
    ];

    const userGrid = createDataGrid('#data-grid-container', {
        columns: [
            { header: 'ID', field: 'id' },
            { header: 'Full Name', field: 'name' },
            { header: 'Role', field: 'role' },
            { header: 'Status', field: 'status' }
        ],
        data: usersData,
        onDelete(id) {
            ModalComponent.open({
                title: 'Confirm Delete',
                body: `<p>Are you sure you want to delete user <strong>#${id}</strong>?</p>`,
                confirmText: 'Delete Now',
                onConfirm() {
                    usersData = usersData.filter(u => u.id !== id);
                    userGrid.setData(usersData);
                    ToastComponent.success(`User #${id} deleted!`);
                }
            });
        }
    });
    userGrid.init();

    // Search Handler
    document.getElementById('grid-search-input')?.addEventListener('input', (e) => {
        userGrid.filter(e.target.value);
    });

    // Form Submit Handler
    document.getElementById('form-user')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newUser = {
            id: Date.now(),
            name: formData.get('name'),
            role: formData.get('role'),
            status: formData.get('status')
        };

        usersData.push(newUser);
        userGrid.setData(usersData);
        e.target.reset();
        ToastComponent.success(`User '${newUser.name}' added successfully!`);
    });
});