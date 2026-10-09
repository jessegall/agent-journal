<script setup>
import {planMeter} from "../domain/journals.js";
import {computed} from "vue";
import Meter from "../kit/Meter.vue";
import StateDot from "../kit/StateDot.vue";
import Tile from "../kit/Tile.vue";
import JobTimer from "../kit/JobTimer.vue";
import {agentState} from "../domain/ticketAgents.js";
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
    <Tile
        opens
        compact
        :class="['agent-window', state.key, {sub: entry.sub}]"
        :label="`Open ${entry.name}, ${entry.title}`"
        @open="emit('open')"
    >
        <template #head>
            <span class="aw-head">
                <span class="aw-name">{{ entry.name }}</span>
                <span class="aw-pill">
                    <StateDot :state="state.dot" />
                    <span class="aw-state">{{ state.word }}</span>
                </span>
            </span>
        </template>
        <p class="aw-title">{{ entry.title }}</p>
        <template v-if="asks">
            <p class="aw-asks">{{ entry.card.reason }}</p>
        </template>
        <template v-else-if="entry.now">
            <p class="aw-now">{{ entry.now }}</p>
        </template>
        <template v-if="entry.plan">
            <Meter v-bind="planMeter(entry.plan)" />
        </template>
        <div class="aw-lines">
            <p class="aw-line">
                <span class="aw-key">Branch</span>
                <span class="aw-branch">{{ entry.env }}</span>
            </p>
            <template v-if="entry.model">
                <p class="aw-line">
                    <span class="aw-key">Model</span>
                    <span class="aw-kind">{{ entry.model }}</span>
                </p>
            </template>
            <template v-if="entry.label">
                <p class="aw-line">
                    <span class="aw-key">Kind</span>
                    <span class="aw-kind">
                        <span class="aw-label">{{ entry.label }}</span>
                        <template v-if="entry.of">{{ entry.of }}</template>
                    </span>
                </p>
            </template>
            <template v-if="entry.since">
                <p class="aw-line">
                    <span class="aw-key">Running for</span>
                    <JobTimer :since="entry.since" />
                </p>
            </template>
            <template v-else-if="quiet">
                <p class="aw-line" title="Last sign of life from the agent">
                    <span class="aw-key">Last active</span>
                    <span :class="['aw-seen', quiet.tone, {waits: entry.waits && quiet.tone}]">{{ clock(entry.at) }} · {{ quiet.ago }}</span>
                </p>
            </template>
        </div>
    </Tile>
</template>

<style scoped>
.agent-window {
    min-height: 0;
    overflow: hidden;
}

.agent-window.sub {
    border-right-style: dashed;
    border-bottom-style: dashed;
    background: var(--bg-2);
}

.agent-window.sub :deep(.tile-head) {
    box-shadow: inset 3px 0 0 var(--tone-commit);
}

.agent-window.sub .aw-label {
    color: var(--tone-commit);
    font-weight: 600;
}

.aw-head {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    width: 100%;
}

.aw-name {
    min-width: 0;
    overflow: hidden;
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.aw-pill {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    padding: 1px 9px;
    border: 1px solid var(--border-2);
    border-radius: 999px;
    font-size: 11.5px;
}

.aw-state {
    color: var(--text-2);
    font-weight: 500;
    white-space: nowrap;
}

.agent-window.waiting .aw-pill {
    border-color: color-mix(in srgb, var(--tone-warn) 45%, var(--border-2));
}

.agent-window.waiting .aw-state {
    color: var(--tone-warn);
}

.agent-window.stuck .aw-state {
    color: var(--danger);
}

.aw-title {
    display: -webkit-box;
    margin: 0;
    overflow: hidden;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.35;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.aw-lines {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-top: auto;
}

.aw-line {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
    margin: 0;
    font-size: 11.5px;
}

.aw-key {
    flex: none;
    width: 44px;
    color: var(--text-4);
}

.aw-branch {
    min-width: 0;
    overflow: hidden;
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 10.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.aw-kind {
    min-width: 0;
    overflow: hidden;
    color: var(--text-3);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.aw-label {
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.aw-seen {
    align-self: flex-start;
    margin: 0;
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
