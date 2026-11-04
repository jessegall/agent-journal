<script setup>
import {ref} from "vue";
import Btn from "../../kit/Btn.vue";
import {render} from "../../text/index.js";

// a document's revisions: each with what changed, and the text of the one opened
const props = defineProps({id: {type: Number, required: true}, revisions: {type: Array, required: true}, read: {type: Function, required: true}});
const opened = ref(null);

async function open(row) {
    const answer = await props.read(["doc", "revision", String(props.id), String(row.number)]);
    opened.value = answer.ok ? answer.value : null;
}
</script>

<template>
    <div class="document-tab" data-document-revisions>
        <template v-if="revisions.length">
            <template v-for="row in revisions" :key="row.number">
                <Btn kind="text" :data-text-revision="row.number" @click="open(row)">Revision {{ row.number }}: {{ row.change || row.created_at }}</Btn>
            </template>
            <template v-if="opened">
                <div class="md revision-text" data-text-revision-body v-html="render(opened.body, {env: '', rowNames: false, document: true})" />
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

.revision-text {
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
