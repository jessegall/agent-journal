<script setup>
import {computed, ref} from "vue";
import Btn from "../../kit/Btn.vue";
import {lineDiff} from "../../domain/lineDiff.js";

// a document's revisions: each with what changed; the one opened shows its difference from the current text and can be made the current text again
const props = defineProps({id: {type: Number, required: true}, revisions: {type: Array, required: true}, text: {type: String, default: ""}, read: {type: Function, required: true}, editing: Boolean});
const emit = defineEmits(["restored", "close-revision"]);
const opened = ref(null);
const failure = ref("");
const lines = computed(() => (opened.value ? lineDiff(opened.value.body, props.text) : []));

async function open(row) {
    const answer = await props.read(["doc", "revision", String(props.id), String(row.number)]);
    opened.value = answer.ok ? answer.value : null;
    failure.value = answer.ok ? "" : answer.error;
}

async function restore() {
    const answer = await props.read(["doc", "edit", String(props.id), "--abstract", opened.value.abstract, "--body", opened.value.body]);
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) emit("restored");
}
</script>

<template>
    <div class="document-tab" data-document-revisions>
        <template v-if="editing">
            <Btn small bordered data-close-revision @click="emit('close-revision')">Close the open revision</Btn>
        </template>
        <template v-if="revisions.length">
            <template v-for="row in revisions" :key="row.number">
                <Btn variant="text" :data-text-revision="row.number" @click="open(row)">Revision {{ row.number }}: {{ row.change }} · {{ row.author_name }} · <time :datetime="row.created_at">{{ row.created_at.slice(0, 16).replace("T", " ") }}</time></Btn>
            </template>
            <template v-if="failure">
                <p class="revision-failure" role="alert" data-text-revision-failure>{{ failure }}</p>
            </template>
            <template v-if="opened">
                <Btn small bordered data-text-revision-restore @click="restore">Go back to this revision</Btn>
                <div class="revision-diff" data-text-revision-diff>
                    <template v-for="line in lines" :key="line.key">
                        <div :class="['revision-line', line.type]">{{ line.text || " " }}</div>
                    </template>
                </div>
            </template>
        </template>
        <template v-else>
            <p class="document-none">No revisions</p>
        </template>
    </div>
</template>

<style scoped>
.document-tab {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
    min-width: 0;
    overflow-y: auto;
    padding: 18px 24px;
}

.revision-failure {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}

.revision-line {
    white-space: pre-wrap;
}

.revision-line.added {
    background: color-mix(in srgb, var(--green) 14%, transparent);
}

.revision-line.removed {
    background: color-mix(in srgb, var(--danger) 14%, transparent);
}

.revision-diff {
    width: 100%;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
    font-size: 13px;
    line-height: 1.6;
    overflow-wrap: anywhere;
}

.document-none {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
