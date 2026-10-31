<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import Segmented from "../kit/Segmented.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TextInput from "../kit/TextInput.vue";
import {STATUS_ORDER, statusOf} from "../domain/taskBoard.js";
import {taskBoard} from "../state/taskBoard.js";
import TasksDisplayMenu from "./TasksDisplayMenu.vue";
import TasksFilterMenu from "./TasksFilterMenu.vue";
import TasksKeysMenu from "./TasksKeysMenu.vue";

const props = defineProps({tasks: {type: Array, required: true}, single: Boolean});
const emit = defineEmits(["new", "close"]);
const VIEWS = [
    {key: "list", label: "List", tip: "The list of tasks (V)"},
    {key: "graph", label: "Graph", tip: "What waits on what (V)"},
];
const menu = ref(null);
const search = ref(null);
const counts = computed(() => Object.fromEntries(STATUS_ORDER.map((s) => [s, props.tasks.filter((t) => statusOf(t) === s).length])));
const standing = computed(() => {
    const open = props.tasks.length - counts.value.done;
    return `${open} not done${counts.value.blocked ? `, ${counts.value.blocked} blocked` : ""}`;
});
const show = (kind, el) => (menu.value = menu.value?.kind === kind ? null : {kind, el});
defineExpose({focusSearch: () => search.value?.focus()});
</script>

<template>
    <header class="tasks-head">
        <h2>Tasks</h2>
        <Segmented :options="VIEWS" :value="taskBoard.view" @pick="taskBoard.view = $event" />
        <template v-if="tasks.length && !single">
            <span class="standing">{{ standing }}</span>
        </template>
        <span class="grow" />
        <template v-if="taskBoard.view === 'list'">
            <TextInput
                ref="search"
                class="search"
                icon="search"
                type="search"
                :value="taskBoard.words"
                placeholder="Search the tasks"
                aria-label="Search the tasks"
                @input="taskBoard.words = $event.target.value"
                @keydown.esc.stop="taskBoard.words ? (taskBoard.words = '') : $event.target.blur()"
            />
            <Btn small :class="{on: taskBoard.statuses.length}" @click="show('filter', $event.currentTarget)">
                Filter
                <template v-if="taskBoard.statuses.length">
                    <span class="count">{{ taskBoard.statuses.length }}</span>
                </template>
            </Btn>
            <Btn small @click="show('display', $event.currentTarget)">Display</Btn>
        </template>
        <Btn small title="New task (C)" @click="emit('new')">
            <Icon name="plus" :size="12" />
            New task
        </Btn>
        <template v-if="!single">
            <Btn small title="Keys (?)" @click="show('keys', $event.currentTarget)">?</Btn>
        </template>
        <Btn small aria-label="Close the tasks (Esc)" @click="emit('close')"><Icon name="close" :size="13" /></Btn>
        <template v-if="menu">
            <MenuPanel :anchor="menu.el" :min-width="240" align="right" @close="menu = null">
                <SwitchCase :value="menu.kind">
                    <template #filter><TasksFilterMenu :counts="counts" @close="menu = null" /></template>
                    <template #display><TasksDisplayMenu /></template>
                    <template #keys><TasksKeysMenu /></template>
                </SwitchCase>
            </MenuPanel>
        </template>
    </header>
</template>

<style scoped>
.tasks-head {
    display: flex;
    flex: none;
    align-items: center;
    gap: 6px;
    height: 48px;
    padding: 0 10px 0 18px;
    border-bottom: 1px solid var(--border);
}

h2 {
    margin: 0 4px 0 0;
    font-size: 14px;
    font-weight: 600;
}

.standing {
    color: var(--text-4);
    font-size: 12px;
    white-space: nowrap;
}

.grow {
    flex: 1;
}

.search {
    width: 210px;
}

.count {
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

@media (max-width: 900px) {
    .search {
        width: 150px;
    }
}
</style>
