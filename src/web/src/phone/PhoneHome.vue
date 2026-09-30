<script setup>
import {computed, inject, nextTick, onMounted, onUnmounted, provide, ref, watch} from "vue";
import {phone} from "../api/phone.js";
import {usePoll} from "../poll.js";
import PhoneAgent from "./PhoneAgent.vue";
import PhoneCompose from "./PhoneCompose.vue";
import PhoneHold from "./PhoneHold.vue";
import {plain} from "./plain.js";
import PhoneReader from "./PhoneReader.vue";
import PhonePlaces from "./PhonePlaces.vue";
import PhoneNotify from "./PhoneNotify.vue";
import PhoneViewer from "./PhoneViewer.vue";
import PhoneBoard from "./PhoneBoard.vue";
import PhoneTabs from "./PhoneTabs.vue";
import Icon from "../kit/Icon.vue";
import {peeked} from "./peeked.js";
import {ordered} from "./waiting.js";
import PhoneStatus from "./PhoneStatus.vue";
import PhoneTurn from "./PhoneTurn.vue";
import PhoneWaiting from "./PhoneWaiting.vue";
import {ended, flush, justSent, settle, waitingToSend} from "./outbox.js";
import {clock} from "../format/time.js";
import ReadTicks from "../kit/ReadTicks.vue";
import {useBubbles} from "./bubbles.js";
import {useEdgeBack} from "./edge.js";
import {useUnder} from "./under.js";
import {announce, spoken} from "./announce.js";
import {tick} from "./haptic.js";

const FEED_EVERY = 5000;
const NEAR_BOTTOM = 120;
const MOVING = 800;
const SENDING = {completed: 0, seen: [], data: {}};
const LABELS = {chat: "Chat", home: "Home"};
defineProps({connection: {type: Object, required: true}});
const failed = inject("phoneFailed");
const feed = ref({items: [], waiting: [], agent: "offline"});
const emit = defineEmits(["moved"]);
const picking = ref(false);
const pages = ref([]);
const direction = ref("push");
const screen = ref("chat");
const VIEWED = ["source", "attachment"];
const about = ref("");
const quote = ref("");
const held = ref(null);
const stack = ref(null);
const list = ref(null);
const top = ref(null);
const compose = ref(null);
const draft = ref("");
const offline = ref(false);
const homeUnder = ref(false);
const LOADED = (document.querySelector('script[src*="phone-"]')?.src || "").split("/").pop();
const newer = ref(false);
const reload = () => window.location.reload();
const reading = computed(() => pages.value.at(-1)?.ref || "");
const chatUnder = useUnder(top);
const under = computed(() => (screen.value === "chat" ? chatUnder.value : homeUnder.value));
let seen = null;

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
const DAY = 86400000;
const dayOf = (seconds) => new Date(seconds * 1000).toDateString();
const named = (seconds) => {
    const day = dayOf(seconds);
    if (day === new Date().toDateString()) return "Today";
    if (day === new Date(Date.now() - DAY).toDateString()) return "Yesterday";
    return new Date(seconds * 1000).toLocaleDateString(undefined, {weekday: "long", day: "numeric", month: "long"});
};
const dividers = computed(() =>
    feed.value.items.map((item, i) => (i === 0 || dayOf(item.created) !== dayOf(feed.value.items[i - 1].created) ? named(item.created) : "")),
);
const keyOf = (item) => item.type + item.n;
const fresh = (item) => Boolean(seen) && !seen.has(keyOf(item));
const nearBottom = () => !list.value || list.value.scrollHeight - list.value.clientHeight - list.value.scrollTop < NEAR_BOTTOM;

const refresh = usePoll("phone-feed", asked, FEED_EVERY, (got) => {
    if (!got) return;
    const following = nearBottom() && still();
    seen = seen || new Set(got.items.map(keyOf));
    feed.value = got;
    navigator.setAppBadge?.(got.waiting.length).catch(() => {});
    newer.value = Boolean(got.build && LOADED && got.build !== LOADED);
    settle(got.items);
    if (following) toBottom();
});
provide("phoneRefresh", refresh);

