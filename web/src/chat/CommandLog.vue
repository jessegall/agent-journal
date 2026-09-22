<script setup>
import {computed} from "vue";

const props = defineProps({commands: {type: Array, default: () => []}});
const newestFirst = computed(() => [...props.commands].reverse());

const line = (c) =>
    c.tool === "Bash"
        ? c.what
        : `${c.tool.replace(/^mcp__/, "").replaceAll("__", " · ")} ${c.subject && c.subject !== c.what ? c.subject : ""}`.trim();
</script>

<template>
    <p class="bar-none">What the agent ran lately, newest at the bottom.</p>
    <template v-if="!commands.length">
        <p class="bar-none">Nothing yet.</p>
    </template>
    <div class="log">
        <template v-for="c in newestFirst" :key="c.at">
            <div :class="['log-line', {running: !c.done, shell: c.tool === 'Bash'}]">
                <span class="log-mark">{{ c.tool === "Bash" ? "$" : "›" }}</span>
                <span class="log-text">{{ line(c) }}</span>
            </div>
        </template>
    </div>
</template>

<style scoped>
.bar-none {
    margin: 4px 6px 6px;
    color: var(--text-4);
    font-size: 12px;
}

.log {
    display: flex;
    flex-direction: column-reverse;
    max-height: 340px;
    overflow-y: auto;
    padding: 8px 10px;
    border-radius: 7px;
    background: var(--code-bg);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
    line-height: 1.55;
}

.log-line {
    display: flex;
    gap: 7px;
    color: var(--text-3);
}

.log-line.shell {
    color: var(--text-2);
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
