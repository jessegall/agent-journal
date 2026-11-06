<script setup>
import {computed} from "vue";
import {WindowRoom, useWindow} from "@journal/window-kit";

// the main agent's context window as version 4's context menu drew it: a meter of how full it is, and when it was last compacted
const window = useWindow();
const {data: usage} = window.props.usage;
const main = computed(() => usage.value?.agents?.find((agent) => agent.role === "main") ?? null);
const compacted = computed(() => (main.value?.last_compacted_at ? new Date(main.value.last_compacted_at).toLocaleString() : "Not yet"));

</script>

<template>
    <WindowRoom padding="14px 16px">
        <p class="current">Context window</p>
        <div class="meter" data-context-meter>
            <span>Used</span>
            <strong>{{ Math.round(main?.context_percent ?? 0) }}%</strong>
            <span class="track"><span :style="{width: `${main?.context_percent ?? 0}%`}" /></span>
            <small data-last-compacted>Last compacted: {{ compacted }}</small>
        </div>
    </WindowRoom>
</template>

<style scoped>
.current {
    margin: 0;
    padding: 2px 0 6px;
    color: var(--text);
    font-size: 12px;
}

.meter {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 4px 8px;
    padding: 6px 0;
    color: var(--text-2);
    font-size: 11.5px;
}

.meter strong {
    color: var(--text);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.track {
    grid-column: 1 / -1;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--line);
}

.track > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--accent-text);
}

.meter small {
    grid-column: 1 / -1;
    color: var(--text-3);
    font-size: 10.5px;
}

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
