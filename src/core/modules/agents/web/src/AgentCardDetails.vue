<script setup>
import {computed, defineAsyncComponent, onUnmounted, ref, watch} from "vue";
import {READ_RATES, coalesced, EmptyState, FoldGroup, InnerTabs, eventMayBeChildOf, loadWindowComponent, peekRef, SwitchCase, TabBody, useWindow} from "@journal/window-kit";
import AgentCommand from "./AgentCommand.vue";
import AgentLastingFacts from "./AgentLastingFacts.vue";
import AgentTaskGroup from "./AgentTaskGroup.vue";
import TranscriptRows from "./TranscriptRows.vue";

const props = defineProps({row: {type: Object, required: true}, facts: {type: Object, default: null}, progress: {type: Object, default: null}, waitReason: {type: String, default: ""}, tasks: {type: Array, required: true}, stoppedWithWork: Boolean, open: Boolean});
const TASK_STATES = ["started", "blocked", "open", "completed"];
const ENDED_WITHOUT_REPORT = "It ended without a report";
const endedReason = computed(() => (props.row.ended_at && props.facts?.job_returned?.startsWith(ENDED_WITHOUT_REPORT) ? props.facts.job_returned : ""));
const sections = computed(() => props.tasks.length ? TASK_STATES.map((state) => ({state, label: state.slice(0, 1).toUpperCase() + state.slice(1), tasks: props.tasks.filter((task) => task.state === state || (state === "started" && task.state === "testing") || (state === "completed" && task.state === "cancelled"))})) : []);
const FOLDED_STATES = new Set(["completed"]);
const folded = ref({});
const sectionOpen = (state) => !(folded.value[state] ?? FOLDED_STATES.has(state));
const fold = (state) => (folded.value = {...folded.value, [state]: sectionOpen(state)});
// a running helper's card names the command it runs, as the foot of the chat does for the main agent, or says plainly that it ran none
const context = useWindow();
const {rows: reports} = context.props.reports;
context.state["reports.agent"] = String(props.row.number);
const isReader = computed(() => props.row.access === "read-only");
const tabOrder = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"];
const cardTabs = computed(() => [...context.tabs].sort((one, two) => (tabOrder.indexOf(one.key) < 0 ? tabOrder.length : tabOrder.indexOf(one.key)) - (tabOrder.indexOf(two.key) < 0 ? tabOrder.length : tabOrder.indexOf(two.key))));
const isRetired = computed(() => Boolean(props.row.retired_at) || props.row.state === "retired");
// an agent that only reads, or is retired, opens on what it said; the others on their tasks
const firstTab = () => isReader.value || isRetired.value ? cardTabs.value.find((item) => item.key === "transcript") : cardTabs.value[0];
const tab = ref(firstTab());
watch(tab, (value) => { context.state.tab = value?.key ?? ""; }, {immediate: true});
onUnmounted(() => { context.state.tab = ""; });
watch(cardTabs, (tabs) => { if (!tabs.some((item) => item.key === tab.value?.key)) tab.value = tabs[0]; });
watch(() => props.open, (open) => { if (open) tab.value = firstTab(); });
const components = Object.fromEntries(context.tabs.filter((tab) => tab.component).map((tab) => [tab.key, defineAsyncComponent(() => loadWindowComponent(tab.component))]));
const instructionOpen = ref(false);
const {data: tool} = context.props.tool;
const runningCommand = computed(() => tool.value?.tool ?? "");
const noCommandNote = computed(() => tool.value?.note ?? "");
const showsCommand = computed(() => props.row.role !== "main" && (!props.row.ended_at || props.stoppedWithWork || props.waitReason));
async function readCommand() {
    if (!props.open || !showsCommand.value) return;
    context.state["tool.agent"] = String(props.row.number);
    await context.reload("tool");
}
const readCommandSoon = coalesced(readCommand, READ_RATES.agentCommand);
const stopFollowing = context.follow(["hook_call.*", "process_part.*"], (event) => eventMayBeChildOf(event, "session_agent_id", new Set([props.row.id])) && readCommandSoon());
onUnmounted(() => stopFollowing?.());
watch(() => props.open, (open) => { if (open) readCommand(); }, {immediate: true});
</script>

