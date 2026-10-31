<script setup>
import {computed, ref, watch} from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import ChatMark from "../kit/ChatMark.vue";
import OutputLines from "../kit/OutputLines.vue";
import RunStop from "./RunStop.vue";
import FlowchartMark from "./FlowchartMark.vue";
import SubagentMark from "./SubagentMark.vue";
import WhisperMark from "./WhisperMark.vue";
import MadeCard from "./MadeCard.vue";
import MemoryRound from "./MemoryRound.vue";
import SuggestionCard from "./SuggestionCard.vue";
import TurnGroup from "./TurnGroup.vue";
import TurnMessage from "./TurnMessage.vue";
import TurnThought from "./TurnThought.vue";
import {useTurnLinks} from "./turnLinks.js";
import {go} from "../route.js";
import {store} from "../state/store.js";
import {useScope} from "../composables/scope.js";
import {useOutputPages} from "../composables/outputPages.js";
import {useRunStop} from "../composables/runStop.js";
import {actionLabel, refAction} from "../domain/markAction.js";

const props = defineProps({turn: Object});
const emit = defineEmits(["reply", "edit", "grew"]);
const {openRef} = useTurnLinks();
const scope = useScope();
const dock = () => scope.api.act("messages", props.turn.id, "dock");
const data = computed(() => props.turn.data);
const skillMark = computed(() => ({
    icon: "book",
    tone: "",
    group: "agent",
    markIcon: "skill",
    label: "Loaded skill",
    name: props.turn.title,
    time: props.turn.time,
    title: `Read the ${props.turn.title} skill`,
    action: actionLabel("skills"),
}));
const compactedMark = computed(() => ({
    icon: "activity",
    markIcon: "compact",
    group: "agent",
    label: "Conversation compacted",
    time: props.turn.time,
}));
const opened = ref(false);
// what a card's one-click action opens: the page it goes to, the row it names, or the whole output of its command
const target = computed(() => data.value.row || (data.value.output ? `outputs:${data.value.output}` : ""));
const action = computed(() => (data.value.go ? actionLabel("pages") : target.value ? refAction(target.value) : ""));
const {stoppable, what, phase, line, stop} = useRunStop(() => data.value);
// a run the user stops says Stopping for a moment, then is a quiet line saying they stopped it
const STOP_SHOWN = {
    stopping: () => ({stopping: true}),
    stopped: () => ({stopped: true, label: line.value, figure: "", docked: false}),
};
const cardMark = computed(() => ({
    ...data.value,
    key: props.turn.key,
    detail: data.value.collapsed ? "" : data.value.detail,
    time: props.turn.time,
    action: action.value,
    ...(STOP_SHOWN[phase.value]?.() || {}),
}));
const lines = computed(() => (data.value.lines || []).filter(Boolean));

const pages = useOutputPages((...page) => scope.api.readOutput(data.value.output, ...page));
// a memories mark of a compaction holds the round it faded; one written before rounds were kept says so when opened
const fading = computed(() => data.value.shows === "memories" && (Boolean(data.value.round) || String(data.value.label || "").startsWith("Memories faded")));
const reason = computed(() => data.value.reason || "");
const opens = computed(() => Boolean(reason.value) || (!data.value.go && !data.value.row && Boolean(data.value.output || data.value.summary || lines.value.length || fading.value)));

function toggle() {
    opened.value = !opened.value;
    if (opened.value && data.value.output) pages.poll().catch(() => {});
}

watch(
    () => data.value.lines,
    () => opened.value && data.value.output && pages.poll().catch(() => {})
);

function markClick(data) {
    const act = data.go ? () => go(data.go, 0, data.query || "") : () => openRef(target.value);
    return {...(opens.value ? {click: toggle} : {}), ...(action.value ? {act} : {})};
}
</script>

