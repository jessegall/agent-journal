<script setup>
import DataTable from "../kit/DataTable.vue";
import {ref} from "vue";
import {usePoll} from "../composables/poll.js";

const measures = ref(null);

usePoll("developer.readers", {take: (got) => (measures.value = got)});

const share = (part, whole) => (whole ? `${Math.round((100 * part) / whole)}%` : "none yet");
const average = (part, whole) => (whole ? (part / whole).toFixed(1) : "none yet");
const rows = () =>
    measures.value
        ? [
              ["Background runs read by a project reader", `${share(measures.value.reader_runs, measures.value.background_runs)} of ${measures.value.background_runs}`],
              ["Reader suggestions a reader now reads", `${share(measures.value.followed_suggestions, measures.value.suggestions)} of ${measures.value.suggestions}`],
              ["Reader suggestions per session", `${average(measures.value.suggestions, measures.value.sessions)} over ${measures.value.sessions} sessions`],
          ]
        : [];
const readers = () => (measures.value ? measures.value.readers : []);
</script>

<template>
    <section class="developer-readers" data-developer-readers>
        <h3 class="developer-heading">Shell readers</h3>
        <p class="developer-line">Counted over the runs this environment moved to the background. A run no project reader reads shows its last lines.</p>
        <DataTable :columns="['Measure', 'Value']" :rows="rows().map((cells) => ({cells}))" empty="Nothing measured yet" />
        <h4 class="developer-subheading">Reader reports per ten runs</h4>
        <DataTable
            :columns="['Reader', 'Runs read', 'Reports', 'Reports per ten runs']"
            :rows="readers().map((row) => ({cells: [row.reader, row.runs, row.reports, row.report_rate]}))"
            empty="No run was read by a project reader yet"
        />
    </section>
</template>

<style scoped>
.developer-readers {
    margin: 0 0 24px;
}

.developer-heading {
    margin: 0 0 6px;
    font-size: 14px;
    font-weight: 600;
}

.developer-subheading {
    margin: 12px 0 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-2);
}

.developer-line {
    margin: 0 0 12px;
    color: var(--text);
    opacity: 0.7;
    font-size: 13px;
}
</style>
