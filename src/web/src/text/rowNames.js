import {register} from "./index.js";

const SKIPPED = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs;

function chips(text, types) {
    const names = new Map(
        types.flatMap((t) => [
            [t.name, t.name],
            [t.title.toLowerCase(), t.name],
        ])
    );
    if (!names.size) return text;
    const words = [...names.keys()].map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
    const named = new RegExp(`\\b(${words}) #?(\\d+)\\b`, "gi");
    return text.replace(named, (whole, word, n) => {
        const type = names.get(word.toLowerCase());
        return `<a class="row-pill" href="#" data-peek="${type}:${n}">${word} <span class="row-pill-num">${n}</span></a>`;
    });
}

register((text, context) =>
    text
        .split(SKIPPED)
        .map((part, i) => (i % 2 ? part : chips(part, context.types)))
        .join("")
);
