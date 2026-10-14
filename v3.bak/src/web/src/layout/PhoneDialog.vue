<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import QrCode from "../kit/QrCode.vue";
import Segmented from "../kit/Segmented.vue";
import Spinner from "../kit/Spinner.vue";
import {usePoll} from "../composables/poll.js";
import {checkTunnel, tunnelStatus} from "../composables/shares.js";
import {connectedPhones} from "../composables/phones.js";
import {refresh} from "../sync/rows.js";
import PhoneRow from "./PhoneRow.vue";
import TunnelCause from "./TunnelCause.vue";
import TunnelProblem from "../pages/TunnelProblem.vue";

const emit = defineEmits(["close"]);
const DAYS = [
    {key: "1", label: "1 day"},
    {key: "7", label: "7 days"},
    {key: "30", label: "30 days"},
];
const CAN = [
    "Read the chat and see what needs you",
    "Answer questions",
    "Read reports, documents, plans and to-dos",
    "Approve a plan or ask for changes",
    "Send the agent instructions",
];

const ASK_EVERY = 1500;
const OPEN_WAIT = 10000;
const NOT_OPENED = "The secure connection did not open.";
const days = ref("7");
const made = ref(null);
const busy = ref(false);
const failure = ref("");
const stopping = ref(0);
const ready = computed(() => tunnelStatus.value && !tunnelStatus.value.problems.length);
const active = computed(() => connectedPhones.value[0] || null);
const reachable = ref(false);
const connected = computed(() => made.value && reachable.value);
const stalled = ref(false);
const cause = ref(null);
const paired = ref(false);
const showCause = computed(
    () => ready.value && !active.value && cause.value && !connected.value && (stalled.value || cause.value.cause === "host")
);

const askCause = async () => (cause.value = await api.tunnelCause().catch(() => null));
watch(stalled, (now) => now && askCause());

watch([made, reachable], ([code, up], _, onCleanup) => {
    stalled.value = false;
    if (!code || up) return;
    const timer = setTimeout(() => (stalled.value = true), OPEN_WAIT);
    onCleanup(() => clearTimeout(timer));
});

usePoll(
    "phone-tunnel",
    () => (made.value && !reachable.value ? api.tunnelAnswering() : null),
    ASK_EVERY,
    (got) => got && (reachable.value = Boolean(got.reachable))
);
usePoll("phone-tunnel-problems", () => (made.value && !reachable.value ? checkTunnel() : null), ASK_EVERY * 2);
usePoll("phone-paired", () => (made.value ? refresh(["phone"]) : null), ASK_EVERY);

async function fresh() {
    busy.value = true;
    failure.value = "";
    try {
        made.value = await api.connectPhone(Number(days.value));
    } catch (e) {
        failure.value = e.message;
    } finally {
        busy.value = false;
    }
}

async function stop(phone) {
    stopping.value = phone.n;
    failure.value = "";
    try {
        await api.disconnectPhone(phone.n);
    } catch (e) {
        failure.value = e.message;
    } finally {
        stopping.value = 0;
    }
}

function pick(key) {
    days.value = key;
    fresh();
}

const opened = ref(false);
watch(active, (phone) => {
    paired.value = Boolean(phone && made.value);
    made.value = null;
    opened.value = false;
});
watch(
    [ready, active],
    () => {
        if (!ready.value || active.value || opened.value) return;
        opened.value = true;
        fresh();
    },
    {immediate: true}
);
onMounted(() => {
    checkTunnel();
    askCause();
});
</script>

<template>
    <Dialog title="Connect your phone" small tall @close="emit('close')">
        <div class="phone-dialog">
            <template v-if="tunnelStatus && !ready">
                <TunnelProblem :status="tunnelStatus" @ready="checkTunnel" />
            </template>
            <template v-else-if="active">
                <div class="phone-active">
                    <span class="phone-label">{{ paired ? "Connected" : "Active session" }}</span>
                    <p class="phone-done">
                        {{
                            paired
                                ? "Your phone is connected. You can close this window."
                                : "One phone at a time: stop this session to connect another."
                        }}
                    </p>
                    <PhoneRow :title="active.title" :data="active.data" :busy="stopping === active.n" @disconnect="stop(active)" />
                </div>
            </template>
            <template v-else>
                <div class="phone-code">
                    <template v-if="connected">
                        <QrCode :text="made.link" :size="184" />
                    </template>
                    <template v-else>
                        <div class="phone-code-empty">
                            <template v-if="stalled">
                                <p class="phone-stalled">{{ NOT_OPENED }}</p>
                            </template>
                            <template v-else-if="made || busy">
                                <Spinner />
                                {{ made ? "Opening a secure connection" : "Making a code" }}
                            </template>
                        </div>
                    </template>
                    <div class="phone-code-side">
                        <p class="phone-how">Scan this with your phone's camera. The code can be used once and expires after 10 minutes.</p>
                        <span class="phone-label">Stays connected for</span>
                        <Segmented :options="DAYS" :value="days" @pick="pick" />
                        <Btn small :busy="busy" @click="fresh">New code</Btn>
                        <template v-if="connected">
                            <span class="phone-short-label">Or type this code in the home-screen app</span>
                            <span class="phone-short">{{ made.short }}</span>
                            <span class="phone-address">{{ made.address }}</span>
                        </template>
                    </div>
                </div>
            </template>
            <template v-if="showCause">
                <TunnelCause :cause="cause" @restarted="fresh" />
            </template>
            <template v-if="failure">
                <p class="phone-failure">{{ failure }}</p>
            </template>
            <div class="phone-can">
                <span class="phone-label">Your phone can</span>
                <ul>
                    <template v-for="line in CAN" :key="line">
                        <li>{{ line }}</li>
                    </template>
                </ul>
                <p class="phone-cannot">
                    It can't change settings, run commands or reach other environments. Everything it does is logged as done by you.
                </p>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.phone-dialog {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.phone-code {
    display: flex;
    gap: 18px;
    align-items: flex-start;
}

.phone-code > .qr,
.phone-code-empty {
    flex: none;
}

.phone-code-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 184px;
    height: 184px;
    border-radius: 10px;
    background: var(--raised);
    color: var(--text-3);
    font-size: 12.5px;
}

.phone-code-side {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

.phone-how,
.phone-done,
.phone-cannot {
    margin: 0;
    color: var(--text-2);
    line-height: 1.5;
}

.phone-label {
    color: var(--text-3);
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.02em;
}

.phone-address {
    color: var(--text-3);
    font-size: 12px;
    font-family: var(--mono);
    overflow-wrap: anywhere;
}

.phone-short-label {
    color: var(--text-3);
    font-size: 12px;
}

.phone-short {
    color: var(--text);
    font: 600 17px/1 var(--mono);
    letter-spacing: 0.1em;
}

.phone-failure {
    margin: 0;
    color: var(--danger);
}

.phone-can ul {
    margin: 6px 0 8px;
    padding-left: 18px;
    color: var(--text-2);
    line-height: 1.6;
}

.phone-active {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
