<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useOutside} from "../composables/outside.js";

defineOptions({inheritAttrs: false});
const props = defineProps({
    anchor: {type: Object, default: null},
    align: {type: String, default: "auto"},
    minWidth: {type: Number, default: 0},
    maxWidth: {type: Number, default: 0},
    maxHeight: {type: Number, default: 0},
});
const panel = ref(null);
const px = (value) => (value ? `${value}px` : undefined);
const size = computed(() => ({minWidth: px(props.minWidth), maxWidth: px(props.maxWidth), maxHeight: px(props.maxHeight)}));
const EDGE = 8;
const GAP = 4;
const drawn = ref({w: 0, h: 0});
const viewport = () => ({left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight});
const windowOf = (anchor) => {
    const win = anchor.closest(".pane, .float-window");
    return win ? win.getBoundingClientRect() : viewport();
};
const clampTo = (value, low, high) => Math.max(low, Math.min(high, value));
const within = (limit, room) => `${Math.max(0, limit ? Math.min(limit, room) : room)}px`;

function room(bounds, edge) {
    return {
        below: bounds.bottom - edge.bottom - GAP - EDGE,
        above: edge.top - bounds.top - GAP - EDGE,
        across: bounds.right - bounds.left - 2 * EDGE,
    };
}

function fitting(edge) {
    const own = windowOf(props.anchor);
    const space = room(own, edge);
    const fits = drawn.value.w <= space.across && drawn.value.h <= Math.max(space.below, space.above);
    return fits ? own : viewport();
}

const place = computed(() => {
    if (!props.anchor) return size.value;
    const edge = props.anchor.getBoundingClientRect();
    const bounds = fitting(edge);
    const space = room(bounds, edge);
    const {w, h} = drawn.value;
    const leftward = props.align === "auto" ? edge.left + edge.right > bounds.left + bounds.right : props.align === "right";
    const x = clampTo(leftward ? edge.right - w : edge.left, bounds.left + EDGE, Math.max(bounds.left + EDGE, bounds.right - w - EDGE));
    const up = h > space.below && space.above > space.below;
    const vertical = up
        ? {bottom: `${window.innerHeight - edge.top + GAP}px`, maxHeight: within(props.maxHeight, space.above)}
        : {top: `${edge.bottom + GAP}px`, maxHeight: within(props.maxHeight, space.below)};
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
const moved = (a, b) => Math.abs(a.left - b.left) > 1 || Math.abs(a.top - b.top) > 1;
let frame = 0;
let opened = null;

function follow() {
    if (props.anchor) {
        const edge = props.anchor.getBoundingClientRect();
        if (!props.anchor.isConnected || (opened && moved(edge, opened))) return emit("close");
        opened = opened || edge;
    }
    frame = requestAnimationFrame(follow);
}

onMounted(() => {
    measure();
    if (panel.value) watcher.observe(panel.value);
    if (items()[0]) items()[0].focus();
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
    z-index: 40;
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
