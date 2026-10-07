<script setup>
import {computed, reactive, ref, watch} from "vue";
import {startDump} from "../composables/dump.js";
import {PHASE_WORDS} from "../domain/dumpPile.js";
import {fileSize} from "../format/files.js";
import {store} from "../state/store.js";
import Btn from "../kit/Btn.vue";
import CloseButton from "../kit/CloseButton.vue";
import TextArea from "../kit/TextArea.vue";
import Cell from "./kit/Cell.vue";
import CellGroup from "./kit/CellGroup.vue";

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
    <label class="dump-start-label" for="dump-start-text">Notes for the agent</label>
    <TextArea
        id="dump-start-text"
        :value="draft.text"
        @input="draft.text = $event.target.value"
        class="dump-start-text"
        :placeholder="draft.files.length ? 'Anything the agent should know before sorting? Optional' : 'Type or paste anything'"
    />
    <template v-if="draft.error">
        <p class="dump-start-error" role="alert">{{ draft.error }}</p>
    </template>
    <Btn kind="primary" large fill :busy="draft.sending" :disabled="!ready" @click="send">Send to sort</Btn>
    <template v-if="earlier.length">
        <CellGroup head="Earlier dumps">
            <template v-for="row in earlier" :key="row.n">
                <Cell :label="row.title" :sub="PHASE_WORDS[row.pill]" icon="inbox" @pick="emit('pick', row.n)" />
            </template>
        </CellGroup>
    </template>
</template>

<style scoped>
.dump-start-label {
    display: block;
    margin: 16px 4px 6px;
    color: var(--text-2);
    font-size: 0.8125rem;
}

.dump-start-text {
    min-height: 120px;
    margin-bottom: 12px;
    font-size: 1rem;
}

.dump-start-error {
    margin: 0 4px 12px;
    color: var(--danger);
}
</style>
