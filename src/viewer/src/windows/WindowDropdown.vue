<script setup>
import {computed, onUnmounted} from "vue";
import WindowPane from "./WindowPane.vue";

// what a bar button opens under itself, over the page: one window, or several as groups under sticky headers with a count each; it closes on
// a click outside or on escape
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
const grouped = computed(() => props.groups.length > 1);
const placed = computed(() => {
    const smallest = grouped.value ? GROUPED_WIDTH_PIXELS : SMALLEST_WIDTH_PIXELS;
    const box = props.anchor?.getBoundingClientRect();
    const size = {minWidth: `${smallest}px`, maxWidth: `min(${MOST_WIDTH_PIXELS}px, calc(100vw - ${2 * EDGE_PIXELS}px))`};
    if (!box) return size;
    const top = `${box.bottom + GAP_PIXELS}px`;
    return box.left + MOST_WIDTH_PIXELS + EDGE_PIXELS > window.innerWidth ? {...size, top, left: "auto", right: `${EDGE_PIXELS}px`} : {...size, top, left: `${box.left}px`};
});
</script>

<template>
    <div class="dropdown-veil" data-dropdown-veil @click.self="emit('close')">
        <div class="dropdown" :data-dropdown="groups.map((group) => group.name).join(' ')" role="dialog" :style="placed">
            <template v-for="group in groups" :key="group.name">
                <template v-if="grouped">
                    <h3 class="group-head" data-dropdown-group>
                        {{ group.title }}<span class="group-count" data-dropdown-count>{{ group.count }}</span>
                    </h3>
                </template>
                <WindowPane dropdown :name="group.name" :catalogue="catalogue" :subscriptions="subscriptions" :environment="environment" :agent="agent" :prompts="prompts" :shell-read="shellRead" />
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

.dropdown {
    position: absolute;
    top: 84px;
    left: 240px;
    overflow: auto;
    overflow-wrap: anywhere;
    box-sizing: border-box;
    width: fit-content;
    padding: 14px 16px;
    max-height: calc(100vh - 110px);
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
}

.group-head {
    position: sticky;
    z-index: 1;
    top: -14px;
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px 0;
    margin: 0;
    background: var(--raised);
    color: var(--text-2);
    font-size: 12px;
    font-weight: 500;
}

.group-count {
    padding: 0 6px;
    border-radius: 8px;
    background: var(--hover);
    color: var(--text-3);
    font-size: 11px;
}
</style>
