<script setup>
import {computed, onMounted, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import Spinner from "../kit/Spinner.vue";
import Toast from "../kit/Toast.vue";
import {api} from "../api/client.js";
import {report} from "../platform/faults.js";
import {useNow} from "../composables/now.js";
import {store} from "../state/store.js";
import {forgetUpdate, locked, stepAt, updatedTo, updating} from "../state/updating.js";
import {go, route} from "../route.js";

const now = useNow();
const step = computed(() => updating.step || stepAt(Math.max(0, now.value - updating.since)));
const arrived = ref(null);
const left = computed(() => (updating.countdown ? Math.max(0, Math.ceil(updating.countdown.until - now.value)) : 0));

function showArrival(version) {
    const target = updatedTo();
    if (!target || !version) return;
    forgetUpdate();
    if (target === version)
        arrived.value = {text: `Updated to ${version}`, label: "See what changed", action: () => go(route.value.env, "about")};
}

const reload = () => window.location.reload();

function cancel() {
    updating.countdown = null;
    api.cancelUpdate().catch((error) => report("threw", error.message, "POST /api/update/cancel"));
}

onMounted(() => showArrival(store.summary?.version));
watch(() => store.summary?.version, showArrival);
</script>

<template>
    <template v-if="updating.countdown && !locked()">
        <div class="cover" role="alertdialog" aria-live="polite" aria-label="Updating the journal">
            <div class="panel">
                <p class="title">Updating to {{ updating.countdown.version }}</p>
                <template v-if="updating.countdown.starting">
                    <Spinner :size="22" class="spin" />
                    <p class="step">Starting the update</p>
                </template>
                <template v-else>
                    <p class="step">Starts in {{ left === 1 ? "1 second" : `${left} seconds` }}</p>
                    <Btn small class="cancel" @click="cancel">Cancel</Btn>
                </template>
            </div>
        </div>
    </template>
    <template v-else-if="locked()">
        <div class="cover" role="alertdialog" aria-live="polite" aria-label="Updating the journal" aria-busy="true">
            <div class="panel">
                <Spinner :size="22" class="spin" />
                <p class="title">
                    {{
                        updating.version || updating.target ? `Updating to ${updating.version || updating.target}` : "Updating the journal"
                    }}
                </p>
                <p class="step">{{ step }}</p>
            </div>
        </div>
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
.cover {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--bg) 55%, transparent);
    backdrop-filter: blur(6px);
    box-shadow: inset 0 0 120px color-mix(in srgb, var(--accent) 22%, transparent);
    cursor: progress;
}

.panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    min-width: 260px;
    padding: 22px 28px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    box-shadow: var(--tip-shadow);
    text-align: center;
}

.cancel {
    margin-top: 10px;
}

.spin {
    margin-bottom: 6px;
    color: var(--accent-text);
}

.title {
    margin: 0;
    color: var(--text);
    font-size: 14px;
    font-weight: 600;
}

.step {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
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
