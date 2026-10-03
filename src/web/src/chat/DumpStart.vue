<script setup>
import Btn from "../kit/Btn.vue";
import DumpAddFiles from "./DumpAddFiles.vue";
import DumpEyebrow from "./DumpEyebrow.vue";
import DumpFiles from "./DumpFiles.vue";
import DumpLane from "./DumpLane.vue";
import DumpPill from "./DumpPill.vue";
import {counted} from "../format/number.js";
import {store} from "../state/store.js";

defineProps({
    files: {type: Array, required: true},
    sending: {type: Boolean, default: false},
    error: {type: String, default: ""},
    earlier: {type: Array, required: true},
});
const text = defineModel("text", {type: String, required: true});
const emit = defineEmits(["send", "files", "paste", "remove"]);
</script>

<template>
    <div class="dump-start">
        <div class="dump-start-panel">
            <p class="dump-prompt">Throw it all in.</p>
            <div :class="['dump-compose', {lit: files.length}]" @paste="emit('paste', $event)">
                <template v-if="files.length">
                    <DumpEyebrow>The pile · {{ counted(files.length, "file", "files") }}</DumpEyebrow>
                    <DumpFiles :files="files" @remove="(i) => emit('remove', i)" />
                </template>
                <textarea
                    v-model="text"
                    rows="2"
                    :placeholder="files.length ? 'Anything I should know before I sort it? Optional' : 'Type or paste anything'"
                    @keydown.meta.enter.prevent="emit('send')"
                    @keydown.ctrl.enter.prevent="emit('send')"
                />
                <div class="dump-row">
                    <DumpAddFiles @files="(list) => emit('files', list)">
                        {{ files.length ? "Add more" : "Add files" }}
                    </DumpAddFiles>
                    <span class="grow" />
                    <template v-if="error">
                        <span class="dump-error">{{ error }}</span>
                    </template>
                    <Btn kind="primary" small :busy="sending" :disabled="!text.trim() && !files.length" @click="emit('send')">
                        Sort and file it
                    </Btn>
                </div>
            </div>
            <template v-if="!files.length">
                <DumpLane title="Drop as many files as you like" meta="transcripts · notes · documents · screenshots · links">
                    <input type="file" multiple hidden @change="(e) => (emit('files', e.target.files), (e.target.value = ''))" />
                </DumpLane>
            </template>
            <p class="dump-context">
                Mixed is fine. I sort it by subject, one document per subject with a proper name, and file each one straight into a new
                collection. Rename or merge anything afterwards, or remove the whole collection.
            </p>
            <template v-if="earlier.length">
                <div class="dump-earlier">
                    <DumpEyebrow>Earlier dumps</DumpEyebrow>
                    <template v-for="d in earlier" :key="d.n">
                        <button type="button" class="dump-earlier-row" @click="store.dumpShown = d.n">
                            <span class="dump-earlier-title">
                                Dump {{ d.n }}
                                <template v-if="d.title !== `Dump ${d.n}`">· {{ d.title }}</template>
                            </span>
                            <DumpPill :phase="d.pill" />
                        </button>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.dump-start {
    position: relative;
    display: grid;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    place-items: center;
}

.dump-start-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: min(620px, calc(100% - 40px));
    padding: 24px 0;
}

.dump-prompt {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.012em;
    color: var(--text);
}

.dump-compose {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 12px 10px 14px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    transition:
        border-color 0.2s,
        box-shadow 0.2s;
}

.dump-compose:focus-within,
.dump-compose.lit {
    border-color: color-mix(in srgb, var(--accent) 60%, var(--border-2));
}

.dump-compose.lit {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 16%, transparent);
}

.dump-compose textarea {
    width: 100%;
    min-height: 22px;
    padding: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 14px;
    line-height: 1.5;
    resize: none;
}

.dump-compose textarea::placeholder {
    color: var(--text-4);
}

.dump-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.dump-context {
    margin: 0;
    font-size: 13px;
    color: var(--text-3);
    text-wrap: pretty;
}

.dump-earlier {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.dump-earlier .dump-eyebrow {
    padding: 0 8px 4px;
}

.dump-earlier-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 8px;
    border: 0;
    border-radius: 7px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.dump-earlier-row:hover {
    background: var(--hover);
    color: var(--text);
}

.dump-earlier-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.grow {
    flex: 1;
}

.dump-error {
    font-size: 12px;
    color: var(--danger);
}
</style>
