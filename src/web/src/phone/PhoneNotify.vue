<script setup>
import {onMounted, ref} from "vue";
import {phone} from "../api/phone.js";

const SKIPPED = "phone-notify-skipped";
const possible = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
const asking = ref(false);
const shown = ref(false);
const told = ref("");

function remembered() {
    try {
        return Boolean(localStorage.getItem(SKIPPED));
    } catch (error) {
        return false;
    }
}

function bytes(key) {
    const padded = (key + "===".slice((key.length + 3) % 4)).replace(/-/g, "+").replace(/_/g, "/");
    return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

async function subscribed() {
    const worker = await navigator.serviceWorker.register("./sw.js", {scope: "./"});
    const held = await worker.pushManager.getSubscription();
    const made = held || (await worker.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: bytes((await phone.pushKey()).key)}));
    await phone.subscribe(made.endpoint);
}

async function turnOn() {
    asking.value = true;
    told.value = "";
    try {
        if ((await Notification.requestPermission()) !== "granted") {
            told.value = "Notifications stay off. You can turn them on later in the iPhone's Settings for this app.";
            return;
        }
        await subscribed();
        shown.value = false;
    } catch (error) {
        told.value = error.message;
    } finally {
        asking.value = false;
    }
}

function skip() {
    shown.value = false;
    try {
        localStorage.setItem(SKIPPED, "1");
    } catch (error) {
        return;
    }
}

onMounted(() => {
    if (!possible) return;
    if (Notification.permission === "granted") subscribed().catch(() => {});
    else shown.value = Notification.permission === "default" && !remembered();
});
</script>

<template>
    <template v-if="shown">
        <div class="notify">
            <p class="notify-words">Get a notification when the agent needs you, even with the app closed.</p>
            <div class="notify-actions">
                <button type="button" class="notify-on" :disabled="asking" @click="turnOn">Turn on notifications</button>
                <button type="button" class="notify-skip" @click="skip">Not now</button>
            </div>
            <template v-if="told">
                <p class="notify-told" role="status">{{ told }}</p>
            </template>
        </div>
    </template>
</template>

<style scoped>
.notify {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 10px var(--side);
    border-bottom: 1px solid var(--line);
    background: var(--raised);
}

.notify-words,
.notify-told {
    margin: 0;
    color: var(--text-2);
    font-size: 0.824rem;
    line-height: 1.4;
}

.notify-actions {
    display: flex;
    gap: 8px;
}

.notify-on,
.notify-skip {
    min-height: 40px;
    padding: 0 14px;
    border-radius: 12px;
    font: inherit;
    font-size: 0.824rem;
}

.notify-on {
    border: 0;
    background: var(--accent);
    color: #fff;
}

.notify-skip {
    border: 1px solid var(--border-2);
    background: transparent;
    color: var(--text-2);
}
</style>
