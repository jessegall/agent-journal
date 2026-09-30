<script setup>
import {inject, nextTick, provide, ref, watch} from "vue";
import {phone} from "../api/phone.js";
import {usePoll} from "../poll.js";
import PhoneAgent from "./PhoneAgent.vue";
import PhoneCompose from "./PhoneCompose.vue";
import PhoneReader from "./PhoneReader.vue";
import PhoneTurn from "./PhoneTurn.vue";
import PhoneWaiting from "./PhoneWaiting.vue";
import {ended, flush, waitingToSend} from "./outbox.js";

const FEED_EVERY = 5000;
const READABLE = ["question", "report", "doc", "plan"];
defineProps({connection: {type: Object, required: true}});
const failed = inject("phoneFailed");
const feed = ref({items: [], waiting: [], agent: false});
const reading = ref("");
const about = ref("");
const list = ref(null);
const offline = ref(false);

async function asked() {
    try {
        const got = await phone.feed();
        offline.value = false;
        await flush();
        return got;
    } catch (error) {
        if (ended(error)) failed(error);
        else offline.value = true;
        return null;
    }
}

const refresh = usePoll("phone-feed", asked, FEED_EVERY, (got) => got && (feed.value = got));
provide("phoneRefresh", refresh);

watch(
    () => feed.value.items.length,
    () => nextTick(() => list.value && (list.value.scrollTop = list.value.scrollHeight))
);

function chipped(event) {
    const chip = event.target.closest("[data-peek]");
    if (!chip) return;
    event.preventDefault();
    event.stopPropagation();
    const target = chip.dataset.peek.split("@")[0];
    if (READABLE.includes(target.split(":")[0])) reading.value = target;
}

function reply(target) {
    about.value = target;
    reading.value = "";
}

function sent() {
    about.value = "";
    refresh();
}
</script>

<template>
    <header class="home-bar">
        <div class="home-names">
            <span class="home-title">Your journal</span>
            <span class="home-note">{{ connection.phone }}</span>
        </div>
        <PhoneAgent :running="feed.agent" />
    </header>
    <template v-if="offline">
        <p class="home-offline">Can't reach your computer right now. Trying again; what you write waits and sends then.</p>
    </template>
    <PhoneWaiting :waiting="feed.waiting" @open="(target) => (reading = target)" />
    <template v-if="reading">
        <PhoneReader :key="reading" :target="reading" @close="reading = ''" @reply="reply" />
    </template>
    <template v-else>
        <div ref="list" class="home-feed" @click.capture="chipped">
            <template v-for="item in feed.items" :key="item.type + item.n">
                <PhoneTurn :item="item" />
            </template>
            <template v-for="line in waitingToSend" :key="line.idempotency">
                <p class="home-held">{{ line.brief }}<span>Waiting to send</span></p>
            </template>
        </div>
        <PhoneCompose :about="about" @sent="sent" @unabout="about = ''" />
    </template>
</template>

<style scoped>
.home-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 12px 0;
}

.home-names {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.home-title {
    font-weight: 600;
    font-size: 16.5px;
}

.home-note {
    color: var(--text-3);
    font-size: 13px;
}

.home-offline {
    margin: 0 -16px;
    padding: 10px 16px;
    background: color-mix(in oklab, var(--tone-warn) 16%, transparent);
    color: var(--text);
    font-size: 14px;
    line-height: 1.4;
}

.home-held {
    align-self: flex-end;
    max-width: 88%;
    margin: 0;
    padding: 10px 12px;
    border: 1px dashed var(--border-3);
    border-radius: 12px;
    line-height: 1.5;
}

.home-held span {
    display: block;
    color: var(--text-3);
    font-size: 12.5px;
}

.home-feed {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
    padding: 12px 0;
    overflow-y: auto;
}
</style>
