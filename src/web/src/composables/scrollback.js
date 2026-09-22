import {nextTick, onUnmounted, unref, watch} from "vue";

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
