<script setup>
import {commandMark} from "../../composables/terminal.js";
import {useToggledSet} from "../../composables/toggledSet.js";

defineProps({lines: {type: Array, required: true}});
const {members: opened, toggle} = useToggledSet();
</script>

<template>
    <div class="lines" role="log" aria-label="What the agent ran">
        <template v-for="line in lines" :key="line.at">
            <p :class="['line', {shell: line.tool === 'Bash', noted: line.tool === 'Journal'}]">
                <span class="line-mark" aria-hidden="true">{{ commandMark(line.tool) }}</span>
                <span>{{ line.command }}</span>
            </p>
            <template v-if="line.output">
                <button type="button" :class="['line-output', {open: opened.has(line.at)}]" :aria-expanded="opened.has(line.at)" @click="toggle(line.at)">
                    {{ line.output }}
                </button>
            </template>
        </template>
    </div>
</template>

<style scoped>
.lines {
    margin: 0 0 14px;
    padding: 12px;
    border-radius: 12px;
    background: var(--raised);
    color: var(--text-3);
    font: 0.75rem/1.45 ui-monospace, Menlo, monospace;
}

.line {
    display: flex;
    gap: 7px;
    margin: 0;
    word-break: break-word;
}

.line.shell {
    color: var(--text-2);
}

.line.noted {
    color: var(--accent-text);
    font-style: italic;
}

.line-mark {
    flex: none;
    color: var(--text-4);
}

.line-output {
    display: -webkit-box;
    overflow: hidden;
    width: calc(100% - 15px);
    min-height: 44px;
    margin: 2px 0 6px 15px;
    padding: 0 0 0 8px;
    border: 0;
    border-left: 1px solid var(--border);
    background: none;
    color: var(--text-4);
    font: inherit;
    text-align: left;
    white-space: pre-wrap;
    word-break: break-word;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.line-output.open {
    display: block;
}
</style>
