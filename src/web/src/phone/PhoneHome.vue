<script setup>
import {waitingInOrder} from "./waiting.js";
import {scrollIntoRoom} from "./reveal.js";
import {ui} from "../state/ui.js";
import {replyQuote} from "../format/quote.js";
import {plainText} from "../text/words.js";
import {copyText} from "../platform/clipboard.js";
import {computed, inject, nextTick, onMounted, onUnmounted, provide, ref, watch} from "vue";
import {phone} from "../api/phone.js";
import {usePoll} from "../composables/poll.js";
import PhoneCompose from "./PhoneCompose.vue";
import PhoneHold from "./PhoneHold.vue";
import PhoneReader from "./PhoneReader.vue";
import PhonePlaces from "./PhonePlaces.vue";
import PhoneViewer from "./PhoneViewer.vue";
import PhoneBoard from "./PhoneBoard.vue";
import PhoneTabs from "./PhoneTabs.vue";
import PhoneNeeds from "./PhoneNeeds.vue";
import PhoneAgentSheet from "./PhoneAgentSheet.vue";
import Icon from "../kit/Icon.vue";
import {chipOpener} from "./peeked.js";
import PhoneStatus from "./PhoneStatus.vue";
import PhoneTurn from "./PhoneTurn.vue";
import {atThisPlace, discard, ended, flush, justSent, perform, setPlace, settle, waitingActions, waitingToSend} from "./outbox.js";
import PhoneSkeleton from "./PhoneSkeleton.vue";
import PhoneNotices from "./PhoneNotices.vue";
import {useFades} from "./fades.js";
import {wanted} from "./wanted.js";
import {lastLooked, looked} from "./looked.js";
import {useBubbles} from "./bubbles.js";
import PhoneHomeBar from "./PhoneHomeBar.vue";
import PhoneEverything from "./PhoneEverything.vue";
import PhoneTodos from "./PhoneTodos.vue";
import PhoneUpdateBand from "./PhoneUpdateBand.vue";
import PhoneAway from "./PhoneAway.vue";
import PhonePermit from "./PhonePermit.vue";
import NavBar from "./kit/NavBar.vue";
import Toast from "./kit/Toast.vue";
import Tour from "./kit/Tour.vue";
import {startTour, startTourOnce} from "./kit/tour.js";
import {screenOf, targetOf} from "./screens.js";
import PhoneHomeOlder from "./PhoneHomeOlder.vue";
import PhoneHomeSending from "./PhoneHomeSending.vue";
import PhoneAtWork from "./PhoneAtWork.vue";
import PhonePlanSheet from "./PhonePlanSheet.vue";
import PhoneSuggestionLayer from "./PhoneSuggestionLayer.vue";
import {phoneActs} from "./suggestionActs.js";
import {usePlanGo} from "./planGo.js";
import {useEdgeBack} from "./edge.js";
import {useUnder} from "./under.js";
import {announce, spoken} from "./announce.js";
import {tick} from "./haptic.js";
import {IN_CHAT} from "../domain/replies.js";

const FEED_EVERY = 5000;
const NEAR_BOTTOM = 120;
const MOVING = 800;
const LABELS = {chat: "Chat", home: "Home", todos: "To-dos", everything: "Everything"};
const props = defineProps({connection: {type: Object, required: true}});
const here = () => `${props.connection.project}/${props.connection.environment}`;
setPlace(here());
const placeKey = here();
const lookedAt = ref(lastLooked(placeKey));
const awaySince = lookedAt.value || 0;
const switching = ref(false);
const notice = ref("");
let noticeTimer = 0;
const heldHere = computed(() => atThisPlace(waitingToSend.value));
const sentHere = computed(() => atThisPlace(justSent.value));
const actionsHere = computed(() => atThisPlace(waitingActions.value).length);
const failed = inject("phoneFailed");
const feed = ref({items: [], waiting: [], agent: "offline"});
const emit = defineEmits(["moved"]);
const picking = ref(false);
const listing = ref(false);
const agentOpen = ref(false);
const atWorkOpen = ref(false);
const planOpen = ref(false);
const lastActive = computed(() => items.value.findLast((item) => item.who !== "user")?.created || 0);
const pages = ref([]);
const direction = ref("push");
const screen = ref("chat");
const homeEditing = ref(false);
const VIEWED = ["source", "attachment"];
const about = ref("");
const quote = ref("");
const held = ref(null);
const stack = ref(null);
const list = ref(null);
const dock = ref(null);
const dockHeight = ref(140);
let dockWatcher = null;

