<script setup>
import {computed} from "vue";
import GrowingCard from "./GrowingCard.vue";

// a message the agent sent another agent, one that failed to send with the reason, or one another agent sent it: a one-line card naming who, growing to the whole message on a click; only a failed send is red
const props = defineProps({data: {type: Object, default: () => ({})}, text: {type: String, default: ""}});
const failed = computed(() => Boolean(props.data.sent_to && props.data.failure));
const title = computed(() => {
    if (failed.value) return `Message not sent to ${props.data.sent_to}: ${props.data.failure}`;
    return props.data.sent_to ? `Message sent to ${props.data.sent_to}` : `Message from ${props.data.peer || "the main agent"}`;
});
</script>

<template>
    <GrowingCard :title="title" :text="text" :bad="failed" :icon="data.sent_to ? 'send' : 'reply'" :person="data.sent_to || data.peer || ''" :incoming="!data.sent_to" />
</template>
