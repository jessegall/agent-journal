<script setup>
import {Terminal} from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import {onMounted, onUnmounted, ref} from "vue";
import {api} from "../api/client.js";

const props = defineProps({session: String});
const box = ref(null);
const EVERY = 400;
let term = null;
let at = -1;
let timer = 0;
let gone = false;

const bytes = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

async function pull() {
    const part = await api.agentScreen(props.session, at);
    if (gone) return;
    if (term.rows !== part.rows || term.cols !== part.cols) term.resize(part.cols, part.rows);
    if (part.data) term.write(bytes(part.data));
    at = part.at;
    timer = setTimeout(pull, EVERY);
}

onMounted(() => {
    term = new Terminal({
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: 12,
        cursorBlink: false,
        theme: {background: "#0d0e10", foreground: "#e6e7ea"},
    });
    term.open(box.value);
    term.onData((text) => api.agentKeys(props.session, text));
    pull();
});

onUnmounted(() => {
    gone = true;
    clearTimeout(timer);
    term.dispose();
});
</script>

<template>
    <div ref="box" class="agent-screen" />
</template>

<style scoped>
.agent-screen {
    overflow: auto;
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--side);
}
</style>
