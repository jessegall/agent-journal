// jsdom has no ResizeObserver; the components that watch their size get one that never reports
globalThis.ResizeObserver ??= class {
    observe() {}
    disconnect() {}
};

// jsdom cannot scroll, so a component that brings a row into view finds the call there and nothing moves
Element.prototype.scrollIntoView ??= function scrollIntoView() {};
