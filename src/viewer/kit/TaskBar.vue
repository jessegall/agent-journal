<script setup>
// a thin bar of the tasks given: the finished ones, then those in testing in a lighter blue, out of all of them
const props = defineProps({total: {type: Number, required: true}, done: {type: Number, required: true}, testing: {type: Number, required: true}});
const share = (count) => (props.total ? Math.round((count / props.total) * 100) : 0);
</script>

<template>
    <span class="task-bar"><span class="task-bar-fill" data-task-bar-done :style="{width: `${share(done)}%`}" /><span class="task-bar-testing" data-task-bar-testing :style="{width: `${share(testing)}%`}" /></span>
</template>

<style scoped>
.task-bar {
    display: flex;
    height: 4px;
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
    background: color-mix(in srgb, var(--accent) 40%, transparent);
}
</style>
