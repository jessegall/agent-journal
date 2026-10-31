<script setup>
defineProps({phases: {type: Array, default: () => []}});
</script>

<template>
    <aside class="share-timeline" data-share-part="timeline">
        <h3>Timeline</h3>
        <ol>
            <template v-for="phase in phases" :key="phase.id">
                <li>
                    <span class="place">{{ phase.position }}</span>
                    <span class="title">{{ phase.title }}</span>
                </li>
            </template>
        </ol>
    </aside>
</template>

<style scoped>
.share-timeline {
    min-height: 0;
    overflow-y: auto;
    padding: 24px;
    border-left: 1px solid var(--border);
    background: var(--side);
}

h3 {
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 600;
}

ol {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
}

li {
    display: flex;
    gap: 10px;
    color: var(--text-2);
    font-size: 13px;
}

.place {
    flex: none;
    color: var(--text-4);
}

@media (max-width: 760px) {
    .share-timeline {
        border-top: 1px solid var(--border);
        border-left: 0;
    }
}
</style>
