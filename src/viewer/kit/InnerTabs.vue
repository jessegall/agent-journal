<script setup>
import {computed, inject, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {WINDOW_CONTEXT} from "./windowContextKey.js";

// the tabs a window declares in the backend, each with the count from the last answer the window read; choosing one is the window's to read
// a band that never wraps: it scrolls sideways, keeps the open tab in view and draws one line that slides under it
const props = defineProps({active: {type: Object, default: null}, answer: {type: Object, default: () => ({})}, tabs: {type: Array, default: null}});
const emit = defineEmits(["choose"]);
const context = inject(WINDOW_CONTEXT, null);
const tabs = computed(() => props.tabs ?? context?.tabs ?? []);
const band = ref(null);
const line = ref({left: 0, width: 0, slides: false});
const counted = (tab) => props.answer[tab.count_field] !== undefined;

function place(slides) {
    const open = band.value?.querySelector(".inner-tab.on");
    if (!open) return void (line.value = {left: 0, width: 0, slides: false});
    line.value = {left: open.offsetLeft, width: open.offsetWidth, slides};
    if (band.value.scrollWidth > band.value.clientWidth) band.value.scrollLeft = Math.max(0, open.offsetLeft - 12);
}

const settle = () => nextTick(() => place(true));
let watching = null;
onMounted(() => {
    place(false);
    watching = new ResizeObserver(() => place(false));
    watching.observe(band.value);
    document.fonts?.ready.then(() => place(false));
});
onUnmounted(() => watching?.disconnect());
watch(() => props.active?.key, settle);
watch(() => props.answer, settle, {deep: true});
</script>

<template>
    <div ref="band" class="inner-tabs" role="tablist" data-inner-tabs>
        <template v-for="tab in tabs" :key="tab.key">
            <button type="button" role="tab" :class="['inner-tab', {on: active?.key === tab.key}]" :aria-selected="active?.key === tab.key" :data-tab="tab.key" @click="emit('choose', tab)">
                {{ tab.label }}
                <template v-if="counted(tab)">
                    <span class="inner-tab-count" data-tab-count>{{ answer[tab.count_field] }}</span>
                </template>
            </button>
        </template>
        <i :class="['inner-tabs-line', {slides: line.slides}]" :style="{left: `${line.left}px`, width: `${line.width}px`}" data-tabs-line />
    </div>
</template>

<style scoped>
.inner-tabs {
    position: relative;
    display: flex;
    flex: none;
    gap: 2px;
    height: 32px;
    padding: 0 8px;
    overflow-x: auto;
    border-bottom: 1px solid var(--border);
    background: var(--bg-2);
    scrollbar-width: none;
}

.inner-tabs::-webkit-scrollbar {
    display: none;
}

.inner-tab {
    display: inline-flex;
    flex: none;
    gap: 7px;
    align-items: center;
    padding: 0 9px;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    letter-spacing: 0.01em;
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.16s;
}

.inner-tab:hover {
    color: var(--text-2);
}

.inner-tab.on {
    color: var(--text);
    font-weight: 500;
}

.inner-tab-count {
    display: inline-grid;
    place-items: center;
    min-width: 18px;
    height: 16px;
    padding: 0 5px;
    border-radius: 9px;
    background: var(--chip);
    color: var(--text-3);
    font-size: 10.5px;
    font-weight: 400;
    font-variant-numeric: tabular-nums;
    transition:
        background 0.16s,
        color 0.16s;
}

.inner-tab.on .inner-tab-count {
    background: var(--accent-dim);
    color: var(--accent-text);
}

.inner-tabs-line {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background: var(--accent);
}

.inner-tabs-line.slides {
    transition:
        left 220ms cubic-bezier(0.2, 0.9, 0.25, 1),
        width 220ms cubic-bezier(0.2, 0.9, 0.25, 1);
}

@media (prefers-reduced-motion: reduce) {
    .inner-tabs-line.slides {
        transition: none;
    }
}
</style>
