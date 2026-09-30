const GAP = 8;

export function reveal(scroller, target, centred = false) {
    if (!scroller || !target) return;
    const offset = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
    const room = centred ? (scroller.clientHeight - target.offsetHeight) / 2 : GAP;
    scroller.scrollTop = Math.max(0, scroller.scrollTop + offset - room);
}
