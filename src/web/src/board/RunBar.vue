<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import StateDot from "../kit/StateDot.vue";
import Stepper from "../kit/Stepper.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import WorkingAgents from "../agents/WorkingAgents.vue";
import {peek} from "../route.js";

const props = defineProps({
    board: {type: Object, required: true},
    cards: {type: Array, default: () => []},
    slots: {type: Object, default: null},
    waiting: {type: Number, default: 0},
    only: {type: String, default: ""},
    busy: Boolean,
});
const emit = defineEmits(["play", "pause", "resume", "open", "only", "limit"]);
const MOST = 20;
const PIPS = 12;
const PLAY_LINE = "Play starts one agent per ticket, each in its own worktree, in board order.";
const STATES = {
    play: {dot: "", word: "Not running", line: PLAY_LINE},
    run: {
        dot: "running",
        word: "Running",
        line: "by the main agent",
        hint: "The main agent reviews each plan and change, then merges it. The agent stays free for your requests. Pause stops new tickets; running agents finish their steps.",
    },
    paused: {dot: "", word: "Paused", line: "no new ticket starts; running agents finish their step"},
    finished: {
        dot: "done",
        word: "Checking the goal",
        line: "every ticket is merged; the main agent checks the goal against what was built",
    },
};
const mode = computed(() => {
    const data = props.board.data;
    if (!data.started) return "play";
    if (data.finished) return "finished";
    return data.paused ? "paused" : "run";
});
const state = computed(() => STATES[mode.value]);
const added = computed(() => ((props.board.data.added || {}).tickets || []).length);
const line = computed(() =>
    mode.value === "play" && added.value
        ? `${added.value} ${added.value === 1 ? "ticket" : "tickets"} added. ${PLAY_LINE}`
        : state.value.line
);
const running = computed(() => (props.slots ? props.slots.running : []));
const limit = computed(() => (props.slots ? props.slots.limit : 0));
const needing = computed(() => (props.slots ? props.slots.waiting : 0));
const pips = computed(() =>
    limit.value && limit.value <= PIPS ? Array.from({length: limit.value}, (_, i) => ({n: i + 1, on: i < running.value.length})) : []
);
const count = ref(null);
const counting = ref(false);
</script>

<template>
    <section :class="['run-bar', mode]">
        <StateDot :state="state.dot" />
        <p class="run-state">
            <b>{{ state.word }}</b>
            <span :class="['run-line', {hint: state.hint}]" :title="state.hint || line">{{ line }}</span>
        </p>
        <template v-if="cards.length || waiting || needing">
            <span class="run-rule" />
            <div class="run-agents">
                <WorkingAgents :cards="cards" :visible="2" @open="(card) => emit('open', card)" />
                <template v-if="waiting">
                    <Btn
                        small
                        :class="['run-filter', {on: only === 'waiting'}]"
                        title="Show only the cards waiting to start"
                        @click="emit('only', 'waiting')"
                    >
                        <StateDot state="queued" />
                        {{ waiting }} waiting
                    </Btn>
                </template>
                <template v-if="needing">
                    <Btn
                        small
                        :class="['run-filter', {on: only === 'you'}]"
                        title="Show only the cards that need you"
                        @click="emit('only', 'you')"
                    >
                        <StateDot state="you" />
                        {{ needing }} {{ needing === 1 ? "needs" : "need" }} you
                    </Btn>
                </template>
            </div>
        </template>
        <span class="run-grow" />
        <template v-if="slots">
            <span ref="count" class="run-count-anchor">
                <Btn
                    small
                    :class="['run-count', {open: counting}]"
                    title="How many agents may run at once"
                    @click.stop="counting = !counting"
                >
                    <template v-if="pips.length">
                        <span class="run-pips">
                            <template v-for="pip in pips" :key="pip.n">
                                <span :class="['run-pip', {on: pip.on}]" />
                            </template>
                        </span>
                    </template>
                    <span>
                        <b>{{ running.length }}</b>
                        <template v-if="limit">
                            <span class="run-of">of</span>
                            <b>{{ limit }}</b>
                            <span class="run-word">agents</span>
                        </template>
                        <template v-else>
                            <span class="run-word">agents</span>
                            <span class="run-of">· no limit</span>
                        </template>
                    </span>
                    <Icon name="caret" :size="12" :class="{flip: counting}" />
                </Btn>
            </span>
        </template>
        <SwitchCase :value="mode">
            <template #play>
                <Btn kind="primary" small :busy="busy" @click="emit('play')">
                    <Icon name="start" />
                    Play
                </Btn>
            </template>
            <template #paused>
                <Btn kind="primary" small :busy="busy" @click="emit('resume')">
                    <Icon name="start" />
                    Resume
                </Btn>
            </template>
            <template #run>
                <Btn small :busy="busy" title="No new ticket starts; running agents finish their step" @click="emit('pause')">
                    <Icon name="pause" />
                    Pause
                </Btn>
            </template>
        </SwitchCase>
        <template v-if="counting">
            <MenuPanel :anchor="count" align="end" :min-width="280" :max-width="340" @click.stop @close="counting = false">
                <div class="run-panel">
                    <div class="run-limit">
                        Agents at once
                        <Stepper
                            :value="limit"
                            :min="0"
                            :max="MOST"
                            none="none"
                            label="How many ticket agents may run at once"
                            @change="(n) => emit('limit', n)"
                        />
                    </div>
                    <p class="run-note">
                        This limit applies to every board.
                        {{
                            limit
                                ? "Set it to none (no limit) and every started ticket gets an agent at once."
                                : "At none, every started ticket gets an agent at once."
                        }}
                    </p>
                    <template v-if="running.length">
                        <div class="run-list">
                            <template v-for="ticket in running" :key="ticket.n">
                                <MenuItem @click="((counting = false), peek('ticket', ticket.n))">
                                    <StateDot state="running" />
                                    <span class="run-n">#{{ ticket.n }}</span>
                                    <span class="run-title">{{ ticket.title }}</span>
                                </MenuItem>
                            </template>
                        </div>
                    </template>
                </div>
            </MenuPanel>
        </template>
    </section>
