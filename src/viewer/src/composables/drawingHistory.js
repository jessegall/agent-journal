import {computed, ref} from "vue";

const KEPT = 40;

// A drawing's unsaved changes, newest last: each change remembers the nodes and lines before it, so Undo steps back one and Discard goes back to the start.
export function useDrawingHistory(nodes, lines) {
    const past = ref([]);
    const dirty = computed(() => past.value.length > 0);

    function remember() {
        past.value = [...past.value.slice(-(KEPT - 1)), {nodes: nodes.value.map((n) => ({...n})), lines: lines.value.map((l) => ({...l}))}];
    }

    function restore(drawn) {
        nodes.value = drawn.nodes;
        lines.value = drawn.lines;
    }

    function undo() {
        const last = past.value.pop();
        if (last) restore(last);
    }

    function discard() {
        if (!past.value.length) return;
        restore(past.value[0]);
        past.value = [];
    }

    function forget() {
        past.value = [];
    }

    return {past, dirty, remember, undo, discard, forget};
}
