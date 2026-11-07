import {expect, vi} from "vitest";

export function trackMutationObservers() {
    const active = new Set();
    const Observer = globalThis.MutationObserver;
    vi.stubGlobal("MutationObserver", class extends Observer {
        observe(...options) {
            active.add(this);
            super.observe(...options);
        }

        disconnect() {
            super.disconnect();
            active.delete(this);
        }
    });
    return () => expect(active.size, "MutationObservers left connected after unmount").toBe(0);
}
