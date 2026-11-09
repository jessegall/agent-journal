<script setup>
import {computed, ref} from "vue";
import {Btn, OutputLines, usePoll, useWindow} from "@journal/window-kit";

// the latest output of one plugin service, read again while it shows and filling its dialog under a bar that says whether the service runs and stops, starts or restarts it
const props = defineProps({plugin: {type: String, required: true}, service: {type: Object, required: true}});
const LINES = 200;
const view = useWindow();
const lines = ref([]);
const failure = ref("");
const refusal = ref("");
const state = computed(() => (props.service.running ? `Running, process ${props.service.pid}` : "Stopped"));

async function load() {
    const answer = await view.read(`plugin service-log ${props.plugin} ${props.service.service} --lines ${LINES}`);
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) lines.value = String(answer.value.text ?? "").split("\n").filter(Boolean);
}

async function change(action) {
    const answer = await view.run(["plugin", "service", action, props.plugin, props.service.service]);
    refusal.value = answer.ok ? "" : answer.error;
    await Promise.all([view.reload("services"), load()]);
}

usePoll(load, () => true);
</script>

<template>
    <div class="service-terminal" data-plugin-service-terminal>
        <div class="service-bar" data-plugin-service-bar>
            <span class="service-state">{{ state }}</span>
            <template v-if="service.running">
                <Btn small data-plugin-service-action="stop" @click="change('stop')">Stop</Btn>
                <Btn small data-plugin-service-action="restart" @click="change('restart')">Restart</Btn>
            </template>
            <template v-else>
                <Btn small data-plugin-service-action="start" @click="change('start')">Start</Btn>
            </template>
        </div>
        <template v-if="refusal || failure">
            <p class="service-failure" role="alert">{{ refusal || failure }}</p>
        </template>
        <OutputLines :lines="lines" empty="No service output yet." />
    </div>
</template>

<style scoped>
.service-terminal {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    background: var(--bg-2);
}

.service-bar {
    flex: none;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    background: var(--raised);
}

.service-state {
    flex: 1;
    min-width: 0;
    color: var(--text-3);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
}

.service-terminal :deep(.output-lines) {
    flex: 1;
    min-height: 0;
    margin: 0;
    padding: 8px 12px;
    font-family: var(--mono, monospace);
    font-size: 11.5px;
    line-height: 1.45;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.service-failure {
    flex: none;
    margin: 0;
    padding: 6px 12px;
    color: var(--danger);
    font-size: 12px;
}
</style>