function docked() {
    const following = nearBottom();
    dockHeight.value = dock.value?.offsetHeight || 0;
    if (following) toBottom();
}
const top = ref(null);
const compose = ref(null);
const draft = ref("");
watch(
    () => ui.prefill,
    (text, was) => {
        if (text || was) draft.value = text;
    },
    {immediate: true}
);
const offline = ref(false);
const homeUnder = ref(false);
const current = ref(true);
let landNext = true;

function returned() {
    if (document.hidden) return;
    current.value = false;
    lookedAt.value = lastLooked(placeKey);
    landNext = true;
}

const wentOffline = () => (offline.value = true);
const cameOnline = () => refresh();
const freshKeys = ref(new Set());
let waitingFeed = null;
let loadFrame = 0;
const LOADED = (document.querySelector('script[src*="phone-"]')?.src || "").split("/").pop();
const newer = ref(false);
const reload = () => window.location.reload();
const reading = computed(() => pages.value.at(-1)?.ref || "");
const under = useUnder(top);

async function asked() {
    if (switching.value) return null;
    try {
        const got = await phone.feed();
        offline.value = false;
        flush().catch((error) => {
            if (ended(error)) failed(error);
        });
        return got;
    } catch (error) {
        if (ended(error)) failed(error);
        else offline.value = true;
        return null;
    }
}

let movedAt = 0;
const still = () => Date.now() - movedAt > MOVING;
const ready = ref(false);
const far = ref(false);
const unseen = ref(0);
const TALKING = ["message", "question", "comment"];
let scrollFrame = 0;
let stuck = true;
const keptDown = () => stuck && toBottom();
const OLDER_AT = 400;
const earlier = ref([]);
const olderBusy = ref(false);
const beginning = ref(false);
const olderFailed = ref(false);
let olderSpent = false;
let pinned = false;

function freshGesture() {
    olderSpent = false;
    pinned = false;
}
const items = computed(() => {
    const newest = feed.value.items;
    if (!earlier.value.length) return newest;
    const known = new Set(newest.map(keyOf));
    return [...earlier.value.filter((item) => !known.has(keyOf(item))), ...newest];
});
const briefs = computed(
    () => new Map(items.value.filter((item) => IN_CHAT.test(item.ref || "")).map((item) => [item.ref, plainText(item.brief || item.title)]))
);

function measure() {
    scrollFrame = 0;
    const el = list.value;
    if (!el) return;
    far.value = el.scrollHeight - el.clientHeight - el.scrollTop > el.clientHeight;
    stuck = nearBottom();
    if (stuck) {
        unseen.value = 0;
        looked(placeKey, items.value.at(-1)?.created || 0);
    }
    if (el.scrollTop < OLDER_AT) loadOlder();
}

async function loadOlder() {
    const first = items.value[0];
    if (olderBusy.value || olderSpent || olderFailed.value || beginning.value || !ready.value || !first) return;
    olderBusy.value = true;
    olderSpent = true;
    try {
        const got = await phone.older(first.created);
        const known = new Set(items.value.map(keyOf));
        const found = got.items.filter((item) => !known.has(keyOf(item)));
        if (!found.length) {
            beginning.value = true;
            announce("Start of the conversation");
            return;
        }
        announce(`Loaded ${found.length} earlier ${found.length === 1 ? "message" : "messages"}`);
        const el = list.value;
        const fromBottom = el ? el.scrollHeight - el.scrollTop : 0;
        earlier.value = [...found, ...earlier.value];
        await nextTick();
        if (el) el.scrollTop = el.scrollHeight - fromBottom;
        fade();
    } catch (error) {
        if (ended(error)) failed(error);
        else olderFailed.value = true;
    } finally {
        olderBusy.value = false;
    }
}