const toBottom = () => nextTick(() => list.value && (list.value.scrollTop = list.value.scrollHeight));
watch(list, (el) => el && toBottom());

const made = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const entry = (target) => ({id: made(), ref: target});

function open(target) {
    const next = [...pages.value, entry(target)];
    direction.value = "push";
    history.pushState({pages: next}, "");
    pages.value = next;
}

const back = () => history.back();

const edge = useEdgeBack(stack, {covered: () => pages.value.length > 0, back});

function next() {
    const left = ordered(feed.value.waiting).filter((item) => item.ref !== reading.value);
    if (!left.length) return back();
    const stay = [...pages.value.slice(0, -1), entry(left[0].ref)];
    direction.value = "push";
    history.replaceState({pages: stay}, "");
    pages.value = stay;
}

function popped(event) {
    const now = event.state?.pages || [];
    const swiped = edge.landed();
    direction.value = swiped ? "swiped" : now.length >= pages.value.length ? "push" : "pop";
    pages.value = now;
}

onMounted(() => window.addEventListener("popstate", popped));
onUnmounted(() => window.removeEventListener("popstate", popped));

const place = (i) => {
    const last = pages.value.length - 1;
    if (i === last) return "";
    return i === last - 1 ? "beneath" : "buried";
};
const backLabel = (i) => (i > 0 ? "Back" : LABELS[screen.value]);
const stackStyle = computed(() => ({
    "--dx": `${edge.dx.value}px`,
    "--p": String(Math.min(1, edge.dx.value / edge.width.value)),
    "--settle": `${edge.settle.value}ms`,
}));

function chipped(event) {
    const target = peeked(event);
    if (target) open(target);
}

function reply(target, start = "") {
    about.value = target;
    draft.value = start;
    screen.value = "chat";
    if (pages.value.length) history.go(-pages.value.length);
    toBottom();
}

const findTurn = (key) => feed.value.items.find((item) => keyOf(item) === key);
const mine = (reaction, face) => reaction.face === face && reaction.who === "user";

async function react(face) {
    const item = held.value.item;
    held.value = null;
    tick();
    const had = item.reactions || [];
    item.reactions = had.some((r) => mine(r, face)) ? had.filter((r) => !mine(r, face)) : [...had, {face, who: "user"}];
    try {
        await phone.react(item.n, face);
        refresh();
    } catch (error) {
        if (ended(error)) failed(error);
    }
}

function quoteIt(item) {
    quote.value = plain(item.brief || item.title).split("\n").filter((line) => !line.startsWith(">")).join(" ").slice(0, 200);
    about.value = item.ref;
    held.value = null;
    screen.value = "chat";
    compose.value.focus();
}

function copy() {
    navigator.clipboard?.writeText(plain(held.value.item.brief || held.value.item.title)).catch(() => {});
    held.value = null;
    announce("Copied");
}

function holding(key, rect) {
    const item = findTurn(key);
    if (item) held.value = {item, rect};
}

useBubbles(list, {
    hold: holding,
    reply: (key) => {
        const item = findTurn(key);
        if (item) quoteIt(item);
    },
});

function sent() {
    about.value = "";
    draft.value = "";
    refresh();
}

function pick(key) {
    if (key === "chat" && screen.value === "chat") toBottom();
    screen.value = key;
}
</script>

