<script setup>
import {computed, inject, ref} from "vue";
import {useSuggestionNote} from "../composables/suggestionNote.js";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import Icon from "../kit/Icon.vue";
import SuggestionCard from "./SuggestionCard.vue";
import {CLOSE_NOTE, hoursText, isOpen, phaseOf} from "../domain/suggestions.js";

const props = defineProps({suggestion: {type: Object, required: true}, hours: {type: Number, required: true}});
const emit = defineEmits(["close"]);
const acts = inject("suggestionActs");
const writing = ref(false);
const escNote = ref(false);
const open = computed(() => isOpen(phaseOf(props.suggestion)));
const note = useSuggestionNote(acts, () => props.suggestion);

function close() {
    note();
    emit("close");
}

function escape() {
    if (writing.value) return (escNote.value = true);
    close();
}
</script>

<template>
    <Dialog :title="suggestion.title" modal fits :open="true" @dismiss="close" @escape="escape">
        <p class="window-meta">
            <Icon name="bulb" />
            <span>
                Suggestion {{ suggestion.n }} · unanswered for
                <span class="from-setting" title="From Settings › Suggestions">{{ hoursText(hours) }}</span>
            </span>
        </p>
        <SuggestionCard :suggestion="suggestion" bare :esc-note="escNote" @acted="note" @writing="writing = $event" />
        <template #foot>
            <span class="window-note">{{ open ? CLOSE_NOTE : "" }}</span>
            <Btn :kind="open ? 'ghost' : 'primary'" @click="close">Close</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.window-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 0 6px;
    color: var(--text-3);
    font-size: 11.5px;
}

.window-meta :deep(svg) {
    color: var(--blocking);
}

.from-setting {
    border-bottom: 1px dotted var(--text-3);
    cursor: help;
}

.window-note {
    flex: 1;
    color: var(--text-2);
    font-size: 12px;
    text-wrap: pretty;
}
</style>