function retryOlder() {
    olderFailed.value = false;
    olderSpent = false;
    loadOlder();
}

function moved() {
    movedAt = Date.now();
    if (!scrollFrame) scrollFrame = requestAnimationFrame(measure);
}

function newest() {
    const el = list.value;
    if (!el) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({top: el.scrollHeight, behavior: smooth ? "smooth" : "auto"});
    unseen.value = 0;
}
const DAY = 86400000;
const dayOf = (seconds) => new Date(seconds * 1000).toDateString();
const named = (seconds) => {
    const day = dayOf(seconds);
    if (day === new Date().toDateString()) return "Today";
    if (day === new Date(Date.now() - DAY).toDateString()) return "Yesterday";
    return new Date(seconds * 1000).toLocaleDateString(undefined, {weekday: "long", day: "numeric", month: "long"});
};
const dividers = computed(() =>
    items.value.map((item, i) => (i === 0 || dayOf(item.created) !== dayOf(items.value[i - 1].created) ? named(item.created) : ""))
);
const keyOf = (item) => item.type + item.n;
const RUN_GAP = 300;
const fromDesktop = (item) => item.who === "user" && !String(item.data?.via || "").startsWith("phone:");
const BUBBLES = ["message", "comment"];
const peer = (item) => Boolean(item.data?.sent_to || item.data?.peer);
const joins = (before, item) =>
    Boolean(before) &&
    !peer(before) &&
    !peer(item) &&
    BUBBLES.includes(before.type) &&
    BUBBLES.includes(item.type) &&
    before.who === item.who &&
    fromDesktop(before) === fromDesktop(item) &&
    item.created - before.created < RUN_GAP;
const newFrom = computed(() => {
    if (lookedAt.value === null) return "";
    const first = items.value.find((item) => item.created > lookedAt.value && item.who !== "user" && TALKING.includes(item.type));
    return first ? keyOf(first) : "";
});
const joined = computed(() => items.value.map((item, i) => !dividers.value[i] && joins(items.value[i - 1], item)));
const arrivals = ref(new Map());
const closedNotices = ref(new Set());
const REF = /^[a-z_]+:\d+$/;
const notices = computed(() => (feed.value.notices || []).filter((notice) => !closedNotices.value.has(notice.n)));

function openNotice(notice) {
    const link = notice.data?.link || "";
    if (REF.test(link)) return open(link);
    if (link) window.open(link, "_blank", "noopener");
}

async function closeNotice(notice) {
    closedNotices.value = new Set([...closedNotices.value, notice.n]);
    try {
        const went = await perform({kind: "close", n: notice.n});
        announce(went === "held" ? "Closing waits to send" : "Notice closed");
    } catch (error) {
        closedNotices.value = new Set([...closedNotices.value].filter((n) => n !== notice.n));
        if (ended(error)) failed(error);
        else noticed("That notice could not be closed. Try again.");
    }
}

function announceArrivals(coming) {
    if (!coming.length) return;
    if (coming.length > 1) return announce(`${coming.length} new messages`);
    const item = coming[0];
    const who = item.type === "question" ? "Question" : "Agent";
    announce(`${who}: ${plainText(item.label || item.brief || item.title || "").slice(0, 80)}`);
}
const BURST = 600;
const STAGGER = 90;
const arriveAt = (item) => arrivals.value.get(keyOf(item)) ?? -1;
const nearBottom = () => !list.value || list.value.scrollHeight - list.value.clientHeight - list.value.scrollTop < NEAR_BOTTOM;

let seen = null;

