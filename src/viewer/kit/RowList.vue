<script setup>
import EmptyState from "../src/kit/EmptyState.vue";

defineProps({
    rows: {type: Array, required: true},
    failure: {type: String, default: ""},
    empty: {type: String, required: true},
});
</script>

<template>
    <p v-if="failure" class="row-list-failure">{{ failure }}</p>
    <EmptyState v-else-if="!rows.length" :title="empty" />
    <ul v-else class="row-list">
        <li v-for="row in rows" :key="row.id" class="row-list-row">
            <slot :row="row" />
        </li>
    </ul>
</template>

<style scoped>
.row-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.row-list-row {
    display: flex;
    gap: 10px;
    align-items: baseline;
    padding: 6px 8px;
    border-radius: 6px;
    color: var(--text);
}

.row-list-row:hover {
    background: var(--bg-2, rgba(255, 255, 255, 0.03));
}

.row-list-failure {
    margin: 0;
    color: var(--text-2);
}
</style>
