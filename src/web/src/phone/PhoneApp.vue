<script setup>
import {onMounted, ref} from "vue";
import {phone, PhoneError} from "../api/phone.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import Spinner from "../kit/Spinner.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {deviceName} from "./device.js";

const STATES = {401: "unknown", 410: "ended"};

const state = ref("loading");
const told = ref("");
const connection = ref(null);
const words = ref("");
const sending = ref(false);
const sent = ref([]);

function failed(error) {
    state.value = error instanceof PhoneError ? STATES[error.status] || "unreachable" : "unreachable";
    told.value = error.message;
}

async function connect() {
    const code = location.hash.slice(1);
    if (!code) return;
    history.replaceState(null, "", location.pathname);
    await phone.pair(code, deviceName());
}

async function load() {
    try {
        await connect();
        connection.value = await phone.state();
        state.value = "connected";
    } catch (error) {
        failed(error);
    }
}

async function send() {
    const text = words.value.trim();
    if (!text || sending.value) return;
    sending.value = true;
    try {
        await phone.say(text, crypto.randomUUID());
        sent.value = [{text, at: Date.now()}, ...sent.value];
        words.value = "";
    } catch (error) {
        failed(error);
    } finally {
        sending.value = false;
    }
}

onMounted(load);
</script>

<template>
    <main class="phone">
        <SwitchCase :value="state">
            <template #loading>
                <div class="phone-centre"><Spinner /></div>
            </template>
            <template #connected>
                <header class="phone-bar">
                    <span class="phone-title">Your journal</span>
                    <span class="phone-note">{{ connection.phone }}, until {{ new Date(connection.expires * 1000).toLocaleDateString() }}</span>
                </header>
                <section class="phone-sent">
                    <template v-for="line in sent" :key="line.at">
                        <p class="phone-line">{{ line.text }}<span class="phone-note">Sent to the agent</span></p>
                    </template>
                </section>
                <form class="phone-compose" @submit.prevent="send">
                    <textarea v-model="words" class="phone-words" rows="3" placeholder="Tell the agent what to do next" />
                    <Btn kind="primary" large :busy="sending" @click="send">Send to the agent</Btn>
                </form>
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
                    <EmptyState title="Can't reach your computer right now">{{ told }}. It may be asleep or offline.</EmptyState>
                    <Btn large @click="load">Try again</Btn>
                </div>
            </template>
        </SwitchCase>
    </main>
</template>
