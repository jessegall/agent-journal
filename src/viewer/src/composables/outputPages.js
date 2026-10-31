import {nextTick, ref} from "vue";

const EDGE_PX = 24;

// An output read a page at a time: the newest page first, then only the lines after the last held, and a page before the first on scrolling up.
export function useOutputPages(read) {
    const lines = ref([]);
    const start = ref(0);
    const next = ref(0);
    const facts = ref(null);
    const loaded = ref(false);

    async function poll() {
        const got = loaded.value ? await read({after: next.value}) : await read();
        lines.value = loaded.value ? [...lines.value, ...got.lines] : got.lines;
        start.value = loaded.value ? start.value : got.start;
        next.value = got.next;
        facts.value = got;
        loaded.value = true;
    }

    async function older(box) {
        if (!loaded.value || start.value === 0 || box.scrollTop > EDGE_PX) return;
        const height = box.scrollHeight;
        const got = await read({before: start.value});
        lines.value = [...got.lines, ...lines.value];
        start.value = got.start;
        await nextTick();
        box.scrollTop += box.scrollHeight - height;
    }

    return {lines, facts, loaded, poll, older};
}
