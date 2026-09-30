import {computed} from "vue";
import {quoted} from "../format/quote.js";
import {types} from "../state/store.js";
import {render} from "../text/index.js";
import {standaloneUpdates} from "../text/cards.js";
import "../text/all.js";

export function useTurnText(turn, env) {
    const words = computed(() => quoted(turn().brief || turn().title));
    const split = computed(() => standaloneUpdates(words.value.text, {types: types.value}));
    const html = computed(() => render(split.value.text, {types: types.value, env: env.value}));
    return {words, split, html};
}
