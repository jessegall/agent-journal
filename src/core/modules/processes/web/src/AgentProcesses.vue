<script setup>
import {ProcessQueueBody, useWindow} from "@journal/window-kit";

// one agent's runs that went to the process queue, running and waiting first, then the finished, drawn with the queue's own list
defineProps({agent: {type: Number, required: true}});
const view = useWindow();
</script>

<template>
    <ProcessQueueBody :read="view.read" :agent="agent" data-agent-processes />
</template>
