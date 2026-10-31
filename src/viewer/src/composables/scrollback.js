import {nextTick, onUnmounted, ref, unref, watch} from "vue";

// how many frames the place is held while rows drawn above it settle, and how many still frames end the hold early
const HOLD_FRAMES = 60;
const STILL_FRAMES = 6;
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

// Loads rows above what the reader sees and keeps the reader's place: the rows above may be drawn over several frames, so the
// place is held each frame until the height has been still for a few, and let go at once when the reader scrolls themselves.
export async function keepingPlace(scroller, load) {
    const box = unref(scroller);
    const fromBottom = box ? box.scrollHeight - box.scrollTop : 0;
    const grew = await load();
    await nextTick();
    if (grew === false) return grew;
    let held = null;
    let still = 0;
    let height = -1;
    for (let frame = 0; frame < HOLD_FRAMES && still < STILL_FRAMES; frame++) {
        const now = unref(scroller);
        if (!now || (held !== null && now.scrollTop !== held)) break;
        now.scrollTop = now.scrollHeight - fromBottom;
        held = now.scrollTop;
        still = now.scrollHeight === height ? still + 1 : 0;
        height = now.scrollHeight;
        await nextFrame();
    }
    return grew;
}

export function useSighted(mark, onSight, {root = null, margin = "0px"} = {}) {
    let watcher = null;
    const stop = watch(
        () => [unref(mark), unref(root)],
        ([el, box]) => {
            if (watcher) watcher.disconnect();
            watcher = null;
            if (!el || (root && !box)) return;
            watcher = new IntersectionObserver((seen) => seen.some((e) => e.isIntersecting) && onSight(), {
                root: box || null,
                rootMargin: margin,
            });
            watcher.observe(el);
        },
        {immediate: true, flush: "post"}
    );
    onUnmounted(() => {
        stop();
        if (watcher) watcher.disconnect();
    });
}

// How near the top of the scroller the mark must stand for the reader to be at the top.
const NEAR_PX = 200;

// How many pages a chat too short to scroll may take to fill its window, at most.
const FILL_PAGES = 5;

// A window with no height is hidden and asks for nothing; one the rows do not fill asks until they do, starting the moment the chat
// is ready, since its top mark stays in sight and is never sighted again; one that scrolls asks only when the reader has scrolled up
// into its top screenful.
const shows = (box) => box.clientHeight > 0;
const filling = (box) => shows(box) && box.scrollHeight <= box.clientHeight;
const atTop = (box) => shows(box) && box.scrollHeight > box.clientHeight && box.scrollTop < box.clientHeight;

export function useScrollback(scroller, mark, load, {ready = () => true, scrolled = () => true, margin = "200px 0px 0px 0px"} = {}) {
    const loading = ref(false);
    let spent = false;
    // whether the mark still stands near the top of the scroller, so the reader is still at the top
    function inSight() {
        const el = unref(mark);
        const box = unref(scroller);
        return Boolean(el && box) && Math.abs(el.getBoundingClientRect().top - box.getBoundingClientRect().top) < NEAR_PX;
    }
    // after a page the next waits until the reader has left the top and come back to it
    function leftTheTop() {
        if (spent && !inSight()) spent = false;
    }
    const page = () => keepingPlace(scroller, load);
    async function older() {
        const box = unref(scroller);
        if (loading.value || spent || !ready() || !box) return false;
        if (!(filling(box) || (scrolled() && atTop(box)))) return false;
        loading.value = true;
        try {
            let grew = await page();
            for (let pages = 1; grew && pages < FILL_PAGES && filling(box); pages++) grew = await page();
            return grew;
        } finally {
            loading.value = false;
            spent = true;
        }
    }
    useSighted(mark, older, {root: scroller, margin});
    watch(ready, (now) => now && older(), {flush: "post"});
    watch(
        () => unref(scroller),
        (box, was) => {
            was?.removeEventListener("scroll", leftTheTop);
            box?.addEventListener("scroll", leftTheTop, {passive: true});
        },
        {immediate: true, flush: "post"}
    );
    onUnmounted(() => unref(scroller)?.removeEventListener("scroll", leftTheTop));
    return {loading, older};
}
