<script setup>
import SkeletonLine from "./SkeletonLine.vue";

defineProps({count: {type: Number, default: 3}});

const KIND = [{width: "64px", height: 8}];
const TITLE = [{width: "70%", height: 12}];
const LINE = [{width: "45%", height: 9}];
</script>

<template>
    <div class="card-skeletons" aria-busy="true" aria-label="Searching">
        <template v-for="index in count" :key="index">
            <div class="card-skeleton">
                <SkeletonLine :bars="KIND" />
                <SkeletonLine :bars="TITLE" />
                <SkeletonLine :bars="LINE" />
            </div>
        </template>
    </div>
</template>

<style scoped>
.card-skeletons {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.card-skeleton {
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
}
</style>
