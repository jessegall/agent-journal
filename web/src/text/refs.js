import {register} from "./index.js";

register((text, context) => {
    const names = [...new Set(context.types.flatMap((t) => [t.name, t.title.toLowerCase()]))];
    const pattern = new RegExp(`\\b(${names.join("|")})s?\\s+#?(\\d+)\\b`, "gi");
    return text.replace(pattern, (whole, word, n) => {
        const kind = context.types.find((t) => t.name === word.toLowerCase() || t.title.toLowerCase() === word.toLowerCase());
        return kind ? `<a class="row-pill" href="#" data-peek="${kind.name}:${n}">${whole}</a>` : whole;
    });
});
