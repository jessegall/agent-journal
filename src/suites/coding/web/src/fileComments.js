import {computed, ref, watch} from "vue";

// "Whole file", "Line 4" or "Lines 4 to 9": what a comment is about
export const rangeText = (range) => (range?.from == null ? "Whole file" : range.from === range.to ? `Line ${range.from}` : `Lines ${range.from} to ${range.to}`);

// The comments on the file shown, read through the window's file-comments key and written with file-comment make.
// A journal that has no such key answers the first read with a refusal; the comments are then unavailable for this window and nothing of them is drawn.
export function useFileComments(view, current, selection) {
    const rows = ref([]);
    const available = ref(null);
    const hot = ref(0);
    const railOn = ref(true);
    const sending = ref(false);

    async function load() {
        if (available.value === false || !current.value) {
            rows.value = [];
            return;
        }
        const path = current.value;
        const answer = await view.readKey("file-comments", {path});
        if (path !== current.value) return;
        available.value = answer.ok;
        rows.value = answer.ok ? answer.value.rows : [];
    }

    async function send(words) {
        sending.value = true;
        const range = selection.value ? ["--from", String(selection.value.from), "--to", String(selection.value.to)] : [];
        const answer = await view.run(["file-comment", "make", current.value, words, ...range]);
        sending.value = false;
        if (!answer.ok) return;
        selection.value = null;
        railOn.value = true;
        await load();
    }

    watch(current, load, {immediate: true});
    // each comment as the rail shows it: with the lines it is about quoted above its words
    const shown = computed(() => rows.value.map((comment) => ({...comment, quote: comment.from == null ? null : rangeText(comment)})));
    return {rows, shown, available, hot, railOn, sending, send, load};
}
