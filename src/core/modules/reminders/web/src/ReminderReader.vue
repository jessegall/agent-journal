<script setup>
import {computed} from "vue";
import {AgentBadge, Reader} from "@journal/window-kit";
import {AGENT, holdWords, nextWords, repeatWords} from "./reminderWords.js";

// one reminder read whole: its number and the agent in the head, its words as the title, and the facts. The reminder's text is the title, so there is no Text part.
const props = defineProps({row: {type: Object, required: true}});
const facts = computed(() => [
    {name: "repeats", label: "Repeats", value: repeatWords(props.row)},
    {name: "holds", label: "Holds", value: holdWords(props.row)},
    {name: "next", label: "Next", value: nextWords(props.row) || "Not timed"},
    props.row.last_fired_at ? {name: "last", label: "Last", value: props.row.last_fired_at, isTime: true} : {name: "last", label: "Last", value: "Never"},
]);
</script>

<template>
    <Reader :title="row.text" :number="String(row.id)" :facts="facts" data-reminder-reader>
        <template #agent>
            <AgentBadge :name="AGENT" main />
        </template>
    </Reader>
</template>
