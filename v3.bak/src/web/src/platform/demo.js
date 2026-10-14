export const demo = __DEMO__;

export const NOT_IN_DEMO = "Not in the demo";

export function keepRecordedWords(event) {
    if (!demo) return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent("replay-hint", {detail: {target: event.target}}));
}

export const unlessDemo = (title) => (demo ? NOT_IN_DEMO : title);
