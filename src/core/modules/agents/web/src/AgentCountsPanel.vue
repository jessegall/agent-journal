<script setup>
import {computed, ref, watch} from "vue";
import {age, Btn, Icon, useNow, useWindow} from "@journal/window-kit";
import AgentRetireForm from "./AgentRetireForm.vue";
import AgentLimitEditor from "./AgentLimitEditor.vue";
import {countEntries, isFull as full} from "./agentCounts.js";

const emit = defineEmits(["open-agent", "close"]);
const title = defineModel("title", {default: "Agent counts"});
const view = useWindow();
const rows = computed(() => view.props.limits.rows.value ?? []);
const readFailure = computed(() => view.props.limits.failure.value);
const agents = ref([]);
const agentPage = ref(0);
const moreAgents = ref(false);
const now = useNow();
const selected = ref(null);
const pending = ref(false);
const failure = ref("");
const notice = ref("");
const retiring = ref(null);
const reason = ref("");
const entries = computed(() => countEntries(rows.value));
const helper = computed(() => rows.value.find((row) => row.per_profile));
const chosen = computed(() => entries.value.find((row) => row.key === selected.value));
const chosenAgents = computed(() => agents.value.filter((agent) => agent.state !== "retired" && agent.role === chosen.value?.type && (!chosen.value.profile || (agent.facts?.profile || agent.profile) === chosen.value.profile)).sort((a, b) => (a.state !== "running") - (b.state !== "running") || String(a.ended_at || a.created_at).localeCompare(String(b.ended_at || b.created_at))));
const models = computed(() => {
    const counts = new Map();
    for (const agent of chosenAgents.value) {
        const model = agent.facts?.model || agent.program_model;
        if (model) counts.set(model, (counts.get(model) || 0) + 1);
    }
    return [...counts].map(([model, count]) => `${count} ${model}`).join(", ");
});
const width = (count, limit) => limit ? `${Math.min(count / Math.max(count, limit) * 100, 100)}%` : "0%";
const overflow = (count, limit) => limit && count > limit ? `${(count - limit) / count * 100}%` : "0%";
const screen = computed(() => chosen.value?.key ?? "counts");
watch(() => chosen.value?.label || "Agent counts", (value) => { title.value = value; }, {immediate: true});
async function readAgents(row, page = 1) {
    view.state["count-agents.role"] = row.type;
    if (row.profile) view.state["count-agents.profile"] = row.profile;
    else delete view.state["count-agents.profile"];
    view.state["count-agents.page"] = String(page);
    await view.reload("count-agents");
    const result = view.props["count-agents"];
    agents.value = page === 1 ? [...result.rows.value] : [...agents.value, ...result.rows.value];
    agentPage.value = page;
    moreAgents.value = result.more.value;
}
function select(row) { selected.value = row.key; agents.value = []; readAgents(row); }
function back() { selected.value = null; retiring.value = null; failure.value = ""; }
function close() { back(); emit("close"); }
async function change(kind, value) {
    if (pending.value || view.readOnly) return;
    const number = Number(value);
    if (!String(value).trim() || !Number.isInteger(number) || number < 0) { failure.value = "Use a whole number of 0 or more."; return; }
    pending.value = true;
    failure.value = "";
    const row = chosen.value;
    const limits = {run: row.run_limit, kept: row.kept_limit, [kind]: number};
    const environment = ["--environment", view.environment];
    const answer = await view.run(row.profile
        ? ["agent", "profile-limits", row.type, row.profile, "--running", String(limits.run), "--kept", String(limits.kept), ...environment]
        : ["setting", "set", kind === "run" ? row.run_setting : row.kept_setting, String(number), ...environment]);
    if (answer.ok) { await view.reload("limits"); notice.value = "Saved."; }
    else failure.value = answer.error;
    pending.value = false;
}
async function retire(agent) {
    if (!reason.value.trim() || pending.value) return;
    pending.value = true;
    const answer = await view.run(["agent", "retire", String(agent.id), "--reason", reason.value.trim()]);
    failure.value = answer.ok ? "" : "The agent could not be retired. Try again.";
    if (answer.ok) { retiring.value = null; reason.value = ""; notice.value = "Agent retired permanently."; await view.reload("limits"); await readAgents(chosen.value); }
    pending.value = false;
}
function openAgent(agent) { close(); emit("open-agent", agent); }
</script>

