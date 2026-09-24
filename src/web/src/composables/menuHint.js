import {ref} from "vue";
import {remember, remembered} from "./remembered.js";
import {route} from "../route.js";

const seenKey = () => `journal.window-menus.seen.${route.value.env}`;
const HINT_FOR = 6000;

export function useMenuHint(touring) {
    const seen = new Set(remembered(seenKey(), []));
    const focused = new Set();
    const hinted = ref(null);
    let timer = 0;

    function focus(id, view) {
        if (!view || focused.has(view)) return;
        focused.add(view);
        if (seen.has(view) || touring() || hinted.value !== null) return;
        hinted.value = id;
        remember(seenKey(), [...seen.add(view)]);
        clearTimeout(timer);
        timer = setTimeout(() => (hinted.value = null), HINT_FOR);
    }

    function opened(view) {
        if (view && !seen.has(view)) remember(seenKey(), [...seen.add(view)]);
        hinted.value = null;
    }

    return {hinted, focus, opened};
}