function took(got) {
    const following = nearBottom() && still();
    const keys = got.items.map(keyOf);
    const first = !seen;
    freshKeys.value = new Set(seen ? keys.filter((key) => !seen.has(key)) : []);
    const coming = first || landNext ? [] : got.items.filter((item) => freshKeys.value.has(keyOf(item)) && item.who !== "user");
    const step = coming.length > 1 ? Math.min(STAGGER, BURST / (coming.length - 1)) : 0;
    arrivals.value = new Map(coming.map((item, i) => [keyOf(item), Math.round(i * step)]));
    announceArrivals(coming);
    seen = new Set(keys);
    if (earlier.value.length) {
        const oldest = got.items[0]?.created ?? Infinity;
        const dropped = feed.value.items.filter((item) => !seen.has(keyOf(item)) && item.created < oldest);
        if (dropped.length) earlier.value = [...earlier.value, ...dropped];
    }
    if (!following) unseen.value += got.items.filter((item) => freshKeys.value.has(keyOf(item)) && TALKING.includes(item.type)).length;
    feed.value = got;
    ready.value = true;
    nextTick(() => {
        fade();
        measure();
    });
    current.value = true;
    navigator.setAppBadge?.(got.waiting.length).catch(() => {});
    newer.value = Boolean(got.build && LOADED && got.build !== LOADED);
    settle(got.items);
    if (landNext) {
        landNext = false;
        if (lookedAt.value === null) {
            lookedAt.value = items.value.at(-1)?.created || 0;
            looked(placeKey, lookedAt.value);
        }
        land();
    } else if (following) toBottom();
}

function toMark() {
    const el = list.value;
    const mark = el?.querySelector(".home-new");
    if (!mark) return false;
    const after = el.scrollHeight - dockHeight.value - mark.offsetTop;
    const room = el.clientHeight - dockHeight.value;
    el.scrollTop = after <= room ? el.scrollHeight : Math.max(0, mark.offsetTop - 8);
    return true;
}

function land() {
    nextTick(() => {
        pinned = toMark();
        if (!pinned) return toBottom();
        unseen.value = items.value.filter(
            (item) => item.created > lookedAt.value && item.who !== "user" && TALKING.includes(item.type)
        ).length;
        measure();
    });
}

const refresh = usePoll("phone-feed", asked, FEED_EVERY, (got) => {
    if (!got || switching.value) return;
    if (held.value) waitingFeed = got;
    else took(got);
});
provide("phoneRefresh", refresh);
provide(
    "suggestionActs",
    phoneActs((target) => open(target), refresh)
);
const go = usePlanGo(
    computed(() => feed.value.plan),
    refresh,
    failed
);

watch(offline, (now, before) => {
    if (now !== before) announce(now ? "Offline, waiting to reconnect" : "Back online");
});

watch(held, (now) => {
    if (now || !waitingFeed) return;
    const got = waitingFeed;
    waitingFeed = null;
    took(got);
});

function loaded() {
    if (loadFrame) return;
    loadFrame = requestAnimationFrame(() => {
        loadFrame = 0;
        if (pinned) toMark();
        else if (nearBottom() && still()) toBottom();
    });
}

const toBottom = () => nextTick(() => list.value && (list.value.scrollTop = list.value.scrollHeight));
watch(list, (el) => el && toBottom());

const entry = (target) => ({id: crypto.randomUUID(), ref: target});
const saved = (list) => ({pages: list.map(({id, ref}) => ({id, ref}))});
const FLASH = 1200;
let flashing = "";

function flashTo(key) {
    const el = list.value?.querySelector(`[data-hold="${key}"]`);
    if (!el) return;
    scrollIntoRoom(list.value, el, true);
    el.dataset.flash = "";
    setTimeout(() => delete el.dataset.flash, FLASH);
}

function open(target) {
    if (target.startsWith("tab:")) return pick(target.slice(4));
    const key = target.replace(":", "");
    if (IN_CHAT.test(target) && findTurn(key)) {
        screen.value = "chat";
        if (!pages.value.length) return nextTick(() => flashTo(key));
        flashing = key;
        return history.go(-pages.value.length);
    }
    const next = [...pages.value, entry(target)];
    direction.value = "push";
    history.pushState(saved(next), "");
    pages.value = next;
}

