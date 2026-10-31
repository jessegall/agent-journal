<script setup>
import {ref} from "vue";
import {Btn} from "@journal/window-kit";

// Dump files as version 4 had it: the person pastes text or drops text files, and one dump is made of it, a part to a paragraph or file
const emit = defineEmits(["made", "close"]);
const props = defineProps({run: {type: Function, required: true}});
const notes = ref("");
const dropped = ref([]);
const failure = ref("");
const BRIEF_CHARACTERS = 60;

const parts = () => [...notes.value.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean), ...dropped.value.map((file) => `${file.name}: ${file.text.trim()}`)];
const brief = () => (parts()[0] ?? "").replace(/\s+/g, " ").slice(0, BRIEF_CHARACTERS);

async function drop(event) {
    const files = [...(event.dataTransfer?.files ?? [])];
    dropped.value = [...dropped.value, ...(await Promise.all(files.map(async (file) => ({name: file.name, text: await file.text()}))))];
}

async function make() {
    const result = await props.run(["dump", "make", brief(), "--parts", parts().join(" | ")]);
    failure.value = result.ok ? "" : result.error;
    if (!result.ok) return;
    notes.value = "";
    dropped.value = [];
    emit("made");
}
</script>

<template>
    <form class="dump" data-dump-form @submit.prevent="make" @dragover.prevent @drop.prevent="drop">
        <textarea v-model="notes" class="dump-notes" rows="4" placeholder="Paste or drop what you have: a paragraph or a file is one part" />
        <template v-if="dropped.length">
            <p class="dump-files">{{ dropped.map((file) => file.name).join(", ") }}</p>
        </template>
        <div class="dump-row">
            <Btn kind="primary" small :disabled="!parts().length" data-dump-make @click="make">Make the dump</Btn>
            <Btn small @click="emit('close')">Cancel</Btn>
        </div>
        <template v-if="failure">
            <p class="dump-failure">{{ failure }}</p>
        </template>
    </form>
</template>

<style scoped>
.dump {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 12px;
    border: 1px dashed var(--border-2);
    border-radius: 12px;
}

.dump-notes {
    padding: 0;
    border: 0;
    outline: 0;
    color: var(--text);
    background: transparent;
    font: inherit;
    resize: none;
}

.dump-files,
.dump-failure {
    margin: 0;
    color: var(--text-2);
    font-size: 12px;
}

.dump-row {
    display: flex;
    gap: 8px;
}
</style>
