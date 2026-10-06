<script setup>
import {computed, reactive, ref} from "vue";
import {api} from "../api/client.js";
import {EXAMPLES, doesOf} from "../domain/triggerWords.js";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import FormField from "../kit/FormField.vue";
import TriggerEditor from "./TriggerEditor.vue";

const props = defineProps({sequence: {type: Number, default: 0}});
const emit = defineEmits(["made", "close"]);
const blank = () => ({
    title: "",
    words: [],
    words_in: "both",
    does: props.sequence ? "start" : "nudge",
    text: "",
    sequences: props.sequence ? [props.sequence] : [],
});
const draft = reactive(blank());
const error = ref("");

const missing = computed(() => {
    if (!draft.words.length) return "Add at least one word.";
    if (draft.does !== "start" && !draft.text.trim()) return `Write ${doesOf(draft.does).ask.toLowerCase()}.`;
    return draft.title.trim() ? "" : "Give it a name.";
});

function start({name, ...fields}) {
    Object.assign(draft, blank(), fields, {sequences: draft.sequences});
}

async function submit() {
    error.value = "";
    try {
        const made = await api.create("trigger", {
            title: draft.title.trim(),
            words: draft.words,
            words_in: draft.words_in,
            does: draft.does,
            text: draft.does === "start" ? "" : draft.text,
        });
        if (draft.does === "start") await Promise.all(draft.sequences.map((n) => api.setStartsOn(n, `trigger:${made.n}`)));
        emit("made", made.n);
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <Dialog title="New trigger" @close="emit('close')">
        <TriggerEditor :draft="draft">
            <template #examples>
                <FormField label="Start with an example trigger">
                    <div class="examples">
                        <template v-for="example in EXAMPLES" :key="example.name">
                            <Btn small @click="start(example)">{{ example.name }}</Btn>
                        </template>
                    </div>
                </FormField>
            </template>
        </TriggerEditor>
        <template #foot>
            <span class="foot-note">{{ error || missing }}</span>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn kind="primary" :disabled="Boolean(missing)" @click="submit">Create trigger</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.examples {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.foot-note {
    flex: 1;
    color: var(--text-3);
    font-size: 12px;
}
</style>
