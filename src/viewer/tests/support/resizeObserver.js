// jsdom has no ResizeObserver; the components that watch their size get one that never reports
globalThis.ResizeObserver ??= class {
    observe() {}
    disconnect() {}
};
