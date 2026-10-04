export const demo = __DEMO__;

export const NOT_IN_DEMO = "Not in the demo";

export function replayBlocks(text, prefill) {
    if (!demo || text === prefill) return false;
    window.dispatchEvent(new CustomEvent("replay-hint"));
    return true;
}

export const unlessDemo = (title) => (demo ? NOT_IN_DEMO : title);
