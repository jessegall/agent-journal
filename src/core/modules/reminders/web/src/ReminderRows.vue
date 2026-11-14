<script setup>
import {computed, ref} from "vue";
import {Btn, CreateDialog, FilterBar, ListReaderLayout, PageHeader, Skeleton, added, applyFilter, copying, defaultFilter, deleteItem, removed, short, useWindow} from "@journal/window-kit";
import ReminderLine from "./ReminderLine.vue";
import ReminderReader from "./ReminderReader.vue";
import {nextWords, reminderFilters} from "./reminderWords.js";
import {newReminderCommand, newReminderFields, newReminderLine, newReminderPending, refusedFields} from "./newReminder.js";

// the reminders as a list and a reader: each row is the number and the words with the time it comes next at the right edge, then how it repeats, whether it holds the agent and the agent;
// the filters pick the repeat and whether it holds; New makes one, and a right click on a row copies its words or deletes it
const LIST_WIDTH = 460;
const view = useWindow();
const {rows, failure, loaded, act, actionFailure} = view.props.reminders;
const fields = computed(() => reminderFilters(rows.value));
const filter = ref(defaultFilter(fields.value));
const words = ref("");
const shown = computed(() => applyFilter(rows.value, fields.value, filter.value, words.value, ["text"]));
const items = computed(() => shown.value.map((row) => ({id: row.id, title: `${row.id} ${row.text}`, row})));
const chosen = ref(null);
const making = ref(false);

// a reminder made in the dialog shows at once, and the read that follows puts the saved one in its place
const make = async (values) => {
    const result = await act(newReminderLine(values), added(newReminderPending(values)));
    return result.ok ? result : {ok: false, error: result.error};
};
const place = (item) => ({
    head: `Reminder ${item.id}`,
    items: [
        {label: "Copy text", group: "copy", run: ({say}) => copying(item.row.text, short(item.row.text, 30), say)},
        deleteItem({name: `reminder ${item.id}`, remove: () => act(["reminder", "delete", String(item.id)], removed(item.id))}),
    ],
});
</script>

<template>
    <ListReaderLayout v-model:chosen="chosen" :items="items" :list-width="LIST_WIDTH" :place="place" empty-title="No reminders yet" pick-line="Choose a reminder" data-reminders>
        <template #top>
            <PageHeader title="Reminders" :count="rows.length">
                <template #primary><Btn small variant="primary" data-reminder-new @click="making = true">New reminder</Btn></template>
            </PageHeader>
            <FilterBar v-model="filter" v-model:words="words" :fields="fields" :rows="rows" :shown="shown.length" placeholder="Search reminders" />
            <template v-if="making">
                <CreateDialog title="New reminder" submit="Make the reminder" :fields="newReminderFields" :command="newReminderCommand" :check="refusedFields" :run="make" @close="making = false" />
            </template>
            <template v-if="failure || actionFailure">
                <p class="failure" role="alert" data-reminders-failure>{{ failure || actionFailure }}</p>
            </template>
        </template>
        <template #empty>
            <template v-if="!loaded"><Skeleton shape="rows" /></template>
            <template v-else>Reminders appear here with the time they come.</template>
        </template>
        <template #meta="{item}">
            <span class="next" data-reminder-next>{{ nextWords(item.row) }}</span>
        </template>
        <template #line="{item}">
            <ReminderLine :row="item.row" />
        </template>
        <template #reader="{item}">
            <ReminderReader :row="item.row" />
        </template>
    </ListReaderLayout>
</template>

<style scoped>
.next {
    color: var(--text-3);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

.failure {
    margin: 0;
    padding: 6px var(--inset);
    color: var(--bad, var(--text-2));
    font-size: 12px;
}
</style>
