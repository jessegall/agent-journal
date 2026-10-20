<script setup>
import {onMounted, ref} from "vue";

// Offers to tell this phone by push when something new waits for the user: asked once, on a tap, never on its own.
const offered = ref(false);
const failure = ref("");

const fromBase64 = (text) => Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(text.length / 4) * 4, "=")), (c) => c.charCodeAt(0));

async function turnOn() {
    failure.value = "";
    try {
        if ((await Notification.requestPermission()) !== "granted") throw new Error("notifications were not allowed on this phone");
        const worker = await navigator.serviceWorker.ready;
        const {key} = await (await fetch("./push-key", {credentials: "same-origin"})).json();
        const subscription = await worker.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: fromBase64(key)});
        const answer = await fetch("./push", {
            method: "POST",
            credentials: "same-origin",
            headers: {"Content-Type": "application/json", "X-Phone": "1"},
            body: JSON.stringify({endpoint: subscription.endpoint}),
        });
        if (!answer.ok) throw new Error((await answer.json().catch(() => ({}))).error || "the journal did not take the subscription");
        offered.value = false;
    } catch (e) {
        failure.value = e.message;
    }
}

onMounted(async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) return;
    offered.value = Notification.permission === "default";
});
</script>

<template>
    <template v-if="offered">
        <div class="notify">
            <span class="notify-text">Be told on this phone when something needs you.</span>
            <button type="button" class="notify-on" @click="turnOn">Turn on</button>
            <button type="button" class="notify-off" aria-label="Not now" @click="offered = false">Not now</button>
        </div>
    </template>
    <template v-if="failure">
        <p class="notify-failure">{{ failure }}</p>
    </template>
</template>

<style scoped>
.notify {
    position: fixed;
    right: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom));
    left: 12px;
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border: 1px solid var(--border-2);
    border-radius: 14px;
    background: var(--raised);
    color: var(--text);
    font: 14px/1.35 system-ui, sans-serif;
}

.notify-text {
    flex: 1;
}

.notify-on,
.notify-off {
    min-height: 40px;
    padding: 0 12px;
    border: 0;
    border-radius: 10px;
    font: inherit;
}

.notify-on {
    background: var(--accent);
    color: #fff;
}

.notify-off {
    background: none;
    color: var(--text-3);
}

.notify-failure {
    position: fixed;
    right: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom));
    left: 12px;
    margin: 0;
    color: var(--tone-danger);
    font: 13px system-ui, sans-serif;
}
</style>
