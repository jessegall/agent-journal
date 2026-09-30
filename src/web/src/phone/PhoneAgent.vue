<script setup>
defineProps({running: Boolean});
</script>

<template>
    <span :class="['agent-state', {running}]">
        <span class="agent-dot" />
        {{ running ? "Agent running" : "No agent running" }}
    </span>
</template>

<style scoped>
.agent-state {
    display: flex;
    min-height: 24px;
    align-items: center;
    gap: 6px;
    color: var(--text-3);
    font-size: 13px;
}

.agent-state.running {
    color: var(--text-2);
}

.agent-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--text-4);
}

.running .agent-dot {
    background: var(--tone-good);
}
</style>