<template>
    <div class="counts-panel">
        <div :key="screen" :class="['counts', {padded: readFailure || chosen}]" data-counts-screen>
            <template v-if="chosen"><button class="back" type="button" @click="back">‹ Back to the counts</button></template>
            <template v-if="readFailure"><strong>The counts could not be read</strong><p>The journal did not answer.</p><Btn small @click="view.reload('limits')">Try again</Btn></template>
            <template v-else-if="chosen">
                <AgentLimitEditor :row="chosen" :pending="pending" :read-only="view.readOnly" :environment="view.environment" @change="change" />
                <p><strong>{{ chosen.running }} of {{ chosen.run_limit }}</strong> running, <strong>{{ chosen.kept }}<template v-if="chosen.kept_limit"> of {{ chosen.kept_limit }}</template></strong> kept</p><p>{{ models }}</p>
                <template v-if="!chosenAgents.length"><strong>No agents here yet</strong><p>An agent shows here as soon as one of this type starts.</p></template>
                <template v-for="agent in chosenAgents" :key="agent.id"><div class="person" :data-count-agent="agent.id">
                    <span :class="['dot', {running: agent.state === 'running'}]" /><div class="person-text"><strong>{{ agent.facts?.given_name || agent.id }}</strong> {{ agent.state === 'running' ? 'Running' : 'Idle' }}, {{ age(agent.state === 'running' ? agent.process_started_at || agent.created_at : agent.ended_at, now) }}<small>{{ [agent.program, agent.facts?.model, agent.facts?.effort, `${agent.role} ${agent.id}`].filter(Boolean).join(', ') }}</small><small>{{ agent.facts?.task_title || agent.facts?.helper_job }}</small></div>
                    <Btn small @click="openAgent(agent)">Open</Btn><template v-if="agent.state === 'idle' && !view.readOnly"><Btn small @click="retiring = agent.id; reason = ''">Retire</Btn></template>
                    <template v-if="retiring === agent.id"><AgentRetireForm v-model:reason="reason" :pending="pending" @submit="retire(agent)" @cancel="retiring = null" /></template>
                </div></template>
                <template v-if="moreAgents"><Btn small @click="readAgents(chosen, agentPage + 1)">Show more</Btn></template>
            </template>
            <template v-else>
                <div class="columns"><span>Name</span><span>Running</span><span>Kept</span><span /></div>
                <template v-if="helper"><div class="helper-head"><strong>Read-only helpers</strong><span>{{ helper.running }} running, {{ helper.kept }} kept</span></div></template>
                <template v-for="row in entries" :key="row.key"><button type="button" class="count-row" :data-agent-limit-type="row.type || row.key" :data-agent-limit-profile="row.profile" @click="select(row)">
                    <strong>{{ row.label }}</strong><template v-for="cell in [{count: row.running, limit: row.run_limit, unlimited: false}, {count: row.kept, limit: row.kept_limit, unlimited: true}]" :key="cell.unlimited"><span :class="{full: full(cell.count, cell.limit)}"><span>{{ cell.count }}<template v-if="cell.limit || !cell.unlimited"> of {{ cell.limit }}</template></span><template v-if="cell.limit"><span class="bar"><span :style="{width: width(cell.count, cell.limit)}" /><i :style="{width: overflow(cell.count, cell.limit)}" /></span></template></span></template><Icon name="chevronRight" :size="12" />
                </button></template>
            </template>
            <template v-if="failure"><p role="alert">{{ failure }}</p></template><template v-else-if="notice"><p role="status">{{ notice }}</p></template>
        </div>
    </div>
</template>

<style scoped>
.counts { width: 100%; font-size: 12px; animation: counts-screen-in 180ms ease-out; }
.counts.padded { padding: 14px 18px; }
@keyframes counts-screen-in { from { opacity: 0; transform: translateX(16px); } }
p { color: var(--text-3); margin: 0 0 12px; }
.back { border: 0; background: none; color: var(--accent-text); cursor: pointer; margin-bottom: 12px; }
.columns, .count-row { display: grid; grid-template-columns: minmax(100px, 1fr) minmax(90px, 1fr) minmax(90px, 1fr) 12px; gap: 12px; align-items: center; padding-left: 18px; padding-right: 18px; }
.columns, .helper-head { color: var(--text-3); padding-top: 8px; padding-bottom: 8px; }
.helper-head { padding-left: 18px; padding-right: 18px; }
.columns { position: sticky; top: var(--settings-bar-height, 0); z-index: 1; background: var(--raised, var(--bg)); }
.helper-head { display: flex; justify-content: space-between; }
.count-row { width: 100%; padding-top: 9px; padding-bottom: 9px; background: none; border: 0; border-top: 1px solid var(--border); color: var(--text); text-align: left; cursor: pointer; }
.count-row:hover { background: var(--hover); }
.full { font-weight: 600; }
.bar { display: block; position: relative; height: 4px; background: var(--border); margin-top: 5px; }
.bar span { display: block; height: 100%; background: var(--text-3); }
.full .bar span { background: var(--tone-warn); }
.bar i { position: absolute; right: 0; top: 0; height: 100%; background: var(--danger); }
small { display: block; color: var(--text-3); margin-top: 4px; }
.person { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.person-text { flex: 1; min-width: 0; }.person-text small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--text-3); }.dot.running { background: var(--accent); }
[role="alert"], [role="status"] { margin: 8px 18px; }
.padded [role="alert"], .padded [role="status"] { margin: 8px 0; }
[role="alert"] { color: var(--danger); }
@media (max-width: 600px) { .bar { display: none; } }
</style>
