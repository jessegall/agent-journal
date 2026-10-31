<script setup>
import AgentBar from "../chat/AgentBar.vue";
import Thread from "../chat/Thread.vue";
</script>

<template>
    <div class="chat-window">
        <AgentBar />
        <Thread />
    </div>
</template>

<style scoped>
.chat-window {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg);
}

.chat-window > :deep(.thread) {
    padding: 0 12px;
}

@keyframes blink {
    0%,
    100% {
        opacity: 0.4;
    }

    50% {
        opacity: 1;
    }
}
</style>
