import { Todo } from '../../models/todo/todo.model.js';

class TodoService {
    constructor() {
        this.listeners = [];
        this.todos = [
            new Todo({ id: 1, title: 'Setup Modular Architecture', completed: true }),
            new Todo({ id: 2, title: 'Build State-to-UI Observer Pattern', completed: false })
        ];
    }

    // UI မှ Data State ကို စောင့်ကြည့်ရန် (Subscribe)
    subscribe(listenerCallback) {
        this.listeners.push(listenerCallback);
        listenerCallback(this.todos); // Initial state ပို့ပေးခြင်း
    }

    // State ပြောင်းပါက UI သို့ Auto Notify လုပ်ပေးခြင်း
    _notify() {
        this.listeners.forEach(callback => callback(this.todos));
    }

    getTodos() {
        return this.todos;
    }

    addTodo(title) {
        try {
            const newTodo = new Todo({ title });
            this.todos.unshift(newTodo);
            this._notify(); // UI Auto Sync
            return { success: true, data: newTodo };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this._notify(); // UI Auto Sync
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this._notify(); // UI Auto Sync
    }
}

export const todoService = new TodoService();