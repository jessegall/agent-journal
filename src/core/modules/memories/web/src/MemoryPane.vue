<script setup>
import {computed, ref, watch} from "vue";
import {Btn, MenuItem, MenuLabel, SearchBar, Skeleton, TextArea, TimeAgo, peekRef, useWindow, wordLabel} from "@journal/window-kit";
import MemoryEmpty from "./MemoryEmpty.vue";
import MemoryGroup from "./MemoryGroup.vue";
import MemoryRow from "./MemoryRow.vue";
import {EVERYONE, MAIN, OTHERS, PAGE_ROWS, agentOf, agentIdOf, isAgent, isGroup} from "./memoryScope.js";
import {usePagedRead} from "./usePagedRead.js";

// the memories of whoever is chosen: searched and ordered by the server, active or removed, with a new one written for the main agent
const props = defineProps({
    who: {type: String, required: true},
    environment: {type: String, required: true},
    agent: {type: Object, default: null},
    counts: {type: Object, required: true},
});
const emit = defineEmits(["pick"]);

const ORDERS = [{key: "newest", label: "Newest"}, {key: "weight", label: "Highest weight"}];
const STATES = [{key: "active", label: "Active"}, {key: "removed", label: "Removed"}, {key: "all", label: "All"}];

const context = useWindow();
const search = ref("");
const order = ref("newest");
const state = ref("active");
const making = ref(false);
const text = ref("");
const refusal = ref("");
const notice = ref("");
const names = ref({});

const memories = usePagedRead("memories", (limit) => ({
    ...(props.who === MAIN ? {"main-agent": true} : {}), ...(props.who === OTHERS ? {"other-agents": true} : {}),
    ...(isAgent(props.who) ? {agent: agentIdOf(props.who)} : {}), environment: props.environment,
    ...(state.value !== "active" ? {removed: true} : {}), ...(state.value !== "all" ? {state: state.value} : {}),
    ...(search.value.trim() ? {search: search.value.trim()} : {}), order: order.value, limit,
}), PAGE_ROWS, ["memory.*"]);
watch(() => [props.who, props.environment, state.value, search.value, order.value], () => memories.reset());
watch(() => props.who, (who) => {
    if (who !== EVERYONE) search.value = "";
    notice.value = "";
});

watch(memories.rows, () => {
    const agents = context.props.memories.data.value.agents;
    names.value = Object.fromEntries(agents.map((agent) => [agent.agent_id, agent]));
});

const ownerOf = (row) => (row.agent_id === null ? MAIN : agentOf(row.agent_id));
const groups = computed(() => {
    const owners = new Map();
    memories.rows.value.forEach((row) => owners.set(ownerOf(row), [...(owners.get(ownerOf(row)) ?? []), row]));
    const named = [...owners].map(([who, rows]) => ({who, rows, ...describedOwner(who)}));
    return named.sort((one, two) => Number(two.who === MAIN) - Number(one.who === MAIN));
});

function describedOwner(who) {
    if (who === MAIN) return {name: "Main agent", facts: "The main agent"};
    const agent = names.value[agentIdOf(who)];
    if (!agent) return {name: "Agent", facts: ""};
    return {name: agent.name, facts: `${wordLabel(agent.role)}, ${agent.ended_at ? "ended" : "working now"}`};
}

const CHOICE_TITLES = {[MAIN]: "Main agent", [OTHERS]: "Other agents", [EVERYONE]: "Every agent"};
const title = computed(() => (isAgent(props.who) ? props.agent?.name ?? "" : CHOICE_TITLES[props.who]));
const total = computed(() => props.counts[props.who]);
const memoriesWord = (count) => `${count} active ${count === 1 ? "memory" : "memories"}`;
const line = computed(() => {
    if (isAgent(props.who)) return props.agent?.ended_at ? "" : "Working now";
    if (props.who === MAIN) return `What this environment's main agent gets back at every start and when a keyword comes up. ${memoriesWord(total.value)}.`;
    return `${memoriesWord(total.value)}, listed under the agent they belong to.`;
});

const emptyKind = computed(() => {
    if (memories.failure.value) return "failure";
    if (search.value.trim()) return "search";
    if (state.value === "removed") return "removed";
    if (props.who !== MAIN) return "agent";
    return props.counts.others ? "main-others" : "main";
});

async function make() {
    const answer = await context.run(["memory", "make", text.value.trim(), "--environment", props.environment]);
    refusal.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    text.value = "";
    making.value = false;
    notice.value = "Saved for the main agent.";
    emit("pick", MAIN);
    memories.reset();
}
</script>

