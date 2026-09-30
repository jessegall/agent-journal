<script setup>
defineProps({state: {type: String, required: true}});
const WORDS = {offline: "Not running", idle: "Idle", working: "Working"};
</script>

<template>
    <span :class="['agent-state', state]">
        <span class="agent-dot" />
        {{ WORDS[state] }}
    </span>
</template>

<style scoped>
.agent-state {
    display: flex;
    min-height: 26px;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
    border: 1px solid var(--border-2);
    border-radius: 13px;
    color: var(--text-3);
    font-size: 0.765rem;
}

.agent-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--text-4);
}

.idle .agent-dot {
    background: var(--tone-good);
}

.working {
    color: var(--text);
}

.working .agent-dot {
    background: var(--accent);
    animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
    50% {
        opacity: 0.35;
    }
}

@media (prefers-reduced-motion: reduce) {
    .working .agent-dot {
        animation: none;
    }
}
</style>
