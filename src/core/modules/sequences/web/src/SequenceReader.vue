<script setup>
import {computed} from "vue";
import {ActionsMenu, AgentBadge, Reader, SwitchCase} from "@journal/window-kit";
import SequenceRuns from "./SequenceRuns.vue";
import SequenceSteps from "./SequenceSteps.vue";
import SequenceTriggers from "./SequenceTriggers.vue";
import {progress, runsOf, triggersOf} from "./sequenceWords.js";

// one sequence read whole: its number in the head and, while it runs, the agent and the step; the Steps, Runs and Triggers tabs; and the Actions menu
const props = defineProps({sequence: {type: Object, required: true}, runs: {type: Array, required: true}, items: {type: Array, required: true}});
const emit = defineEmits(["abandon"]);
const mine = computed(() => runsOf(props.sequence, props.runs));
const tabs = computed(() => [
    {key: "steps", label: "Steps", count: props.sequence.steps.length},
    {key: "runs", label: "Runs", count: mine.value.length},
    {key: "triggers", label: "Triggers", count: triggersOf(props.sequence).length},
]);
const running = computed(() => mine.value[0] ?? null);
</script>

<template>
    <Reader :title="sequence.title" :number="String(sequence.id)" :tabs="tabs" data-sequence-reader>
        <template #agent>
            <template v-if="running">
                <span class="run-head" data-run-head>Run {{ running.id }} · step {{ running.step_number }} of {{ progress(running).total }}</span>
                <AgentBadge :name="`Agent ${running.session_agent_id}`" />
            </template>
        </template>
        <template #actions>
            <ActionsMenu :items="items" :head="`Sequence ${sequence.id}`" />
        </template>
        <template #default="{tab}">
            <SwitchCase :value="tab">
                <template #steps><SequenceSteps :sequence="sequence" :runs="mine" /></template>
                <template #runs><SequenceRuns :runs="mine" :all="runs" @abandon="emit('abandon', $event)" /></template>
                <template #triggers><SequenceTriggers :sequence="sequence" /></template>
            </SwitchCase>
        </template>
    </Reader>
</template>
