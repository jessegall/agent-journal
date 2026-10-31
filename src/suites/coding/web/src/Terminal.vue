<script setup>
import {nextTick, onUnmounted, ref} from "vue";
import {EmptyState, useWindow} from "@journal/window-kit";

const LINE_LIMIT = 2000;
const FOLLOW_MILLISECONDS = 1000;

const context = useWindow();
const lines = ref([]);
const failure = ref("");
const body = ref(null);
let lastNumber = 0;

// the lines after the last one drawn, kept to the last LINE_LIMIT, the view held at the end while it was there
async function load() {
    const result = await context.read(`agent terminal ${context.agent} --after ${lastNumber}`);
    if (!result.ok) {
        failure.value = result.error;
        return;
    }
    failure.value = "";
    if (!result.value.rows.length) return;
    const atEnd = !body.value || body.value.scrollTop + body.value.clientHeight >= body.value.scrollHeight - 4;
    lines.value = [...lines.value, ...result.value.rows].slice(-LINE_LIMIT);
    lastNumber = lines.value[lines.value.length - 1].number;
    await nextTick();
    if (atEnd && body.value) body.value.scrollTop = body.value.scrollHeight;
}

const follow = setInterval(() => {
    if (context.visible.value) load();
}, FOLLOW_MILLISECONDS);
onUnmounted(() => clearInterval(follow));
load();
</script>

<template>
    <section class="terminal">
        <template v-if="failure">
            <p class="terminal-failure">{{ failure }}</p>
        </template>
        <template v-else-if="!lines.length">
            <EmptyState title="No terminal output from this agent yet" />
        </template>
        <template v-else>
            <pre ref="body" class="terminal-body"><template v-for="line in lines" :key="line.number"><span class="terminal-line">{{ line.text }}</span>
</template></pre>
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

.terminal-body {
    flex: 1;
    min-height: 0;
    margin: 0;
    padding: 8px 12px;
    overflow: auto;
    color: var(--text-1);
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: 12px;
    line-height: 1.45;
    white-space: pre-wrap;
    word-break: break-word;
}

.terminal-failure {
    padding: 8px 12px;
    color: var(--text-3);
}
</style>
