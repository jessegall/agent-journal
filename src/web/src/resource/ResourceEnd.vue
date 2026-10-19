<script setup>
import ResourceMenu from "./ResourceMenu.vue";

defineProps({resource: {type: Object, required: true}});
</script>

<template>
    <span class="resource-end">
        <ResourceMenu :resource="resource" />
    </span>
</template>

<style scoped>
.resource-end {
    position: absolute;
    right: 14px;
    bottom: 10px;
    z-index: 1;
    display: inline-flex;
    align-items: center;
}

.resource-end-mark {
    color: var(--text-3);
    font-size: 11.5px;
}
</style>
