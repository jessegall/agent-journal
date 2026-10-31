import {EASE, still} from "../platform/hydrate.js";

const FULL = "inset(0px 0px 0px 0px round 0px)";

const tone = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// A panel that grows out of the card it was opened from and shrinks back into it, as version 3's update did: its clip runs from the
// card's box to its own and its colour from the card's to the page's while a copy of the card fades, its content showing once it is
// there and fading before it goes back.
export function useGrowFromCard(panel, content, ghost, card) {
    let busy = false;

    function cardAt(el) {
        const p = panel.value.getBoundingClientRect();
        const c = el.getBoundingClientRect();
        return {
            clip: `inset(${c.top - p.top}px ${p.right - c.right}px ${p.bottom - c.bottom}px ${c.left - p.left}px round 9px)`,
            box: {left: `${c.left - p.left}px`, top: `${c.top - p.top}px`, width: `${c.width}px`, height: `${c.height}px`},
        };
    }

    function lay(el) {
        const copy = el.cloneNode(true);
        Object.assign(copy.style, {margin: "0", width: "100%", height: "100%", maxWidth: "none", visibility: "visible"});
        ghost.value.replaceChildren(copy);
        Object.assign(ghost.value.style, cardAt(el).box);
    }

    async function grow() {
        const from = card();
        if (still() || !from?.isConnected) return;
        busy = true;
        const at = cardAt(from);
        lay(from);
        from.style.visibility = "hidden";
        content.value.style.opacity = "0";
        ghost.value.animate([{opacity: 1}, {opacity: 0}], {duration: 150, easing: "ease-out", fill: "forwards"});
        try {
            await panel.value
                .animate(
                    [
                        {clipPath: at.clip, backgroundColor: tone("--raised")},
                        {clipPath: FULL, backgroundColor: tone("--bg")},
                    ],
                    {duration: 300, easing: EASE}
                )
                .finished.catch(() => {});
            ghost.value.replaceChildren();
            content.value.style.opacity = "";
            await content.value.animate([{opacity: 0}, {opacity: 1}], {duration: 160, easing: "ease-out"}).finished.catch(() => {});
        } finally {
            busy = false;
        }
    }

    async function shrink(done) {
        if (busy) return;
        const to = card();
        const finish = () => {
            if (to) to.style.visibility = "";
            done();
        };
        if (still() || !to?.isConnected) return finish();
        busy = true;
        try {
            await content.value.animate([{opacity: 1}, {opacity: 0}], {duration: 90, easing: "ease-in", fill: "forwards"}).finished.catch(() => {});
            const at = cardAt(to);
            lay(to);
            ghost.value.animate([{opacity: 0}, {opacity: 1}], {duration: 140, delay: 120, easing: "ease-in", fill: "both"});
            await panel.value
                .animate(
                    [
                        {clipPath: FULL, backgroundColor: tone("--bg")},
                        {clipPath: at.clip, backgroundColor: tone("--raised")},
                    ],
                    {duration: 260, easing: EASE, fill: "forwards"}
                )
                .finished.catch(() => {});
        } finally {
            busy = false;
            finish();
        }
    }

    return {grow, shrink};
}
