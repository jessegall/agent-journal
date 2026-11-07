<script setup>
import {computed, ref, watch} from "vue";
import {RowList, useWindow} from "@journal/window-kit";
import WorkerSplitProgram from "./WorkerSplitProgram.vue";
import WorkerRouteRow from "./WorkerRouteRow.vue";
import WorkerRouteForm from "./WorkerRouteForm.vue";
import WorkerOutageForm from "./WorkerOutageForm.vue";
import {sharesAfter} from "./programShares.js";

const view = useWindow();
const {rows, failure, loaded, act} = view.props.split;
const {rows: routes, failure: routeFailure} = view.props.routes;
const {rows: tags, failure: tagFailure} = view.props.tags;
const {rows: limits, failure: limitFailure} = view.props["split-limits"];
const drafts = ref([]);
const refusal = ref("");
const pending = ref(false);
const outProgram = ref("");
const worker = computed(() => limits.value.find((row) => row.key === "worker"));
const disabled = computed(() => pending.value || view.readOnly);
const error = computed(() => refusal.value || failure.value || routeFailure.value || tagFailure.value || limitFailure.value);
watch(rows, (fresh) => { drafts.value = fresh.map((row) => ({...row})); }, {immediate: true});
const shareOf = (row) => drafts.value.find((draft) => draft.id === row.id)?.share ?? row.share;
function setShare(row, value) { drafts.value = sharesAfter(drafts.value, row.id, value); }
async function run(line) {
    if (disabled.value) return;
    pending.value = true;
    try {
        const answer = await act(line);
        refusal.value = answer.ok ? "" : answer.error;
        if (answer.ok) { outProgram.value = ""; await view.reload(["routes", "split-limits"]); }
    } finally { pending.value = false; }
}
function save() {
    const shares = drafts.value.map((row) => `${row.id} ${row.share}`).join(",");
    return run(["setting", "set", "journal.core.helpers.program-split", shares, "--project"]);
}
function setLimit(value) {
    if (!worker.value) return;
    return run(["setting", "set", worker.value.run_setting, String(value), "--environment", view.environment]);
}
function markOut(reason, endsAt) { return run(["provider-outage", "make", outProgram.value, reason, "--ends-at", endsAt]); }
</script>

<template>
    <section class="split" data-worker-split>
        <template v-if="error"><p role="alert">{{ error }}</p></template>
        <template v-if="worker"><label>Workers running at once <input type="number" min="0" :value="worker.run_limit" aria-label="Workers running at once" :disabled="disabled" @change="setLimit($event.target.value)" /></label></template>
        <p>Shares apply to new tasks. Helpers and workers are counted separately. A program that is out passes its share to the others.</p>
        <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No agent programs" hint="Installed program modules appear here.">
            <template #default="{row}"><WorkerSplitProgram :row="row" :share="shareOf(row)" :disabled="disabled" @share="setShare(row, $event)" @save="save" @back="run(['provider-outage', 'end', row.id])" @out="outProgram = row.id" /></template>
        </RowList>
        <template v-if="outProgram"><WorkerOutageForm :program="outProgram" :disabled="disabled" @submit="markOut" @cancel="outProgram = ''" /></template>
        <h3>Routes</h3><p>The first matching route wins.</p>
        <template v-for="row in routes" :key="row.id"><WorkerRouteRow :row="row" :count="routes.length" :disabled="disabled" @move="run(['worker-route', 'move', String(row.id), '--to', String($event)])" @delete="run(['worker-route', 'delete', String(row.id)])" /></template>
        <template v-if="!routes.length"><p>No routes. New tasks follow the split.</p></template>
        <WorkerRouteForm :programs="rows" :tags="tags" :disabled="disabled" @submit="run" />
    </section>
</template>

<style scoped>
.split {display: flex; flex-direction: column; gap: 8px;}
p, h3 {margin: 0;}
p {color: var(--text-3); font-size: 12px;}
h3 {margin-top: 12px; font-size: 13px;}
label {display: flex; align-items: center; gap: 8px;}
input {width: 54px;}
[role=alert] {color: var(--danger);}
</style>
