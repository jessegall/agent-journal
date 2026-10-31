<script setup>
import {commandMark} from "../composables/terminal.js";
import {useToggledSet} from "../composables/toggledSet.js";
import Console from "../kit/Console.vue";
import {MOD} from "../platform/keys.js";

defineProps({
    lines: {type: Array, default: () => []},
    queued: {type: Array, default: () => []},
});
const emit = defineEmits(["now"]);

const {members: opened, toggle} = useToggledSet();
</script>

<template>
    <Console>
        <template v-for="c in lines" :key="c.time">
            <div
                :class="['log-line', {shell: c.tool === 'Bash', noted: c.tool === 'Journal', refused: c.refused}]"
                :title="c.refused ? `The journal refused this before it ran: ${c.refused}` : null"
            >
                <span class="log-mark">{{ commandMark(c.tool) }}</span>
                <span
                    :class="['log-text', {open: opened.has(c.time)}]"
                    :title="c.refused ? null : opened.has(c.time) ? 'Click to collapse this line' : 'Click to show the whole line'"
                    @click="toggle(c.time)"
                >
                    {{ c.command }}
                </span>
                <template v-if="c.refused">
                    <span class="log-state">refused</span>
                </template>
            </div>
            <template v-if="c.output">
                <pre
                    :class="['log-output', {open: opened.has(c.time)}]"
                    :title="opened.has(c.time) ? 'Click to collapse the output' : 'Click to show the whole output'"
                    @click="toggle(c.time)"
                    >{{ c.output }}</pre>
            </template>
        </template>
        <template v-for="q in queued" :key="q.time">
            <div class="log-line shell queued" title="Waiting to be typed into the agent's terminal">
                <span class="log-mark">$</span>
                <span class="log-text">{{ q.command }}</span>
                <span class="log-state">pending</span>
                <button type="button" class="log-now" title="Interrupt the agent and run this command now" @click="emit('now', q.command)">
                    Run now · {{ MOD }} Enter
                </button>
            </div>
        </template>
    </Console>
</template>

<style scoped>
.log-line {
    display: flex;
    gap: 7px;
    color: var(--text-3);
}

.log-line.shell {
    color: var(--text-2);
}

.log-line.noted {
    color: var(--accent-text);
    font-style: italic;
}

.log-line.queued {
    color: var(--text-4);
}

/* a command the journal refused before it ran: dimmed, so its retry reads as the one run */
.log-line.refused {
    color: var(--text-4);
    font-style: normal;
    opacity: 0.7;
}

.log-line.refused .log-text {
    text-decoration: line-through;
    text-decoration-color: var(--text-4);
}

.log-state {
    margin-left: auto;
    font-style: italic;
}

.log-now {
    margin-left: 8px;
    padding: 0 6px;
    border: 1px solid var(--border-2);
    border-radius: 4px;
    background: none;
    color: var(--text-2);
    font: inherit;
    cursor: pointer;
}

.log-now:hover {
    border-color: var(--border-3);
    color: var(--text);
}

.log-mark {
    flex: none;
    color: var(--text-4);
}

.log-output {
    display: -webkit-box;
    overflow: hidden;
    margin: 2px 0 6px 15px;
    padding-left: 8px;
    border-left: 1px solid var(--border);
    font: inherit;
    white-space: pre-wrap;
    word-break: break-word;
    color: var(--text-4);
    cursor: pointer;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.log-output.open {
    display: block;
}

.log-output:hover {
    color: var(--text-3);
}

.log-text {
    min-width: 0;
    white-space: pre-wrap;
    word-break: break-word;
    display: -webkit-box;
    overflow: hidden;
    cursor: pointer;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.log-text.open {
    display: block;
}

.queued .log-text {
    cursor: default;
}
</style>
