<script setup>
import {computed, ref} from "vue";
import {Btn, ListReaderLayout, PageHeader, Skeleton, useWindow} from "@journal/window-kit";
import AbandonRun from "./AbandonRun.vue";
import AddTrigger from "./AddTrigger.vue";
import EditSteps from "./EditSteps.vue";
import NewSequence from "./NewSequence.vue";
import SequenceReader from "./SequenceReader.vue";
import {sequenceItems} from "./sequenceItems.js";
import {rowLine, runsOf} from "./sequenceWords.js";

// the sequences as a list and a reader: each row is the number, the title and how many steps it has and what starts it, and while it runs a quiet Running badge.
// A sequence started in the viewer is run by the main agent. A dialog is open for one thing at a time: a new sequence, its steps, a trigger or a run to give up.
const LIST_WIDTH = 460;
const view = useWindow();
const {rows, data, failure, loaded, act, actionFailure} = view.props.board;
const runs = computed(() => data.value?.runs ?? []);
const items = computed(() => rows.value.map((row) => ({id: row.id, title: `${row.id} ${row.title}`, desc: rowLine(row, runs.value), row, running: runsOf(row, runs.value).length > 0})));
const chosen = ref(null);
const dialog = ref(null);
const ask = (kind, sequence, run = null) => (dialog.value = {kind, sequence, run});
const menuOf = (sequence, open = null) => sequenceItems(sequence, runs.value, {act, ask, open});
const place = (item) => ({head: `Sequence ${item.id}`, items: menuOf(item.row, () => (chosen.value = item.id))});
</script>

<template>
    <ListReaderLayout v-model:chosen="chosen" :items="items" :list-width="LIST_WIDTH" :place="place" empty-title="No sequences yet" pick-line="Choose a sequence" data-sequences>
        <template #top>
            <PageHeader title="Sequences" :count="rows.length">
                <template #primary><Btn small variant="primary" data-sequence-new @click="ask('new')">New sequence</Btn></template>
            </PageHeader>
            <template v-if="failure || actionFailure">
                <p class="failure" role="alert" data-sequences-failure>{{ failure || actionFailure }}</p>
            </template>
            <template v-if="dialog?.kind === 'new'"><NewSequence @close="dialog = null" /></template>
            <template v-else-if="dialog?.kind === 'copy'"><NewSequence :title="`${dialog.sequence.title} copy`" :steps="[...dialog.sequence.steps]" @close="dialog = null" /></template>
            <template v-else-if="dialog?.kind === 'steps'"><EditSteps :sequence="dialog.sequence" @close="dialog = null" /></template>
            <template v-else-if="dialog?.kind === 'trigger'"><AddTrigger :sequence="dialog.sequence" @close="dialog = null" /></template>
            <template v-else-if="dialog?.kind === 'abandon'"><AbandonRun :run="dialog.run" @close="dialog = null" /></template>
        </template>
        <template #empty>
            <template v-if="!loaded"><Skeleton shape="rows" /></template>
            <template v-else>A sequence is steps an agent works through in order.</template>
        </template>
        <template #meta="{item}">
            <template v-if="item.running"><span class="badge-quiet" data-sequence-running>Running</span></template>
        </template>
        <template #reader="{item}">
            <SequenceReader :sequence="item.row" :runs="runs" :items="menuOf(item.row)" @abandon="ask('abandon', item.row, $event)" />
        </template>
    </ListReaderLayout>
</template>

<style scoped>
.failure {
    margin: 0;
    padding: 6px var(--inset);
    color: var(--bad, var(--text-2));
    font-size: 12px;
}
</style>