<template>
    <div class="agent-more" data-agent-more @click.stop>
        <AgentLastingFacts :row="row" />
        <template v-if="row.retirement_reason"><p class="agent-summary" data-agent-retirement-reason>Retirement reason: {{ row.retirement_reason }}</p></template>
                <template v-if="endedReason"><p class="agent-ended-reason" data-agent-ended-reason>{{ endedReason }}</p></template>
                <InnerTabs class="agent-tabs" :tabs="cardTabs" :active="tab" :answer="{tasks: tasks.length, reports: row.report_count ?? reports.length, memories: row.memory_count ?? 0}" @choose="tab = $event" />
                <TabBody class="agent-tab-body" :tab="tab" :data-agent-tab-body="tab?.key">
                    <SwitchCase :value="tab?.key">
                        <template #reports>
                            <template v-if="!reports.length"><EmptyState title="No reports">This agent has not sent any reports.</EmptyState></template>
                            <template v-for="report in reports" :key="report.id"><button type="button" class="agent-report" :data-peek="`messages:${report.id}`" @click="peekRef(`messages:${report.id}`)">{{ report.text }}</button></template>
                        </template>
                        <template #tasks>
                            <template v-if="!tasks.length"><EmptyState title="No tasks">No tasks have been assigned to this agent.</EmptyState></template>
                            <template v-for="section in sections" :key="section.state">
                                <AgentTaskGroup :section="section" :open="sectionOpen(section.state)" @toggle="fold(section.state)" />
                            </template>
                            <template v-if="facts?.instruction">
                                <p class="agent-label">Instruction</p>
                                <div class="agent-instruction" data-agent-instruction>{{ facts.instruction }}</div>
                            </template>
                        </template>
                        <template #transcript>
                            <template v-if="isReader">
                            <template v-if="facts?.instruction">
                                <div class="agent-helper-brief">
                                    <FoldGroup label="Instruction" :open="instructionOpen" data-agent-section="instruction" @toggle="instructionOpen = !instructionOpen">
                                        <div class="agent-instruction" data-agent-instruction>{{ facts.instruction }}</div>
                                    </FoldGroup>
                                </div>
                            </template>
                            <template v-else-if="facts && row.ended_at">
                                <p class="agent-label" data-agent-no-job>No job recorded</p>
                            </template>
                            </template>
                            <TranscriptRows :name="`transcript.${row.id}`" padding="0" />
                        </template>
                        <template v-for="(component, key) in components" :key="key" #[key]>
                            <component :is="component" :agent="row.id" />
                        </template>
                    </SwitchCase>
                </TabBody>
                <template v-if="showsCommand"><AgentCommand class="agent-command" :wait-reason="waitReason" :stopped="stoppedWithWork" :command="runningCommand" :note="noCommandNote" /></template>
    </div>
</template>

<style scoped>
.agent-more { display: flex; flex: 1; flex-direction: column; min-width: 0; min-height: 0; max-width: 100%; cursor: default; }
.agent-summary { margin: 8px 14px; color: var(--text-2); font-size: 12px; white-space: pre-wrap; }
.agent-report { padding: 8px 14px; border: 0; border-bottom: 1px solid var(--border-inner); background: transparent; color: var(--text); text-align: left; white-space: pre-wrap; cursor: pointer; }
.agent-ended-reason { margin: 4px 0; color: var(--danger, var(--text)); }
.agent-command { flex: none; width: 100%; max-width: 100%; overflow: hidden; padding: 6px var(--agent-padding); border-top: 1px solid var(--border-inner); background: var(--side); }
.agent-tab-body { position: relative; display: flex; flex: 1; flex-direction: column; min-width: 0; min-height: 0; overflow-x: hidden; overflow-y: auto; contain: inline-size; }
.agent-tab-body:not([data-agent-tab-body="tasks"]) > :deep(*) { flex: 1; min-height: 0; }
.agent-tab-body :deep(.row-list-row) { padding: 8px 14px; border-bottom: 1px solid var(--border-inner); }
.agent-tab-body[data-agent-tab-body="transcript"] :deep(.row-list-row) { gap: 8px; }
.agent-tab-body[data-agent-tab-body="transcript"] :deep(.author) { min-width: 54px; font-size: 11.5px; letter-spacing: .03em; }
.agent-tab-body[data-agent-tab-body="file-feed"] :deep(.row-list-row) { padding: 0; }
.agent-helper-brief { flex: none; }
.agent-label { margin: 12px 14px 0; color: var(--text-3); font-size: 12px; }
.agent-instruction { flex: 1; min-height: 0; margin: 12px 14px 16px; padding: 0 0 0 10px; overflow-y: auto; border-left: 2px solid var(--border-2); color: var(--text-2); font-size: 12.5px; line-height: 1.55; white-space: pre-wrap; }
.agent-helper-brief .agent-instruction { max-height: 240px; }
</style>
