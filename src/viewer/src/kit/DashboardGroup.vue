<script setup>
import {computed} from "vue";
import DashboardNode from "./DashboardNode.vue";

const LAYOUTS = {
    stack: (node) => ({gap: `${node.gap || 14}px`}),
    row: (node) => ({gap: `${node.gap || 12}px`}),
    grid: (node) => ({gap: `${node.gap || 12}px`, gridTemplateColumns: `repeat(${node.columns || 2}, minmax(0, 1fr))`}),
};

const props = defineProps({node: {type: Object, required: true}});
const emit = defineEmits(["open", "file"]);
const laid = computed(() => LAYOUTS[props.node.type](props.node));
</script>

<template>
    <div :class="[node.type, {wrap: node.type === 'row' && node.wrap !== false}]" :style="laid">
        <template v-for="(child, at) in node.children || []" :key="at">
            <DashboardNode :node="child" @open="emit('open', $event)" @file="emit('file', $event)" />
        </template>
    </div>
</template>

<style scoped>
.stack {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    align-items: stretch;
}

.row.wrap {
    flex-wrap: wrap;
}

.grid {
    display: grid;
}
</style>
