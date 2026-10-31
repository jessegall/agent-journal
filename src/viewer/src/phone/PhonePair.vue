<script setup>
import {transport} from "../api/transport.js";
import {onMounted, ref} from "vue";
import "../tokens.css";

// a phone paired with version 3, or forgotten, still holds a key this journal does not know
defineProps({pairedBefore: Boolean});

// Pairs this phone: the code from the link it was opened by, at once, or the short code the computer shows, typed.
const code = ref("");
const failure = ref("");
const busy = ref(false);

async function pair(given) {
    busy.value = true;
    failure.value = "";
    try {
        const answer = await transport.raw("./pair", {
            method: "POST",
            credentials: "same-origin",
            headers: {"Content-Type": "application/json", "X-Phone": "1"},
            body: JSON.stringify({code: given, device: deviceName()}),
        });
        if (!answer.ok) throw new Error((await answer.json().catch(() => ({}))).error || "this code pairs no phone");
        history.replaceState(null, "", "./");
        location.reload();
    } catch (e) {
        failure.value = e.message;
        busy.value = false;
    }
}

// what the phone calls itself, from its browser: the model where it says, else its system
function deviceName() {
    const agent = navigator.userAgent;
    return (agent.match(/iPhone|iPad|Android[^;)]*|Pixel[^;)]*/) || ["A phone"])[0].trim();
}

onMounted(() => {
    const linked = location.hash.replace(/^#/, "");
    if (linked && !linked.startsWith("/")) pair(linked);
});
</script>

<template>
    <main class="pair">
        <h1>Pair this phone</h1>
        <template v-if="pairedBefore">
            <p class="pair-again">This phone was paired with an earlier version of the journal, or was forgotten. Pair it once more.</p>
        </template>
        <p class="pair-how">On your computer, open the journal and click the phone in the top bar. Scan its code, or type the short code here.</p>
        <form class="pair-form" @submit.prevent="pair(code)">
            <input v-model="code" class="pair-input" autocomplete="one-time-code" autocapitalize="characters" placeholder="ABCD-EFGH" aria-label="The short code" />
            <button type="submit" class="pair-btn" :disabled="busy || !code.trim()">{{ busy ? "Pairing" : "Pair" }}</button>
        </form>
        <template v-if="failure">
            <p class="pair-failure">{{ failure }}</p>
        </template>
    </main>
</template>

<style scoped>
.pair {
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-width: 420px;
    margin: 18vh auto 0;
    padding: 0 20px;
    color: var(--text);
    font: 15px/1.45 system-ui, sans-serif;
}

h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
}

.pair-again {
    margin: 0;
    color: var(--tone-warn);
}

.pair-how {
    margin: 0;
    color: var(--text-2);
}

.pair-form {
    display: flex;
    gap: 8px;
}

.pair-input {
    flex: 1;
    min-height: 44px;
    padding: 0 12px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    letter-spacing: 0.08em;
}

.pair-btn {
    min-height: 44px;
    padding: 0 18px;
    border: 0;
    border-radius: 10px;
    background: var(--accent);
    color: #fff;
    font: inherit;
}

.pair-btn:disabled {
    opacity: 0.5;
}

.pair-failure {
    margin: 0;
    color: var(--tone-danger);
}
</style>
