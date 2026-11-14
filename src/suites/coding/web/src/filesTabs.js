import {onUnmounted, ref, watch} from "vue";

// Each Files window keeps its own open tabs, written in the address so a reload keeps them: the first window as files=a.py,b.py&files-at=a.py, the second as files2.
// A window takes the lowest number no other Files window holds, so after a reload the windows find their own tabs again in the order they open.
const taken = new Set();
const AT = "-at";

export function useFilesTabs() {
    let slot = 0;
    while (taken.has(slot)) slot++;
    taken.add(slot);
    onUnmounted(() => taken.delete(slot));
    const name = slot ? `files${slot + 1}` : "files";
    const params = new URLSearchParams(location.search);
    const tabs = ref((params.get(name) || "").split(",").filter(Boolean).map(decodeURIComponent));
    const shown = params.get(`${name}${AT}`) || "";

    // the address follows the tabs, replacing the entry in the history so back never steps through tab changes
    function keep(current) {
        const next = new URLSearchParams(location.search);
        if (tabs.value.length) {
            next.set(name, tabs.value.map(encodeURIComponent).join(","));
            next.set(`${name}${AT}`, current);
        } else {
            next.delete(name);
            next.delete(`${name}${AT}`);
        }
        history.replaceState(history.state, "", `?${next}${location.hash}`);
    }

    return {tabs, shown, keep, watchTabs: (current) => watch([tabs, current], () => keep(current.value))};
}
