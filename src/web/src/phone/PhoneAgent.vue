<script setup>
defineProps({state: {type: String, required: true}, auto: {type: Boolean, default: false}});
const WORDS = {offline: "Not running", idle: "Idle", working: "Working"};
</script>

<template>
    <span :class="['agent-state', state]">
        <span class="agent-dot" />
        {{ WORDS[state] }}
        <template v-if="auto">
            <span class="agent-auto">auto</span>
        </template>
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

.agent-auto {
    padding: 1px 6px;
    border-radius: 8px;
    background: color-mix(in oklab, var(--accent) 24%, transparent);
    color: var(--accent-text);
    font-size: 0.647rem;
    font-weight: 700;
    line-height: 1.3;
}

.agent-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--text-4);
}

.idle .agent-auto {
    padding: 1px 6px;
    border-radius: 8px;
    background: color-mix(in oklab, var(--accent) 24%, transparent);
    color: var(--accent-text);
    font-size: 0.647rem;
    font-weight: 700;
    line-height: 1.3;
}

.agent-dot {
    background: var(--tone-good);
}

.working {
    color: var(--text);
}

.working .agent-auto {
    padding: 1px 6px;
    border-radius: 8px;
    background: color-mix(in oklab, var(--accent) 24%, transparent);
    color: var(--accent-text);
    font-size: 0.647rem;
    font-weight: 700;
    line-height: 1.3;
}

.agent-dot {
    background: var(--accent);
    animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
    50% {
        opacity: 0.35;
    }
}

@media (prefers-reduced-motion: reduce) {
    .working .agent-auto {
    padding: 1px 6px;
    border-radius: 8px;
    background: color-mix(in oklab, var(--accent) 24%, transparent);
    color: var(--accent-text);
    font-size: 0.647rem;
    font-weight: 700;
    line-height: 1.3;
}

.agent-dot {
        animation: none;
    }
}
</style>
