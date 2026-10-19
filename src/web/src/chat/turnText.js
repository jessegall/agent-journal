import {computed} from "vue";
import {quoted} from "../format/quote.js";
import {render} from "../text/index.js";
import "../text/all.js";

export function useTurnText(turn, env) {
    const words = computed(() => quoted(turn().text || turn().title || ""));
    const html = computed(() => render(words.value.text, {env: env.value}));
    return {words, html};
}
