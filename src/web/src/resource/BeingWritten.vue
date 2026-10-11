<script setup>
defineProps({
    writing: {type: Object, required: true},
});
const emit = defineEmits(["follow"]);
</script>

<template>
    <button type="button" class="written" title="Go to what the agent is writing" @click="emit('follow')">
        <span class="track">
            <span class="sweep" />
        </span>
        <span class="words">
            The agent is still writing this
            <template v-if="writing.section">
                <span class="where">{{ writing.section }}</span>
            </template>
        </span>
    </button>
</template>

<style scoped>
.written {
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    background: none;
    text-align: left;
    cursor: pointer;
}

.track {
    display: block;
    height: 2px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--border);
}

.sweep {
    display: block;
    width: 40%;
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    animation: sweep 1.8s ease-in-out infinite;
}

.words {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding-top: 5px;
    color: var(--accent-text);
    font-size: 11px;
}

.where {
    color: var(--text-3);
}

.where::before {
    content: "·";
    padding-right: 6px;
}

.written:hover .words {
    color: var(--text);
}

@keyframes sweep {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(250%);
    }
}

@media (prefers-reduced-motion: reduce) {
    .sweep {
        width: 100%;
        animation: none;
    }
}
</style>
