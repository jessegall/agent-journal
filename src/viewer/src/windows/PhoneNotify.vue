<script setup>
import {onMounted, ref} from "vue";

// offers a phone notices once, on a tap: it asks for permission, subscribes with the journal's public key and hands the subscription to the journal
const ASKED = "journal.notices-asked";
const offered = ref(false);
let registration = null;

function keyBytes(text) {
    const padded = text.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(text.length / 4) * 4, "=");
    return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function canOffer() {
    if (!("serviceWorker" in navigator) || typeof Notification === "undefined" || Notification.permission !== "default" || localStorage.getItem(ASKED)) return false;
    registration = await navigator.serviceWorker.ready;
    return Boolean(registration.pushManager);
}

async function subscribe() {
    const key = (await (await fetch("/api/push")).json()).public_key;
    const subscription = await registration.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: keyBytes(key)});
    await fetch("/api/push", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(subscription.toJSON())});
}

async function accept() {
    localStorage.setItem(ASKED, "yes");
    offered.value = false;
    if ((await Notification.requestPermission()) === "granted") await subscribe();
}

onMounted(async () => (offered.value = await canOffer()));
</script>

<template>
    <template v-if="offered">
        <button type="button" class="phone-notify" @click="accept">Get notices when something waits for you</button>
    </template>
</template>

<style scoped>
.phone-notify {
    margin: 6px 8px;
    min-height: 44px;
    border: 1px solid var(--line);
    border-radius: 6px;
    color: var(--text);
    background: var(--bg-2);
    font-size: 13px;
}
</style>
