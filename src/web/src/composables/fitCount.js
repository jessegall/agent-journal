import {nextTick, onMounted, onUnmounted, ref, watch} from "vue";

export function useFitCount(box, measure, source, reserve) {
    const fits = ref(Infinity);
    const counted = (room) => [...measure.value.children].filter((child) => child.offsetLeft + child.offsetWidth <= room).length;
    const count = () => {
        if (!box.value || !measure.value) return;
        const all = counted(box.value.clientWidth);
        fits.value = all < measure.value.children.length ? counted(box.value.clientWidth - reserve) : all;
    };
    const observer = new ResizeObserver(count);
    onMounted(() => box.value && observer.observe(box.value));
    onUnmounted(() => observer.disconnect());
    watch(source, () => nextTick(count), {immediate: true});
    return fits;
}