<template>
    <div class="pane" data-memory-pane>
        <div class="head">
            <div>
                <h2 class="title" data-pane-title>
                    {{ title }}
                    <template v-if="agent"><span class="pill">{{ wordLabel(agent.role) }}</span></template>
                </h2>
                <p class="line">{{ line }}</p>
            </div>
            <template v-if="agent">
                <Btn small bordered data-open-agent @click="peekRef(`agents:${agent.id}`)">Open this agent</Btn>
            </template>
        </div>
        <template v-if="agent?.ended_at">
            <p class="ended-note" role="note" data-ended-note>This agent ended <TimeAgo :at="agent.ended_at" />, so its memories reach no agent while it is ended.</p>
        </template>
        <SearchBar v-model="search" placeholder="Search these memories">
            <template #menu>
                <MenuLabel>Order</MenuLabel>
                <template v-for="choice in ORDERS" :key="choice.key">
                    <MenuItem :checked="order === choice.key" :data-memory-order="choice.key" @click="order = choice.key">{{ choice.label }}</MenuItem>
                </template>
                <MenuLabel>Show</MenuLabel>
                <template v-for="choice in STATES" :key="choice.key">
                    <MenuItem :checked="state === choice.key" :data-memory-state="choice.key" @click="state = choice.key">{{ choice.label }}</MenuItem>
                </template>
            </template>
            <Btn small bordered data-memory-new @click="making = !making">New memory</Btn>
        </SearchBar>
        <template v-if="making">
            <form class="make" data-memory-form @submit.prevent="make">
                <TextArea class="make-text" rows="2" :value="text" placeholder="What should be remembered?" aria-label="What should be remembered?" @input="text = $event.target.value" />
                <div class="make-foot">
                    <span>A new memory goes to the main agent.</span>
                    <Btn small bordered @click="making = false">Cancel</Btn>
                    <Btn small variant="primary" type="submit" :disabled="!text.trim()">Save memory</Btn>
                </div>
            </form>
        </template>
        <template v-if="refusal">
            <p class="refusal" role="alert" data-memory-refusal>{{ refusal }}</p>
        </template>
        <template v-if="notice">
            <p class="notice" role="status" data-memory-notice>{{ notice }}</p>
        </template>
        <div class="list" data-memory-list>
            <template v-if="!memories.loaded.value">
                <Skeleton />
            </template>
            <template v-else-if="!memories.rows.value.length">
                <MemoryEmpty :kind="emptyKind" :others="counts.others" :reason="memories.failure.value"@retry="memories.reset()" @everyone="emit('pick', EVERYONE)" @others="emit('pick', OTHERS)" @make="making = true" />
            </template>
            <template v-else>
                <template v-if="isGroup(who)">
                    <template v-for="group in groups" :key="group.who">
                        <MemoryGroup :name="group.name" :facts="group.facts" @pick="emit('pick', group.who)">
                            <template v-for="row in group.rows" :key="row.id">
                                <MemoryRow :row="row" />
                            </template>
                        </MemoryGroup>
                    </template>
                </template>
                <template v-else>
                    <template v-for="row in memories.rows.value" :key="row.id">
                        <MemoryRow :row="row" />
                    </template>
                </template>
                <template v-if="memories.hasMore.value">
                    <div class="more"><Btn small bordered data-memories-more @click="memories.more()">Load older</Btn></div>
                </template>
            </template>
        </div>
    </div>
</template>

<style scoped>
.pane {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}

.head {
    display: flex;
    flex: none;
    flex-wrap: wrap;
    gap: 6px 14px;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px 10px;
}

.title {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 8px;
    align-items: center;
    margin: 0;
    font-size: 15px;
    font-weight: 600;
}

.pill {
    padding: 1px 7px;
    border-radius: 4px;
    background: var(--chip);
    color: var(--text-2);
    font-size: 11.5px;
    font-weight: 400;
}

.line {
    margin: 1px 0 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.ended-note {
    margin: 0 20px 10px;
    padding: 7px 11px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    color: var(--text-2);
    font-size: 12.5px;
}

.make {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    padding: 10px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-2);
}

.make-text {
    min-height: 0;
}

.make-foot {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    width: 100%;
}

.make-foot span {
    flex: 1 1 180px;
    color: var(--text-3);
    font-size: 12px;
}

.refusal {
    margin: 8px 20px 0;
    color: var(--danger);
    font-size: 12.5px;
}

.notice {
    margin: 8px 20px 0;
    padding: 7px 11px;
    border-radius: 7px;
    background: var(--accent-dim);
    font-size: 12.5px;
}

.list {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 0 20px 24px;
}

.more {
    display: flex;
    justify-content: center;
    padding: 14px 0 0;
}

@media (max-width: 720px) {
    .head,
    .list {
        padding-right: 0;
        padding-left: 0;
    }

    .ended-note,
    .refusal,
    .notice {
        margin-right: 0;
        margin-left: 0;
    }
}
</style>
