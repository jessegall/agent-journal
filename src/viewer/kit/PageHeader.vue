<script setup>
// a page's header: its title and count, then the primary action and the actions menu at the right edge
defineProps({title: {type: String, required: true}, count: {type: Number, default: null}});
</script>

<template>
    <header class="page-header" data-page-header>
        <h1 class="page-title">{{ title }}<template v-if="count !== null">
  <span class="page-count" data-page-count>{{ count }}</span>
</template></h1>
        <span class="page-header-end">
            <slot name="primary" />
            <slot name="actions" />
        </span>
    </header>
</template>

<style scoped>
.page-header {
    display: flex;
    flex: none;
    align-items: center;
    gap: var(--s3);
    padding: 14px var(--inset) 12px;
}

.page-title {
    display: flex;
    flex: 1;
    align-items: baseline;
    gap: var(--s2);
    min-width: 0;
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.page-count {
    color: var(--text-3);
    font-size: 12.5px;
    font-weight: 400;
    font-variant-numeric: tabular-nums;
}

.page-header-end {
    display: flex;
    align-items: center;
    gap: var(--s2);
}
</style>
