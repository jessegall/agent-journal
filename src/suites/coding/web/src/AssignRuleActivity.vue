<script setup>
// what one rule did lately: how many tasks it gave in the last day, or that it never matched, and why it was last skipped
defineProps({activity: {type: Object, required: true}});
</script>

<template>
    <span class="activity" data-assign-activity>{{ activity.text }}</span>
    <template v-if="activity.last_skip">
        <span class="activity" data-assign-last-skip>Last skipped: {{ activity.last_skip }}</span>
    </template>
</template>

<style scoped>
.activity { color: var(--text-3); font-size: 11.5px; }
</style>
