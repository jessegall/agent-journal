<script setup>
import {computed, ref} from "vue";
import {Btn, Dialog, Icon, ago, Skeleton, useRows, useWindow} from "@journal/window-kit";
import NewSequence from "./NewSequence.vue";
import SequenceRuns from "./SequenceRuns.vue";
import SequenceSteps from "./SequenceSteps.vue";
import SequenceTriggers from "./SequenceTriggers.vue";
import {startWords} from "./sequenceTriggers.js";

const context = useWindow();
const {rows, failure, loaded} = useRows("sequence list", ["sequence.*"]);
const {rows: runs} = useRows("sequence-run list", ["sequence_run.*", "sequence.*"]);
const drafting = ref(false);
const openedId = ref(null);
const deleting = ref(false);
const refusal = ref("");
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
    const answer = await context.run(["sequence", "delete", String(openedId.value)]);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) openedId.value = null;
}
</script>

<template>
    <div class="cards-page">
        <div class="cards-bar">
            <span class="cards-count">{{ rows.length }} {{ rows.length === 1 ? "sequence" : "sequences" }}</span>
            <Btn small bordered data-sequence-new @click="drafting = true"><Icon name="plus" :size="12" /> New sequence</Btn>
        </div>
        <div class="cards">
            <template v-if="!loaded">
                <Skeleton shape="cards" />
            </template>
            <template v-else-if="failure">
                <p class="cards-note">{{ failure }}</p>
            </template>
            <template v-else-if="loaded && !rows.length">
                <p class="cards-note">No sequences yet</p>
            </template>
            <template v-for="row in rows" :key="row.id">
                <button type="button" class="card" :data-row="row.id" @click="open(row)">
                    <span class="card-head"><Icon name="list" class="card-icon" /> Sequence {{ row.id }}<span class="card-age">{{ ago(row.created_at) }}</span></span>
                    <span class="card-title">{{ row.title }}</span>
                    <span class="card-foot">{{ row.steps.length }} steps · {{ runningCount(row) ? `${runningCount(row)} running now` : startWords(JSON.parse(row.triggers || "[]"))[0] }}</span>
                </button>
            </template>
        </div>
        <template v-if="drafting">
            <NewSequence @close="drafting = false" />
        </template>
        <template v-if="opened">
            <Dialog :title="opened.title" tall @close="openedId = null">
                <SequenceTriggers :sequence="opened" />
                <SequenceSteps :sequence="opened" :runs="openedRuns" />
                <SequenceRuns :runs="openedRuns" />
                <template #foot>
                    <span class="note" role="status">{{ refusal }}</span>
                    <Btn kind="danger" data-sequence-delete @click="remove">{{ deleting ? "Delete it for good" : "Delete" }}</Btn>
                    <Btn data-sequence-done @click="openedId = null">Done</Btn>
                </template>
            </Dialog>
        </template>
    </div>
</template>

<style scoped>
.cards-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.cards-bar {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    padding: 8px 20px;
    border-bottom: 1px solid var(--border);
}

.cards-count,
.note {
    color: var(--text-3);
    font-size: 12px;
}

.note {
    flex: 1;
}

.cards {
    flex: 1;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
    align-content: start;
    padding: 16px 20px;
}

.card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 130px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    color: inherit;
    text-align: left;
    cursor: pointer;
}

.card:hover {
    border-color: var(--border-strong, var(--border));
}

.card-head {
    display: flex;
    gap: 6px;
    align-items: center;
    color: var(--text-2);
    font-size: 13px;
}

.card-icon {
    width: 14px;
    height: 14px;
}

.card-title {
    font-weight: 600;
}

.card-foot {
    margin-top: auto;
    color: var(--text-3);
    font-size: 12px;
}

.cards-note {
    margin: 0;
    color: var(--text-2);
}
.card-age {
    margin-left: auto;
}
</style>
