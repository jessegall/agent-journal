<script setup>
import {computed, ref} from "vue";
import Skeleton from "../kit/Skeleton.vue";
import {inspectorWidth} from "../domain/inspectorWidths.js";
import Inspector from "./Inspector.vue";
import InspectorHead from "./InspectorHead.vue";

// the side panel of a declared inspector: the dialog with the width its declaration asks for, over the shared layout
const props = defineProps({
    term: {type: String, required: true},
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
const listing = computed(() => props.catalogue.inspector(props.term));
const root = ref(null);
defineExpose({focus: () => root.value?.focus()});
</script>

<template>
    <aside
        ref="root"
        tabindex="-1"
        :class="['panel', 'declared', {opening}]"
        :style="{'--inspector-width': inspectorWidth(listing?.width)}"
        role="dialog"
        :aria-label="`${term} ${id}`"
        data-resource-panel
    >
        <template v-if="opening">
            <div class="panel-opening" data-resource-opening><Skeleton /></div>
        </template>
        <template v-if="listing">
            <Inspector
                :term="noun"
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
.panel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--border);
    background: var(--bg);
    box-shadow: -20px 0 50px rgba(0, 0, 0, 0.4);
}

.panel :deep(.panel-opening) {
    position: absolute;
    z-index: 1;
    inset: 0;
    padding: 20px 24px;
}

.panel > :deep(:not(.panel-opening)) {
    transition: opacity 0.18s ease;
}

.panel.opening > :deep(:not(.panel-opening)) {
    opacity: 0;
    transition: none;
}

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