const back = () => history.back();

const edge = useEdgeBack(stack, {depth: () => pages.value.length, back});

const SPOKEN_AFTER = 300;

const nextAfter = (target) => waitingInOrder(feed.value.waiting).find((item) => item.ref !== target) || null;

function next() {
    const left = waitingInOrder(feed.value.waiting).filter((item) => item.ref !== reading.value);
    if (!left.length) return back();
    const stay = [...pages.value.slice(0, -1), entry(left[0].ref)];
    direction.value = "push";
    history.replaceState(saved(stay), "");
    pages.value = stay;
}

function popped(event) {
    const now = event.state?.pages || [];
    const swiped = edge.landed(now.length);
    direction.value = swiped ? "swiped" : now.length >= pages.value.length ? "push" : "pop";
    pages.value = now;
    if (!flashing || now.length) return;
    const key = flashing;
    flashing = "";
    setTimeout(() => flashTo(key), 320);
}

onMounted(() => {
    window.visualViewport?.addEventListener("resize", keptDown);
    window.visualViewport?.addEventListener("scroll", keptDown);
    dockWatcher = new ResizeObserver(docked);
    if (dock.value) dockWatcher.observe(dock.value);
    window.addEventListener("popstate", popped);
    document.addEventListener("visibilitychange", returned);
    window.addEventListener("offline", wentOffline);
    window.addEventListener("online", cameOnline);
});
onUnmounted(() => {
    dockWatcher?.disconnect();
    window.visualViewport?.removeEventListener("resize", keptDown);
    window.visualViewport?.removeEventListener("scroll", keptDown);
    window.removeEventListener("popstate", popped);
    document.removeEventListener("visibilitychange", returned);
    window.removeEventListener("offline", wentOffline);
    window.removeEventListener("online", cameOnline);
    cancelAnimationFrame(loadFrame);
    cancelAnimationFrame(scrollFrame);
    clearTimeout(noticeTimer);
});

const place = (i) => {
    const last = pages.value.length - 1;
    if (i === last) return "";
    return i === last - 1 ? "beneath" : "buried";
};
const backLabel = (i) => (i > 0 ? "Back" : LABELS[screen.value]);
const stackStyle = computed(() => ({"--settle": `${edge.settle.value}ms`}));

const chipped = chipOpener(open);
const fade = useFades(list);

function reply(target, start = "") {
    about.value = target;
    draft.value = start;
    screen.value = "chat";
    if (pages.value.length) history.go(-pages.value.length);
    toBottom();
}

const findTurn = (key) => items.value.find((item) => keyOf(item) === key);
const mine = (reaction, face) => reaction.face === face && reaction.who === "user";

async function react(face) {
    const item = held.value.item;
    held.value = null;
    tick();
    const had = item.reactions || [];
    const removing = had.some((r) => mine(r, face));
    item.reactions = removing ? had.filter((r) => !mine(r, face)) : [...had, {face, who: "user"}];
    try {
        const went = await perform({kind: "react", n: item.n, face, type: item.type});
        announce(went === "held" ? "Your reaction sends when you are back online" : removing ? `Removed ${face}` : `Reacted ${face}`);
        refresh();
    } catch (error) {
        item.reactions = had;
        if (ended(error)) failed(error);
        else noticed("That reaction didn't go through. Try again.");
    }
}

function noticed(words) {
    clearTimeout(noticeTimer);
    notice.value = words;
    noticeTimer = setTimeout(() => (notice.value = ""), 4000);
}

function arrived() {
    picking.value = false;
    emit("moved");
}

function leaving() {
    switching.value = true;
    setPlace("");
}

function staying() {
    switching.value = false;
    setPlace(here());
}

watch(
    wanted,
    (target) => {
        if (!target) return;
        wanted.value = "";
        open(target);
    },
    {immediate: true, flush: "post"}
);

function quoteIt(item) {
    quote.value = replyQuote(item.brief || item.title);
    about.value = item.ref;
    held.value = null;
    screen.value = "chat";
    compose.value.focus();
    toBottom();
}

