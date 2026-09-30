<script setup>
const BUBBLES = [
    {id: "a", side: "agent", width: "72%", lines: 3},
    {id: "b", side: "user", width: "48%", lines: 1},
    {id: "c", side: "agent", width: "64%", lines: 2},
    {id: "d", side: "agent", width: "40%", lines: 1},
    {id: "e", side: "user", width: "58%", lines: 2},
    {id: "f", side: "agent", width: "70%", lines: 3},
];
</script>

<template>
    <div class="skeleton" role="status">
        <span class="phone-hidden">Loading</span>
        <template v-for="bubble in BUBBLES" :key="bubble.id">
            <div :class="['skeleton-bubble', bubble.side]" :style="{width: bubble.width, height: `${bubble.lines * 20 + 16}px`}" aria-hidden="true" />
        </template>
    </div>
</template>

<style scoped>
.skeleton {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 10px;
    flex: 1;
    min-height: 0;
    padding: 12px 0;
    overflow: hidden;
}

.skeleton-bubble {
    border-radius: 18px;
    background: linear-gradient(90deg, var(--raised) 30%, var(--hover) 50%, var(--raised) 70%) 0 0 / 300% 100%;
    animation: shimmer 1.4s linear infinite;
}

.skeleton-bubble.agent {
    align-self: flex-start;
}

.skeleton-bubble.user {
    align-self: flex-end;
    background-color: var(--accent-dim);
    opacity: 0.6;
}

@keyframes shimmer {
    from {
        background-position: 100% 0;
    }

    to {
        background-position: 0 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .skeleton-bubble {
        animation: none;
    }
}
</style>
