<script setup>
import {computed} from "vue";
import DropList from "./DropList.vue";

const props = defineProps({
    title: {type: String, required: true},
    models: {type: Array, required: true},
    value: {type: String, default: ""},
    inherits: Boolean,
});
const emit = defineEmits(["pick"]);

const items = computed(() => [
    ...props.models.map((model) => ({key: model.name, label: model.name, note: model.tier})),
    ...(props.inherits ? [{key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one"}] : []),
]);
const label = computed(() => (items.value.find((item) => item.key === props.value) || {label: props.value || "chosen at start"}).label);
</script>

<template>
    <DropList :label="label" icon="model" :items="items" :picked="value" :menu-width="280" :aria-label="`${title} model`" @pick="emit('pick', $event.key)" />
</template>
