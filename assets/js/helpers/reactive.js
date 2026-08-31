export function createReactiveState(initialState, onStateChange) {
    return new Proxy(initialState, {
        set(target, key, value) {
            target[key] = value;
            // Data ပြောင်းသွားသည်နှင့် UI Handler ကို Auto-call လုပ်ပေးမည်
            if (typeof onStateChange === 'function') {
                onStateChange(target, key, value);
            }
            return true;
        }
    });
}