</template>

<style scoped>
.run-bar {
    display: flex;
    flex: none;
    align-items: center;
    gap: 12px;
    min-width: 0;
    height: 52px;
    padding: 0 12px 0 20px;
    border-bottom: 1px solid var(--border);
    background: #17181b;
}

.run-state {
    display: flex;
    flex: 0 1 auto;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
    margin: 0;
    white-space: nowrap;
}

.run-state b {
    flex: none;
    font-size: 13.5px;
    font-weight: 600;
}

.run-line {
    min-width: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12.5px;
    text-overflow: ellipsis;
}

.run-line.hint {
    color: var(--text-2);
    text-decoration: underline;
    text-decoration-color: var(--border-3);
    text-underline-offset: 3px;
    cursor: help;
}

.run-rule {
    flex: none;
    width: 1px;
    height: 20px;
    background: var(--border-2);
}

.run-agents {
    display: flex;
    flex: 0 1 auto;
    align-items: center;
    gap: 6px;
    min-width: 0;
}

.run-filter {
    flex: none;
    color: var(--text-3);
}

.run-filter.on {
    border-color: var(--accent);
    color: var(--text);
}

.run-grow {
    flex: 1;
    min-width: 0;
}

.run-count-anchor {
    flex: none;
}

.run-count {
    border-color: var(--border-2);
    color: var(--text-2);
}

.run-count.open {
    border-color: var(--border-3);
    background: var(--hover);
}

.run-count b {
    color: var(--text);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
}

.run-of {
    margin: 0 4px;
    color: var(--text-4);
}

.run-word {
    margin-left: 4px;
}

.flip {
    transform: rotate(180deg);
}

.run-pips {
    display: flex;
    gap: 2px;
}

.run-pip {
    width: 4px;
    height: 12px;
    border-radius: 1px;
    background: var(--border-3);
}

.run-pip.on {
    background: var(--accent-text);
}

.run-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 6px 4px;
}

.run-limit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: var(--text-2);
    font-size: 12.5px;
}

.run-note {
    margin: 0;
    color: var(--text-4);
    font-size: 11.5px;
}

.run-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 8px;
    border-top: 1px solid var(--border);
}

.run-n {
    flex: none;
    color: var(--text-4);
    font-variant-numeric: tabular-nums;
}

.run-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media (max-width: 1000px) {
    .run-word {
        display: none;
    }
}

@media (max-width: 640px) {
    .run-bar {
        flex-wrap: wrap;
        row-gap: 0;
        height: auto;
        padding: 0 8px 0 14px;
    }

    .run-state {
        height: 52px;
        align-items: center;
    }

    .run-line,
    .run-rule {
        display: none;
    }

    .run-agents {
        order: 10;
        flex-basis: 100%;
        height: 42px;
        margin: 0 -8px 0 -14px;
        padding: 0 14px;
        overflow-x: auto;
        border-top: 1px solid var(--border);
    }

    .run-pips {
        display: none;
    }

    .run-agents :deep(.working),
    .run-agents :deep(.agent) {
        flex: none;
    }
}
</style>
