import {onBeforeUnmount, onMounted, ref} from "vue";

// The height an element's content has now, kept as it changes, so a box around it can ease from one height to the next; null until measured
export function useMeasuredHeight(content) {
    const height = ref(null);
    const watcher = new ResizeObserver(() => (height.value = content.value.offsetHeight));
    onMounted(() => watcher.observe(content.value));
    onBeforeUnmount(() => watcher.disconnect());
    return height;
}