function copy() {
    copyText(plainText(held.value.item.brief || held.value.item.title));
    held.value = null;
    setTimeout(() => announce("Copied"), SPOKEN_AFTER);
}

function holding(key, rect, el) {
    const item = findTurn(key);
    if (item) held.value = {item, rect, el};
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
    if (pages.value.length) history.go(-pages.value.length);
    if (key === "chat" && screen.value === "chat") toBottom();
    screen.value = key;
}

const COMMANDS = {
    message: () => (pick("chat"), nextTick(() => compose.value?.focus())),
    places: () => (picking.value = true),
    agent: () => (agentOpen.value = true),
    needs: () => (listing.value = true),
    tour: () => (pick("chat"), startTour()),
};
const command = (key) => COMMANDS[key]();

onMounted(startTourOnce);
</script>

<template>
    <div
        ref="stack"
        :class="['stack', {dragging: edge.dragging.value, settling: edge.settle.value > 0}]"
        :style="stackStyle"
        :inert="Boolean(picking || held || listing || agentOpen || atWorkOpen || planOpen)"
    >
        <div
            :class="['layer', 'base', pages.length === 1 ? 'beneath' : pages.length > 1 ? 'buried' : '']"
            :inert="pages.length > (edge.leaving.value ? 1 : 0)"
        >
            <PhoneUpdateBand :newer="newer" @reload="reload" />
            <template v-if="screen === 'chat'">
                <PhoneHomeBar
                    :connection="connection"
                    :feed="feed"
                    :under="under"
                    :offline="offline"
                    :current="current"
                    :notice="notice"
                    :actions-here="actionsHere"
                    :go="go"
                    :away="far"
                    @places="picking = true"
                    @agent="agentOpen = true"
                    @at-work="atWorkOpen = true"
                    @plan="planOpen = true"
                    @open="open"
                    @list="listing = true"
                />
            </template>
            <div class="panes">
                <section
                    id="pane-chat"
                    role="tabpanel"
                    aria-label="Chat"
                    :class="['pane', {away: screen !== 'chat'}]"
                    :inert="screen !== 'chat'"
                    :style="{'--dock': `${dockHeight}px`}"
                >
                    <template v-if="switching || !ready">
                        <PhoneSkeleton />
                    </template>
                    <template v-else>
                        <div class="home-feed-box">
                            <div
                                ref="list"
                                :class="['home-feed', {spaced: far}]"
                                data-scroller
                                @click.capture="chipped"
                                @scroll.passive="moved"
                                @touchstart.passive="freshGesture"
                                @wheel.passive="freshGesture"
                                @load.capture="loaded"
                            >
                                <span ref="top" class="home-edge" />
                                <PhoneAway :items="items" :since="awaySince" :waiting="feed.waiting.length" @needs="listing = true" />
                                <PhoneHomeOlder :busy="olderBusy" :failed="olderFailed" :beginning="beginning" @retry="retryOlder" />
                                <template v-for="(item, i) in items" :key="keyOf(item)">
                                    <template v-if="keyOf(item) === newFrom">
                                        <p class="home-new" role="separator">New since you last looked</p>
                                    </template>
                                    <template v-if="dividers[i]">
                                        <p class="home-day">{{ dividers[i] }}</p>
                                    </template>
                                    <PhoneTurn
                                        :item="item"
                                        :arrive="arriveAt(item)"
                                        :briefs="briefs"
                                        :joined="joined[i]"
                                        :continues="joined[i + 1] === true"
                                        @hold="(it, rect, el) => (held = {item: it, rect, el})"
                                    />
                                </template>
                                <PhoneHomeSending :sent="sentHere" :held="heldHere" :offline="offline" @discard="discard" />
                                <template v-if="feed.running?.prompt">
                                    <PhonePermit :prompt="feed.running.prompt" @answered="refresh()" />
                                </template>
                            </div>
                            <template v-if="far">
                                <button
                                    type="button"
                                    class="home-newest"
                                    :aria-label="unseen ? `Scroll to newest, ${unseen} new` : 'Scroll to newest'"
                                    @click="newest"
                                >
                                    <Icon name="down" :size="18" />
                                    <template v-if="unseen">
                                        <span class="home-unseen" aria-hidden="true">{{ unseen }}</span>
                                    </template>
                                </button>
                            </template>
                        </div>
                    </template>
                    <div ref="dock" class="home-dock">
                        <PhoneNotices :notices="notices" @open="openNotice" @close="closeNotice" />
                        <template v-if="screen === 'chat'">
                            <PhoneStatus :working="feed.agent === 'working'" />
                        </template>
                        <template v-else>
                            <div class="home-status-space" />
                        </template>
                        <PhoneCompose
                            :key="placeKey"
                            ref="compose"
                            :about="about"
                            :quote="quote"
                            :draft="draft"
                            @sending="toBottom"
                            @focused="keptDown"
                            @typing="toBottom"
                            @sent="sent"
                            @unabout="about = ''"
                            @unquote="((quote = ''), (about = ''))"
                        />
                    </div>
                </section>
                <template v-if="screen === 'home'">
                    <section id="pane-home" role="tabpanel" aria-label="Home" class="pane">
                        <NavBar title="Home" :under="homeUnder">
                            <button type="button" class="home-change" @click="homeEditing = !homeEditing">{{ homeEditing ? "Done" : "Change Home" }}</button>
                        </NavBar>
                        <PhoneBoard
                            v-model:editing="homeEditing"
                            :home="connection.home || []"
                            :waiting="feed.waiting"
                            :place="placeKey"
                            :sub="`${connection.project} · ${connection.environment}`"
                            @open="open"
                            @under="homeUnder = $event"
                        />
                    </section>
                </template>
                <template v-if="screen === 'todos'">
                    <section id="pane-todos" role="tabpanel" aria-label="To-dos" class="pane">
                        <PhoneTodos @open="open" />
                    </section>
                </template>
                <template v-if="screen === 'everything'">
                    <section id="pane-everything" role="tabpanel" aria-label="Everything" class="pane">
                        <PhoneEverything :connection="connection" @open="open" />
                    </section>
                </template>
            </div>
        </div>
        <TransitionGroup :name="direction">
            <template v-for="(page, i) in pages" :key="page.id">
                <div
                    :class="['layer', 'page', place(i), {departing: edge.leaving.value && i === pages.length - 1}]"
                    :inert="i < pages.length - (edge.leaving.value ? 2 : 1)"
                >
                    <template v-if="VIEWED.includes(page.ref.split(':')[0])">
                        <PhoneViewer :target="page.ref" :back="backLabel(i)" @close="back" />
                    </template>
                    <template v-else-if="screenOf(page.ref)">
                        <component
                            :is="screenOf(page.ref)"
                            :target="targetOf(page.ref)"
                            :back="backLabel(i)"
                            @back="back"
                            @open="open"
                            @command="command"
                            @switching="leaving"
                            @stayed="staying"
                            @moved="arrived"
                        />
                    </template>
                    <template v-else>
                        <PhoneReader
                            :target="page.ref"
                            :back="backLabel(i)"
                            :up-next="nextAfter(page.ref)"
                            @close="back"
                            @open="open"
                            @next="next"
                            @reply="reply"
                        />
                    </template>
                </div>
            </template>
        </TransitionGroup>
    </div>
    <PhoneTabs :screen="screen" :count="feed.waiting.length" @pick="pick" />
    <Toast />
    <Tour :tab="screen" @tab="pick" />
    <template v-if="picking">
        <PhonePlaces
            :environment="connection.environment"
            @close="picking = false"
            @switching="leaving"
            @stayed="staying"
            @moved="arrived"
        />
    </template>
    <template v-if="agentOpen">
        <PhoneAgentSheet
            :state="feed.agent"
            :environment="connection.environment"
            :last-active="lastActive"
            :live="feed.running || {}"
            @changed="refresh()"
            @close="agentOpen = false"
            @started="((agentOpen = false), refresh())"
        />
    </template>
    <template v-if="atWorkOpen">
        <PhoneAtWork
            :environment="connection.environment"
            :live="feed.running || {}"
            @changed="refresh()"
            @read="open"
            @close="atWorkOpen = false"
        />
    </template>
    <template v-if="planOpen && feed.plan">
        <PhonePlanSheet :plan="feed.plan" :go="go" @read="(target) => ((planOpen = false), open(target))" @close="planOpen = false" />
    </template>
    <template v-if="listing">
        <PhoneNeeds :waiting="feed.waiting" @open="(target) => ((listing = false), open(target))" @close="listing = false" />
    </template>
    <template v-if="held">
        <PhoneHold
            :item="held.item"
            :rect="held.rect"
            :source="held.el"
            @react="react"
            @reply="quoteIt(held.item)"
            @copy="copy"
            @close="held = null"
        />
    </template>
    <PhoneSuggestionLayer :items="items" />
    <p class="phone-hidden" aria-live="polite">{{ spoken }}</p>
