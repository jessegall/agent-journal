<script setup>
import {onMounted, ref} from "vue";
import Button from "./kit/Button.vue";
import {pushPossible as possible, subscribed} from "./push.js";

const SKIPPED = "phone-notify-skipped";
const asking = ref(false);
const offered = ref(false);
const told = ref("");

function remembered() {
    try {
        return Boolean(localStorage.getItem(SKIPPED));
    } catch (error) {
        return false;
    }
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
        offered.value = false;
    } catch (error) {
        told.value = error.message;
    } finally {
        asking.value = false;
    }
}

function skip() {
    offered.value = false;
    try {
        localStorage.setItem(SKIPPED, "1");
    } catch (error) {
        return;
    }
}

onMounted(() => {
    if (!possible) return;
    if (Notification.permission === "granted") subscribed().catch(() => {});
    else offered.value = Notification.permission === "default" && !remembered();
});
</script>

<template>
    <template v-if="offered">
        <div class="notify">
            <p class="notify-words">Get a notification when the agent needs you, even with the app closed.</p>
            <div class="notify-actions">
                <Button :disabled="asking" @click="turnOn">Turn on notifications</Button>
                <Button kind="plain" @click="skip">Not now</Button>
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

</style>
