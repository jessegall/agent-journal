<script setup>
import {computed} from "vue";
import {ActionsMenu, AgentBadge, Reader} from "@journal/window-kit";
import MemoryFacts from "./MemoryFacts.vue";
import {HIGHEST_WEIGHT, MAIN_NAME, stateWords} from "./memoryWords.js";

// one memory read whole: its number and the agent it belongs to in the head, its words as the title, the facts, its keywords, and the Actions menu
const props = defineProps({row: {type: Object, required: true}, owner: {type: String, required: true}, items: {type: Array, required: true}});
const facts = computed(() => [
    {name: "state", label: "State", value: stateWords(props.row)},
    {name: "weight", label: "Weight", value: `${props.row.weight} of ${HIGHEST_WEIGHT}`},
    {name: "task", label: "Task", value: props.row.task_id ? String(props.row.task_id) : "None", ...(props.row.task_id ? {link: `tasks:${props.row.task_id}`} : {})},
    ...(props.row.reason ? [{name: "reason", label: "Reason", value: props.row.reason}] : []),
    {name: "made", label: "Made", value: props.row.created_at, isTime: true},
]);
</script>

<template>
    <Reader :title="row.text" :number="String(row.id)" :facts="facts" data-memory-reader>
        <template #agent>
            <AgentBadge :name="owner" :main="owner === MAIN_NAME" />
        </template>
        <template #actions>
            <ActionsMenu :items="items" :head="`Memory ${row.id}`" />
        </template>
        <MemoryFacts :row="row" />
    </Reader>
</template>