<template>
    <div ref="stack" :class="['stack', {dragging: edge.dragging.value, settling: edge.settle.value > 0}]" :style="stackStyle" :inert="Boolean(picking || held)">
        <div :class="['layer', 'base', pages.length === 1 ? 'beneath' : pages.length > 1 ? 'buried' : '']" :inert="pages.length > 0">
            <div :class="['home-top', {under}]">
                <header class="home-bar">
                    <button type="button" class="home-names" aria-label="Switch journal or environment" @click="picking = true">
                        <span class="home-title">
                            <span class="home-dot" :style="{background: connection.color}" />
                            <span class="home-project">{{ connection.project }}</span>
                            <Icon name="chevron" :size="14" class="home-chevron" />
                        </span>
                        <span class="home-note">{{ connection.environment }}</span>
                    </button>
                    <button type="button" class="home-agent" @click="picking = true">
                        <span class="phone-hidden">Agent:</span>
                        <PhoneAgent :state="feed.agent" />
                    </button>
                </header>
                <template v-if="newer">
                    <p class="home-newer">
                        A newer version of this app is ready.
                        <button type="button" @click="reload">Reload now</button>
                    </p>
                </template>
                <template v-if="offline">
                    <p class="home-offline" role="status">Can't reach your computer right now. Trying again; what you write waits and sends then.</p>
                </template>
                <PhoneNotify />
                <PhoneWaiting :waiting="feed.waiting" @open="open" />
            </div>
            <div class="panes">
                <section id="pane-chat" role="tabpanel" aria-label="Chat" :class="['pane', {away: screen !== 'chat'}]" :inert="screen !== 'chat'">
                    <div ref="list" class="home-feed" data-scroller @click.capture="chipped" @scroll.passive="moved" @load.capture="nearBottom() && still() && toBottom()">
                        <span ref="top" class="home-edge" />
                        <template v-for="(item, i) in feed.items" :key="keyOf(item)">
                            <template v-if="dividers[i]">
                                <p class="home-day">{{ dividers[i] }}</p>
                            </template>
                            <PhoneTurn :item="item" :fresh="fresh(item)" @hold="(it, rect) => it.type === 'message' && (held = {item: it, rect})" />
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
                    <template v-if="screen === 'chat'">
                        <PhoneStatus />
                    </template>
                    <template v-else>
                        <div class="home-status-space" />
                    </template>
                    <PhoneCompose
                        ref="compose"
                        :about="about"
                        :quote="quote"
                        :draft="draft"
                        @sending="toBottom"
                        @sent="sent"
                        @unabout="about = ''"
                        @unquote="(quote = ''), (about = '')"
                    />
                </section>
                <template v-if="screen === 'home'">
                    <section id="pane-home" role="tabpanel" aria-label="Home" class="pane">
                        <PhoneBoard :home="connection.home || []" :waiting="feed.waiting" @open="open" @under="homeUnder = $event" />
                    </section>
                </template>
            </div>
            <PhoneTabs :screen="screen" :count="feed.waiting.length" @pick="pick" />
        </div>
        <TransitionGroup :name="direction">
            <template v-for="(page, i) in pages" :key="page.id">
                <div :class="['layer', 'page', place(i)]" :inert="i < pages.length - 1">
                    <template v-if="VIEWED.includes(page.ref.split(':')[0])">
                        <PhoneViewer :target="page.ref" :back="backLabel(i)" @close="back" />
                    </template>
                    <template v-else>
                        <PhoneReader :target="page.ref" :back="backLabel(i)" @close="back" @open="open" @next="next" @reply="reply" />
                    </template>
                </div>
            </template>
        </TransitionGroup>
    </div>
    <template v-if="picking">
        <PhonePlaces :environment="connection.environment" @close="picking = false" @moved="emit('moved')" />
    </template>
    <template v-if="held">
        <PhoneHold :item="held.item" :rect="held.rect" @react="react" @reply="quoteIt(held.item)" @copy="copy" @close="held = null" />
    </template>
    <p class="phone-hidden" aria-live="polite">{{ spoken }}</p>
</template>

<style scoped>
.stack {
    position: relative;
    flex: 1;
    min-height: 0;
    max-width: none;
    overflow: hidden;
}

.layer {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    max-width: none;
    padding: 0 var(--side);
    background: var(--bg);
    transform: translateX(0);
    transition: transform var(--pop) var(--push);
}

.layer::after {
    position: absolute;
    inset: 0;
    max-width: none;
    background: #000;
    content: "";
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--pop) linear;
}

