<script setup>
import {CloseButton, ExecutionLanes, Icon, usePoll, useWindow} from "@journal/window-kit";

// every lane of the journal beside the request log: what runs and waits in each and why
const emit = defineEmits(["close"]);
const view = useWindow();
const {data: queue, failure} = view.props.queue;
usePoll(() => view.reload("queue"), () => view.visible.value);
</script>

<template>
    <aside class="inspector" data-executions>
        <header><Icon name="terminal" :size="13" /><h1>Executions</h1><CloseButton title="Close the executions" @click="emit('close')" /></header>
        <template v-if="failure"><p class="empty" role="alert">{{ failure }}</p></template>
        <template v-else-if="queue">
            <template v-if="queue.halted"><p class="empty" data-executions-halted>The long lane is halted: {{ queue.halt_reason }}</p></template>
            <ExecutionLanes :execution="queue.execution" />
        </template>
    </aside>
</template>

<style scoped>
.inspector { display: flex; flex-direction: column; min-height: 0; height: 100%; overflow-y: auto; background: var(--bg); }
header { display: flex; align-items: center; gap: 8px; padding: 14px; border-bottom: 1px solid var(--border); }
header h1 { flex: 1; margin: 0; font-size: 14px; }
.empty { margin: 0; padding: 14px; color: var(--text-3); font-size: 12px; }
</style>
