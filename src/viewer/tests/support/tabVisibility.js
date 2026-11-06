let hidden = false;

export function setupTabVisibility() {
    hidden = false;
    Object.defineProperty(document, "hidden", {configurable: true, get: () => hidden});
}

export function showTab(isHidden) {
    hidden = isHidden;
    document.dispatchEvent(new Event("visibilitychange"));
}
