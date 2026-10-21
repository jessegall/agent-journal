<script setup>
import CommentToggle from "./CommentToggle.vue";
import ResourceActions from "./ResourceActions.vue";
import ShareButton from "./ShareButton.vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {useScope} from "../composables/scope.js";
import {meta, SHARED} from "../domain/tables.js";

defineProps({resource: {type: Object, required: true}});
const emit = defineEmits(["edit", "close"]);
const scope = useScope();
</script>

<template>
    <div class="controls">
        <ResourceActions :resource="resource" @edit="emit('edit')" @close="emit('close')" />
        <span class="controls-end">
            <template v-if="meta(resource.table).exports">
                <Btn
                    small
                    class="download"
                    :href="scope.api.exportUrl(resource.table, resource.id)"
                    download
                    :title="`Download the ${meta(resource.table).title.toLowerCase()} as a file`"
                >
                    <Icon name="download" :size="13" />
                    Download
                </Btn>
            </template>
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
