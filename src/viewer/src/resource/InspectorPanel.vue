<script setup>
import {computed} from "vue";
import Skeleton from "../kit/Skeleton.vue";
import {inspectorWidth} from "../domain/inspectorWidths.js";
import Inspector from "./Inspector.vue";
import InspectorHead from "./InspectorHead.vue";

// the side panel of a declared inspector: the dialog with the width its declaration asks for, over the shared layout
const props = defineProps({
    noun: {type: String, required: true},
    id: {type: Number, required: true},
    table: {type: String, required: true},
    read: {type: Function, required: true},
    catalogue: {type: Object, required: true},
    environment: {type: String, required: true},
    readOnly: Boolean,
    backed: Boolean,
    opening: Boolean,
});
const emit = defineEmits(["close", "back", "open"]);
const listing = computed(() => props.catalogue.inspector(props.noun));
</script>

<template>
    <aside
        :class="['panel', 'declared', {opening}]"
        :style="{'--inspector-width': inspectorWidth(listing?.width)}"
        role="dialog"
        :aria-label="`${noun} ${id}`"
        data-resource-panel
    >
        <template v-if="opening">
            <div class="panel-opening" data-resource-opening><Skeleton /></div>
        </template>
        <template v-if="listing">
            <Inspector
                :noun="noun"
                :id="id"
                :table="table"
                :read="read"
                :catalogue="catalogue"
                :environment="environment"
                :read-only="readOnly"
                :backed="backed"
                @close="emit('close')"
                @back="emit('back')"
                @open="emit('open', $event)"
            />
        </template>
        <template v-else>
            <InspectorHead :title="noun" :backed="backed" :opened="{table, id}" @close="emit('close')" @back="emit('back')" />
            <p class="missing" role="alert" data-resource-failure>This row has no inspector.</p>
        </template>
    </aside>
</template>

<style scoped>
.panel.declared {
    width: var(--inspector-width);
}

.missing {
    margin: 0;
    padding: 16px;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