<template>
    <SwitchCase :value="turn.kind">
        <template #skill>
            <div class="thread-turn skill" :data-ref="turn.key">
                <ChatMark :mark="skillMark" @act="store.skill = turn.title" />
            </div>
        </template>
        <template #thought>
            <TurnThought :turn="turn" @reply="emit('reply', $event)" />
        </template>
        <template #day>
            <p class="thread-turn thread-day" :data-ref="turn.key">{{ turn.title }}</p>
        </template>
        <template #compacted>
            <div class="thread-turn compacted" :data-ref="turn.key">
                <ChatMark :mark="compactedMark" />
            </div>
        </template>
        <template #card>
            <div :class="['thread-turn', 'card', {mine: data.side === 'user', docked: data.docked}]" :data-ref="turn.key">
                <span class="mark-row">
                    <ChatMark :mark="cardMark" :open="opens ? opened : undefined" v-on="markClick(data)">
                        <template v-if="opens" #default="{shown}">
                            <div :class="['mark-more', {open: shown}]" @click.stop>
                                <div class="mark-more-inner">
                                    <template v-if="data.line">
                                        <p class="mark-label">Command</p>
                                        <p class="mark-command">{{ data.line }}</p>
                                    </template>
                                    <template v-if="data.summary">
                                        <p class="mark-label">Summary</p>
                                        <p class="mark-summary">{{ data.summary }}</p>
                                    </template>
                                    <template v-if="reason">
                                        <p class="mark-label">Why it stopped</p>
                                        <p class="mark-summary">{{ reason }}</p>
                                    </template>
                                    <template v-if="data.output && pages.loaded.value">
                                        <p class="mark-label">Output</p>
                                        <OutputLines class="mark-terminal" :lines="pages.lines.value" @older="pages.older" />
                                    </template>
                                    <template v-if="data.proof_task">
                                        <button type="button" class="mark-proofs" @click.stop="openRef(`tasks:${data.proof_task}`)">Open task {{ data.proof_task }} and its proofs</button>
                                    </template>
                                    <template v-if="fading && opened">
                                        <MemoryRound :round="data.round" />
                                    </template>
                                    <template v-if="!data.output && !reason && opened">
                                        <ul class="mark-lines">
                                            <template v-for="line in lines" :key="line">
                                                <li class="mark-line">{{ line }}</li>
                                            </template>
                                        </ul>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </ChatMark>
                    <template v-if="stoppable">
                        <RunStop :what="what" @stop="stop" />
                    </template>
                    <template v-if="data.output && !data.docked && !data.ending">
                        <button type="button" class="mark-dock" title="Dock the live view above the chat" @click="dock">Dock</button>
                    </template>
                </span>
            </div>
        </template>
        <template #group>
            <TurnGroup :turn="turn" @reply="emit('reply', $event)" />
        </template>
        <template #whisper>
            <div class="thread-turn whisper" :data-ref="turn.key">
                <WhisperMark v-bind="data" :title="turn.title" :time="turn.time" />
            </div>
        </template>
        <template #flowchart>
            <div class="thread-turn flowchart" :data-ref="turn.key">
                <FlowchartMark :title="turn.title" :edges="turn.edges" :time="turn.time" />
            </div>
        </template>
        <template #subagent>
            <div class="thread-turn subagent" :data-ref="turn.key">
                <SubagentMark v-bind="data" :task="turn.title" :time="turn.time" />
            </div>
        </template>
        <template #made>
            <div class="thread-turn made" :data-ref="turn.key">
                <MadeCard :made="turn.made" />
            </div>
        </template>
        <template #suggestion>
            <div class="thread-turn suggestion" :data-ref="turn.key">
                <SuggestionCard :suggestion="turn.suggestion" />
            </div>
        </template>
        <template #default>
            <TurnMessage :turn="turn" @reply="emit('reply', $event)" @grew="emit('grew')" />
        </template>
    </SwitchCase>
</template>

<style scoped>
.thread-turn {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: flex-start;
    --turn-gutter: 48px;

    gap: 3px;
    max-width: min(78%, calc(100% - var(--turn-gutter)));
}

.thread-turn.suggestion {
    width: min(560px, calc(100% - var(--turn-gutter)));
}

.thread-day {
    align-self: center;
    margin: 0;
    padding: 4px 0;
    color: var(--text-4);
    font-size: 10.5px;
}

/* the compaction is a line across the whole chat, since what is above it was summed up */
.thread-turn.compacted {
    flex-direction: row;
    align-items: center;
    align-self: stretch;
    gap: 10px;
    max-width: none;
    margin: 4px 0;
}

.thread-turn.compacted > .mark {
    flex: none;
}

.thread-turn.compacted::before,
.thread-turn.compacted::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--border-2);
}

.mark-lines {
    grid-column: 1 / -1;
    margin: 0;
    padding: 2px 0 0 20px;
    text-align: left;
    color: var(--text-2);
    font-size: 12px;
    line-height: 1.45;
    list-style: none;
    overflow-wrap: anywhere;
}

.mark-more {
    grid-column: 1 / -1;
    contain: inline-size;
}

.mark-more:not(.open) {
    display: none;
}

.mark-proofs {
    align-self: flex-start;
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.mark-command {
    margin: 0 0 0 20px;
    color: var(--text-2);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11px;
    overflow-wrap: anywhere;
}

.mark-summary {
    margin: 0 0 0 20px;
    color: var(--text-2);
    font-size: 12px;
}

/* each part of an opened mark has its label above it */
.mark-label {
    margin: 8px 0 2px 20px;
    color: var(--text-4);
    font-size: 10.5px;
}

.mark-terminal {
    max-height: 150px;
    margin: 0 0 2px 20px;
    padding: 8px 10px;
    overflow: auto;
    border-radius: 6px;
    background: var(--term);
    color: #d6d6d6;
    font:
        11px/1.55 ui-monospace,
        "SF Mono",
        Menlo,
        monospace;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.mark-row {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: 100%;
}

.mark-dock {
    padding: 1px 7px;
    border: 1px solid var(--border-2);
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s ease;
}

/* on a phone the stop sits closer to its mark */
:global(html.phone .mark-row) {
    gap: 4px;
}

.mark-row:hover .run-stop,
.mark-row:focus-within .run-stop {
    opacity: 1;
}

.thread-turn.card:hover .mark-dock,
.mark-dock:focus-visible {
    opacity: 1;
}

.mark-dock:hover {
    color: var(--text-2);
    border-color: var(--border);
}

.thread-turn.card.mine {
    display: flex;
    justify-content: flex-end;
}

.thread-turn.mine,
.thread-turn.incoming {
    align-self: flex-end;
    align-items: flex-end;
}

/* an opened mark may take the chat's whole width, past the share a folded line keeps */
.thread-turn.card:has(.mark[data-open]) {
    max-width: calc(100% - var(--turn-gutter));
}

.thread-turn.card.docked {
    opacity: 0.55;
}
</style>
