<script setup>
import {computed, ref} from "vue";
import Console from "../kit/Console.vue";

const props = defineProps({
    commands: {type: Array, default: () => []},
    queued: {type: Array, default: () => []},
    outputs: {type: Object, default: () => ({})},
});
const emit = defineEmits(["now"]);

const opened = ref(new Set());

function toggle(at) {
    const next = new Set(opened.value);
    next.has(at) ? next.delete(at) : next.add(at);
    opened.value = next;
}

const JOURNAL_CALL = /^(cd\s+\S+\s*&&\s*)?\S*journal\s/;
const shown = computed(() => props.commands.filter((c) => !(c.tool === "Bash" && JOURNAL_CALL.test(c.command.trim()))));

const line = (c) =>
    ["Bash", "Typed", "Journal"].includes(c.tool)
        ? c.command
        : `${c.tool.replace(/^mcp__/, "").replaceAll("__", " · ")} ${c.subject && c.subject !== c.command ? c.subject : ""}`.trim();
</script>

<template>
    <Console>
        <template v-for="c in shown" :key="c.at">
            <div :class="['log-line', {running: !c.done, shell: c.tool === 'Bash', noted: c.tool === 'Journal'}]">
                <span class="log-mark">{{ c.tool === "Bash" ? "$" : c.tool === "Journal" ? "#" : "›" }}</span>
                <span class="log-text">{{ line(c) }}</span>
            </div>
            <template v-if="outputs[String(c.at)]">
                <pre
                    :class="['log-output', {open: opened.has(c.at)}]"
                    :title="opened.has(c.at) ? 'Click to fold the output' : 'Click to show the whole output'"
                    @click="toggle(c.at)"
                    >{{ outputs[String(c.at)] }}</pre>
            </template>
        </template>
        <template v-for="q in queued" :key="q.at">
            <div class="log-line shell queued" title="Waiting to be typed into the agent's terminal">
                <span class="log-mark">$</span>
                <span class="log-text">{{ q.command }}</span>
                <span class="log-state">pending · ⌃↵ or</span>
                <button type="button" class="log-now" title="Interrupt the agent and run this command now" @click="emit('now', q.command)">
                    Run now
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

.log-line.running {
    color: var(--text);
}

.log-mark {
    flex: none;
    color: var(--text-4);
}

.log-line.running .log-mark {
    color: var(--accent-text);
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
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
</style>
