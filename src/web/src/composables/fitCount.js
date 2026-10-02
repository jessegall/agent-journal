import {nextTick, onMounted, onUnmounted, ref, watch} from "vue";

export function useFitCount(box, source) {
    const fits = ref(Infinity);
    const measure = () => {
        const node = box.value;
        if (!node) return;
        const edge = node.clientWidth;
        fits.value = [...node.children].filter((child) => child.offsetLeft + child.offsetWidth <= edge).length;
    };
    const observer = new ResizeObserver(measure);
    onMounted(() => box.value && observer.observe(box.value));
    onUnmounted(() => observer.disconnect());
    watch(source, () => nextTick(measure), {immediate: true});
    return fits;
}
