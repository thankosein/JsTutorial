export class Todo {
    constructor({ id, title, completed = false, createdAt = new Date() }) {
        // 🚨 အဓိက အရေးကြီးဆုံး Single Validation
        if (!title || typeof title !== 'string' || !title.trim()) {
            throw new Error('Todo title is required and cannot be empty.');
        }

        this.id = id || Date.now();
        this.title = title.trim(); // Auto sanitize whitespace
        this.completed = Boolean(completed);
        this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    }
}