.page {
    z-index: 1;
    box-shadow: -8px 0 24px rgb(0 0 0 / 35%);
    transform: translateX(var(--dx));
}

.layer.beneath {
    transform: translateX(calc(-30% + var(--dx) * 0.3));
}

.layer.beneath::after {
    opacity: calc(0.25 * (1 - var(--p)));
}

.layer.buried {
    visibility: hidden;
}

.stack.dragging .layer,
.stack.dragging .layer::after {
    transition: none;
}

.stack.dragging .page,
.stack.dragging .beneath {
    will-change: transform;
}

.stack.settling .layer,
.stack.settling .layer::after {
    transition-duration: var(--settle);
}

.page.push-enter-active {
    transition: transform var(--push-in) var(--push);
    will-change: transform;
}

.page.push-enter-from {
    transform: translateX(100%);
}

.page.push-leave-active {
    transition: transform var(--push-in) var(--push);
    will-change: transform;
}

.page.push-leave-to {
    transform: translateX(-30%);
}

.page.pop-leave-active {
    transition: transform var(--pop) var(--push);
    will-change: transform;
}

.page.pop-leave-to {
    transform: translateX(100%);
}

.page.swiped-leave-active {
    display: none;
    transition: none;
}

.home-top {
    flex: none;
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 0 var(--side);
    border-bottom: 1px solid transparent;
    transition: border-color 200ms linear;
}

.home-top.under {
    border-bottom-color: var(--line);
}

.home-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-height: 52px;
}

.home-names {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-height: 44px;
    justify-content: center;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
}

.home-chevron {
    flex: none;
    color: var(--text-3);
    transform: rotate(90deg);
}

.home-dot {
    flex: none;
    width: 9px;
    height: 9px;
    border-radius: 50%;
}

.home-title {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 1rem;
    font-weight: 600;
}

.home-project {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.home-note {
    padding-left: 16px;
    color: var(--text-3);
    font-size: 0.765rem;
}

.home-agent {
    flex: none;
    min-height: 44px;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
}

.home-newer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin: 0 0 8px;
    padding: 6px 6px 6px 14px;
    border-radius: 18px;
    background: var(--accent-dim);
    color: var(--text);
    font-size: 0.765rem;
    line-height: 1.3;
}

.home-newer button {
    flex: none;
    min-height: 30px;
    padding: 0 12px;
    border: 0;
    border-radius: 15px;
    background: var(--accent);
    color: #fff;
    font: inherit;
    font-weight: 600;
}

.home-offline {
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 8px var(--side);
    background: color-mix(in oklab, var(--tone-warn) 16%, transparent);
    color: var(--text);
    font-size: 0.824rem;
    line-height: 1.35;
}

.panes {
    position: relative;
    flex: 1;
    min-height: 0;
    max-width: none;
}

.pane {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    max-width: none;
}

.pane.away {
    visibility: hidden;
}

.home-status-space {
    flex: none;
    height: 22px;
}

.home-edge {
    display: block;
    flex: none;
    height: 1px;
    margin-bottom: -1px;
}

.home-day {
    align-self: center;
    margin: 14px 0 4px;
    color: var(--text-3);
    font-size: 0.706rem;
    font-weight: 600;
}

.home-sent {
    align-self: flex-end;
    max-width: 78%;
    margin: 0;
    padding: 8px 12px;
    border-radius: 18px;
    background: var(--accent-dim);
    line-height: 1.35;
    white-space: pre-wrap;
}

.home-sent span {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 4px;
    color: var(--text-3);
    font-size: 0.676rem;
    text-align: right;
}

.home-held {
    align-self: flex-end;
    max-width: 78%;
    margin: 0;
    padding: 8px 12px;
    border: 1px dashed var(--border-3);
    border-radius: 18px;
    line-height: 1.35;
}

.home-held span {
    display: block;
    color: var(--text-3);
    font-size: 0.735rem;
}

.home-feed {
    display: flex;
    overflow-x: hidden;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
    padding: 2px 0 12px;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
}
</style>
