<script setup>
import {ref} from "vue";
import ResizeHandle from "./ResizeHandle.vue";
import {percent, percentBox} from "../format/number.js";

const props = defineProps({
    panes: {type: Array, required: true},
    splits: {type: Array, required: true},
    colors: {type: Function, default: null},
});
const emit = defineEmits(["resize"]);
const area = ref(null);
const live = ref(false);
const SNAP = 14;
const LEAST = 140;
const EDGE = 0.0005;

function border(s) {
    const at = s.dir === "row" ? s.box.x + s.box.w * s.r : s.box.y + s.box.h * s.r;
    return s.dir === "row"
        ? {left: `calc(${percent(at)} - 3px)`, top: percent(s.box.y), height: percent(s.box.h)}
        : {top: `calc(${percent(at)} - 3px)`, left: percent(s.box.x), width: percent(s.box.w)};
}

function ratio(s) {
    return (moved) => {
        const whole = area.value.getBoundingClientRect();
        const row = s.dir === "row";
        const size = row ? s.box.w * whole.width : s.box.h * whole.height;
        const from = row ? whole.left + s.box.x * whole.width : whole.top + s.box.y * whole.height;
        const least = Math.min(LEAST, size * 0.3);
        const at = Math.min(size - least, Math.max(least, (row ? moved.clientX : moved.clientY) - from));
        const near = Math.abs(at - size / 2) < SNAP;
        return {value: near ? 0.5 : at / size, snapped: near};
    };
}

defineExpose({element: area});
</script>

<template>
    <div ref="area" :class="['pane-grid', {live}]">
        <template v-for="p in panes" :key="p.id">
            <section
                :class="['pane', p.state, {after: p.rect.x > EDGE, below: p.rect.y > EDGE}]"
                :style="{...percentBox(p.rect), ...(props.colors ? props.colors(p.pane) : {})}"
            >
                <slot name="pane" v-bind="p" />
            </section>
        </template>
        <template v-for="s in splits" :key="s.path">
            <ResizeHandle
                class="pane-split"
                :axis="s.dir === 'row' ? 'x' : 'y'"
                :measure="ratio(s)"
                :style="border(s)"
                @start="live = true"
                @stop="live = false"
                @resize="emit('resize', s.path, $event)"
                @reset="emit('resize', s.path, 0.5)"
            />
        </template>
        <slot />
    </div>
</template>

<style scoped>
.pane-grid {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

.pane {
    position: absolute;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    background: var(--bg);
    container-type: inline-size;
    transition:
        left 0.26s var(--ease),
        top 0.26s var(--ease),
        width 0.26s var(--ease),
        height 0.26s var(--ease),
        opacity 0.22s ease;
}

.pane.after {
    border-left: 1px solid var(--border);
}

.pane.below {
    border-top: 1px solid var(--border);
}

.pane.born,
.pane.dying {
    opacity: 0;
}

.pane.dying {
    pointer-events: none;
}

.pane-grid .pane-split {
    position: absolute;
    margin: 0;
    transition:
        left 0.26s var(--ease),
        top 0.26s var(--ease),
        width 0.26s var(--ease),
        height 0.26s var(--ease);
}

.pane-grid.live .pane,
.pane-grid.live .pane-split {
    transition: none;
}

@media (prefers-reduced-motion: reduce) {
    .pane,
    .pane-grid .pane-split {
        transition: none;
    }
}
</style>
