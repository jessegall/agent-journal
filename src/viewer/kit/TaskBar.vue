<script setup>
// a thin bar of the tasks given: the finished ones in full blue, those in testing lighter, the started ones faint, out of all of them
const props = defineProps({total: {type: Number, required: true}, done: {type: Number, required: true}, testing: {type: Number, required: true}, started: {type: Number, default: 0}});
const share = (count) => (props.total ? Math.round((count / props.total) * 100) : 0);
</script>

<template>
    <span class="task-bar"><span class="task-bar-fill" data-task-bar-done :style="{width: `${share(done)}%`}" /><span class="task-bar-testing" data-task-bar-testing :style="{width: `${share(testing)}%`}" /><span class="task-bar-started" data-task-bar-started :style="{width: `${share(started)}%`}" /></span>
</template>

<style scoped>
.task-bar {
    display: flex;
    height: 5px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--chip);
}

.task-bar-fill {
    display: block;
    height: 100%;
    background: var(--accent);
}

.task-bar-testing {
    display: block;
    height: 100%;
    background: color-mix(in srgb, var(--accent) 60%, transparent);
}

.task-bar-started {
    display: block;
    height: 100%;
    background: color-mix(in srgb, var(--accent) 25%, transparent);
}
</style>
