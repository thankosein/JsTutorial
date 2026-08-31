export class Sanitizer {
    /**
     * Convert HTML special characters to safe HTML Entities
     */
    static escapeHTML(str) {
        if (!str) return '';
        return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
}