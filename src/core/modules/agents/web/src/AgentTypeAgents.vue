<script setup>
import {computed, onMounted, ref} from "vue";
import {age, agentNumber, agentTitle, Btn, useNow, useWindow} from "@journal/window-kit";
import {SettingEmptyState} from "@journal/setting-components";
import AgentRetireForm from "./AgentRetireForm.vue";

// the agents of one type (and of one profile when given), the running ones first, each to open, and an idle one to
// retire with a reason; the agents are read a page at a time through the window key count-agents
const props = defineProps({role: {type: String, required: true}, profile: {type: String, default: ""}});
const emit = defineEmits(["open-agent", "retired"]);
const view = useWindow();
const now = useNow();
const agents = ref([]);
const page = ref(0);
const more = ref(false);
const pending = ref(false);
const failure = ref("");
const notice = ref("");
const retiring = ref(null);
const reason = ref("");

const listed = computed(() => agents.value
    .filter((agent) => agent.state !== "retired" && agent.role === props.role && (!props.profile || (agent.facts?.profile || agent.profile) === props.profile))
    .sort((a, b) => (a.state !== "running") - (b.state !== "running") || String(a.ended_at || a.created_at).localeCompare(String(b.ended_at || b.created_at))));
const models = computed(() => {
    const counts = new Map();
    for (const agent of listed.value) {
        const model = agent.facts?.model || agent.program_model;
        if (model) counts.set(model, (counts.get(model) || 0) + 1);
    }
    return [...counts].map(([model, count]) => `${count} ${model}`).join(", ");
});

async function read(at = 1) {
    view.state["count-agents.role"] = props.role;
    if (props.profile) view.state["count-agents.profile"] = props.profile;
    else delete view.state["count-agents.profile"];
    view.state["count-agents.page"] = String(at);
    await view.reload("count-agents");
    const result = view.props["count-agents"];
    agents.value = at === 1 ? [...result.rows.value] : [...agents.value, ...result.rows.value];
    page.value = at;
    more.value = result.more.value;
}

async function retire(agent) {
    if (!reason.value.trim() || pending.value) return;
    pending.value = true;
    const answer = await view.run(["agent", "retire", String(agent.number), "--reason", reason.value.trim()]);
    failure.value = answer.ok ? "" : "The agent could not be retired. Try again.";
    if (answer.ok) {
        retiring.value = null;
        reason.value = "";
        notice.value = "Agent retired permanently.";
        emit("retired");
        await read();
    }
    pending.value = false;
}

onMounted(() => read());
</script>

<template>
    <section class="type-agents" data-type-agents>
        <p class="models">{{ models }}</p>
        <template v-if="!listed.length">
            <SettingEmptyState title="No agents here yet" line="An agent shows here as soon as one of this type starts." />
        </template>
        <template v-for="agent in listed" :key="agent.id">
            <div class="person" :data-count-agent="agent.id">
                <span :class="['dot', {running: agent.state === 'running'}]" />
                <div class="person-text">
                    <strong>{{ agentTitle(agent).text }}</strong> {{ agent.state === 'running' ? 'Running' : 'Idle' }}, {{ age(agent.state === 'running' ? agent.process_started_at || agent.created_at : agent.ended_at, now) }}
                    <small>{{ [agent.program, agent.facts?.model, agent.facts?.effort, agentNumber(agent)].filter(Boolean).join(', ') }}</small>
                    <small>{{ agent.facts?.task_title || agent.facts?.helper_job }}</small>
                </div>
                <Btn small @click="emit('open-agent', agent)">Open</Btn>
                <template v-if="agent.state === 'idle' && !view.readOnly">
                    <Btn small @click="retiring = agent.id; reason = ''">Retire</Btn>
                </template>
                <template v-if="retiring === agent.id">
                    <AgentRetireForm v-model:reason="reason" :pending="pending" @submit="retire(agent)" @cancel="retiring = null" />
                </template>
            </div>
        </template>
        <template v-if="more">
            <Btn small @click="read(page + 1)">Show more</Btn>
        </template>
        <template v-if="failure">
            <p role="alert" class="bad">{{ failure }}</p>
        </template>
        <template v-else-if="notice">
            <p role="status">{{ notice }}</p>
        </template>
    </section>
</template>

<style scoped>
.type-agents { font-size: 12px; }
.models { margin: 0 0 12px; color: var(--text-3); }
p { color: var(--text-3); }
small { display: block; margin-top: 4px; color: var(--text-3); }
.person { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.person-text { flex: 1; min-width: 0; }
.person-text small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--text-3); }
.dot.running { background: var(--accent); }
.bad { color: var(--danger); }
</style>
