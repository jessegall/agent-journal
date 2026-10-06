<script setup>
import ResourceMenu from "./ResourceMenu.vue";

defineProps({resource: {type: Object, required: true}});
</script>

<template>
    <span class="resource-end">
        <template v-if="resource.data.system">
            <span class="resource-end-mark" title="Comes with the journal. It cannot be closed or deleted.">Comes with the journal</span>
        </template>
        <template v-else>
            <ResourceMenu :resource="resource" />
        </template>
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
