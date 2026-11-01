<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {providerName} from "../domain/agents.js";

// the one line under the agent bar, as version 4's agent facts drew it: who the agent is, its state, the plan's allowance used, how full its
// context is, its model and cost, how long it has run and each count; each fact asks to open what it tells of
const props = defineProps({
    agent: {type: Object, default: null},
    facts: {type: Object, default: () => ({helpers: 0, tasks: 0, waiting: 0})},
    usage: {type: Object, default: () => ({agents: [], windows: []})},
    now: {type: Number, default: () => Date.now()},
});
const emit = defineEmits(["open"]);
const COUNTS = [
    {key: "helpers", title: "Subagents and workers running", icon: "agents"},
    {key: "tasks", title: "Open tasks", icon: "task"},
    {key: "waiting", title: "Questions waiting", icon: "question"},
];
const running = computed(() => Boolean(props.agent) && !props.agent.ended_at);
const status = computed(() => props.usage.agents?.find((row) => row.id === props.agent?.id) ?? null);
const allowance = computed(() => props.usage.windows?.[0] ?? null);
const used = computed(() => (allowance.value ? Math.max(0, Math.min(100, Math.round(allowance.value.used_percent))) : null));
const context = computed(() => (status.value?.context_percent == null ? null : Math.round(status.value.context_percent)));
const cost = computed(() => (status.value?.cost_dollars ? `$${status.value.cost_dollars.toFixed(2)}` : ""));
const uptime = computed(() => {
    const started = props.agent?.process_started_at ? new Date(props.agent.process_started_at).getTime() : 0;
    if (!started) return "";
    const minutes = Math.max(0, Math.floor((props.now - started) / 60000));
    return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
});
</script>

<template>
    <div class="information" data-information-bar>
        <template v-if="agent">
            <button type="button" class="fact lead" data-fact="agent" :title="`Session ${agent.session}`" @click="emit('open', 'agents')"><Icon name="agents" :size="12" /> {{ providerName(agent.program) }}</button>
            <span class="fact" data-fact="state"><Icon name="activity" :size="12" /> {{ running ? "Working" : "Ended" }}</span>
            <template v-if="used !== null">
                <button type="button" class="fact" data-fact="usage" :title="`${used}% of the plan's ${allowance.title} allowance used`" @click="emit('open', 'usage')">
                    <span class="gauge usage"><span :style="{width: `${used}%`}" /></span> {{ used }}%
                </button>
            </template>
            <template v-if="context !== null">
                <button type="button" class="fact" data-fact="context" :title="`Context ${context}% full`" @click="emit('open', 'context')">
                    <Icon name="gauge" :size="12" /> <span class="gauge"><span :style="{width: `${context}%`}" /></span> {{ context }}%
                </button>
            </template>
            <template v-if="status?.model">
                <span class="fact" data-fact="model"><Icon name="model" :size="12" /> {{ status.model }}</span>
            </template>
            <template v-if="cost">
                <button type="button" class="fact" data-fact="cost" title="What this session has cost" @click="emit('open', 'usage')">{{ cost }}</button>
            </template>
            <template v-if="uptime">
                <span class="fact" data-fact="uptime" title="How long this session has run"><Icon name="reminders" :size="12" /> {{ uptime }}</span>
            </template>
            <template v-for="count in COUNTS" :key="count.key">
                <button type="button" :class="['fact', {none: !facts[count.key]}]" :data-count="count.key" :title="count.title" @click="emit('open', count.key)"><Icon :name="count.icon" :size="12" /> {{ facts[count.key] }}</button>
            </template>
                    </template>
        <span class="space" />
        <slot />
    </div>
</template>

<style scoped>
.information {
    display: flex;
    gap: 16px;
    align-items: center;
    min-height: 30px;
    padding: 0 16px;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
    font-size: 12px;
}

.fact {
    display: inline-flex;
    flex: none;
    gap: 5px;
    align-items: center;
    padding: 0 4px;
    margin: 0 -4px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: inherit;
    font: inherit;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

button.fact {
    cursor: pointer;
}

button.fact:hover {
    background: var(--hover);
    color: var(--text);
}

.fact.none {
    color: var(--text-3);
}

.fact.lead {
    color: var(--text);
}

.gauge {
    display: inline-block;
    width: 20px;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--line, var(--border));
}

.gauge > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--text-3);
}

.gauge.usage > span {
    background: var(--accent-text);
}

.space {
    flex: 1;
}
</style>
