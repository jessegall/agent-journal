<script setup>
import {WindowSubscriptions} from "../windows/windowSubscriptions.js";
import {lineResult} from "../windows/windowContext.js";
import ShareFace from "../windows/ShareFace.vue";

defineProps({session: {type: Object, required: true}});
const subscriptions = new WindowSubscriptions();

const read = (window, line, environment) => lineResult(window, line, environment);
</script>

<template>
    <ShareFace :session="session" :read="read" :subscriptions="subscriptions" :entry="session.share.window" />
</template>
