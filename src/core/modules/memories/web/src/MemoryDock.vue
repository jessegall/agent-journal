<script setup>
defineProps({row: {type: Object, default: null}});
</script>

<template>
    <div class="memory-dock">
        <template v-if="row">
            <span class="memory-dock-weight">weight {{ row.weight }}</span>
            <span class="memory-dock-text">{{ row.text }}</span>
        </template>
    </div>
</template>

<style scoped>
.memory-dock {
    display: flex;
    gap: 8px;
    font-size: 12px;
    line-height: 1.45;
}

.memory-dock-weight {
    color: var(--text-4);
}
</style>
