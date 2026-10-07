<script setup>
import {computed, reactive, ref, watch} from "vue";
import {startDump} from "../composables/dump.js";
import {PHASE_WORDS} from "../domain/dumpPile.js";
import {fileSize} from "../format/files.js";
import {store} from "../state/store.js";
import CloseButton from "../kit/CloseButton.vue";
import Button from "./kit/Button.vue";
import Cell from "./kit/Cell.vue";
import CellGroup from "./kit/CellGroup.vue";
import Field from "./kit/Field.vue";

defineProps({earlier: {type: Array, default: () => []}});
const emit = defineEmits(["started", "pick"]);
const draft = reactive({text: "", files: [], sending: false, error: ""});
const picker = ref(null);
const ready = computed(() => Boolean(draft.text.trim() || draft.files.length) && !draft.sending);

watch(
    () => store.dumpFiles,
    (files) => {
        if (!files.length) return;
        draft.files.push(...files);
        store.dumpFiles = [];
    },
    {immediate: true}
);

function picked(event) {
    draft.files = [...draft.files, ...event.target.files];
    event.target.value = "";
}

async function send() {
    if (!ready.value) return;
    draft.sending = true;
    draft.error = "";
    try {
        const row = await startDump(draft.text.trim(), draft.files);
        Object.assign(draft, {text: "", files: []});
        emit("started", row);
    } catch (error) {
        draft.error = error.message;
    } finally {
        draft.sending = false;
    }
}
</script>

<template>
    <CellGroup :head="draft.files.length ? `Files · ${draft.files.length}` : 'Files'">
        <template v-for="(file, i) in draft.files" :key="file.name + file.size + file.lastModified">
            <Cell :label="file.name" :sub="fileSize(file.size)" icon="file" still>
                <template #end>
                    <CloseButton :title="`Take ${file.name} out`" @click="draft.files.splice(i, 1)" />
                </template>
            </Cell>
        </template>
        <Cell icon="plus" label="Add files" @pick="picker.click()" />
    </CellGroup>
    <input ref="picker" type="file" multiple hidden aria-label="Files to send" @change="picked" />
    <Field
        v-model="draft.text"
        class="dump-start-text"
        label="Notes for the agent"
        area
        :placeholder="draft.files.length ? 'Anything the agent should know before sorting? Optional' : 'Type or paste anything'"
    />
    <template v-if="draft.error">
        <p class="dump-start-error" role="alert">{{ draft.error }}</p>
    </template>
    <Button fill :busy="draft.sending" :disabled="!ready" @click="send">Send to the agent to sort</Button>
    <template v-if="earlier.length">
        <CellGroup head="Earlier dumps">
            <template v-for="row in earlier" :key="row.n">
                <Cell :label="row.title" :sub="PHASE_WORDS[row.pill]" icon="inbox" @pick="emit('pick', row.n)" />
            </template>
        </CellGroup>
    </template>
</template>

<style scoped>
.dump-start-text {
    margin: 16px 0 12px;
}

.dump-start-error {
    margin: 0 4px 12px;
    color: var(--danger);
}
</style>
