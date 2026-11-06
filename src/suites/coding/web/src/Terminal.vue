<script setup>
import {computed, nextTick, ref, watch} from "vue";
import {AutoScrollPane, EmptyState, Skeleton, useRows, useWindow} from "@journal/window-kit";
import TerminalOutput from "./TerminalOutput.vue";

// Commands are listed oldest first and open to their full text; a line typed here goes to the agent's terminal.
const COMMAND_TOOLS = new Set(["Bash", "Monitor", "shell", "exec_command"]);
const JOURNAL_LINE = /^(\S+=\S+\s+)*(\S*\/)?journal(\s|$)/;

// the terminal opens with at least this many lines, reading older pages of the agent's hook calls until it has them or the record ends, and reads one more page each time it is scrolled to the top
const OPENING_LINES = 100;
const PAGE_CALLS = 200;
const TOP_PIXELS = 8;

const context = useWindow();
const props = defineProps({agent: {type: Number, default: null}});
const agent = props.agent ?? context.agent;
const {rows, failure, loaded, older} = useRows(`hook-call feed --session-agent-id ${agent} --limit ${PAGE_CALLS}`, ["hook_call.*"], {incremental: true});
const typed = ref("");
const refusal = ref("");
const input = ref(null);
const opened = ref(new Set());
const fullCommands = ref({});
const log = ref(null);
const paging = ref(false);
const recordEnds = ref(false);

// the pane menu's detail level: commands alone, with the journal's lines too, or every tool the agent used
const isShown = {
    commands: (row) => COMMAND_TOOLS.has(row.tool) && !isJournalLine(row),
    journal: (row) => COMMAND_TOOLS.has(row.tool),
    everything: () => true,
};
const isJournalLine = (row) => JOURNAL_LINE.test(row.summary);
const level = context.option("verbosity");
const commands = computed(() => rows.value.filter((row) => row.hook === "pre_tool_use" && row.summary && isShown[level.value ?? "everything"](row)).sort((one, two) => one.id - two.id));
const markOf = (row) => (isJournalLine(row) ? "#" : COMMAND_TOOLS.has(row.tool) ? "$" : ">");

// reads the page of calls before the oldest held, and when the view is at the top keeps it on the line it showed; false when no page was read
async function pageOlder() {
    if (paging.value || recordEnds.value) return false;
    paging.value = true;
    const pane = log.value?.pane;
    const atTop = pane?.scrollTop < TOP_PIXELS;
    const before = pane?.scrollHeight;
    recordEnds.value = !(await older());
    if (atTop) {
        await nextTick();
        pane.scrollTop += pane.scrollHeight - before;
    }
    paging.value = false;
    return !recordEnds.value;
}

async function fillOpening() {
    let reading = true;
    while (reading && commands.value.length < OPENING_LINES) reading = await pageOlder();
}

function followScroll(event) {
    if (event.target.scrollTop < TOP_PIXELS) pageOlder();
}

watch(() => loaded.value && commands.value.length < OPENING_LINES, (short) => short && fillOpening(), {immediate: true});

function toggle(row) {
    const next = new Set(opened.value);
    if (!next.delete(row.id)) next.add(row.id);
    opened.value = next;
}

async function send() {
    const line = typed.value;
    if (!line.trim()) return;
    typed.value = "";
    const result = await context.run(["agent", "type", String(agent), line]);
    refusal.value = result.ok ? "" : result.error;
    if (!result.ok) typed.value = line;
}

function focusInput(event) {
    if (String(window.getSelection()) || event.target.closest("button, a, input, textarea, .terminal-text")) return;
    input.value?.focus();
}
</script>

<template>
    <section class="terminal" @click="focusInput">
        <template v-if="failure">
            <p class="terminal-failure">{{ failure }}</p>
        </template>
        <template v-else-if="!loaded">
            <Skeleton shape="text" />
        </template>
        <template v-else-if="!commands.length">
            <EmptyState title="No commands from this agent yet" />
        </template>
        <template v-else>
            <AutoScrollPane ref="log" :row-count="commands.length" pane-class="terminal-body" data-terminal-log @scroll.capture="followScroll">
                <template v-for="row in commands" :key="row.id">
                    <div :class="['terminal-row', {refused: row.refusal}]" data-terminal-command :title="row.refusal ? `The journal refused this before it ran: ${row.refusal}` : null">
                        <span class="terminal-mark">{{ markOf(row) }}</span>
                        <button type="button" :class="['terminal-text', {open: opened.has(row.id)}]" :aria-expanded="opened.has(row.id)" @click="toggle(row)">{{ opened.has(row.id) ? fullCommands[row.id] || row.summary : row.summary }}</button>
                        <template v-if="row.refusal">
                            <span class="terminal-state" data-terminal-refused>refused</span>
                        </template>
                    </div>
                    <template v-if="opened.has(row.id)"><TerminalOutput :call="row.id" @command="fullCommands[row.id] = $event" /></template>
                </template>
            </AutoScrollPane>
        </template>
        <form class="terminal-run" data-terminal-run @submit.prevent="send">
            <span class="terminal-prompt">$</span>
            <input ref="input" v-model="typed" class="terminal-input" aria-label="A command to run in the agent's terminal" autocomplete="off" @keydown.enter.ctrl.prevent="send" @keydown.enter.meta.prevent="send">
        </form>
        <template v-if="refusal">
            <p class="terminal-failure" role="alert" data-terminal-refusal>{{ refusal }}</p>
        </template>
    </section>
</template>

<style scoped>
.terminal {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    background: var(--code-bg);
}

.terminal :deep(.terminal-body) {
    flex: 1;
    min-height: 0;
    margin: 0;
    padding: 8px 12px;
    overflow: auto;
    color: var(--text-1);
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: 12px;
    line-height: 1.45;
}

.terminal-row {
    display: flex;
    gap: 7px;
    align-items: baseline;
}

.terminal-mark,
.terminal-state {
    flex: none;
    color: var(--text-3);
}

.terminal-row.refused .terminal-text,
.terminal-row.refused .terminal-state {
    color: var(--danger);
}

.terminal-text {
    min-width: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
}

.terminal-text.open {
    overflow-wrap: anywhere;
    white-space: pre-wrap;
}

.terminal-run {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-top: 1px solid var(--border);
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: 12px;
}

.terminal-prompt {
    color: var(--text-3);
}

.terminal-input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: inherit;
    font: inherit;
}

.terminal-failure {
    padding: 8px 12px;
    color: var(--text-3);
}
</style>
