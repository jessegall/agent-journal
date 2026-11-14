<script setup>
import TimeAgo from "../../../kit/TimeAgo.vue";
import ProcessQueueBand from "../ProcessQueueBand.vue";

// the states the agent is in as the journal read them when the inspector opened, one line each: its name, the tier as a small label and since when; nothing is drawn when no state is open
defineProps({states: {type: Array, required: true}});
</script>

<template>
    <template v-if="states.length">
        <ProcessQueueBand icon="clock">States</ProcessQueueBand>
        <template v-for="state in states" :key="state.name">
            <div class="state" data-agent-open-state :title="`${state.name} (${state.tier}): ${state.rows.join(', ')}`">
                <span class="name">{{ state.name }}</span><span class="tier">{{ state.tier }}</span><TimeAgo class="since" :at="state.since" />
            </div>
        </template>
    </template>
</template>

<style scoped>
.state { display: flex; align-items: center; gap: 9px; padding: 8px 14px; border-bottom: 1px solid var(--border-inner); color: var(--text-2); font-size: 12.5px; }
.name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tier { flex: none; color: var(--text-3); font-size: 11px; }
.since { flex: none; color: var(--text-3); font-size: 12px; font-variant-numeric: tabular-nums; }
</style>
