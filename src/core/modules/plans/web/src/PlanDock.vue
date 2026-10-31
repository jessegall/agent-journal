<script setup>
defineProps({row: {type: Object, default: null}});
</script>

<template>
    <div class="plan-dock">
        <template v-if="row">
            <span class="plan-dock-state">{{ row.state }}</span>
            <span class="plan-dock-title">{{ row.title }}</span>
        </template>
    </div>
</template>

<style scoped>
.plan-dock {
    display: flex;
    gap: 8px;
    font-size: 12px;
    line-height: 1.45;
}

.plan-dock-state {
    color: var(--text-4);
}
</style>
