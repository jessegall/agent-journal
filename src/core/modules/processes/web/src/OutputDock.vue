<script setup>
defineProps({row: {type: Object, default: null}});
</script>

<template>
    <div class="output-dock">
        <template v-if="row">
            <span class="output-dock-state">{{ row.state }}</span>
            <span class="output-dock-line">{{ row.line }}</span>
        </template>
    </div>
</template>

<style scoped>
.output-dock {
    display: flex;
    gap: 8px;
    font-size: 12px;
    line-height: 1.45;
}

.output-dock-state {
    color: var(--text-4);
}

.output-dock-line {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
