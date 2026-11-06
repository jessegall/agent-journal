<script setup>
defineProps({count: {type: String, required: true}, rate: {type: String, required: true}});
</script>

<template>
    <span class="agent-count" data-agent-motion>
        <template v-if="rate"><span class="agent-pace" data-agent-pace>{{ rate }}</span></template>
        <span class="agent-tasks" data-agent-tasks>{{ count }}</span>
    </span>
</template>

<style scoped>
.agent-count { display: inline-flex; flex: none; align-items: baseline; gap: 8px; }
.agent-pace { color: var(--text-4); font-size: 10.5px; }
.agent-tasks { color: var(--text-2); font-size: 12px; }
</style>
