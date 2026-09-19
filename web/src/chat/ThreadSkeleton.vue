<script setup>
const rows = [3, 1, 2, 4, 2];
</script>

<template>
    <div class="thread-skeleton" aria-label="Loading messages">
        <div v-for="(lines, i) in rows" :key="i" :class="['thread-turn', {mine: i % 2}]">
            <div class="thread-bubble">
                <span v-for="line in lines" :key="line" class="thread-blank" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.thread-skeleton {
    order: 1;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 7px;
    padding: 14px 8px 12px;
    overflow: hidden;
}

.thread-turn {
    display: flex;
    flex-direction: column;
    width: 60%;
    max-width: 88%;
}

.thread-turn.mine {
    align-self: flex-end;
}

.thread-bubble {
    display: flex;
    flex-direction: column;
    gap: 7px;
    width: 100%;
    padding: 12px;
    border: 1px solid transparent;
    border-radius: 9px;
    background: color-mix(in srgb, var(--raised) 55%, transparent);
    animation: thread-wait 1.6s ease-in-out infinite;
}

.thread-blank {
    display: block;
    width: 100%;
    height: 9px;
    border-radius: 99px;
    background: color-mix(in srgb, var(--text-3) 22%, transparent);
}

.thread-blank:not(:only-child):last-child {
    width: 62%;
    opacity: 0.6;
}

@keyframes thread-wait {
    0%,
    100% {
        opacity: 0.45;
    }

    50% {
        opacity: 0.8;
    }
}
</style>
