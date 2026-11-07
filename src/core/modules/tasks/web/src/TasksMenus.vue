<script setup>
import {ref} from "vue";
import {Btn, MenuItem, MenuLabel, MenuPanel, SwitchCase, useWindow} from "@journal/window-kit";

const STATES = ["started", "open", "delegated", "blocked", "testing", "completed", "cancelled"];
const GROUPINGS = [
    {key: "state", label: "Status"},
    {key: "plan", label: "Plan and phase"},
    {key: "none", label: "Nothing"},
];
const SHOWN = [
    {key: "number", label: "The task's number"},
    {key: "reason", label: "What blocks the task"},
];
const KEYS = [
    ["↑ ↓", "Move through the list"],
    ["Enter", "Open the task"],
    ["Space", "Open or close the task beside the list"],
    ["C", "New task"],
    ["S", "Change the status"],
    ["V", "List or graph"],
    ["/", "Search"],
    ["Esc", "Close"],
];
const props = defineProps({states: {type: Array, required: true}, display: {type: Object, required: true}, selected: {type: Number, default: 0}});
const emit = defineEmits(["states", "display", "deleted"]);
const context = useWindow();
const menu = ref(null);
const sure = ref(false);
const refusal = ref("");
const name = (state) => state.slice(0, 1).toUpperCase() + state.slice(1);

function opened(type, event) {
    sure.value = false;
    refusal.value = "";
    menu.value = {type, anchor: event.currentTarget};
}

const toggled = (state) => emit("states", props.states.includes(state) ? props.states.filter((held) => held !== state) : [...props.states, state]);
const changed = (fields) => emit("display", {...props.display, ...fields});

async function remove() {
    if (!sure.value) return void (sure.value = true);
    const answer = await context.run(["task", "delete", String(props.selected)]);
    refusal.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    menu.value = null;
    emit("deleted");
}
</script>

<template>
    <Btn small data-menu-filter :title="states.length ? `Filter: ${states.length}` : 'Filter'" @click="opened('filter', $event)">Filter</Btn>
    <Btn small data-menu-display @click="opened('display', $event)">Display</Btn>
    <Btn small data-menu-keys @click="opened('keys', $event)">Keys</Btn>
    <Btn small data-menu-more :disabled="!selected" @click="opened('more', $event)">More</Btn>
    <template v-if="menu">
        <MenuPanel :anchor="menu.anchor" :min-width="240" :max-width="320" @close="menu = null">
            <SwitchCase :value="menu.type">
                <template #filter>
                    <MenuLabel>Show tasks that are</MenuLabel>
                    <template v-for="state in STATES" :key="state">
                        <MenuItem :on="states.includes(state)" :data-filter-state="state" @click="toggled(state)">{{ name(state) }}</MenuItem>
                    </template>
                    <MenuItem data-filter-clear @click="(emit('states', []), (menu = null))">Show every task that is not done</MenuItem>
                </template>
                <template #display>
                    <MenuLabel>Group the list by</MenuLabel>
                    <template v-for="grouping in GROUPINGS" :key="grouping.key">
                        <MenuItem :on="display.grouping === grouping.key" :data-grouping="grouping.key" @click="changed({grouping: grouping.key})">{{ grouping.label }}</MenuItem>
                    </template>
                    <MenuLabel>Show on each task</MenuLabel>
                    <template v-for="shown in SHOWN" :key="shown.key">
                        <MenuItem :on="display[shown.key]" :data-shown="shown.key" @click="changed({[shown.key]: !display[shown.key]})">{{ shown.label }}</MenuItem>
                    </template>
                    <MenuItem :on="display.showDone" data-show-done @click="changed({showDone: !display.showDone})">Show completed tasks</MenuItem>
                </template>
                <template #keys>
                    <MenuLabel>Keys</MenuLabel>
                    <template v-for="[keys, what] in KEYS" :key="keys">
                        <span class="key-line">{{ what }}<kbd>{{ keys }}</kbd></span>
                    </template>
                </template>
                <template #default>
                    <MenuLabel>Task {{ selected }}</MenuLabel>
                    <MenuItem data-delete-task @click="remove">{{ sure ? "Delete it for good" : "Delete" }}</MenuItem>
                    <template v-if="refusal">
                        <p class="menu-note" role="alert">{{ refusal }}</p>
                    </template>
                </template>
            </SwitchCase>
        </MenuPanel>
    </template>
</template>

<style scoped>
.key-line {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    padding: 4px 10px;
    color: var(--text-2);
    font-size: 13px;
}

kbd {
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
}

.menu-note {
    margin: 4px 10px;
    color: var(--text-2);
    font-size: 12px;
}
</style>
