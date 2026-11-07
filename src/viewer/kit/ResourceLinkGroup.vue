<script setup>
import {computed, ref} from "vue";

const props = defineProps({model: {type: String, required: true}, count: {type: Number, required: true}, rows: {type: Array, required: true}, linkAttribute: {type: String, required: true}, documentId: {type: Number, default: 0}});
const emit = defineEmits(["open"]);
const expanded = ref(false);
const shown = computed(() => expanded.value ? props.rows : props.rows.slice(0, 3));
const label = computed(() => `${props.model.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase())} ${props.count}`);
const unavailable = (row) => row.endpoint.unavailable || !row.endpoint.open_ref;
const attributes = (row) => ({[props.linkAttribute]: true, "data-link-model": row.endpoint.model, "data-link-id": row.endpoint.id});
const description = (row) => `${row.endpoint.model === "doc" && row.endpoint.id === props.documentId ? "Design document" : row.endpoint.model.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase())} ${row.endpoint.id}, ${row.relations.map((relation) => relation.replaceAll("_", " ")).join(", ")}`;

</script>

<template>
    <div class="link-group">
        <div class="group-label" data-link-kind>{{ label }}</div>
        <template v-for="row in shown" :key="`${row.endpoint.model}:${row.endpoint.id}`"><button type="button" class="resource-link" v-bind="attributes(row)" :disabled="unavailable(row)" @click="emit('open', row)">
            <span class="title">{{ row.endpoint.title }}</span>
            <span class="relations">{{ description(row) }}<template v-if="unavailable(row)"> · Unavailable</template></span>
        </button></template>
        <template v-if="rows.length > 3 && !expanded"><button type="button" class="show-more" data-link-show-more @click="expanded = true">Show more</button></template>
    </div>
</template>

<style scoped>
.link-group {display: flex; flex-direction: column; gap: 3px;}
.group-label {color: var(--text-3); font-size: 11px;}
.resource-link {display: flex; flex-direction: column; padding: 3px 0; border: 0; background: none; color: var(--text-2); font: inherit; text-align: left; cursor: pointer;}
.resource-link:disabled {cursor: default; opacity: .65;}
.title {overflow: hidden; max-width: 100%; text-overflow: ellipsis; white-space: nowrap;}
.relations {color: var(--text-3); font-size: 12px;}
.show-more {align-self: flex-start; border: 0; background: none; color: var(--text-3); font: inherit; cursor: pointer;}
</style>
