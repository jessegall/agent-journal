<script setup>
import {computed} from "vue";
import {Btn, DropList} from "@journal/window-kit";

// one condition or extra action in a list: its value, typed or picked from choices, and a way to remove it
const props = defineProps({
    label: {type: String, required: true},
    example: {type: String, default: ""},
    choices: {type: Array, default: null},
});
const emit = defineEmits(["remove"]);
const value = defineModel({type: String, required: true});
const pickedLabel = computed(() => props.choices?.find((choice) => choice.value === value.value)?.label ?? "Choose one");
</script>

<template>
    <div class="block">
        <template v-if="choices">
            <div class="field"><span class="label">{{ label }}</span><DropList :label="pickedLabel" :items="choices" :picked="value" data-trigger-choice @pick="value = $event.value" /></div>
        </template>
        <template v-else>
            <label class="field"><span class="label">{{ label }}</span><input v-model="value" :placeholder="example" data-trigger-listed></label>
        </template>
        <Btn class="remove" small @click="emit('remove')">Remove</Btn>
    </div>
</template>

<style scoped src="./triggerForm.css"></style>

<style scoped>
.remove {
    align-self: flex-start;
}
</style>
