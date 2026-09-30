<script setup>
import {onMounted, onUnmounted, provide, ref} from "vue";
import {phone, PhoneError} from "../api/phone.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import Spinner from "../kit/Spinner.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {deviceName} from "./device.js";
import PhoneHome from "./PhoneHome.vue";
import {ended, forget} from "./outbox.js";
import {useScreenFill} from "./fill.js";
import {wanted} from "./wanted.js";

const OPEN = "open=";

const STATES = {401: "unknown", 410: "ended"};
const RETRY_EVERY = 10000;

const state = ref("loading");
const told = ref("");
const connection = ref(null);
const typed = ref("");
const pairing = ref(false);

function failed(error) {
    if (ended(error)) forget();
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
useScreenFill();
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
                    <EmptyState title="This phone is no longer connected">{{ told }}. Scan a new code from your computer to connect again.</EmptyState>
                </div>
            </template>
            <template #unknown>
                <div class="phone-centre">
                    <EmptyState title="Connect this phone">
                        On your computer, open the journal and press the phone button in the top bar. Scan the code, or type the short code under it here.
                    </EmptyState>
                    <form class="phone-typed" @submit.prevent="pairTyped">
                        <input v-model="typed" class="phone-code-box" autocomplete="one-time-code" autocapitalize="characters" placeholder="ABCD-EFGH" />
                        <Btn kind="primary" large :busy="pairing" @click="pairTyped">Connect</Btn>
                        <template v-if="told && pairing === false && typed">
                            <p class="phone-typed-told">{{ told }}</p>
                        </template>
                    </form>
                </div>
            </template>
            <template #unreachable>
                <div class="phone-centre">
                    <EmptyState title="Can't reach your computer right now">It may be asleep or offline. Trying again every few seconds.</EmptyState>
                    <Btn large @click="load">Try again</Btn>
                </div>
            </template>
        </SwitchCase>
    </main>
</template>
