<script setup>
import {computed, ref} from "vue";
import {Icon, WindowRoom, useWindow} from "@journal/window-kit";

// the number of workers this environment has out, as version 4's status bar showed it; a click opens the list of what they are doing
const context = useWindow();
const out = ref(0);
const tip = computed(() => (out.value ? `${out.value} ${out.value === 1 ? "worker" : "workers"} out` : "Workers"));

async function load() {
    const answer = await context.read(`worker waits --environment ${context.environment}`);
    out.value = answer.ok ? answer.value.rows.length : 0;
}

const openList = (event) => window.dispatchEvent(new CustomEvent("journal:open-dropdown", {detail: {name: "workers.workers", anchor: event.currentTarget}}));

context.follow(["agent.*", "task.*", "worker_worktree.*"], load);
load();
</script>

<template>
    <WindowRoom>
        <button type="button" class="workers-count" data-workers-count :title="tip" @click="openList">
            <Icon name="agents" :size="12" />
            {{ out }}
        </button>
    </WindowRoom>
</template>

<style scoped>
.workers-count {
    display: inline-flex;
    gap: 5px;
    align-items: center;
    padding: 2px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
}

.workers-count:hover {
    background: var(--hover);
    color: var(--text);
}
</style>
