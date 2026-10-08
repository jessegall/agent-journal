<script setup>
import Skeleton from "./Skeleton.vue";

defineProps({title: {type: String, default: ""}, loading: Boolean, shape: {type: String, default: "rows"}});
</script>

<template>
    <template v-if="loading">
        <Skeleton :shape="shape" />
    </template>
    <template v-else-if="title">
        <div class="empty-state titled">
            <p class="empty-state-title">{{ title }}</p>
            <p class="empty-state-text"><slot /></p>
        </div>
    </template>
    <template v-else>
        <p class="empty-state"><slot /></p>
    </template>
</template>

<style scoped>
.empty-state {
    margin: 0;
    color: var(--text-3);
}

.empty-state.titled {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 24px;
    text-align: center;
    pointer-events: none;
    animation: empty-state-in 0.3s both;
}

.empty-state-title {
    margin: 0;
    color: var(--text-2);
    font-size: 14px;
    font-weight: 500;
}

.empty-state-text {
    max-width: 300px;
    margin: 0;
    color: var(--text-4);
    font-size: 12.5px;
    line-height: 1.5;
    text-wrap: pretty;
}

@keyframes empty-state-in {
    from {
        opacity: 0;
    }
}
</style>
