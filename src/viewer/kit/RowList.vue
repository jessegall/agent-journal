<script setup>
import EmptyState from "../src/kit/EmptyState.vue";
import Skeleton from "../src/kit/Skeleton.vue";

defineProps({
    rows: {type: Array, required: true},
    failure: {type: String, default: ""},
    empty: {type: String, required: true},
    loaded: {type: Boolean, required: true},
    // what the skeleton looks like while the first read is out: the shape of what is coming
    shape: {type: String, default: "rows"},
});
</script>

<template>
    <template v-if="!loaded && !failure">
        <Skeleton :shape="shape" />
    </template>
    <template v-else-if="failure">
        <p class="row-list-failure">{{ failure }}</p>
    </template>
    <template v-else-if="!rows.length && loaded">
        <EmptyState :title="empty" />
    </template>
    <template v-else>
        <ul class="row-list">
            <template v-for="row in rows" :key="row.id">
                <li class="row-list-row">
                    <slot :row="row" />
                </li>
            </template>
        </ul>
    </template>
</template>

<style scoped>
.row-list {
    animation: row-list-in 0.25s ease both;
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

@keyframes row-list-in {
    from {
        opacity: 0;
    }
}
</style>
