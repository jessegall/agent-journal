import {vi} from "vitest";

// the height the drawn text of a folded bubble has, which jsdom cannot work out: the folded body reports `height`, and its size watcher reports once it is watching
export function foldedHeight(height) {
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {configurable: true, get() { return this.classList.contains("folded-body") ? height : 0; }});
    vi.stubGlobal("ResizeObserver", class {
        constructor(report) {
            this.report = report;
        }

        observe() {
            this.report([{contentRect: {width: 100, height: 100}}]);
        }

        disconnect() {}
    });
}

export function unfoldedHeight() {
    delete HTMLElement.prototype.scrollHeight;
    vi.unstubAllGlobals();
}
