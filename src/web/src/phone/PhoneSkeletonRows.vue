<script setup>
const props = defineProps({count: {type: Number, default: 3}});
const WIDTHS = ["72%", "58%", "66%", "48%", "62%"];
const rows = Array.from({length: props.count}, (_, i) => ({id: `row-${i}`, width: WIDTHS[i % WIDTHS.length]}));
</script>

<template>
    <ul class="skeleton-rows" aria-hidden="true">
        <template v-for="row in rows" :key="row.id">
            <li class="skeleton-row">
                <span class="shimmer" :style="{width: row.width}" />
                <span class="shimmer skeleton-age" />
            </li>
        </template>
    </ul>
</template>

<style scoped>
.skeleton-rows {
    margin: 0;
    padding: 0;
    list-style: none;
}

.skeleton-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 44px;
    padding: 11px 16px;
}

.skeleton-row + .skeleton-row {
    border-top: 1px solid var(--line);
}

.skeleton-row .shimmer {
    height: 14px;
}

.skeleton-age {
    width: 44px;
    flex: none;
}
</style>
