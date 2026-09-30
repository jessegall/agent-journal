<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import QrCode from "../kit/QrCode.vue";
import Segmented from "../kit/Segmented.vue";
import {checkTunnel, tunnelStatus} from "../composables/shares.js";
import {connectedPhones} from "../composables/phones.js";
import PhoneRow from "./PhoneRow.vue";
import TunnelProblem from "../resource/TunnelProblem.vue";

const emit = defineEmits(["close"]);
const DAYS = [
    {key: "1", label: "1 day"},
    {key: "7", label: "7 days"},
    {key: "30", label: "30 days"},
];
const CAN = [
    "Read the chat and see what needs you",
    "Answer questions",
    "Read reports, documents and plans",
    "Approve a plan or ask for changes",
    "Send the agent instructions",
];

const days = ref("7");
const made = ref(null);
const busy = ref(false);
const failure = ref("");
const stopping = ref(0);
const ready = computed(() => tunnelStatus.value && tunnelStatus.value.installed && tunnelStatus.value.logged_in);
const paired = computed(() => made.value && connectedPhones.value.find((phone) => phone.n === made.value.n));

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

async function disconnect(phones) {
    stopping.value = phones.length > 1 ? -1 : phones[0].n;
    try {
        for (const phone of phones) await api.disconnectPhone(phone.n);
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

watch(ready, (now) => now && !made.value && fresh());
onMounted(checkTunnel);
</script>

<template>
    <Dialog title="Connect your phone" small @close="emit('close')">
        <div class="phone-dialog">
            <template v-if="tunnelStatus && !ready">
                <TunnelProblem :status="tunnelStatus" @ready="checkTunnel" />
            </template>
            <template v-else-if="paired">
                <p class="phone-done">Connected: {{ paired.title }}. You can close this.</p>
                <Btn small @click="fresh">Connect another phone</Btn>
            </template>
            <template v-else>
                <div class="phone-code">
                    <template v-if="made">
                        <QrCode :text="made.link" :size="184" />
                    </template>
                    <template v-else>
                        <div class="phone-code-empty" />
                    </template>
                    <div class="phone-code-side">
                        <p class="phone-how">Scan this with your phone's camera. The code works once, for 10 minutes.</p>
                        <span class="phone-label">Stays connected for</span>
                        <Segmented :options="DAYS" :value="days" @pick="pick" />
                        <Btn small :busy="busy" @click="fresh">New code</Btn>
                        <template v-if="made">
                            <span class="phone-address">{{ made.address }}</span>
                        </template>
                    </div>
                </div>
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
                <p class="phone-cannot">It can't change settings, run commands or reach other environments. Everything it does is recorded as you.</p>
            </div>
            <template v-if="connectedPhones.length">
                <div class="phone-list">
                    <span class="phone-label">Connected phones</span>
                    <template v-for="phone in connectedPhones" :key="phone.n">
                        <PhoneRow :title="phone.title" :data="phone.data" :busy="stopping === phone.n" @disconnect="disconnect([phone])" />
                    </template>
                    <template v-if="connectedPhones.length > 1">
                        <Btn small :busy="stopping === -1" @click="disconnect(connectedPhones)">Disconnect all</Btn>
                    </template>
                </div>
            </template>
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
    width: 184px;
    height: 184px;
    border-radius: 10px;
    background: var(--raised);
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

.phone-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}
</style>
