<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import WindowPane from "./WindowPane.vue";

// what a bar button opens under itself, over the page: one window, or several as groups under sticky headers with a count each; it closes on
// a click outside or on escape
const HIDING = "data-settling";
const SMALLEST_WIDTH_PIXELS = 240;
const MOST_WIDTH_PIXELS = 480;
const GROUPED_WIDTH_PIXELS = 360;
const GAP_PIXELS = 6;
const EDGE_PIXELS = 8;
const props = defineProps({
    groups: {type: Array, required: true},
    anchor: {type: Object, default: null},
    catalogue: {type: Object, required: true},
    subscriptions: {type: Object, required: true},
    environment: {type: String, required: true},
    agent: {type: Number, default: null},
    prompts: {type: Object, default: null},
    shellRead: {type: Function, default: null},
});
const emit = defineEmits(["close"]);
const closeOnEscape = (event) => event.key === "Escape" && emit("close");
window.addEventListener("keydown", closeOnEscape);
onUnmounted(() => window.removeEventListener("keydown", closeOnEscape));
// the panel takes the width its contents need: when new contents change that width it grows or shrinks to it in WIDTH_MS, its contents hidden
// while it moves and fading in once it has settled, so no text moves with the width. The width it moves from is the last it settled at.
const WIDTH_MS = 200;
const panel = ref(null);
const panelWidth = ref(0);
let moving = 0;
const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
function fitWidth() {
    const el = panel.value;
    if (!el || el.hasAttribute(HIDING)) return;
    const from = panelWidth.value;
    const to = el.offsetWidth;
    panelWidth.value = to;
    if (!from || Math.abs(to - from) < 2 || reducedMotion()) return;
    el.setAttribute(HIDING, "");
    el.style.width = `${from}px`;
    void el.offsetWidth;
    el.style.transition = `width ${WIDTH_MS}ms ease`;
    el.style.width = `${to}px`;
    const own = ++moving;
    setTimeout(() => {
        if (own !== moving) return;
        Object.assign(el.style, {width: "", transition: ""});
        el.removeAttribute(HIDING);
    }, WIDTH_MS);
}
const watcher = new ResizeObserver(fitWidth);
onMounted(() => {
    panelWidth.value = panel.value.offsetWidth;
    watcher.observe(panel.value);
});
onUnmounted(() => {
    moving += 1;
    watcher.disconnect();
});
const grouped = computed(() => props.groups.length > 1);
const placed = computed(() => {
    const smallest = grouped.value ? GROUPED_WIDTH_PIXELS : SMALLEST_WIDTH_PIXELS;
    const box = props.anchor?.getBoundingClientRect();
    const size = {minWidth: `${smallest}px`, maxWidth: `min(${MOST_WIDTH_PIXELS}px, calc(100vw - ${2 * EDGE_PIXELS}px))`};
    if (!box) return size;
    const left = Math.max(EDGE_PIXELS, Math.min(box.left, window.innerWidth - panelWidth.value - EDGE_PIXELS));
    return {...size, top: `${box.bottom + GAP_PIXELS}px`, left: `${left}px`};
});
</script>

<template>
    <div class="dropdown-veil" data-dropdown-veil @click.self="emit('close')">
        <div ref="panel" class="dropdown" :data-dropdown="groups.map((group) => group.name).join(' ')" role="dialog" :style="placed">
            <template v-for="group in groups" :key="group.name">
                <template v-if="grouped">
                    <h3 class="group-head" data-dropdown-group>
                        {{ group.title }}<span class="group-count" data-dropdown-count>{{ group.count }}</span>
                    </h3>
                </template>
                <div class="dropdown-body">
                    <WindowPane dropdown :name="group.name" :catalogue="catalogue" :subscriptions="subscriptions" :environment="environment" :agent="agent" :prompts="prompts" :shell-read="shellRead" />
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.dropdown-veil {
    position: fixed;
    z-index: 40;
    inset: 0;
}

/* its height grows from its skeleton's size to its contents' as they arrive; its width does in fitWidth */
.dropdown {
    interpolate-size: allow-keywords;
    transition: height 0.2s ease;
    position: absolute;
    top: 84px;
    left: 240px;
    overflow: auto;
    overflow-wrap: anywhere;
    box-sizing: border-box;
    width: fit-content;
    max-height: calc(100vh - 110px);
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
}

.dropdown[data-dropdown="agents.helpers"] {
    width: min(460px, calc(100vw - 16px));
}

.group-head {
    position: sticky;
    z-index: 1;
    top: 0;
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px 16px;
    margin: 0;
    background: var(--raised);
    color: var(--text-2);
    font-size: 12px;
    font-weight: 500;
}

.dropdown-body {
    transition: opacity 0.16s ease;
}

.dropdown[data-settling] .dropdown-body {
    opacity: 0;
    transition: none;
}

.group-count {
    padding: 0 6px;
    border-radius: 8px;
    background: var(--hover);
    color: var(--text-3);
    font-size: 11px;
}
</style>
