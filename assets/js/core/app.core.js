export const AppCore = {
    // Event Bus: Custom Event ထုတ်ပေးခြင်း
    emit(eventName, detail = {}) {
        document.dispatchEvent(new CustomEvent(eventName, { detail }));
    },

    // Event Bus: Custom Event ကို နားထောင်ခြင်း
    on(eventName, callback) {
        document.addEventListener(eventName, (e) => callback(e.detail));
    },

    // Event Delegation Helper
    delegate(parentSelector, eventType, childSelector, handler) {
        const parent = document.querySelector(parentSelector) || document;
        parent.addEventListener(eventType, (e) => {
            const target = e.target.closest(childSelector);
            if (target && parent.contains(target)) {
                handler.call(target, e, target);
            }
        });
    }
};