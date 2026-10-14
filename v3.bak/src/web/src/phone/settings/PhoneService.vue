<script setup>
import {computed, ref} from "vue";
import {api} from "../../api/client.js";
import {usePoll} from "../../composables/poll.js";
import {ownerTitle, useServiceAction} from "../../composables/service.js";
import {runsAllowed, runsOff} from "../runs.js";
import {isRunning, stateWord} from "../../domain/services.js";
import {span} from "../../format/time.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import PhonePage from "./PhonePage.vue";
import PhoneTerm from "./PhoneTerm.vue";

const EVERY = 2000;
const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
const service = ref(null);
const log = ref("");
const look = usePoll(
    `phone-service-${props.target}`,
    () => api.services(),
    EVERY,
    (got) => (service.value = got.find((s) => s.id === props.target) || null)
);
usePoll(
    `phone-service-log-${props.target}`,
    () => api.serviceLog(props.target),
    EVERY,
    (got) => (log.value = got.log)
);
const {error, set, busy, working} = useServiceAction(() => look());
const goTo = (url) => window.open(url, "_blank");
const running = computed(() => isRunning(service.value));
const line = computed(() => {
    const s = service.value;
    if (!s) return "";
    const since = running.value && s.since ? ` · up ${span(Date.now() / 1000 - s.since)}` : "";
    return `${stateWord(s)}${since} · kept running by ${ownerTitle(s.plugin)}`;
});
</script>

<template>
    <PhonePage :title="service ? service.service : 'Service'" :line="line" :back="back" @back="emit('back')">
        <template v-if="service">
            <template v-if="error">
                <p class="service-error">{{ error }}</p>
            </template>
            <template v-if="service.why">
                <p class="service-why">{{ service.why }}</p>
            </template>
            <CellGroup :foot="runsOff">
                <template v-if="runsAllowed">
                    <Cell
                        :label="running ? (busy(service.id, 'down') ? 'Stopping…' : 'Stop') : busy(service.id, 'up') ? 'Starting…' : 'Start'"
                        :tone="running ? 'danger' : 'accent'"
                        :chevron="false"
                        @pick="working(service.id) || set(service.id, running ? 'down' : 'up')"
                    />
                    <Cell :label="busy(service.id, 'restart') ? 'Restarting…' : 'Restart'" :chevron="false" @pick="working(service.id) || set(service.id, 'restart')" />
                </template>
            </CellGroup>
            <template v-if="service.url">
                <CellGroup>
                    <Cell label="Open its address" :sub="service.url" icon="open" @pick="goTo(service.url)" />
                </CellGroup>
            </template>
            <h2 class="service-log-head">Service log</h2>
            <PhoneTerm :text="log || 'Nothing is logged yet.'" />
        </template>
    </PhonePage>
</template>

<style scoped>
.service-error {
    color: var(--danger);
}

.service-why {
    color: var(--text-2);
}

.service-log-head {
    margin: 22px 4px 7px;
    color: var(--text-3);
    font-size: 0.8125rem;
    font-weight: 600;
}
</style>
