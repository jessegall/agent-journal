<script setup>
import {onMounted, ref} from "vue";
import Btn from "../kit/Btn.vue";
import {transport} from "../api/transport.js";
import {copyText} from "../platform/clipboard.js";

// a one-time link that logs another browser in as this user; the server refuses it to any session that is not a user's
const emit = defineEmits(["close"]);
const link = ref("");
const failure = ref("");
const copied = ref(false);

async function ask() {
    const answer = await transport.raw("/api/login-link", {method: "POST", headers: {"Content-Type": "application/json"}, body: "{}"});
    const body = await answer.json();
    if (answer.ok) link.value = body.link;
    else failure.value = body.error;
}

async function copy() {
    copied.value = await copyText(link.value);
}

onMounted(ask);
</script>

<template>
    <Teleport to="body">
        <div class="login-scrim" @click="emit('close')" />
        <div class="login-link" role="dialog" aria-label="Log in another browser" data-login-link>
            <h2>Log in another browser</h2>
            <template v-if="failure">
                <p class="login-failure" data-login-failure>{{ failure }}</p>
            </template>
            <template v-else-if="link">
                <p>Open this link in the other browser. It works once.</p>
                <input class="login-address" :value="link" readonly aria-label="Login link" data-login-address @focus="$event.target.select()" />
                <Btn small bordered data-login-copy @click="copy">{{ copied ? "Copied" : "Copy" }}</Btn>
            </template>
            <template v-else>
                <p>Making a link…</p>
            </template>
            <Btn small bordered data-login-close @click="emit('close')">Close</Btn>
        </div>
    </Teleport>
</template>

<style scoped>
.login-scrim {
    position: fixed;
    z-index: 50;
    inset: 0;
    background: rgba(4, 5, 6, 0.62);
}

.login-link {
    position: fixed;
    z-index: 51;
    top: 20vh;
    left: 50%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: min(560px, 92vw);
    padding: 16px;
    transform: translateX(-50%);
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
}

.login-link h2 {
    margin: 0;
    font-size: 15px;
}

.login-link p {
    margin: 0;
    color: var(--text-3);
    font-size: 13px;
}

.login-address {
    padding: 6px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font: 12px ui-monospace, monospace;
}

.login-failure {
    color: var(--text);
}
</style>
