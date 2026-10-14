import {onMounted, onUnmounted} from "vue";

const SEEN_MS = 2000;

export function useSuggestionNote(acts, suggestion) {
    let noted = false;
    let timer = 0;

    function note() {
        if (noted) return;
        noted = true;
        clearTimeout(timer);
        acts.noteWindow(suggestion().n).catch(() => (noted = false));
    }

    onMounted(() => (timer = setTimeout(note, SEEN_MS)));
    onUnmounted(() => clearTimeout(timer));
    return note;
}
