<script setup>
import {computed, ref} from "vue";
import {age, Btn, Dialog, Icon, useNow, useWindow} from "@journal/window-kit";
import AgentRetireForm from "./AgentRetireForm.vue";

const emit = defineEmits(["open-agent"]);
const view = useWindow();
const {rows, failure: readFailure} = view.props.limits;
const agents = ref([]);
const agentPage = ref(0);
const moreAgents = ref(false);
const now = useNow();
const open = ref(false);
const selected = ref(null);
const editing = ref(false);
const pending = ref(false);
const failure = ref("");
const notice = ref("");
const retiring = ref(null);
const reason = ref("");
const entries = computed(() => rows.value.flatMap((row) => row.per_profile ? row.profiles.filter((profile) => profile.kept).map((profile) => ({...profile, label: profile.title, type: row.key, key: `${row.key}:${profile.profile}`})) : [{...row, type: row.key}]));
const full = (count, limit) => limit > 0 && count >= limit;
const badge = computed(() => entries.value.filter((row) => full(row.running, row.run_limit) || full(row.kept, row.kept_limit)).length);
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
const title = computed(() => editing.value ? "Change the maximums" : chosen.value?.label || "Agent counts");
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
function back() { editing.value = false; selected.value = null; retiring.value = null; failure.value = ""; }
function close() { open.value = false; back(); }
async function change(row, key, previous, value) {
    if (pending.value || view.readOnly) return;
    const number = Number(value);
    if (!String(value).trim() || !Number.isInteger(number) || number < 0) { failure.value = "Use a whole number of 0 or more."; return; }
    pending.value = true;
    failure.value = "";
    const answer = await view.run(["setting", "set", key, String(number), "--environment", view.environment]);
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
    <button class="counts-button" type="button" title="Agent counts" aria-label="Agent counts" data-agent-counts @click="open = true"><Icon name="settings" :size="16" /><span v-if="badge" class="badge" data-agent-count-badge>{{ badge }}</span></button>
    <Dialog v-if="open" :title="title" modal fits @close="close" @escape="close">
        <div class="counts">
            <button v-if="editing || chosen" class="back" type="button" @click="back">‹ Back to the counts</button>
            <template v-if="readFailure"><strong>The counts could not be read</strong><p>The journal did not answer.</p><Btn small @click="view.reload('limits')">Try again</Btn></template>
            <template v-else-if="editing">
                <p>How many agents of a type may run at once, and how many may be kept.</p>
                <div v-for="row in rows" :key="row.key" class="edit-row" :data-edit-type="row.key">
                    <div><strong>{{ row.per_profile ? 'Each helper type' : 'Workers' }}</strong><small v-if="row.per_profile">Researcher, Planner and the others</small></div>
                    <label v-for="field in [{name: 'Most running', value: row.run_limit, key: row.run_setting, source: row.run_source, kind: 'run'}, {name: 'Most kept', value: row.kept_limit, key: row.kept_setting, source: row.kept_source, kind: 'kept'}]" :key="field.key">
                        {{ field.name }}<span class="stepper"><button type="button" :disabled="pending || view.readOnly || field.value === 0" @click="change(row, field.key, field.value, field.value - 1)">−</button><input type="number" min="0" :value="field.value" :disabled="pending || view.readOnly" :data-agent-limit-input="field.kind" @change="change(row, field.key, field.value, $event.target.value)" /><button type="button" :disabled="pending || view.readOnly" @click="change(row, field.key, field.value, field.value + 1)">+</button></span>
                        <small v-if="field.value === 0">{{ field.kind === 'run' ? 'None can start' : 'Any number' }}</small><small v-else-if="field.source === `environment ${view.environment}`">Changed for {{ view.environment }}</small>
                    </label>
                </div>
            </template>
            <template v-else-if="chosen">
                <p><strong>{{ chosen.running }} of {{ chosen.run_limit }}</strong> running, <strong>{{ chosen.kept }}<template v-if="chosen.kept_limit"> of {{ chosen.kept_limit }}</template></strong> kept</p><p>{{ models }}</p>
                <template v-if="!chosenAgents.length"><strong>No agents here yet</strong><p>An agent shows here as soon as one of this type starts.</p></template>
                <div v-for="agent in chosenAgents" :key="agent.id" class="person" :data-count-agent="agent.id">
                    <span :class="['dot', {running: agent.state === 'running'}]" /><div class="person-text"><strong>{{ agent.facts?.given_name || agent.id }}</strong> {{ agent.state === 'running' ? 'Running' : 'Idle' }}, {{ age(agent.state === 'running' ? agent.process_started_at || agent.created_at : agent.ended_at, now) }}<small>{{ [agent.program, agent.facts?.model, agent.facts?.effort, `${agent.role} ${agent.id}`].filter(Boolean).join(', ') }}</small><small>{{ agent.facts?.task_title || agent.facts?.helper_job }}</small></div>
                    <Btn small @click="openAgent(agent)">Open</Btn><Btn v-if="agent.state === 'idle' && !view.readOnly" small @click="retiring = agent.id; reason = ''">Retire</Btn>
                    <AgentRetireForm v-if="retiring === agent.id" v-model:reason="reason" :pending="pending" @submit="retire(agent)" @cancel="retiring = null" />
                </div>
                <Btn v-if="moreAgents" small @click="readAgents(chosen, agentPage + 1)">Show more</Btn>
            </template>
            <template v-else>
                <p>Kept agents have not been retired, so they can take another job. Open a row to see them.</p>
                <div class="columns"><span>Name</span><span>Running</span><span>Kept</span><span /></div>
                <div v-if="helper" class="helper-head"><strong>Helpers</strong><span>{{ helper.running }} running, {{ helper.kept }} kept</span></div>
                <button v-for="row in entries" :key="row.key" type="button" class="count-row" :data-agent-limit-type="row.type || row.key" :data-agent-limit-profile="row.profile" @click="select(row)">
                    <strong>{{ row.label }}</strong><span v-for="cell in [{count: row.running, limit: row.run_limit, unlimited: false}, {count: row.kept, limit: row.kept_limit, unlimited: true}]" :key="cell.unlimited" :class="{full: full(cell.count, cell.limit)}"><span>{{ cell.count }}<template v-if="cell.limit || !cell.unlimited"> of {{ cell.limit }}</template></span><span v-if="cell.limit" class="bar"><span :style="{width: width(cell.count, cell.limit)}" /><i :style="{width: overflow(cell.count, cell.limit)}" /></span></span><Icon name="chevronRight" :size="12" />
                </button>
            </template>
            <p v-if="failure" role="alert">{{ failure }}</p><p v-else-if="notice" role="status">{{ notice }}</p>
        </div>
        <template #foot><template v-if="editing"><span class="foot-note">{{ notice || `Changes apply to ${view.environment}.` }}</span><Btn @click="back">Done</Btn></template><template v-else-if="!chosen"><Btn :disabled="view.readOnly" data-agent-limits-edit @click="editing = true">Change the maximums</Btn></template></template>
    </Dialog>
</template>

<style scoped>
.counts-button { position: relative; width: 30px; height: 30px; border: 0; background: none; color: var(--text-2); cursor: pointer; }
.badge { position: absolute; right: -2px; top: -3px; min-width: 14px; border-radius: 8px; background: var(--accent); color: var(--raised); font-size: 10px; }
.counts { width: min(570px, 100%); font-size: 12px; }
p { color: var(--text-3); margin: 0 0 12px; }
.back { border: 0; background: none; color: var(--accent-text); cursor: pointer; margin-bottom: 12px; }
.columns, .count-row { display: grid; grid-template-columns: minmax(100px, 1fr) minmax(90px, 1fr) minmax(90px, 1fr) 12px; gap: 12px; align-items: center; }
.columns, .helper-head { color: var(--text-3); padding: 8px 0; }
.helper-head { display: flex; justify-content: space-between; }
.count-row { width: 100%; padding: 9px 0; background: none; border: 0; border-top: 1px solid var(--border); color: var(--text); text-align: left; cursor: pointer; }
.count-row:hover { background: var(--hover); }
.full { font-weight: 600; }
.bar { display: block; position: relative; height: 4px; background: var(--border); margin-top: 5px; }
.bar span { display: block; height: 100%; background: var(--text-3); }
.full .bar span { background: var(--tone-warn); }
.bar i { position: absolute; right: 0; top: 0; height: 100%; background: var(--danger); }
.edit-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
small { display: block; color: var(--text-3); margin-top: 4px; }
.stepper { display: flex; height: 32px; margin-top: 4px; }
.stepper button, .stepper input { width: 32px; border: 1px solid var(--border); background: var(--raised); color: var(--text); text-align: center; }
.stepper input { width: 48px; }
.person { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.person-text { flex: 1; min-width: 0; }.person-text small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--text-3); }.dot.running { background: var(--accent); }
[role="alert"] { color: var(--danger); }.foot-note { flex: 1; color: var(--text-3); }
@media (max-width: 600px) { .bar { display: none; }.stepper { height: 44px; }.edit-row { grid-template-columns: 1fr 1fr; }.edit-row > div { grid-column: span 2; } }
</style>
