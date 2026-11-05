<script setup>
import {computed, useId} from "vue";
import ButtonTemplateField from "./ButtonTemplateField.vue";
import FormField from "./FormField.vue";
import Segmented from "./Segmented.vue";
import SwitchCase from "./SwitchCase.vue";
import TextArea from "./TextArea.vue";

const props = defineProps({field: {type: Object, required: true}, value: {type: String, required: true}, environment: {type: String, required: true}});
const emit = defineEmits(["pick"]);
const id = useId();
const control = computed(() => props.field.choices ? "choice" : props.field.target ? "template" : "text");
</script>

<template>
    <FormField :label="field.label" :for="id" :data-button-field="field.name">
        <SwitchCase :value="control">
            <template #choice>
                <Segmented :id="id" :options="field.choices" :value="value" wrap @pick="emit('pick', $event)" />
            </template>
            <template #template>
                <ButtonTemplateField :field="field" :value="value" :environment="environment" @pick="emit('pick', $event)" />
            </template>
            <template #text>
                <TextArea :id="id" :value="value" @input="emit('pick', $event.target.value)" />
            </template>
        </SwitchCase>
    </FormField>
</template>
