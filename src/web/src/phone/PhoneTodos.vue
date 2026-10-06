<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import ActionSheet from "./kit/ActionSheet.vue";
import ItemRow from "./kit/ItemRow.vue";
import ListScreen from "./kit/ListScreen.vue";
import {newestFirst} from "./kit/listed.js";
import {toast} from "./kit/toast.js";

const UNDONE = "Undone on the phone right after it was marked done";
const EMPTY = {icon: "todos", title: "No open to-dos", reason: "When you or the agent add a to-do, it shows here.", action: ""};

const emit = defineEmits(["open"]);
const list = ref(null);
const acting = ref(null);

const load = newestFirst("todo");

async function shifted(row, lane, words, undo = null) {
    try {
        await api.shift(row.n, lane, lane === "todo" ? {why: UNDONE} : {});
        toast(words, undo);
    } catch (error) {
        toast(error.message);
    }
    list.value.reload();
}

const about = (row) => `To-do ${row.n}`;
const done = (row) => shifted(row, "done", `Marked to-do ${row.n} done`, () => shifted(row, "todo", `To-do ${row.n} is open again`));
const lead = (row) => ({label: "Mark done", run: () => done(row)});
const trail = (row) => [
    {key: "start", label: "Start", tone: "start", run: () => shifted(row, "doing", `Started to-do ${row.n}`)},
    {key: "more", label: "More", tone: "", run: () => (acting.value = row)},
];
const actions = (row) => [
    {key: "open", label: "Open", run: () => emit("open", `todo:${row.n}`)},
    {key: "start", label: "Start", run: () => shifted(row, "doing", `Started to-do ${row.n}`)},
    {key: "done", label: "Mark done", run: () => done(row)},
];
</script>

<template>
    <ListScreen ref="list" title="To-dos" intro="What the agent is asked to do in this environment." :load="load" :empty="EMPTY">
        <template #row="{row}">
            <ItemRow
                :title="row.title"
                :about="about(row)"
                :meta="[`#${row.n}`]"
                :lead="lead(row)"
                :trail="trail(row)"
                @open="emit('open', `todo:${row.n}`)"
                @more="acting = row"
            />
        </template>
    </ListScreen>
    <template v-if="acting">
        <ActionSheet :title="acting.title" :about="about(acting)" :actions="actions(acting)" @close="acting = null" />
    </template>
</template>
