<script setup>
import {computed, onBeforeUnmount, ref, watch} from "vue";
import ChatDock from "../kit/ChatDock.vue";
import Btn from "../kit/Btn.vue";
import CloseButton from "../kit/CloseButton.vue";
import FoldSign from "../kit/FoldSign.vue";
import Icon from "../kit/Icon.vue";
import {store} from "../state/store.js";
import MarkIcon from "../kit/MarkIcon.vue";
import OutputLines from "../kit/OutputLines.vue";
import DockLeave from "./DockLeave.vue";
import RunStop from "./RunStop.vue";
import {useScope} from "../composables/scope.js";
import {holdDock, pinDock, releaseDock, undock, unpinDock} from "../actions/docking.js";
import {isLeaving} from "../domain/docks.js";
import {createdAt} from "../domain/row.js";
import {watchLines} from "../domain/watchStatus.js";
import {useOutputPages} from "../composables/outputPages.js";
import {useRunStop} from "../composables/runStop.js";
import {useWatchRun} from "../composables/watchRun.js";
import {agent} from "../composables/leadAgent.js";

const SHOWN_LINES = 6;

const props = defineProps({message: {type: Object, required: true}, folded: Boolean});
const scope = useScope();
const card = computed(() => props.message.data);
const {stoppable, what, phase, title: stoppedTitle, stop} = useRunStop(() => card.value);
const stopped = computed(() => phase.value === "stopped");
const {
    endedTone,
    state: runState,
    tone,
    icon,
    bar,
    width,
    ranFor,
} = useWatchRun(
    () => card.value,
    () => stopped.value
);
// the card's title: what runs, Stopping for a moment once the user stops it, and then that they stopped it
const heading = computed(() => (stopped.value ? stoppedTitle.value : props.message.text));
const printed = computed(() => watchLines((card.value.lines?.length ? card.value.lines : [card.value.detail]).filter(Boolean)));
const lines = computed(() => printed.value.steps.slice(-SHOWN_LINES));
// what is happening now is told while the run goes on, one line for the journal and one for each plugin
const statuses = computed(() => (card.value.ending || phase.value ? [] : printed.value.statuses));

const opened = ref(false);
const shown = ref(false);
// only a run of the main agent's own is the avatar's to watch: a worker's or a subagent's run is shown, never acted on
const leads = computed(() => !props.message.session || props.message.session === agent.value?.session);
const pages = useOutputPages((...page) => scope.api.readOutput(card.value.output, ...page));

const takeDown = () => undock(scope, props.message);
// a question about this run starts in the composer with the run quoted, and the message sent refers to the run's row for the agent to read
const askedRow = computed(() => (card.value.output ? `command_outputs:${card.value.output}` : `checks:${card.value.check}`));
const askAbout = () => (store.quoting = {text: props.message.text, ref: "", refers: [askedRow.value], label: "Asking about"});

async function read() {
    if (card.value.output) await pages.poll();
}

// a card leaves once its run ends unless the user pinned it; while it closes by itself, pointing at it holds it in place
const leaving = computed(() => isLeaving(props.message));
const pinned = computed(() => Boolean(card.value.pinned));
const togglePin = () => (pinned.value ? unpinDock : pinDock)(scope, props.message);
const pointed = () => leaving.value && !card.value.held_at && holdDock(props.message);
const left = () => card.value.held_at && releaseDock(props.message);
// a card taken away under the pointer, as when docked runs fold into their row, hears no pointer leave: it lets its hold go as it goes
onBeforeUnmount(left);

function toggle() {
    opened.value = !opened.value;
    if (opened.value) {
        shown.value = true;
        read();
    }
}

watch(
    () => props.message.data,
    () => opened.value && read()
);
</script>

