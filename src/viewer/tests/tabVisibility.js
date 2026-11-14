export function tabVisibility() {
    let hidden = false;
    return {
        reset() {
            hidden = false;
            Object.defineProperty(document, "hidden", {configurable: true, get: () => hidden});
        },
        show(isHidden) {
            hidden = isHidden;
            document.dispatchEvent(new Event("visibilitychange"));
        },
    };
}
