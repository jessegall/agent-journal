<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import EmptyState from "../kit/EmptyState.vue";
import AgentDrawer from "./AgentDrawer.vue";
import AgentWindow from "./AgentWindow.vue";
import TicketAgent from "./TicketAgent.vue";
import {gridColumns, orchestraOf} from "../domain/orchestra.js";
import {usePoll} from "../poll.js";
import {onlyWorking} from "../composables/agentsShown.js";
import {agentState} from "../domain/ticketAgents.js";

const EVERY = 4000;
const summary = ref(null);
usePoll(
    "orchestra",
    () => api.summary(),
    EVERY,
    (got) => got && (summary.value = got)
);
const RESTING = ["idle", "stopped"];
const every = computed(() => orchestraOf(summary.value && summary.value.environments, Date.now() / 1000));
const entries = computed(() =>
    onlyWorking.value ? every.value.filter((entry) => !RESTING.includes(agentState(entry.card).key)) : every.value
);
const hidden = computed(() => every.value.length - entries.value.length);
const columns = computed(() => gridColumns(entries.value.length));
const openedKey = ref("");
const opened = computed(() => entries.value.find((e) => e.key === openedKey.value) || null);
const terminal = ref(null);
</script>

<template>
    <div class="agent-grid-view">
        <template v-if="summary && !entries.length && hidden">
            <EmptyState title="No agent is working right now">
                {{ hidden }} idle or stopped {{ hidden === 1 ? "agent is" : "agents are" }} hidden. Show them again from this pane's menu.
            </EmptyState>
        </template>
        <template v-else-if="summary && !entries.length">
            <EmptyState title="No agent is working on a board">
                When a ticket or a plan starts its own agent, it shows here with what it is doing.
            </EmptyState>
        </template>
        <div class="agent-grid" :style="{'--columns': columns}">
            <template v-for="entry in entries" :key="entry.key">
                <AgentWindow :entry="entry" @open="openedKey = entry.key" />
            </template>
        </div>
        <template v-if="opened">
            <TicketAgent
                :card="opened.card"
                :env="opened.env"
                :kind="opened.kind || 'ticket'"
                :label="opened.label"
                :plan="opened.plan ? opened.plan.n : 0"
                @close="openedKey = ''"
                @terminal="terminal = opened.card"
            />
        </template>
        <template v-if="terminal">
            <AgentDrawer :card="terminal" @close="terminal = null" />
        </template>
    </div>
</template>

<style scoped>
.agent-grid-view {
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow-y: auto;
}

.agent-grid {
    display: grid;
    flex: 1;
    grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
    grid-auto-rows: minmax(150px, 1fr);
    border-top: 1px solid var(--border);
    border-left: 1px solid var(--border);
}

@container (max-width: 520px) {
    .agent-grid {
        grid-template-columns: minmax(0, 1fr);
        grid-auto-rows: minmax(140px, auto);
    }
}
</style>
