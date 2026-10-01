<script setup>
import AttachFiles from "./AttachFiles.vue";
import CommentToggle from "./CommentToggle.vue";
import Priority from "./Priority.vue";
import ResourceActions from "./ResourceActions.vue";
import ShareButton from "./ShareButton.vue";

defineProps({
    resource: {type: Object, required: true},
    standing: {type: Boolean, default: false},
    system: {type: Boolean, default: false},
    ranked: {type: Boolean, default: false},
});
const emit = defineEmits(["edit", "close"]);
const SHARED = ["doc", "collection", "report"];
</script>

<template>
    <div class="controls">
        <ResourceActions :resource="resource" @edit="emit('edit')" @close="emit('close')" />
        <span class="controls-end">
            <template v-if="standing && !system">
                <AttachFiles :resource="resource" />
            </template>
            <template v-if="SHARED.includes(resource.type) && !system">
                <ShareButton :resource="resource" />
            </template>
            <CommentToggle :resource="resource" />
        </span>
        <template v-if="ranked">
            <Priority :resource="resource" />
        </template>
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
