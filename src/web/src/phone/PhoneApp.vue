<script setup>
import {computed, onMounted, onUnmounted, provide, ref, watch} from "vue";
import {loadViewerSettings} from "../composables/colorScheme.js";
import {api} from "../api/client.js";
import {phone, PhoneError} from "../api/phone.js";
import {transport} from "../api/transport.js";
import Btn from "../kit/Btn.vue";
import Spinner from "../kit/Spinner.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {deviceName} from "./device.js";
import PhoneHome from "./PhoneHome.vue";
import {waitingActions, waitingToSend} from "./outbox.js";
import {wanted} from "./wanted.js";
import {useKeyboard} from "./keyboard.js";
import {usePoll} from "../composables/poll.js";
import {runsAllowed} from "./runs.js";
import PhoneUnlockSheet from "./PhoneUnlockSheet.vue";
import {asking, enrolled, unlockable, unlocked} from "./unlock.js";
import {store} from "../state/store.js";

const OPEN = "open=";
const BASE = "/p";

const STATES = {401: "unknown", 410: "ended"};
const RETRY_EVERY = 10000;

const state = ref("loading");
const told = ref("");
const connection = ref(null);
const typed = ref("");
const pairing = ref(false);
const waiting = computed(() => waitingToSend.value.filter((line) => !line.lost).length + waitingActions.value.length);
const waitsLine = computed(() => {
    if (!waiting.value) return "";
    return waiting.value === 1
        ? "1 thing waits to send and goes once you are back."
        : `${waiting.value} things wait to send and go once you are back.`;
});
transport.carry({"X-Phone": "1"});
transport.unlockWith(unlocked);
watch(
    connection,
    (now) => {
        if (!now) return;
        api.point(BASE, () => now.environment);
        loadViewerSettings();
    },
    {flush: "sync"}
);
watch(connection, async (now) => {
    enrolled.value = Boolean(now?.passkey);
    runsAllowed.value = Boolean(now) && (await unlockable());
});

const dropped = computed(() => Boolean(connection.value) || waiting.value > 0);

function failed(error) {
    state.value = error instanceof PhoneError ? STATES[error.status] || "unreachable" : "unreachable";
    told.value = error.message;
}

provide("phoneFailed", failed);

async function connect() {
    const code = location.hash.slice(1);
    if (!code) return;
    if (code.startsWith(OPEN)) {
        history.replaceState(null, "", location.pathname);
        wanted.value = decodeURIComponent(code.slice(OPEN.length));
        return;
    }
    await phone.pair(code, deviceName());
    history.replaceState(null, "", location.pathname);
}

async function load() {
    try {
        await connect();
        connection.value = await phone.state();
        store.spec = await api.manifest();
        state.value = "connected";
    } catch (error) {
        failed(error);
    }
}

async function reconnect() {
    history.replaceState(null, "", location.pathname);
    try {
        connection.value = await phone.state();
    } catch (error) {
        failed(error);
    }
}

usePoll("phone-retry", load, RETRY_EVERY, undefined, () => state.value === "unreachable");

async function pairTyped() {
    pairing.value = true;
    try {
        await phone.pair(typed.value.trim(), deviceName());
        typed.value = "";
        await load();
    } catch (error) {
        told.value = error.message;
    } finally {
        pairing.value = false;
    }
}

useKeyboard();
const typing = () => document.activeElement?.matches?.("textarea, input, [contenteditable]");
const pinned = () => !typing() && (window.scrollX || window.scrollY) && window.scrollTo(0, 0);
const released = () => setTimeout(pinned, 300);
const serviceMessage = (event) => event.data?.open && (wanted.value = event.data.open);
onMounted(() => {
    window.addEventListener("scroll", pinned, {passive: true});
    document.addEventListener("focusout", released);
    navigator.serviceWorker?.addEventListener("message", serviceMessage);
    navigator.serviceWorker?.register("./sw.js", {scope: "./"}).catch(() => {});
    load();
});
onUnmounted(() => {
    window.removeEventListener("scroll", pinned);
    document.removeEventListener("focusout", released);
    navigator.serviceWorker?.removeEventListener("message", serviceMessage);
});
</script>

<template>
    <main class="phone">
        <SwitchCase :value="state">
            <template #loading>
                <div class="phone-centre"><Spinner /></div>
            </template>
            <template #connected>
                <PhoneHome :key="connection.project + connection.environment" :connection="connection" @moved="reconnect" />
            </template>
            <template #ended>
                <div class="phone-centre">
                    <h1 class="phone-title">This phone is no longer connected</h1>
                    <p class="phone-words">
                        {{ told }}. Scan a new code from your computer to connect again.
                        {{ waitsLine }}
                    </p>
                </div>
            </template>
            <template #unknown>
                <div class="phone-centre">
                    <template v-if="dropped">
                        <h1 class="phone-title">This phone was disconnected</h1>
                        <p class="phone-words">
                            Pair it again to keep going: on your computer, press the phone button in the top bar, then scan the code or type
                            it here.
                            {{ waitsLine }}
                        </p>
                    </template>
                    <template v-else>
                        <h1 class="phone-title">Connect this phone</h1>
                        <p class="phone-words">
                            On your computer, open the journal and press the phone button in the top bar. Scan the code, or type the short
                            code under it here.
                        </p>
                    </template>
                    <form class="phone-typed" @submit.prevent="pairTyped">
                        <label class="phone-hidden" for="phone-code">Pairing code</label>
                        <input
                            id="phone-code"
                            v-model="typed"
                            class="phone-code-box"
                            autocomplete="one-time-code"
                            autocapitalize="characters"
                            placeholder="ABCD-EFGH"
                        />
                        <Btn kind="primary" large :busy="pairing" @click="pairTyped">Connect</Btn>
                        <template v-if="told && pairing === false && typed">
                            <p class="phone-typed-told">{{ told }}</p>
                        </template>
                    </form>
                </div>
            </template>
            <template #unreachable>
                <div class="phone-centre">
                    <h1 class="phone-title">Can't reach your computer right now</h1>
                    <p class="phone-words">It may be asleep or offline. Trying again every few seconds.</p>
                    <Btn large @click="load">Try again</Btn>
                </div>
            </template>
        </SwitchCase>
        <template v-if="asking">
            <PhoneUnlockSheet />
        </template>
    </main>
</template>
