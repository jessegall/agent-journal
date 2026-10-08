<script setup>
import {clamp} from "../format/number.js";
import {computed, onMounted, onUnmounted, ref} from "vue";
import {anchorTo, useOutside} from "../composables/outside.js";

defineOptions({inheritAttrs: false});
const props = defineProps({
    anchor: {type: Object, default: null},
    align: {type: String, default: "auto"},
    minWidth: {type: Number, default: 0},
    maxWidth: {type: Number, default: 0},
    maxHeight: {type: Number, default: 0},
    gap: {type: Number, default: 4},
    height: {type: Number, default: 0},
    plain: Boolean,
});
const panel = ref(null);
const px = (value) => (value ? `${value}px` : undefined);
const size = computed(() => ({
    minWidth: px(props.minWidth),
    maxWidth: px(props.maxWidth),
    maxHeight: px(props.maxHeight),
    height: px(props.height),
}));
const EDGE = 8;
const drawn = ref({w: 0, h: 0});
const edge = ref(props.anchor ? props.anchor.getBoundingClientRect() : null);
const viewport = () => ({left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight});
const onScreen = (r) => ({
    left: Math.max(0, r.left),
    top: Math.max(0, r.top),
    right: Math.min(window.innerWidth, r.right),
    bottom: Math.min(window.innerHeight, r.bottom),
});
const windowOf = (anchor) => {
    const win = anchor.closest(".pane, .float-window");
    return win ? onScreen(win.getBoundingClientRect()) : viewport();
};
const within = (limit, room) => `${Math.max(0, limit ? Math.min(limit, room) : room)}px`;

function room(bounds, at) {
    return {
        below: bounds.bottom - at.bottom - props.gap - EDGE,
        above: at.top - bounds.top - props.gap - EDGE,
        across: bounds.right - bounds.left - 2 * EDGE,
    };
}

function fitting(at) {
    const own = windowOf(props.anchor);
    const space = room(own, at);
    const fits = drawn.value.w <= space.across && drawn.value.h <= Math.max(space.below, space.above);
    return fits ? own : viewport();
}

const place = computed(() => {
    if (!edge.value) return size.value;
    const at = edge.value;
    const bounds = fitting(at);
    const space = room(bounds, at);
    const {w, h} = drawn.value;
    const leftward = props.align === "auto" ? at.left + at.right > bounds.left + bounds.right : props.align === "right";
    const x = clamp(leftward ? at.right - w : at.left, bounds.left + EDGE, Math.max(bounds.left + EDGE, bounds.right - w - EDGE));
    const up = h > space.below && space.above > space.below;
    const vertical = up
        ? {bottom: `${window.innerHeight - at.top + props.gap}px`, maxHeight: within(props.maxHeight, space.above)}
        : {top: `${at.bottom + props.gap}px`, maxHeight: within(props.maxHeight, space.below)};
    return {...size.value, ...vertical, left: `${x}px`, maxWidth: within(props.maxWidth, window.innerWidth - x - EDGE)};
});
const emit = defineEmits(["close"]);
const items = () => [...panel.value.querySelectorAll("button:not(:disabled)")];

function step(by) {
    const all = items();
    const at = all.indexOf(document.activeElement);
    all[(at + by + all.length) % all.length].focus();
}

const KEYS = {ArrowDown: () => step(1), ArrowUp: () => step(-1), Escape: () => emit("close")};
const onKey = (e) => KEYS[e.key] && (e.preventDefault(), KEYS[e.key]());
const measure = () => panel.value && (drawn.value = {w: panel.value.offsetWidth, h: panel.value.scrollHeight});
const watcher = new ResizeObserver(measure);
useOutside(panel, (e) => props.anchor && !props.anchor.contains(e.target) && emit("close"));
const moved = (a, b) => ["top", "left", "right", "bottom"].some((side) => Math.abs(a[side] - b[side]) > 1);
const offScreen = (r) => r.bottom < 0 || r.top > window.innerHeight;
let frame = 0;

function follow() {
    if (props.anchor) {
        const now = props.anchor.getBoundingClientRect();
        if (!props.anchor.isConnected || offScreen(now)) return emit("close");
        if (moved(now, edge.value)) edge.value = now;
    }
    frame = requestAnimationFrame(follow);
}

onMounted(() => {
    if (props.anchor && panel.value) anchorTo(panel.value, props.anchor);
    measure();
    if (panel.value) watcher.observe(panel.value);
    if (!props.plain && items()[0]) items()[0].focus();
    follow();
});
onUnmounted(() => {
    watcher.disconnect();
    cancelAnimationFrame(frame);
});
defineExpose({element: panel});
</script>

<template>
    <Teleport to="body" :disabled="!anchor">
        <div ref="panel" v-bind="$attrs" :class="['menu-panel', {anchored: anchor}]" :style="place" @keydown="onKey"><slot /></div>
    </Teleport>
</template>

<style scoped>
.menu-panel {
    position: absolute;
    z-index: 90;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 6px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--raised);
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
    overflow-y: auto;
}

.menu-panel:not(.anchored) {
    top: calc(100% + 4px);
    left: 0;
}

.menu-panel.anchored {
    position: fixed;
}
</style>
