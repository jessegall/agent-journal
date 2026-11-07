<script setup>
import {CloseButton, Icon, usePoll, useWindow} from "@journal/window-kit";
import ProcessQueueBand from "../../../../../viewer/src/resource/ProcessQueueBand.vue";

const emit = defineEmits(["close"]);
const view = useWindow();
const {data: queue, failure} = view.props.queue;
usePoll(() => view.reload("queue"), () => view.visible.value);
const elapsed = (row) => `${Math.round(row.waited_ms)} ms`;
</script>

<template>
    <aside class="inspector" data-request-queue>
        <header><Icon name="terminal" :size="13" /><h1>Request queue</h1><CloseButton title="Close the request queue" @click="emit('close')" /></header>
        <template v-if="failure"><p class="empty" role="alert">{{ failure }}</p></template>
        <template v-else-if="queue">
            <div class="limits">Hooks at once: {{ queue.hook_limit }} · Main agent wait: {{ queue.main_hook_seconds }} s · Other agent wait: {{ queue.agent_hook_seconds }} s · Viewer wait: {{ queue.viewer_wait_seconds }} s</div>
            <ProcessQueueBand icon="start" :count="queue.running.length">Running</ProcessQueueBand>
            <template v-if="!queue.running.length"><p class="empty" data-request-queue-empty>Nothing is running.</p></template>
            <template v-for="(row, index) in queue.running" :key="`running-${index}`"><div class="entry" data-request-queue-running><span>{{ row.sender }}<template v-if="row.priority"> · {{ row.priority }}</template></span><strong>{{ row.event }}</strong><span>{{ elapsed(row) }}</span></div></template>
            <ProcessQueueBand icon="clock" :count="queue.waiting.length">Waiting</ProcessQueueBand>
            <template v-if="!queue.waiting.length"><p class="empty">Nothing is waiting.</p></template>
            <template v-for="(row, index) in queue.waiting" :key="`waiting-${index}`"><div class="entry" data-request-queue-waiting><span>{{ row.sender }}<template v-if="row.priority"> · {{ row.priority }}</template></span><strong>{{ row.event }}</strong><span>{{ elapsed(row) }}</span></div></template>
        </template>
    </aside>
</template>

<style scoped>
.inspector { display: flex; flex-direction: column; min-height: 0; height: 100%; background: var(--bg); }
header { display: flex; align-items: center; gap: 8px; padding: 14px; border-bottom: 1px solid var(--border); }
header h1 { flex: 1; margin: 0; font-size: 14px; }
.limits, .empty { margin: 0; padding: 14px; color: var(--text-3); font-size: 12px; }
.entry { display: grid; grid-template-columns: 110px minmax(0, 1fr) 70px; gap: 8px; padding: 12px 14px; border-bottom: 1px solid var(--border); font-size: 12px; }
.entry strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
.entry span:last-child { text-align: right; font-variant-numeric: tabular-nums; }
</style>
