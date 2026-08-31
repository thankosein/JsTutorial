import { todoService } from '../assets/js/services/todo/todo.service.js';
import { ToastComponent } from '../assets/js/core/app.ui.js';
import { AppCore } from '../assets/js/core/app.core.js';

// Text XSS protection helper
const escapeHTML = (str) => String(str).replace(/[&<>"']/g, match => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[match]));

export function init() {
    const listContainer = document.getElementById('todo-list-container');
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const stats = document.getElementById('todo-stats');

    // UI Render Function
    function render(todos) {
        if (!listContainer) return;
        const pendingCount = todos.filter(t => !t.completed).length;

        if (stats) stats.textContent = `${pendingCount} Task${pendingCount === 1 ? '' : 's'} Remaining`;

        if (todos.length === 0) {
            listContainer.innerHTML = `
                <div class="bg-white p-6 text-center text-slate-400 text-xs rounded-xl border border-slate-200">
                    No tasks found. Add your first task above!
                </div>`;
            return;
        }

        listContainer.innerHTML = todos.map(todo => `
            <div class="todo-item bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group" data-id="${todo.id}">
                <div class="flex items-center space-x-3 cursor-pointer btn-toggle">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} class="w-4 h-4 text-indigo-600 rounded cursor-pointer pointer-events-none">
                    <span class="text-sm font-medium ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700'}">
                        ${escapeHTML(todo.title)}
                    </span>
                </div>
                <button class="btn-delete text-xs text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ✕ Delete
                </button>
            </div>
        `).join('');
    }

    // STATE-TO-UI BINDING: State ပြောင်းတိုင်း UI Auto Sync လုပ်မည်
    todoService.subscribe((updatedTodos) => {
        render(updatedTodos);
    });

    // Add Todo Form Submit Event
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const result = todoService.addTodo(input.value);

        if (!result.success) {
            if (typeof ToastComponent !== 'undefined' && ToastComponent.error) {
                ToastComponent.error(result.error);
            } else {
                alert(result.error);
            }
            return;
        }

        input.value = '';
        if (typeof ToastComponent !== 'undefined' && ToastComponent.success) {
            ToastComponent.success('Task added successfully!');
        }
    });

    // Event Delegation: Toggle Checkbox
    AppCore.delegate('#todo-list-container', 'click', '.btn-toggle', (e, target) => {
        const id = Number(target.closest('.todo-item').dataset.id);
        todoService.toggleTodo(id);
    });

    // Event Delegation: Delete Item
    AppCore.delegate('#todo-list-container', 'click', '.btn-delete', (e, target) => {
        const id = Number(target.closest('.todo-item').dataset.id);
        todoService.deleteTodo(id);
        if (typeof ToastComponent !== 'undefined' && ToastComponent.info) {
            ToastComponent.info('Task deleted.');
        }
    });
}