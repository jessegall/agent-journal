<script setup>
import {computed, ref, watch} from "vue";
import Icon from "../kit/Icon.vue";
import Tile from "../kit/Tile.vue";
import AgentWindow from "./AgentWindow.vue";
import {hiddenBy, hiddenSummary, orchestraOf, ordered, slotsFor} from "../domain/orchestra.js";
import {agent} from "../composables/leadAgent.js";
import {useWorkers} from "../composables/workers.js";
import {store} from "../state/store.js";
import {peek, route} from "../route.js";
import {ui} from "../state/ui.js";

const {rows: workers} = useWorkers();
const every = computed(() => orchestraOf(store.summary, workers.value, agent.value, route.value.env));
const slots = ref([]);
watch(every, (now) => (slots.value = slotsFor(slots.value, now)), {immediate: true});
const entries = computed(() =>
    ordered(
        every.value.filter((entry) => !hiddenBy(entry, ui.agentView)),
        ui.agentView.order,
        slots.value
    )
);
const LEAST = 9;
const ROW = 3;
const empties = computed(() => Math.max(LEAST, Math.ceil(entries.value.length / ROW) * ROW) - entries.value.length);
const hidden = computed(() => every.value.length - entries.value.length);
const why = computed(() => hiddenSummary(every.value, ui.agentView).join(", "));
const openEntry = (entry) => peek(entry.opens.table, entry.opens.id, 0, entry.opens.session || "");
</script>

<template>
    <div class="agent-grid-view">
        <template v-if="store.summary && !entries.length">
            <p class="agent-grid-note">
                {{
                    hidden
                        ? `All ${hidden} ${hidden === 1 ? "agent is" : "agents are"} hidden by this pane's view: ${why}. Change it under View in this pane's menu.`
                        : "No agent is running. An environment's agent, a worker and a subagent each show here while they work."
                }}
            </p>
        </template>
        <TransitionGroup tag="div" name="cell" class="agent-grid">
            <template v-for="entry in entries" :key="entry.key">
                <AgentWindow :entry="entry" @open="openEntry(entry)" />
            </template>
            <template v-for="at in empties" :key="`empty-${at}`">
                <Tile compact class="agent-empty" aria-hidden="true">
                    <Icon name="agents" :size="22" />
                </Tile>
            </template>
        </TransitionGroup>
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

/* a cell whose place in the order changes slides there, so it is seen moving rather than gone */
.cell-move {
    transition: transform 320ms cubic-bezier(0.22, 0.7, 0.3, 1);
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
