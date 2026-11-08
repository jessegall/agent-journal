<script setup>
import {computed, onMounted, ref} from "vue";
import {ago} from "../../format/time.js";
import {useNow} from "../../../kit/useNow.js";
import Skeleton from "../../kit/Skeleton.vue";
import {useResourceEvents} from "../resourceEvents.js";
import {eventAboutRows, eventChildOf} from "../../../kit/eventRows.js";
import {agentState, agentTitle, detailRows, finishedWords, givenName, stripCells} from "./agentView.js";
import AgentBrief from "./AgentBrief.vue";
import AgentFolds from "./AgentFolds.vue";
import AgentNow from "./AgentNow.vue";
import AgentRecent from "./AgentRecent.vue";
import AgentStrip from "./AgentStrip.vue";
import AgentWho from "./AgentWho.vue";

// the body of an agent's inspector: its identity, activity, instructions, recent moves and the folds of its details; the head and the actions belong to the shared layout
const props = defineProps({id: {type: Number, required: true}, read: {type: Function, required: true}, environment: {type: String, required: true}});
const now = useNow();
const row = ref(null);
const facts = ref(null);
const inspection = ref(null);
const tool = ref({});
const counts = ref({helpers: 0, skills: 0});
const loads = ref(0);
const points = ref([]);
const programs = ref([]);
const failure = ref("");
let reading = 0;

const nothing = computed(() => (row.value.ended_at ? finishedWords(facts.value) : `It has no task.${facts.value?.instruction ? " It was given an instruction." : ""}`));

async function load() {
    const turn = ++reading;
    const answer = await props.read(["usage", "inspector", String(props.id), "--environment", props.environment]);
    if (turn !== reading) return;
    failure.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    row.value = answer.value.agent;
    facts.value = answer.value.facts;
    inspection.value = answer.value.inspection;
    tool.value = answer.value.tool;
    counts.value = {helpers: answer.value.helpers, skills: answer.value.skills};
    points.value = answer.value.points;
    programs.value = answer.value.programs;
    loads.value += 1;
}

const thisAgent = computed(() => new Set([props.id]));
const concernsAgent = {
    agent: (event) => eventAboutRows(event, thisAgent.value),
    hook_call: (event) => eventChildOf(event, "session_agent_id", thisAgent.value),
};
useResourceEvents(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], load, (event) => concernsAgent[event.event.split(".")[0]]?.(event) ?? true);
onMounted(load);
</script>

<template>
    <article class="agent-inspector" data-agent-inspector>
        <div class="scroll">
            <template v-if="failure"><p class="failure" role="alert" data-resource-failure>{{ failure }}</p></template>
            <template v-else-if="row && inspection">
                <AgentWho :name="givenName(row, facts)" :state="agentState(row, facts)" :started-by="inspection.started_by" :agent="row" :programs="programs" :usage="{agents: facts ? [facts] : [], windows: facts?.windows ?? []}" />
                <AgentStrip :cells="stripCells({row, facts, inspection, now})" />
                <AgentNow :inspection="inspection" :tool="tool" :nothing="nothing" />
                <AgentBrief :label="row.access === 'read-only' ? 'Instruction' : 'Brief'" :text="facts?.instruction ?? ''" :points="points" />
                <AgentRecent :moves="inspection.recent" />
                <AgentFolds :id="id" :read="read" :counts="counts" :loads="loads" :details="detailRows(row, inspection)" />
                <template v-if="row.ended_at"><p class="ended" data-agent-ended>Ended {{ ago(row.ended_at, now) }}. It takes no more actions.</p></template>
            </template>
            <template v-else><Skeleton /></template>
        </div>
    </article>
</template>

<style scoped>
.agent-inspector { display: flex; flex: 1; flex-direction: column; min-height: 0; }
.scroll { flex: 1; min-height: 0; overflow-y: auto; scrollbar-width: thin; }
.failure { padding: 10px 14px; color: var(--danger); font-size: 12px; }
.ended { padding: 8px 14px; color: var(--text-3); font-size: 12px; }
</style>
