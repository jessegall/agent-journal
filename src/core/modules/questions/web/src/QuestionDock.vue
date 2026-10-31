<script setup>
defineProps({row: {type: Object, default: null}});
</script>

<template>
    <div class="question-dock">
        <template v-if="row">
            <span class="question-dock-state">{{ row.state }}</span>
            <span class="question-dock-text">{{ row.text }}</span>
        </template>
    </div>
</template>

<style scoped>
.question-dock {
    display: flex;
    gap: 8px;
    font-size: 12px;
    line-height: 1.45;
}

.question-dock-state {
    color: var(--text-4);
}
</style>
