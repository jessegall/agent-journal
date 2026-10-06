<script setup>
import {computed, ref} from "vue";
import ChoiceList from "../kit/ChoiceList.vue";
import FormField from "../kit/FormField.vue";
import WordChips from "../kit/WordChips.vue";
import WordTest from "../kit/WordTest.vue";
import {matching} from "../domain/words.js";

const props = defineProps({
    words: {type: Array, default: () => []},
    wordsIn: {type: String, default: "both"},
    scopes: {type: Array, required: true},
    unavailable: {type: Object, default: () => ({})},
    readonly: Boolean,
    label: {type: String, default: "Words to watch for"},
    scopeLabel: {type: String, default: "Trigger when"},
    help: {type: String, default: "Whole words or phrases. Upper or lower case doesn't matter. Press Enter after each one."},
    yes: {type: String, default: "The trigger would act."},
    no: {type: String, default: "The trigger would not act."},
});
const emit = defineEmits(["words", "where"]);
const tried = ref("");
const choices = computed(() =>
    props.scopes.map((scope) => ({
        ...scope,
        current: scope.value === props.wordsIn,
        unavailable: props.readonly ? "" : props.unavailable[scope.value],
    }))
);
</script>

<template>
    <div class="watched">
        <FormField :label="label" :help="help">
            <WordChips
                :words="words"
                :readonly="readonly"
                :highlight="matching(words, tried)"
                :placeholder="words.length ? 'Add another' : 'Add a word, then press Enter'"
                @change="emit('words', $event)"
            />
        </FormField>
        <WordTest :words="words" :yes="yes" :no="no" @text="tried = $event" />
        <FormField :label="scopeLabel">
            <ChoiceList stacked :choices="choices" :disabled="readonly" @pick="emit('where', $event)" />
            <slot />
        </FormField>
    </div>
</template>

<style scoped>
.watched {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
</style>
