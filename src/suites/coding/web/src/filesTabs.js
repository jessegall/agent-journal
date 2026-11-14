import {onUnmounted, ref, watch} from "vue";

// Each Files window keeps its own open tabs and the lines picked in the file shown, written in the address so a reload keeps them:
// the first window as files=a.py,b.py&files-at=a.py&files-lines=3-7, the second as files2.
// A window takes the lowest number no other Files window holds, so after a reload the windows find their own tabs again in the order they open.
const taken = new Set();
const AT = "-at";
const LINES = "-lines";

export function useFilesTabs() {
    let slot = 0;
    while (taken.has(slot)) slot++;
    taken.add(slot);
    onUnmounted(() => taken.delete(slot));
    const name = slot ? `files${slot + 1}` : "files";
    const params = new URLSearchParams(location.search);
    const tabs = ref((params.get(name) || "").split(",").filter(Boolean).map(decodeURIComponent));
    const shown = params.get(`${name}${AT}`) || "";
    const [from, to = from] = (params.get(`${name}${LINES}`) || "").split("-").map(Number);
    const selection = ref(from ? {from, to} : null);

    // the address follows the tabs, replacing the entry in the history so back never steps through tab changes
    function keep(current) {
        const next = new URLSearchParams(location.search);
        const range = selection.value;
        if (tabs.value.length) {
            next.set(name, tabs.value.map(encodeURIComponent).join(","));
            next.set(`${name}${AT}`, current);
        } else {
            next.delete(name);
            next.delete(`${name}${AT}`);
        }
        if (range) next.set(`${name}${LINES}`, range.from === range.to ? String(range.from) : `${range.from}-${range.to}`);
        else next.delete(`${name}${LINES}`);
        history.replaceState(history.state, "", `?${next}${location.hash}`);
    }

    return {tabs, shown, selection, keep, watchTabs: (current) => watch([tabs, current, selection], () => keep(current.value))};
}