<template>
    <ChatDock label="Watched output" :folded="folded" kind="watch-dock" @pointerenter="pointed" @pointerleave="left">
        <template #edge>
            <Transition name="leave-fade">
                <DockLeave v-if="leaving" :ends-at="card.undock_at" />
            </Transition>
        </template>
        <template #head>
            <span class="watch-dock-state" :data-state="runState" :style="{'--tone': tone}">
                <MarkIcon :name="icon" />
            </span>
            <button
                type="button"
                class="watch-dock-label"
                :aria-expanded="opened"
                :title="[card.line, opened ? 'Fold the output' : 'Show the whole output'].filter(Boolean).join('\n\n')"
                @click="toggle"
            >
                <span class="watch-dock-title">{{ heading }}</span>
                <FoldSign :open="opened" />
            </button>
            <template v-if="phase === 'stopping'">
                <span class="watch-dock-figure">Stopping</span>
            </template>
            <template v-else-if="card.count">
                <span class="watch-dock-figure">{{ card.count }}</span>
            </template>
            <template v-if="card.ending">
                <span class="watch-dock-ending">{{ card.ending }}</span>
            </template>
            <template v-if="ranFor">
                <span class="watch-dock-figure watch-dock-timer">{{ ranFor }}</span>
            </template>
            <Btn
                kind="icon"
                :class="['watch-dock-pin', {pinned}]"
                :aria-pressed="pinned"
                :title="pinned ? 'Unpin: the card leaves once its run ends' : 'Pin: the card stays after its run ends, until you close it'"
                :aria-label="pinned ? 'Unpin the card' : 'Pin the card'"
                @click="togglePin"
            >
                <Icon name="pin" :style="{fill: pinned ? 'currentColor' : 'none'}" />
            </Btn>
            <Btn kind="icon" class="watch-dock-ask" title="Ask about this" aria-label="Ask about this" @click="askAbout">
                <Icon name="bubble" />
            </Btn>
            <template v-if="stoppable">
                <RunStop :what="what" above @stop="stop" />
            </template>
            <template v-if="!card.waiting_run || !card.active">
                <CloseButton title="Take the watched output down from above the chat" @click="takeDown" />
            </template>
        </template>
        <template v-if="statuses.length">
            <ul class="watch-dock-statuses">
                <template v-for="status in statuses" :key="status">
                    <li>{{ status }}</li>
                </template>
            </ul>
        </template>
        <div :class="['watch-dock-more', {open: opened}]">
            <div class="watch-dock-more-inner">
                <template v-if="shown && pages.loaded.value">
                    <OutputLines class="watch-dock-output" :lines="pages.lines.value" @older="pages.older" />
                </template>
                <template v-else-if="shown">
                    <ul class="watch-dock-lines">
                        <template v-for="line in lines" :key="line">
                            <li>{{ line }}</li>
                        </template>
                    </ul>
                </template>
            </div>
        </div>
        <template v-if="card.fraction > 0">
            <div class="watch-dock-bar" :data-figure-bar="leads ? (card.ending ? endedTone : '') : undefined" :data-figure-began="createdAt(message)">
                <div class="watch-dock-fill" :style="{width, background: bar}" :data-figure-progress="leads && !card.ending ? '' : null"></div>
            </div>
        </template>
    </ChatDock>
</template>

<style scoped>
.watch-dock-more {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition:
        grid-template-rows var(--move),
        opacity var(--fade);
}

.watch-dock-more.open {
    grid-template-rows: 1fr;
    opacity: 1;
}

.watch-dock-more-inner {
    min-height: 0;
    overflow: hidden;
}

.watch-dock-state {
    display: flex;
    flex: none;
    justify-content: center;
    width: 16px;
    color: var(--tone);
}

.watch-dock-elsewhere {
    margin: 0;
    padding: 6px 15px 10px;
    font-size: 11px;
    color: var(--text-3);
}

.watch-dock-output {
    max-height: 240px;
    margin: 0 15px 8px;
    padding: 6px 8px;
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text-2);
    font-size: 11px;
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

/* the whole title is the button that opens the card to its whole output, the fold sign after it */
.watch-dock-label {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    gap: 9px;
    min-width: 0;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    text-align: left;
    cursor: pointer;
    color: var(--text);
    font-size: 12px;
    font-weight: 500;
}

.watch-dock-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.watch-dock-label:hover .fold,
.watch-dock-label:focus-visible .fold {
    color: var(--text-2);
}

/* the stop shows while the card is pointed at */
.chat-dock-card:hover .run-stop,
.chat-dock-card:focus-within .run-stop {
    opacity: 1;
}

/* the pin turns the accent colour while the card is pinned */
.watch-dock-pin.pinned {
    color: var(--accent);
}

.leave-fade-leave-active {
    transition: opacity 0.25s ease;
}

.leave-fade-leave-to {
    opacity: 0;
}

.watch-dock-figure,
.watch-dock-ending {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}

.watch-dock-statuses {
    margin: 0;
    padding: 0 12px 10px 35px;
    color: var(--text-3);
    font-size: 11px;
    line-height: 1.5;
    list-style: none;
    overflow-wrap: anywhere;
}

.watch-dock-lines {
    margin: 0;
    padding: 0 12px 10px 35px;
    color: var(--text-3);
    font-family: var(--mono, monospace);
    font-size: 11px;
    line-height: 1.5;
    list-style: none;
    overflow-wrap: anywhere;
}

/* the bar lies along the card's foot, adding no height, so the title stays in the middle of the card */
.watch-dock-bar {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    border-radius: 1px;
    background: var(--border);
    overflow: hidden;
}

.watch-dock-fill {
    height: 100%;
    transition: width 0.4s ease;
}
</style>
