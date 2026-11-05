<script setup>
// the line at the foot of the chat that names what the agent runs: the command rolls up out of the way when the next one comes, and an idle word shows when none runs
defineProps({text: {type: String, default: ""}, idle: {type: String, default: "waiting"}});
</script>

<template>
    <span class="running" data-running-command>
        <Transition name="roll" mode="out-in">
            <span v-if="text" :key="text" class="running-line" :title="text">{{ text }}</span>
            <span v-else key="idle" class="running-idle">{{ idle }}</span>
        </Transition>
    </span>
</template>

<style scoped>
.running {
    --command-in: 180ms;
    --command-out: 150ms;
    flex: 0 1 auto;
    min-width: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 10.5px;
    color: var(--text-3);
    pointer-events: none;
}

.running-line {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    opacity: 0.75;
}

.running-idle {
    display: inline-block;
    max-width: 44ch;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.roll-enter-active {
    transition:
        opacity var(--command-in) ease,
        transform var(--command-in) cubic-bezier(0.22, 0.7, 0.3, 1);
}

.roll-leave-active {
    transition:
        opacity var(--command-out) ease,
        transform var(--command-out) cubic-bezier(0.22, 0.7, 0.3, 1);
}

.roll-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.roll-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
