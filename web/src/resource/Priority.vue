<script setup>
import {computed, onUnmounted, ref} from "vue";
import {api} from "../api/client.js";
import PriorityIcon from "../kit/PriorityIcon.vue";
import {route} from "../route.js";
import {useOutside} from "../composables/outside.js";

const LEVELS = [
    {value: "low", n: 50},
    {value: "default", n: 100},
    {value: "high", n: 150},
    {value: "critical", n: 200},
];
const props = defineProps({resource: Object});
const open = ref(false);
const wrap = ref(null);
const current = computed(() => Number(props.resource.data.priority ?? 100));
const name = computed(() => (current.value >= 200 ? "Critical" : current.value > 100 ? "High" : current.value < 100 ? "Low" : "Default"));
useOutside(wrap, () => (open.value = false));

async function pick(level) {
    open.value = false;
    if (level.n === current.value) return;
    await api.act(props.resource.type, props.resource.n, "priority", {value: level.value});
}
</script>

<template>
    <span ref="wrap" class="prio-wrap">
        <button type="button" :class="['prio-btn', {open}]" :aria-expanded="open" title="Priority" @click="open = !open">
            <PriorityIcon :value="current" />
            {{ name }}
        </button>
        <Transition name="drop">
            <div v-if="open" class="prio-menu">
                <template v-for="l in LEVELS" :key="l.value">
                    <button type="button" :class="['prio-row', {on: l.n === current}]" @click="pick(l)">
                        <PriorityIcon :value="l.n" />
                        {{ l.value.replace(/^\w/, (c) => c.toUpperCase()) }}
                    </button>
                </template>
            </div>
        </Transition>
    </span>
</template>

<style scoped>
.prio-wrap {
    position: relative;
    display: inline-flex;
}

.prio-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 24px;
    padding: 0 8px;
    border: 1px solid transparent;
    border-radius: 6px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.prio-btn:hover,
.prio-btn.open {
    border-color: var(--border-2);
    background: var(--hover);
    color: var(--text);
}

.prio-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 20;
    min-width: 140px;
    padding: 4px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
}

.prio-row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 6px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.prio-row:hover {
    background: var(--hover);
    color: var(--text);
}

.prio-row.on {
    color: var(--accent-text);
}
</style>