</template>

<style scoped>
.home-change {
    min-height: 44px;
    padding: 0 8px;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 1.0625rem;
}

.stack {
    --dx: 0px;
    --p: 0;
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
    box-shadow: -8px 0 24px var(--shade);
    transform: translateX(var(--dx));
}

.layer.beneath {
    transform: translateX(calc(-30% + var(--dx) * 0.3));
}

.layer.beneath::after {
    opacity: calc(0.25 * (1 - var(--p)));
}

.page.departing {
    pointer-events: none;
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

.home-new {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 8px 0 2px;
    color: var(--accent-text);
    font-size: 0.765rem;
    font-weight: 600;
}

.home-new::before,
.home-new::after {
    flex: 1;
    height: 1px;
    background: color-mix(in oklab, var(--accent) 50%, transparent);
    content: "";
}

.home-day {
    align-self: center;
    margin: 14px 0 4px;
    color: var(--text-3);
    font-size: 0.706rem;
    font-weight: 600;
}

.home-feed-box {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.home-newest {
    position: absolute;
    bottom: calc(var(--dock, 140px) + 14px + var(--keyboard, 0px));
    left: 50%;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin-left: -22px;
    padding: 0;
    border: 1px solid var(--line);
    border-radius: 50%;
    background: var(--raised);
    color: var(--text);
    box-shadow: var(--shadow-1);
    animation: newest-in 200ms ease-out;
}

.home-unseen {
    position: absolute;
    top: -6px;
    right: -8px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    min-height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--accent);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    line-height: 1;
}

@keyframes newest-in {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
}

.home-feed.spaced {
    padding-bottom: calc(var(--dock, 140px) + 56px + var(--keyboard, 0px));
}

.home-dock {
    position: absolute;
    right: calc(12px - var(--side));
    bottom: calc(8px + var(--keyboard, 0px));
    left: calc(12px - var(--side));
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: none;
    pointer-events: none;
}

.home-dock > * {
    pointer-events: auto;
}

.home-dock::before {
    position: absolute;
    top: -28px;
    right: -12px;
    bottom: -8px;
    left: -12px;
    z-index: -1;
    background: color-mix(in oklab, var(--bg) 22%, transparent);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    content: "";
    pointer-events: none;
    -webkit-mask-image: linear-gradient(to bottom, transparent, #000);
    mask-image: linear-gradient(to bottom, transparent, #000);
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    .home-dock::before {
        background: color-mix(in oklab, var(--bg) 40%, transparent);
    }
}

@media (max-height: 420px) {
    .home-dock .status-wrap,
    .home-dock .home-status-space {
        display: none;
    }
}

.home-dock .status-wrap {
    align-self: stretch;
    padding: 0 10px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
}

.home-dock .status-wrap.empty {
    display: none;
}

.home-feed {
    display: flex;
    overflow-x: hidden;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
    padding: 2px 0 calc(var(--dock, 140px) + 12px + var(--keyboard, 0px));
    overflow-y: auto;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
}
</style>
