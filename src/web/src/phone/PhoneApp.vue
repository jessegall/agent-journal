<script setup>
import {computed, onMounted, onUnmounted, provide, ref} from "vue";
import {phone, PhoneError} from "../api/phone.js";
import Btn from "../kit/Btn.vue";
import Spinner from "../kit/Spinner.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {deviceName} from "./device.js";
import PhoneHome from "./PhoneHome.vue";
import {waitingActions, waitingToSend} from "./outbox.js";
import {wanted} from "./wanted.js";

const OPEN = "open=";

const STATES = {401: "unknown", 410: "ended"};
const RETRY_EVERY = 10000;

const state = ref("loading");
const told = ref("");
const connection = ref(null);
const typed = ref("");
const pairing = ref(false);
const waiting = computed(() => waitingToSend.value.length + waitingActions.value.length);
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
    history.replaceState(null, "", location.pathname);
    await phone.pair(code, deviceName());
}

async function load() {
    state.value = "loading";
    try {
        await connect();
        connection.value = await phone.state();
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

const retry = setInterval(() => state.value === "unreachable" && !document.hidden && load(), RETRY_EVERY);

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

const pressable = () => {};
const heard = (event) => event.data?.open && (wanted.value = event.data.open);
onMounted(() => {
    document.addEventListener("touchstart", pressable, {passive: true});
    navigator.serviceWorker?.addEventListener("message", heard);
    navigator.serviceWorker?.register("./sw.js", {scope: "./"}).catch(() => {});
    load();
});
onUnmounted(() => {
    clearInterval(retry);
    document.removeEventListener("touchstart", pressable);
    navigator.serviceWorker?.removeEventListener("message", heard);
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
                        <template v-if="waiting">{{ waiting === 1 ? "1 thing waits" : `${waiting} things wait` }} to send and goes once you are back.</template>
                    </p>
                </div>
            </template>
            <template #unknown>
                <div class="phone-centre">
                    <template v-if="dropped">
                        <h1 class="phone-title">This phone was disconnected</h1>
                        <p class="phone-words">
                            Pair it again to keep going: on your computer, press the phone button in the top bar, then scan the code or type it here.
                            <template v-if="waiting">{{ waiting === 1 ? "1 thing waits" : `${waiting} things wait` }} to send and goes once you are back.</template>
                        </p>
                    </template>
                    <template v-else>
                        <h1 class="phone-title">Connect this phone</h1>
                        <p class="phone-words">On your computer, open the journal and press the phone button in the top bar. Scan the code, or type the short code under it here.</p>
                    </template>
                    <form class="phone-typed" @submit.prevent="pairTyped">
                        <label class="phone-hidden" for="phone-code">Pairing code</label>
                        <input id="phone-code" v-model="typed" class="phone-code-box" autocomplete="one-time-code" autocapitalize="characters" placeholder="ABCD-EFGH" />
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
    </main>
</template>
