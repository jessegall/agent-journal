<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import Tile from "../kit/Tile.vue";
import AgentDrawer from "./AgentDrawer.vue";
import AgentWindow from "./AgentWindow.vue";
import TicketAgent from "./TicketAgent.vue";
import {hiddenBy, hiddenSummary, orchestraOf, ordered} from "../domain/orchestra.js";
import {usePoll} from "../poll.js";
import {polled} from "../sync/polled.js";
import {store} from "../state/store.js";
import {peekThere} from "../route.js";
import {agentView} from "../composables/agentsShown.js";

usePoll(...polled.summary);
const summary = computed(() => store.summary);
const every = computed(() => orchestraOf(summary.value && summary.value.environments, Date.now() / 1000));
const entries = computed(() =>
    ordered(
        every.value.filter((entry) => !hiddenBy(entry, agentView)),
        agentView.order
    )
);
const LEAST = 9;
const ROW = 3;
const empties = computed(() => Math.max(LEAST, Math.ceil(entries.value.length / ROW) * ROW) - entries.value.length);
const hidden = computed(() => every.value.length - entries.value.length);
const why = computed(() => hiddenSummary(every.value, agentView).join(", "));
const openedKey = ref("");
const opened = computed(() => entries.value.find((e) => e.key === openedKey.value) || null);
const terminal = ref(null);
const openEntry = (entry) => (entry.sub ? peekThere(entry.env, "agent", entry.parent, 0, entry.session) : (openedKey.value = entry.key));
</script>

<template>
    <div class="agent-grid-view">
        <template v-if="summary && !entries.length">
            <p class="agent-grid-note">
                {{
                    hidden
                        ? `All ${hidden} ${hidden === 1 ? "agent is" : "agents are"} hidden by this pane's view: ${why}. Change it under View in this pane's menu.`
                        : "No agent is working on a board. When a ticket or a plan starts its own agent, it shows here."
                }}
            </p>
        </template>
        <div class="agent-grid">
            <template v-for="entry in entries" :key="entry.key">
                <AgentWindow :entry="entry" @open="openEntry(entry)" />
            </template>
            <template v-for="at in empties" :key="`empty-${at}`">
                <Tile compact class="agent-empty" aria-hidden="true">
                    <Icon name="agents" :size="22" />
                </Tile>
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
    flex: none;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-content: start;
    border-top: 1px solid var(--border);
    border-left: 1px solid var(--border);
}

.agent-grid > * {
    aspect-ratio: 1;
}

.agent-grid-note {
    flex: none;
    margin: 0;
    padding: 10px 14px;
    color: var(--text-3);
    font-size: 12.5px;
}

.agent-empty {
    pointer-events: none;
}

.agent-empty :deep(.tile-body) {
    align-items: center;
    justify-content: center;
    color: var(--text-4);
    opacity: 0.35;
}

@container (max-width: 560px) {
    .agent-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@container (max-width: 300px) {
    .agent-grid {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
