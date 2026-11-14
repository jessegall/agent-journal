<script setup>
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import Icon from "../src/kit/Icon.vue";
import MarkIcon from "../src/kit/MarkIcon.vue";
import {vContext} from "./vContext.js";

// the one tab bar, as an editor draws it: every tab has a cross slot of its own, kept free so no tab changes its width, and the cross shows on the open,
// hovered, focused and menu tab. A middle click and the Delete key close a tab; a right click opens its menu: Close, Close others, Close to the right, Close all.
// A page adds its own items to the menu with extra(tab) and its own buttons after the tabs in the slot.
// tabs: [{key, title, icon, count, hot, on, lifting, gone}]
const props = defineProps({tabs: {type: Array, required: true}, insertAt: {type: Number, default: -1}, extra: {type: Function, default: () => []}});
const emit = defineEmits(["pick", "close", "grab"]);
const row = ref(null);
const compact = ref(false);
let watcher = null;
const MIDDLE = 1;

// the tabs show their labels while they all fit in the row's real width; one that does not fit has the labels of its inactive tabs left out
async function fit() {
    compact.value = false;
    await nextTick();
    if (row.value) compact.value = row.value.scrollWidth > row.value.clientWidth;
}

const closeEach = (tabs) => tabs.forEach((tab) => emit("close", tab.key));
const place = (tab, at) => ({
    head: tab.title,
    items: [
        {label: "Close", group: "open", keys: "Del", run: () => emit("close", tab.key)},
        {label: "Close others", group: "open", disabled: props.tabs.length < 2, reason: "Only tab", run: () => closeEach(props.tabs.filter((other) => other !== tab))},
        {label: "Close to the right", group: "open", disabled: at === props.tabs.length - 1, reason: "None", run: () => closeEach(props.tabs.slice(at + 1))},
        {label: "Close all", group: "open", run: () => closeEach(props.tabs)},
        ...props.extra(tab),
    ],
});

watch(() => props.tabs.map((tab) => `${tab.title}:${tab.count ?? ""}`).join("|"), fit);
onMounted(() => {
    fit();
    if (typeof ResizeObserver === "undefined") return;
    watcher = new ResizeObserver(fit);
    watcher.observe(row.value);
});
onBeforeUnmount(() => watcher?.disconnect());
</script>

<template>
    <div :class="['pane-tabs', {compact}]">
        <div ref="row" class="pane-tabs-row" role="tablist">
            <template v-for="(t, i) in tabs" :key="t.key">
                <div
                    v-context="() => place(t, i)"
                    role="tab"
                    tabindex="0"
                    :aria-selected="t.on"
                    :class="[
                        'pane-tab',
                        {
                            on: t.on,
                            lifting: t.lifting,
                            gone: t.gone,
                            'insert-before': insertAt === i,
                            'insert-after': insertAt === tabs.length && i === tabs.length - 1,
                        },
                    ]"
                    :data-tab="t.key"
                    @pointerdown="emit('grab', $event, t.key)"
                    @mousedown.middle.prevent
                    @auxclick="$event.button === MIDDLE && (emit('close', t.key), $event.preventDefault())"
                    @keydown.enter.prevent="emit('pick', t.key)"
                    @keydown.space.prevent="emit('pick', t.key)"
                    @keydown.delete.prevent="emit('close', t.key)"
                >
                    <MarkIcon :name="t.icon" />
                    <span class="pane-tab-label">{{ t.title }}</span>
                    <template v-if="t.count !== undefined">
                        <span :class="['pane-tab-n', {hot: t.hot}]">{{ t.count }}</span>
                    </template>
                    <button
                        type="button"
                        class="pane-tab-x"
                        tabindex="-1"
                        :aria-label="`Close ${t.title}`"
                        @pointerdown.stop
                        @click.stop="emit('close', t.key)"
                    >
                        <Icon name="x" :size="10" />
                    </button>
                </div>
            </template>
        </div>
        <slot />
    </div>
</template>

<style scoped>
.pane-tabs {
    flex: none;
    display: flex;
    align-items: stretch;
    gap: 8px;
    height: 34px;
    padding: 0 5px 0 14px;
    border-bottom: 1px solid var(--border);
    background: var(--side);
}

.pane-tabs-row {
    flex: 1;
    min-width: 0;
    display: flex;
    gap: 12px;
    overflow: hidden;
}

.pane-tab {
    position: relative;
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    letter-spacing: 0.03em;
    color: var(--text-3);
    white-space: nowrap;
    cursor: pointer;
    touch-action: none;
    transition:
        color 0.15s,
        box-shadow 0.2s,
        opacity 0.15s;
}

.pane-tab:hover {
    color: var(--text-2);
}

.pane-tab:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: -1px;
}

.pane-tab.on {
    color: var(--text);
    box-shadow: inset 0 -1px 0 var(--accent);
}

.pane-tab.lifting {
    opacity: 0.4;
}

.pane-tab.gone {
    color: var(--text-4);
}

.pane-tab.gone .pane-tab-label,
.pane-tab.gone :deep(.ico) {
    text-decoration: line-through;
}

.pane-tab :deep(.ico) {
    color: inherit;
}

.pane-tab-n {
    font-size: 11px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.pane-tab.on .pane-tab-n,
.pane-tab-n.hot {
    color: var(--accent-text);
}

.pane-tab.insert-before::before,
.pane-tab.insert-after::after {
    content: "";
    position: absolute;
    top: 7px;
    bottom: 7px;
    width: 2px;
    border-radius: 1px;
    background: var(--accent);
}

.pane-tab.insert-before::before {
    left: -7px;
}

.pane-tab.insert-after::after {
    right: -7px;
}

/* the slot is always there, so a tab keeps its width whether the cross shows or not */
.pane-tab-x {
    display: grid;
    flex: none;
    place-items: center;
    width: 16px;
    height: 16px;
    padding: 0;
    border: 0;
    border-radius: 4px;
    background: none;
    color: var(--text-4);
    opacity: 0;
    cursor: pointer;
}

.pane-tab.on .pane-tab-x,
.pane-tab:hover .pane-tab-x,
.pane-tab:focus-visible .pane-tab-x,
.pane-tab.menu-target .pane-tab-x,
.pane-tab-x:focus-visible {
    opacity: 1;
}

.pane-tab-x:hover {
    background: var(--hover);
    color: var(--text);
}

.pane-tabs.compact .pane-tab:not(.on) .pane-tab-label,
.pane-tabs.compact .pane-tab:not(.on) .pane-tab-x {
    display: none;
}

.pane-tabs.compact .pane-tab:not(.on):hover .pane-tab-x {
    display: grid;
}
</style>
