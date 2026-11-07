<script setup>
import {Icon, peekRef, RunningCommand} from "@journal/window-kit";
defineProps({waitReason: {type: String, required: true}, stopped: Boolean, command: {type: String, required: true}, note: {type: String, required: true}});
</script>
<template>
    <span class="agent-command" data-agent-command>
        <template v-if="waitReason"><button type="button" class="agent-waiting" data-agent-waiting title="Open the process queue" @click.stop="peekRef('test_queue:0')">Waiting: {{ waitReason }} <Icon name="arrow" :size="11" /></button></template>
        <template v-else-if="stopped"><span data-agent-stopped>Waiting</span></template>
        <template v-else><RunningCommand :text="command" :idle="note || 'thinking'" /></template>
    </span>
</template>
<style scoped>
.agent-command { display:flex; width:60%; min-width:0; overflow:hidden; color:var(--text-3); font-size:11px; contain:inline-size; }
.agent-waiting { padding:0; border:0; background:none; color:var(--accent-text); font:inherit; font-size:11.5px; cursor:pointer; }
.agent-waiting:hover { text-decoration:underline; }
</style>
