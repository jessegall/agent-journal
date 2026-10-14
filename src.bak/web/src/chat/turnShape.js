import {nextTick, onMounted, watch} from "vue";

const LONG = 6;

function shape(el) {
    const text = el.querySelector(".thread-text");
    if (!text) return;
    Object.assign(el.style, {width: "9999px", maxWidth: ""});
    const cap = el.getBoundingClientRect().width;
    const rows = () => Math.round(text.getBoundingClientRect().height / parseFloat(getComputedStyle(text).lineHeight));
    const lines = rows();
    el.style.width = "";
    if (lines < 2 || lines > LONG) return;
    let low = Math.ceil(cap / lines);
    let high = Math.ceil(cap);
    while (high - low > 4) {
        const mid = Math.floor((low + high) / 2);
        el.style.width = `${mid}px`;
        if (rows() > lines) low = mid;
        else high = mid;
    }
    el.style.width = `${high}px`;
}

export function useTurnShape(bubble, {sources, holdsCard}) {
    const shaped = () => nextTick(() => bubble.value && !holdsCard() && shape(bubble.value));
    onMounted(shaped);
    watch(sources, shaped);
}
