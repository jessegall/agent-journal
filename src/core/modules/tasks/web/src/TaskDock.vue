<script setup>
defineProps({row: {type: Object, default: null}});
</script>

<template>
    <div class="task-dock">
        <template v-if="row">
            <span class="task-dock-state">{{ row.state }}</span>
            <span class="task-dock-title">{{ row.title }}</span>
        </template>
    </div>
</template>

<style scoped>
.task-dock {
    display: flex;
    gap: 8px;
    font-size: 12px;
    line-height: 1.45;
}

.task-dock-state {
    color: var(--text-4);
}
</style>
