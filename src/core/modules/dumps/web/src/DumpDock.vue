<script setup>
defineProps({row: {type: Object, default: null}});
</script>

<template>
    <div class="dump-dock">
        <template v-if="row">
            <span class="dump-dock-title">{{ row.title || `Dump ${row.id}` }}</span>
            <span class="dump-dock-brief">{{ row.outcome || row.brief }}</span>
        </template>
    </div>
</template>

<style scoped>
.dump-dock {
    display: flex;
    gap: 8px;
    font-size: 12px;
    line-height: 1.45;
}

.dump-dock-title {
    color: var(--text-4);
}
</style>
