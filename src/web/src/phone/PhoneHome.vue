<script setup>
import {inject, nextTick, onMounted, onUnmounted, provide, ref, watch} from "vue";
import {phone} from "../api/phone.js";
import {usePoll} from "../poll.js";
import PhoneAgent from "./PhoneAgent.vue";
import PhoneCompose from "./PhoneCompose.vue";
import PhoneHold from "./PhoneHold.vue";
import {plain} from "./plain.js";
import PhoneReader from "./PhoneReader.vue";
import PhonePlaces from "./PhonePlaces.vue";
import PhoneNotify from "./PhoneNotify.vue";
import Icon from "../kit/Icon.vue";
import {peeked} from "./peeked.js";
import PhoneStatus from "./PhoneStatus.vue";
import PhoneTurn from "./PhoneTurn.vue";
import PhoneWaiting from "./PhoneWaiting.vue";
import {ended, flush, justSent, settle, waitingToSend} from "./outbox.js";
import {clock} from "../format/time.js";
import ReadTicks from "../kit/ReadTicks.vue";

const FEED_EVERY = 5000;
const NEAR_BOTTOM = 120;
const MOVING = 800;
const SENDING = {completed: 0, seen: [], data: {}};
defineProps({connection: {type: Object, required: true}});
const failed = inject("phoneFailed");
const feed = ref({items: [], waiting: [], agent: false});
const emit = defineEmits(["moved"]);
const picking = ref(false);
const reading = ref("");
const trail = ref([]);
const about = ref("");
const quote = ref("");
const held = ref(null);
const list = ref(null);
const compose = ref(null);
const draft = ref("");
const offline = ref(false);
const current = ref(false);
const returned = () => !document.hidden && (current.value = false);
const LOADED = (document.querySelector('script[src*="phone-"]')?.src || "").split("/").pop();
const newer = ref(false);
const reload = () => window.location.reload();

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

let movedAt = 0;
const still = () => Date.now() - movedAt > MOVING;
const moved = () => (movedAt = Date.now());
const nearBottom = () => !list.value || list.value.scrollHeight - list.value.clientHeight - list.value.scrollTop < NEAR_BOTTOM;

const refresh = usePoll("phone-feed", asked, FEED_EVERY, (got) => {
    if (!got) return;
    const following = nearBottom() && still();
    feed.value = got;
    current.value = true;
    navigator.setAppBadge?.(got.waiting.length).catch(() => {});
    newer.value = Boolean(got.build && LOADED && got.build !== LOADED);
    settle(got.items);
    if (following) toBottom();
});
provide("phoneRefresh", refresh);

let kept = -1;
const toBottom = () => nextTick(() => list.value && (list.value.scrollTop = list.value.scrollHeight));
const restored = () => nextTick(() => list.value && (list.value.scrollTop = kept));
watch(list, (el) => el && (kept < 0 ? toBottom() : restored()));

function shown(stack) {
    trail.value = stack.slice(0, -1);
    reading.value = stack.at(-1) || "";
}

function open(target) {
    if (!reading.value) kept = list.value ? list.value.scrollTop : -1;
    const stack = [...trail.value, ...(reading.value ? [reading.value] : []), target];
    history.pushState({reading: stack}, "");
    shown(stack);
}

const back = () => history.back();
const popped = (event) => shown(event.state?.reading || []);

onMounted(() => {
    window.addEventListener("popstate", popped);
    document.addEventListener("visibilitychange", returned);
});
onUnmounted(() => {
    window.removeEventListener("popstate", popped);
    document.removeEventListener("visibilitychange", returned);
});

function chipped(event) {
    const target = peeked(event);
    if (target) open(target);
}

function reply(target, start = "") {
    about.value = target;
    draft.value = start;
    kept = -1;
    history.go(-(trail.value.length + 1));
}

const mine = (reaction, face) => reaction.face === face && reaction.who === "user";

async function react(face) {
    const item = held.value;
    held.value = null;
    const had = item.reactions || [];
    item.reactions = had.some((r) => mine(r, face)) ? had.filter((r) => !mine(r, face)) : [...had, {face, who: "user"}];
    try {
        await phone.react(item.n, face);
        refresh();
    } catch (error) {
        if (ended(error)) failed(error);
    }
}

