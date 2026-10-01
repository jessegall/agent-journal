<script setup>
import GoalPoints from "./GoalPoints.vue";

defineProps({goal: {type: String, default: ""}, doneWhen: {type: Array, required: true}});
</script>

<template>
    <div class="brief">
        <GoalPoints :goal="goal" :points="doneWhen" />
    </div>
</template>

<style scoped>
.brief {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
}

.brief :deep(.goal-whole) {
    margin: 0;
    color: var(--text);
    font-weight: 500;
}

.brief :deep(.goal-points) {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding-left: 18px;
    color: var(--text-2);
    font-size: 12.5px;
}
</style>
