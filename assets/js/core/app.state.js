export function createState(initialState, renderCallback) {
    return new Proxy(initialState, {
        set(target, property, value) {
            target[property] = value;
            renderCallback(target);
            return true;
        }
    });
}