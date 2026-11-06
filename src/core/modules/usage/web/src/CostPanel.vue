<script setup>
import {computed} from "vue";
import {WindowRoom, useWindow} from "@journal/window-kit";
import {byAgent, byModel, byProfile, dollars} from "./costBreakdown.js";

// what the open sessions and their helpers would cost through an API, as a total, for this session and for each model, agent and profile that reported one
const window = useWindow();
const {data: usage, failure} = window.props.usage;
const agents = computed(() => usage.value?.agents ?? []);
const own = computed(() => agents.value.find((agent) => agent.id === window.agent) ?? null);
const total = computed(() => agents.value.reduce((sum, agent) => sum + (agent.cost_dollars || 0), 0));

</script>

<template>
    <WindowRoom padding="14px 16px">
        <p class="current">Predicted API price</p>
        <p class="note" data-cost-note>What these sessions would cost when using Claude Code or Codex through an API. It is not what a plan charges.</p>
        <template v-if="failure">
            <p class="none">{{ failure }}</p>
        </template>
        <template v-else-if="usage">
            <div class="line total" data-cost-total>
                <span>All open sessions</span>
                <strong>{{ dollars(total) }}</strong>
            </div>
            <template v-if="own">
                <div class="line" data-cost-session>
                    <span>This session</span>
                    <strong>{{ dollars(own.cost_dollars) }}</strong>
                </div>
            </template>
            <template v-if="total > 0">
                <p class="group">By model</p>
                <template v-for="row in byModel(agents)" :key="row.label">
                    <div class="line" data-cost-model>
                        <span>{{ row.label }}</span>
                        <strong>{{ dollars(row.cost) }}</strong>
                    </div>
                </template>
                <p class="group">By agent</p>
                <template v-for="row in byAgent(agents)" :key="row.label">
                    <div class="line" data-cost-agent>
                        <span>{{ row.label }}</span>
                        <strong>{{ dollars(row.cost) }}</strong>
                    </div>
                </template>
                <template v-if="byProfile(agents).length">
                    <p class="group">By profile</p>
                    <template v-for="row in byProfile(agents)" :key="row.label">
                        <div class="line" data-cost-profile>
                            <span>{{ row.label }}</span>
                            <strong>{{ dollars(row.cost) }}</strong>
                        </div>
                    </template>
                </template>
            </template>
            <template v-else>
                <p class="none">No session has reported a cost yet.</p>
            </template>
        </template>
    </WindowRoom>
</template>

<style scoped>
.current {
    margin: 0;
    padding: 2px 0 4px;
    color: var(--text);
    font-size: 12px;
}

.note {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 11px;
    line-height: 1.4;
}

.line {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 3px 0;
    color: var(--text-2);
    font-size: 11.5px;
}

.line strong {
    color: var(--text);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.total {
    border-bottom: 1px solid var(--border);
    padding-bottom: 6px;
}

.group {
    margin: 8px 0 2px;
    color: var(--text-3);
    font-size: 10.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
