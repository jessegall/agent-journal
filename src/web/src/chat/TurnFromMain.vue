<script setup>
import {computed} from "vue";
import BubbleHeader from "../kit/BubbleHeader.vue";
import {clock} from "../format/time.js";

// Whose message it is, from the turn's data: another agent's, one the agent sent another, or the main agent's to a subagent.
const props = defineProps({at: {type: Number, default: 0}, data: {type: Object, default: () => ({})}});
const said = computed(() => (props.data.sent_to ? `Sent to ${props.data.sent_to}` : `Message from ${props.data.peer || "the main agent"}`));
const label = computed(() => `${said.value} · ${clock(props.at)}`);
</script>

<template>
    <BubbleHeader icon="agents" :label="label" tone="agent" small />
</template>
