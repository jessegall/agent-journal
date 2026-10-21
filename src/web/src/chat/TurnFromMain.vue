<script setup>
import {computed} from "vue";
import BubbleHeader from "../kit/BubbleHeader.vue";
import {clock} from "../format/time.js";

// Whose message it is, from the turn's data: another agent's, one the agent sent another, one that failed to send with the reason, or the main agent's to a subagent.
const props = defineProps({time: {type: Number, default: 0}, data: {type: Object, default: () => ({})}});
const failed = computed(() => Boolean(props.data.sent_to && props.data.failure));
const said = computed(() => {
    if (failed.value) return `Failed to send to ${props.data.sent_to}: ${props.data.failure}`;
    return props.data.sent_to ? `Sent to ${props.data.sent_to}` : `Message from ${props.data.peer || "the main agent"}`;
});
const label = computed(() => `${said.value} · ${clock(props.time)}`);
</script>

<template>
    <BubbleHeader icon="agents" :label="label" :tone="failed ? 'danger' : 'agent'" small />
</template>
