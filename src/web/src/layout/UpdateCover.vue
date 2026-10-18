<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import CoverPanel from "./CoverPanel.vue";
import Toast from "../kit/Toast.vue";
import {api} from "../api/client.js";
import {report} from "../platform/faults.js";
import {useNow} from "../composables/now.js";
import {store} from "../state/store.js";
import {covered, followServer, forgetUpdate, locked, stepAt, updatedTo, updating} from "../state/updating.js";
import {go, route} from "../route.js";

const now = useNow();
const step = computed(() => updating.step || stepAt(Math.max(0, now.value - updating.since)));
const arrived = ref(null);
const countdown = computed(() => updating.countdown);
const left = computed(() => (countdown.value ? Math.max(0, Math.ceil(countdown.value.until - now.value)) : 0));
const countdownStep = computed(() =>
    countdown.value?.starting ? "Starting the update" : `Starts in ${left.value === 1 ? "1 second" : `${left.value} seconds`}`
);
const lockedTitle = computed(() => {
    const target = updating.version || updating.target;
    return target ? `Updating to ${target}` : "Updating the journal";
});

function showArrival(version) {
    const target = updatedTo();
    if (!target || !version) return;
    forgetUpdate();
    if (target === version) arrived.value = {text: `Updated to ${version}`, label: "See what changed", action: () => go("about")};
}

const reload = () => window.location.reload();

function cancel() {
    updating.countdown = null;
    api.cancelUpdate().catch((error) => report("threw", error.message, "POST /api/update/cancel"));
}

// The cover asks the server for itself while it is up, so it closes when the journal comes back even if the page's own
// polling has stopped: a request that fails is a round that found nothing, and the next one goes out all the same.
const ASK_EVERY_MS = 2000;
let asking = 0;

async function askTheServer() {
    try {
        const got = await api.summary();
        store.summary = got;
        followServer(got);
    } catch (error) {
        report("threw", error.message, "GET /summary while the update cover is up");
    }
}

function watchTheServer() {
    if (asking || !covered()) return;
    asking = window.setInterval(askTheServer, ASK_EVERY_MS);
}

function stopWatching() {
    window.clearInterval(asking);
    asking = 0;
}

onMounted(() => {
    showArrival(store.summary?.version);
    watchTheServer();
});
onUnmounted(stopWatching);
watch(() => store.summary?.version, showArrival);
watch(covered, (up) => (up ? watchTheServer() : stopWatching()));
</script>

<template>
    <template v-if="countdown && !locked()">
        <CoverPanel
            label="Updating the journal"
            :title="`Updating to ${countdown.version}`"
            :step="countdownStep"
            :spinning="countdown.starting"
        >
            <template v-if="!countdown.starting">
                <Btn small class="cancel" @click="cancel">Not now</Btn>
            </template>
        </CoverPanel>
    </template>
    <template v-else-if="locked()">
        <CoverPanel label="Updating the journal" :title="lockedTitle" :step="step" busy />
    </template>
    <template v-else-if="updating.starting">
        <CoverPanel
            label="The journal is starting"
            title="The journal is starting"
            :step="updating.bootStep || 'Starting the journal'"
            busy
        />
    </template>
    <template v-else-if="updating.late">
        <div class="late" role="status">
            <span>The update is taking longer than expected. It carries on in the background.</span>
            <Btn small kind="primary" @click="reload">Reload</Btn>
        </div>
    </template>
    <Toast :toast="arrived" @done="arrived = null">
        <Icon class="arrived" name="tick" :size="12" />
    </Toast>
</template>

<style scoped>
.cancel {
    margin-top: 10px;
}

.arrived {
    color: var(--tone-good);
}

.late {
    position: fixed;
    left: 50%;
    bottom: 20px;
    z-index: 70;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 12px 9px 14px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 13px;
    transform: translateX(-50%);
}
</style>
