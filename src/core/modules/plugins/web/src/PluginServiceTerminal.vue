<script setup>
import {ref} from "vue";
import {OutputLines, usePoll, useWindow} from "@journal/window-kit";

// the latest output of one running plugin service in the viewer's output terminal, read again while it shows
const props = defineProps({plugin: {type: String, required: true}, service: {type: String, required: true}});
const LINES = 200;
const view = useWindow();
const lines = ref([]);
const failure = ref("");

async function load() {
    const answer = await view.read(`plugin service-log ${props.plugin} ${props.service} --lines ${LINES}`);
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) lines.value = String(answer.value.text ?? "").split("\n").filter(Boolean);
}

usePoll(load, () => true);
</script>

<template>
    <div class="service-terminal" data-plugin-service-terminal>
        <template v-if="failure">
            <p class="service-failure" role="alert">{{ failure }}</p>
        </template>
        <OutputLines :lines="lines" empty="No service output yet." />
    </div>
</template>

<style scoped>
.service-terminal {
    min-width: 0;
    margin: 4px 0 6px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-2);
}

.service-terminal :deep(.output-lines) {
    max-height: 220px;
    margin: 0;
    padding: 8px 10px;
    font-family: var(--mono, monospace);
    font-size: 11.5px;
    line-height: 1.45;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.service-failure {
    margin: 0;
    padding: 6px 10px;
    color: var(--danger);
    font-size: 12px;
}
</style>
