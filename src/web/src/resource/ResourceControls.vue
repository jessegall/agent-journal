<script setup>
import CommentToggle from "./CommentToggle.vue";
import ResourceActions from "./ResourceActions.vue";
import ShareButton from "./ShareButton.vue";
import {SHARED} from "../domain/tables.js";

defineProps({resource: {type: Object, required: true}});
const emit = defineEmits(["edit", "close"]);
</script>

<template>
    <div class="controls">
        <ResourceActions :resource="resource" @edit="emit('edit')" @close="emit('close')" />
        <span class="controls-end">
            <template v-if="SHARED.includes(resource.table)">
                <ShareButton :resource="resource" />
            </template>
            <CommentToggle :resource="resource" />
        </span>
    </div>
</template>

<style scoped>
.controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.controls-end {
    order: 2;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
}
</style>
