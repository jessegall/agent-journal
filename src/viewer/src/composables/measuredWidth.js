import {onBeforeUnmount, onMounted, ref} from "vue";

// The width an element has now, kept as it changes; null until measured
export function useMeasuredWidth(element) {
    const width = ref(null);
    const watcher = new ResizeObserver(() => (width.value = element.value.offsetWidth));
    onMounted(() => {
        width.value = element.value.offsetWidth;
        watcher.observe(element.value);
    });
    onBeforeUnmount(() => watcher.disconnect());
    return width;
}
