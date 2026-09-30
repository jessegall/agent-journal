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

const STATES = {401: "unknown", 410: "ended"};
const RETRY_EVERY = 10000;

const state = ref("loading");
const told = ref("");
const connection = ref(null);

function failed(error) {
    if (ended(error)) forget();
    state.value = error instanceof PhoneError ? STATES[error.status] || "unreachable" : "unreachable";
    told.value = error.message;
}

provide("phoneFailed", failed);

async function connect() {
    const code = location.hash.slice(1);
    if (!code) return;
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

const retry = setInterval(() => state.value === "unreachable" && !document.hidden && load(), RETRY_EVERY);

onMounted(load);
onUnmounted(() => clearInterval(retry));
</script>

<template>
    <main class="phone">
        <SwitchCase :value="state">
            <template #loading>
                <div class="phone-centre"><Spinner /></div>
            </template>
            <template #connected>
                <PhoneHome :connection="connection" />
            </template>
            <template #ended>
                <div class="phone-centre">
                    <EmptyState title="This phone is no longer connected">{{ told }}. Scan a new code from your computer to connect again.</EmptyState>
                </div>
            </template>
            <template #unknown>
                <div class="phone-centre">
                    <EmptyState title="Connect this phone">On your computer, open the journal, press the phone button in the top bar, and scan the code.</EmptyState>
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
