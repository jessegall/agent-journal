<script setup>
import {ref} from "vue";
import {readSession} from "../windows/startup.js";
import {fetchWindowCatalogue} from "../windows/windowCatalogue.js";
import {WindowSubscriptions} from "../windows/windowSubscriptions.js";
import {lineResult} from "../windows/windowContext.js";
import ShareFace from "../windows/ShareFace.vue";

const WINDOWS = {plan: "plans.plans"};
const session = ref(null);
const entry = ref(null);
const subscriptions = new WindowSubscriptions();

async function open() {
    const answer = await readSession();
    if (answer.type !== "share") return;
    session.value = answer;
    const offers = await fetchWindowCatalogue(answer.share.environment);
    entry.value = offers.windows.find((window) => window.name === WINDOWS[answer.share.row_model]) ?? null;
}

open();

const read = (window, line, environment) => lineResult(window, line, environment);
</script>

<template>
    <ShareFace :session="session" :read="read" :subscriptions="subscriptions" :entry="entry" />
</template>
