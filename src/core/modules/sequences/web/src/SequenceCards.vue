<script setup>
import {computed, ref} from "vue";
import {Btn, Dialog, RowCards, removed, useWindow} from "@journal/window-kit";
import NewSequence from "./NewSequence.vue";
import SequenceRuns from "./SequenceRuns.vue";
import SequenceSteps from "./SequenceSteps.vue";
import SequenceTriggers from "./SequenceTriggers.vue";
import {startWords} from "./sequenceTriggers.js";

const view = useWindow();
const {rows, data, failure, loaded, act} = view.props.board;
const runs = computed(() => data.value?.runs ?? []);
const drafting = ref(false);
const openedId = ref(null);
const deleting = ref(false);
const refusal = ref("");
const footOf = (row) => `${row.steps.length} steps · ${runningCount(row) ? `${runningCount(row)} running now` : startWords(JSON.parse(row.triggers || "[]"))[0]}`;
const opened = computed(() => rows.value.find((row) => row.id === openedId.value) || null);
const openedRuns = computed(() => runs.value.filter((run) => run.sequence_id === openedId.value));
const runningCount = (row) => runs.value.filter((run) => run.sequence_id === row.id).length;

function open(row) {
    refusal.value = "";
    deleting.value = false;
    openedId.value = row.id;
}

async function remove() {
    if (!deleting.value) return void (deleting.value = true);
    const answer = await act(["sequence", "delete", String(openedId.value)], removed(openedId.value));
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) openedId.value = null;
}
</script>

<template>
    <RowCards term="sequence" icon="list" :rows="rows" :failure="failure" :loaded="loaded" :head="(row) => `Sequence ${row.id}`" :title="(row) => row.title" :foot="footOf" @new="drafting = true" @open="open">
        <template v-if="drafting">
            <NewSequence @close="drafting = false" />
        </template>
        <template v-if="opened">
            <Dialog padded :title="opened.title" tall @close="openedId = null">
                <SequenceTriggers :sequence="opened" />
                <SequenceSteps :sequence="opened" :runs="openedRuns" />
                <SequenceRuns :runs="openedRuns" />
                <template #foot>
                    <span class="note" role="status">{{ refusal }}</span>
                    <Btn variant="danger" data-sequence-delete @click="remove">{{ deleting ? "Delete it for good" : "Delete" }}</Btn>
                    <Btn data-sequence-done @click="openedId = null">Done</Btn>
                </template>
            </Dialog>
        </template>
    </RowCards>
</template>

<style scoped>
.note {
    flex: 1;
    color: var(--text-3);
    font-size: 12px;
}
</style>
