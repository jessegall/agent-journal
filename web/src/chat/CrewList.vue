<script setup>
import {computed, onUnmounted, ref} from "vue";
import {span} from "../store.js";

const props = defineProps({
    rows: {type: Array, default: () => []},
    total: {type: Number, default: 0},
    started: {type: String, default: "started"},
});
const emit = defineEmits(["open"]);
const now = ref(Date.now() / 1000);
const clock = setInterval(() => (now.value = Date.now() / 1000), 1000);
const listed = computed(() => [...props.rows.filter((r) => r.running), ...props.rows.filter((r) => !r.running).reverse()]);
const running = computed(() => props.rows.filter((r) => r.running).length);

function lasted(row) {
    if (!row.at) return "";
    return row.running ? `running ${span(now.value - row.at)}` : `${row.status || "finished"} · ${span((row.ended || row.at) - row.at)}`;
}

function detail(row) {
    return row.command && row.task ? row.command : row.cell || [row.type, row.model].filter(Boolean).join(" · ");
}

onUnmounted(() => clearInterval(clock));
</script>

<template>
    <p class="crew-none">{{ running }} running, {{ total }} {{ started }} in this session.</p>
    <template v-for="row in listed" :key="row.id || row.cell || `${row.task}-${row.model}`">
        <button
            type="button"
            :class="['crew-row', {done: !row.running}]"
            :disabled="!row.session"
            :title="row.session ? 'Open this session' : ''"
            @click="emit('open', row)"
        >
            <span :class="['crew-dot', {on: row.running}]" />
            <span class="crew-what">
                {{ row.task || row.command }}
                <small>{{ detail(row) }}</small>
            </span>
            <small class="crew-when">{{ lasted(row) }}</small>
        </button>
    </template>
</template>

<style scoped>
.crew-none {
    margin: 0;
    padding: 6px 8px;
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 1.4;
}

.crew-row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font-size: 12px;
    text-align: left;
}

.crew-row:not(:disabled) {
    cursor: pointer;
}

.crew-row:not(:disabled):hover {
    background: var(--hover);
}

.crew-row.done {
    opacity: 0.6;
}

.crew-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-3);
}

.crew-dot.on {
    background: var(--created);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--created) 25%, transparent);
}

.crew-what {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.crew-what small {
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text-3);
    font-size: 11px;
}

.crew-when {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}
</style>
