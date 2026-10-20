import {nextTick, onUnmounted, ref, unref, watch} from "vue";

export async function keepingPlace(scroller, load) {
    const box = unref(scroller);
    const fromBottom = box ? box.scrollHeight - box.scrollTop : 0;
    const grew = await load();
    await nextTick();
    const now = unref(scroller);
    if (grew !== false && now) now.scrollTop = now.scrollHeight - fromBottom;
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

// After one earlier page loads, the next waits this long, so a reader at the top is not handed the whole history at once.
const PAUSE_MS = 2000;
// How near the top of the scroller the mark must stand, once the pause is over, for the next page to load.
const NEAR_PX = 200;

export function useScrollback(scroller, mark, load, {ready = () => true, margin = "200px 0px 0px 0px"} = {}) {
    const loading = ref(false);
    let restedAt = 0;
    let later = 0;
    // whether the mark still stands near the top of the scroller, so the reader is still at the top
    function inSight() {
        const el = unref(mark);
        const box = unref(scroller);
        return Boolean(el && box) && el.getBoundingClientRect().top - box.getBoundingClientRect().top < NEAR_PX;
    }
    // a page asked for inside the pause waits until it is over, and loads then only if the reader is still at the top
    function afterThePause(wait) {
        if (later) return false;
        later = window.setTimeout(() => {
            later = 0;
            if (inSight()) older();
        }, wait);
        return false;
    }
    async function older() {
        if (loading.value || !ready()) return false;
        const wait = restedAt - Date.now();
        if (wait > 0) return afterThePause(wait);
        loading.value = true;
        try {
            return await keepingPlace(scroller, load);
        } finally {
            loading.value = false;
            restedAt = Date.now() + PAUSE_MS;
        }
    }
    useSighted(mark, older, {root: scroller, margin});
    onUnmounted(() => window.clearTimeout(later));
    return {loading, older};
}
