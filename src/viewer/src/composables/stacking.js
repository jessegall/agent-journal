import {computed, onUnmounted, reactive, watch} from "vue";

const BASE = 80;
const open = reactive([]);

export function stacking(visible) {
    const mine = Symbol("layer");
    const release = () => open.includes(mine) && open.splice(open.indexOf(mine), 1);
    watch(
        visible,
        (on) => {
            if (on && !open.includes(mine)) open.push(mine);
            if (!on) release();
        },
        {immediate: true}
    );
    onUnmounted(release);
    return computed(() => BASE + Math.max(0, open.indexOf(mine)));
}
