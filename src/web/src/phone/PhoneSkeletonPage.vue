<script setup>
import PhoneSkeletonRows from "./PhoneSkeletonRows.vue";

defineProps({kind: {type: String, default: ""}});
const LINES = [
    {id: "a", width: "96%"},
    {id: "b", width: "92%"},
    {id: "c", width: "88%"},
    {id: "d", width: "94%"},
    {id: "e", width: "60%"},
];
</script>

<template>
    <div class="skeleton-page" role="status">
        <span class="phone-hidden">Loading</span>
        <span class="shimmer skeleton-kind" aria-hidden="true" />
        <span class="shimmer skeleton-title" aria-hidden="true" />
        <span class="shimmer skeleton-title short" aria-hidden="true" />
        <template v-if="kind === 'todo'">
            <div class="skeleton-card" aria-hidden="true">
                <PhoneSkeletonRows :count="3" />
            </div>
        </template>
        <template v-else>
            <template v-for="line in LINES" :key="line.id">
                <span class="shimmer skeleton-line" :style="{width: line.width}" aria-hidden="true" />
            </template>
        </template>
    </div>
</template>

<style scoped>
.skeleton-page {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    padding: 8px 0 24px;
}

.skeleton-kind {
    width: 110px;
    height: 12px;
    margin-bottom: 4px;
}

.skeleton-title {
    width: 86%;
    height: 26px;
}

.skeleton-title.short {
    width: 52%;
    margin-bottom: 10px;
}

.skeleton-card {
    overflow: hidden;
    border-radius: 12px;
    background: var(--raised);
}

.skeleton-line {
    height: 15px;
}
</style>
