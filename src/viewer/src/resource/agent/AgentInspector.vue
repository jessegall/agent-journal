<script setup>
import {computed, onMounted, ref} from "vue";
import {ago} from "../../format/time.js";
import {useNow} from "../../../kit/useNow.js";
import BackButton from "../../kit/BackButton.vue";
import CloseButton from "../../kit/CloseButton.vue";
import Icon from "../../kit/Icon.vue";
import Skeleton from "../../kit/Skeleton.vue";
import {useResourceEvents} from "../resourceEvents.js";
import InspectorSections from "../../windows/InspectorSections.vue";
import InspectorActions from "../../kit/InspectorActions.vue";
import RowMoves from "../RowMoves.vue";
import {agentState, agentTitle, detailRows, finishedWords, givenName, identityParts, rowsOf, stripCells, totalOf} from "./agentView.js";
import AgentBrief from "./AgentBrief.vue";
import AgentFolds from "./AgentFolds.vue";
import AgentNow from "./AgentNow.vue";
import AgentRecent from "./AgentRecent.vue";
import AgentStrip from "./AgentStrip.vue";
import AgentWho from "./AgentWho.vue";

// the agent's identity, activity, instructions and actions
const props = defineProps({id: {type: Number, required: true}, read: {type: Function, required: true}, environment: {type: String, required: true}, backed: Boolean});
const emit = defineEmits(["close", "back"]);
const now = useNow();
const row = ref(null);
const facts = ref(null);
const inspection = ref(null);
const tool = ref({});
const counts = ref({helpers: 0, skills: 0});
const loads = ref(0);
const points = ref([]);
const failure = ref("");
let reading = 0;

const nothing = computed(() => (row.value.ended_at ? finishedWords(facts.value) : `It has no task.${facts.value?.instruction ? " It was given an instruction." : ""}`));

async function load() {
    const turn = ++reading;
    const shown = await props.read(["agent", "show", String(props.id)]);
    if (turn !== reading) return;
    if (!shown.ok) return void (failure.value = shown.error);
    const id = String(props.id);
    const worker = shown.value.role === "worker";
    const [listed, inspected, tooled, children, loaded, pointed] = await Promise.all([
        props.read(["usage", "agents", "--closed", "--agent", id, "--environment", props.environment]),
        props.read(["usage", "agent", id]),
        shown.value.ended_at ? {ok: false} : props.read(["usage", "tool", "--agent", id]),
        props.read(["agent", "list", "--parent", id, "--limit", "1", "--columns", "id"]),
        props.read(["agent-skill", "list", "--agent", id, "--state", "loaded", "--limit", "1", "--columns", "id"]),
        worker ? props.read(["worker-worktree", "points", "--agent", id]) : {ok: false},
    ]);
    if (turn !== reading) return;
    failure.value = inspected.ok ? "" : inspected.error;
    row.value = shown.value;
    facts.value = rowsOf(listed).find((one) => one.id === props.id) ?? null;
    inspection.value = inspected.ok ? inspected.value : null;
    tool.value = tooled.ok ? tooled.value : {};
    counts.value = {helpers: totalOf(children), skills: totalOf(loaded)};
    points.value = pointed.ok ? pointed.value.points : [];
    loads.value += 1;
}

useResourceEvents(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], load);
onMounted(load);
</script>

<template>
    <article class="agent-inspector" data-agent-inspector>
        <header class="top">
            <template v-if="backed"><BackButton @back="emit('back')" /></template>
            <Icon name="bot" :size="13" /><h1 data-resource-title>{{ row ? agentTitle(row) : `Agent ${id}` }}</h1>
            <CloseButton title="Close the panel" data-resource-close @click="emit('close')" />
        </header>
        <template v-if="row && !row.ended_at">
            <InspectorActions data-agent-actions><RowMoves noun="agent" :id="id" :row="row" :read="read" inline @done="load" /></InspectorActions>
        </template>
        <div class="scroll">
            <template v-if="failure"><p class="failure" role="alert" data-resource-failure>{{ failure }}</p></template>
            <template v-else-if="row && inspection">
                <AgentWho :name="givenName(row, facts)" :state="agentState(row, facts)" :parts="identityParts(row, facts)" :started-by="inspection.started_by" />
                <AgentStrip :cells="stripCells({row, facts, inspection, now})" />
                <AgentNow :inspection="inspection" :tool="tool" :nothing="nothing" />
                <AgentBrief :label="row.access === 'read-only' ? 'Instruction' : 'Brief'" :text="facts?.instruction ?? ''" :points="points" />
                <AgentRecent :moves="inspection.recent" />
                <AgentFolds :id="id" :read="read" :counts="counts" :loads="loads" :details="detailRows(row, inspection)" />
                <InspectorSections slot-name="inspector.agent" :row="row" />
                <template v-if="row.ended_at"><p class="ended" data-agent-ended>Ended {{ ago(row.ended_at, now) }}. It takes no more actions.</p></template>
            </template>
            <template v-else><Skeleton /></template>
        </div>
    </article>
</template>

<style scoped>
.agent-inspector { display: flex; flex: 1; flex-direction: column; min-height: 0; }
.top { display: flex; align-items: center; gap: 8px; height: 34px; flex: none; padding: 0 6px 0 14px; background: var(--side); border-bottom: 1px solid var(--border); color: var(--text-3); }
h1 { flex: 1; margin: 0; color: var(--text); font-size: 11.5px; font-weight: 600; letter-spacing: .03em; }
.scroll { flex: 1; min-height: 0; overflow-y: auto; scrollbar-width: thin; }
.failure { padding: 10px 14px; color: var(--danger); font-size: 12px; }
.ended { padding: 8px 14px; color: var(--text-3); font-size: 12px; }
</style>
