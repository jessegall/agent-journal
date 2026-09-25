<script setup>
import {computed} from "vue";
import Meter from "../kit/Meter.vue";
import StateDot from "../kit/StateDot.vue";
import Tile from "../kit/Tile.vue";
import {agentState} from "../domain/ticketAgents.js";
import {planMeter} from "../sync/hub.js";
import {clock} from "../format/time.js";
import {useNow} from "../composables/now.js";
import {quietOf} from "../domain/orchestra.js";

const props = defineProps({entry: {type: Object, required: true}});
const emit = defineEmits(["open"]);
const state = computed(() => agentState(props.entry.card));
const asks = computed(() => state.value.key !== "working" && props.entry.card.reason);
const now = useNow();
const quiet = computed(() => (props.entry.at ? quietOf(props.entry.at, now.value) : null));
</script>

<template>
    <Tile opens :class="['agent-window', state.key]" :label="`Open the agent of ${entry.label} ${entry.title}`" @open="emit('open')">
        <template #head>
            <span class="aw-head">
                <span class="aw-label">{{ entry.label }}</span>
                <StateDot :state="state.dot" />
                <span class="aw-state">{{ state.word }}</span>
                <span class="aw-env">{{ entry.env }}</span>
            </span>
        </template>
        <p class="aw-title">{{ entry.title }}</p>
        <template v-if="quiet">
            <p :class="['aw-seen', quiet.tone, {waits: entry.waits && quiet.tone}]" :title="`Its last hook report or transcript write`">
                Last active {{ clock(entry.at) }} · {{ quiet.ago }}
            </p>
        </template>
        <template v-if="asks">
            <p class="aw-asks">{{ entry.card.reason }}</p>
        </template>
        <template v-else-if="entry.now">
            <p class="aw-now">{{ entry.now }}</p>
        </template>
        <template v-if="entry.plan" #foot>
            <Meter v-bind="planMeter(entry.plan)" />
        </template>
    </Tile>
</template>

<style scoped>
.agent-window {
    min-height: 0;
    overflow: hidden;
}

.aw-head {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
    font-size: 11.5px;
}

.aw-label,
.aw-state {
    flex: none;
    white-space: nowrap;
}

.aw-label {
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.aw-state {
    color: var(--text-2);
    font-weight: 500;
}

.agent-window.waiting .aw-state {
    color: var(--tone-warn);
}

.agent-window.stuck .aw-state {
    color: var(--danger);
}

.aw-env {
    min-width: 0;
    margin-left: auto;
    overflow: hidden;
    color: var(--text-4);
    font-family: var(--mono);
    font-size: 10.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.aw-title {
    display: -webkit-box;
    margin: 0 0 4px;
    overflow: hidden;
    color: var(--text);
    font-size: 13.5px;
    font-weight: 500;
    line-height: 1.35;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.aw-seen {
    align-self: flex-start;
    margin: 0 0 4px;
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}

.aw-seen.amber {
    color: var(--tone-warn);
}

.aw-seen.red {
    color: var(--danger);
}

.aw-seen.waits {
    padding: 1px 7px;
    border-radius: 99px;
    font-weight: 600;
}

.aw-seen.waits.amber {
    background: color-mix(in srgb, var(--tone-warn) 18%, transparent);
}

.aw-seen.waits.red {
    background: color-mix(in srgb, var(--danger) 20%, transparent);
}

.aw-now,
.aw-asks {
    margin: 0;
    overflow: hidden;
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 11.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.aw-asks {
    color: var(--tone-warn);
    font-family: inherit;
}

.agent-window.stuck .aw-asks {
    color: var(--danger);
}
</style>