function quoteIt() {
    quote.value = plain(held.value.brief || held.value.title).split("\n").filter((line) => !line.startsWith(">")).join(" ").slice(0, 200);
    about.value = held.value.ref;
    held.value = null;
    compose.value.focus();
}

function copy() {
    navigator.clipboard?.writeText(plain(held.value.brief || held.value.title)).catch(() => {});
    held.value = null;
}

function sent() {
    about.value = "";
    draft.value = "";
    refresh();
}
</script>

<template>
    <header class="home-bar">
        <button type="button" class="home-names" aria-label="Switch journal or environment" @click="picking = true">
            <span class="home-title">
                <span class="home-dot" :style="{background: connection.color}" />
                {{ connection.project }}
                <span class="home-note">· {{ connection.environment }}</span>
                <Icon name="chevron" :size="14" class="home-chevron" />
            </span>
        </button>
        <PhoneAgent :running="feed.agent" />
    </header>
    <template v-if="newer">
        <p class="home-newer">
            A newer version of this app is ready.
            <button type="button" @click="reload">Reload now</button>
        </p>
    </template>
    <template v-if="!current && !offline">
        <p class="home-updating">Updating…</p>
    </template>
    <template v-if="offline">
        <p class="home-offline">Can't reach your computer right now. Trying again; what you write waits and sends then.</p>
    </template>
    <PhoneNotify />
    <PhoneWaiting :waiting="feed.waiting" @open="open" />
    <template v-if="reading">
        <PhoneReader :key="reading" :target="reading" :back="trail.length ? 'Back' : 'Chat'" @close="back" @open="open" @reply="reply" />
    </template>
    <template v-else>
        <div ref="list" class="home-feed" @click.capture="chipped" @scroll.passive="moved" @load.capture="nearBottom() && still() && toBottom()">
            <template v-for="item in feed.items" :key="item.type + item.n">
                <PhoneTurn :item="item" @hold="(it) => it.type === 'message' && (held = it)" />
            </template>
            <template v-for="line in justSent" :key="line.idempotency">
                <p class="home-sent">
                    {{ line.brief }}
                    <span>
                        {{ clock(line.at / 1000) }}
                        <ReadTicks :message="SENDING" />
                    </span>
                </p>
            </template>
            <template v-for="line in waitingToSend" :key="line.idempotency">
                <p class="home-held">{{ line.brief }}<span>{{ offline ? "Waiting to send" : "Sending…" }}</span></p>
            </template>
        </div>
        <PhoneStatus />
        <PhoneCompose ref="compose" :about="about" :quote="quote" :draft="draft" @sending="toBottom" @sent="sent" @unabout="about = ''" @unquote="(quote = ''), (about = '')" />
    </template>
    <template v-if="picking">
        <PhonePlaces :environment="connection.environment" @close="picking = false" @moved="emit('moved')" />
    </template>
    <template v-if="held">
        <PhoneHold :item="held" @react="react" @reply="quoteIt" @copy="copy" @close="held = null" />
    </template>
</template>

<style scoped>
.home-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    padding: 12px 0;
}

.home-names {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
}

.home-chevron {
    color: var(--text-3);
    transform: rotate(90deg);
}

.home-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
}

.home-title {
    display: flex;
    align-items: center;
    gap: 7px;
    font-weight: 600;
    font-size: 16.5px;
}

.home-note {
    color: var(--text-3);
    font-weight: 400;
    font-size: 14px;
}

.home-newer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 10px var(--side);
    background: var(--accent-dim);
    color: var(--text);
    font-size: 14px;
    line-height: 1.4;
}

.home-newer button {
    padding: 4px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
}

.home-updating {
    margin: 0;
    padding: 2px 0 6px;
    color: var(--text-3);
    font-size: 12.5px;
}

.home-offline {
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 10px var(--side);
    background: color-mix(in oklab, var(--tone-warn) 16%, transparent);
    color: var(--text);
    font-size: 14px;
    line-height: 1.4;
}

.home-sent {
    align-self: flex-end;
    max-width: 88%;
    margin: 0;
    padding: 10px 12px;
    border-radius: 12px;
    background: var(--accent-dim);
    line-height: 1.5;
    white-space: pre-wrap;
}

.home-sent span {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 4px;
    color: var(--text-3);
    font-size: 11.5px;
    text-align: right;
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
    overflow-x: hidden;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
    padding: 12px 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
}
</style>
