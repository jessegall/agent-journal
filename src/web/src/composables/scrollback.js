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

// How near the top of the scroller the mark must stand for the reader to be at the top.
const NEAR_PX = 200;

export function useScrollback(scroller, mark, load, {ready = () => true, margin = "200px 0px 0px 0px"} = {}) {
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
    async function older() {
        if (loading.value || spent || !ready()) return false;
        loading.value = true;
        try {
            return await keepingPlace(scroller, load);
        } finally {
            loading.value = false;
            spent = true;
        }
    }
    useSighted(mark, older, {root: scroller, margin});
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
