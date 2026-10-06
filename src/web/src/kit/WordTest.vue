<script setup>
import {computed, ref} from "vue";
import {matching} from "../domain/words.js";
import FormField from "./FormField.vue";
import TextInput from "./TextInput.vue";

const props = defineProps({
    words: {type: Array, default: () => []},
    yes: {type: String, default: "The trigger would act."},
    no: {type: String, default: "The trigger would not act."},
});
const emit = defineEmits(["text"]);
const text = ref("");
const hits = computed(() => matching(props.words, text.value));
const result = computed(() => {
    if (!text.value) return "The words that match turn green above.";
    if (!hits.value.length) return `No match. ${props.no}`;
    return `Matches ${hits.value.map((word) => `“${word}”`).join(", ")}. ${props.yes}`;
});

function type(value) {
    text.value = value;
    emit("text", value);
}
</script>

<template>
    <FormField label="Test the words" :help="result">
        <TextInput :value="text" placeholder="Type a sentence to see whether it matches" @input="type($event.target.value)" />
    </FormField>
</template>
