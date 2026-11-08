<script setup>
import {computed, ref} from "vue";
import {Btn, WindowRoom, usePoll, useWindow} from "@journal/window-kit";

const POLL_MILLISECONDS = 3000;

const view = useWindow();
const {data: value, failure} = view.props.tools;
const tools = computed(() => value.value?.tools ?? []);
const busy = ref("");
const failed = ref({name: "", text: ""});
const readOnly = computed(() => view.face === "phone" || view.readOnly === true);
const anyRunning = computed(() => tools.value.some((tool) => tool.is_running));
usePoll(() => anyRunning.value && view.reload("tools"), () => anyRunning.value, POLL_MILLISECONDS);

async function act(tool, words) {
    busy.value = tool.name;
    failed.value = {name: "", text: ""};
    try {
        const reply = await view.run(words);
        failed.value = {name: tool.name, text: reply.ok ? "" : reply.error};
        await view.reload("tools");
    } finally {
        busy.value = "";
    }
}

const refreshed = (tool) => tool.refreshed_at ? `Last refresh ${new Date(tool.refreshed_at).toLocaleString()}` : "Never refreshed";
const status = (tool) => {
    if (tool.is_running) return "Refreshing";
    if (tool.is_failed) return "The last refresh failed";
    return tool.is_on ? "On" : "Off";
};
</script>

<template>
    <WindowRoom>
        <p v-if="failure" class="failure" data-tools-failure>{{ failure }}</p>
        <article v-for="tool in tools" :key="tool.name" class="tool" :data-tool="tool.name">
            <div class="head">
                <span class="title">{{ tool.title }}</span>
                <span class="state" data-tool-state>{{ status(tool) }}</span>
            </div>
            <p class="detail">{{ tool.description }}</p>
            <p class="detail" data-tool-installed>{{ tool.is_installed ? "Installed" : "Not installed" }}</p>
            <p class="detail" data-tool-refreshed>{{ refreshed(tool) }}</p>
            <div class="actions">
                <Btn v-if="!tool.is_installed" bordered :disabled="readOnly || busy !== ''" data-tool-install @click="act(tool, ['tool', 'install', tool.name])">Install</Btn>
                <Btn bordered :disabled="readOnly || busy !== ''" data-tool-switch @click="act(tool, ['tool', tool.is_on ? 'off' : 'on', tool.name])">{{ tool.is_on ? "Turn off" : "Turn on" }}</Btn>
                <Btn bordered :disabled="readOnly || busy !== '' || !tool.is_installed || tool.is_running" data-tool-refresh @click="act(tool, ['tool', 'refresh', tool.name])">Refresh now</Btn>
            </div>
            <p v-if="failed.name === tool.name && failed.text" class="failure" data-tool-failure>{{ failed.text }}</p>
        </article>
    </WindowRoom>
</template>

<style scoped>
.tool {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
    padding: 12px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    font-size: 13px;
}

.head {
    display: flex;
    align-items: baseline;
    gap: 10px;
}

.title {
    flex: 1;
    font-weight: 600;
}

.state,
.detail {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.actions {
    display: flex;
    gap: 8px;
}

.failure {
    margin: 0;
    color: var(--bad, var(--text-2));
    font-size: 12px;
}
</style>
