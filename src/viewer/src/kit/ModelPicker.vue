<script setup>
import {computed} from "vue";
import {MODELS, PROVIDER_TITLES} from "../domain/models.js";
import DropList from "./DropList.vue";

const props = defineProps({
    provider: {type: String, default: "claude"},
    value: {type: String, default: ""},
    inherits: Boolean,
});
const emit = defineEmits(["pick"]);

const items = computed(() => [
    ...MODELS[props.provider],
    ...(props.inherits ? [{key: "", label: "the agent's model", note: "the model of the agent that starts it"}] : []),
]);
const label = computed(() => (items.value.find((item) => item.key === props.value) || {label: props.value || "the agent's model"}).label);
</script>

<template>
    <DropList
        :label="label"
        icon="model"
        :items="items"
        :picked="value"
        :menu-width="280"
        :aria-label="`${PROVIDER_TITLES[provider]} model`"
        @pick="emit('pick', $event.key)"
    />
</template>
