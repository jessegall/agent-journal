<script setup>
import {subagentsOf} from "../domain/subagents.js";
import {busyLine, isBusy} from "../domain/agentState.js";
import {openQuestion, questionView, updateView} from "../state/overlays.js";
import {agent} from "../composables/leadAgent.js";
import {feedOn} from "../composables/settings.js";
import {store} from "../state/store.js";
import {cardPlan} from "../domain/plans.js";
import {useWaiting} from "../composables/waiting.js";
import WaitingPanel from "./WaitingPanel.vue";
import {defaultHidden} from "../domain/chatVisibility.js";
import Dot from "../kit/Dot.vue";
import RunningCommand from "./RunningCommand.vue";
import {demand} from "../composables/poll.js";
import {useScrollback} from "../composables/scrollback.js";
import {useFollowing} from "../composables/following.js";
import {isScrollbarPress, wheelsInside} from "../domain/readerHand.js";
import {arrivalQueue, arriveAtOnce, depart} from "./arrival.js";
import {useReadingPlace} from "../composables/readingPlace.js";
import Skeleton from "../kit/Skeleton.vue";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {markSeen} from "../sync/seen.js";
import {onOutboxNotice, sendMessage, token} from "./outbox.js";
import {usePromised} from "../composables/promised.js";
import Icon from "../kit/Icon.vue";
import {openInChat, route} from "../route.js";
import {quoted, withQuote} from "../format/quote.js";
import {laidOut} from "../platform/view.js";
import {mainChat, threadTurns} from "../domain/thread.js";
import {DUMP_OFFER} from "../domain/dumpPile.js";
import {useActiveCards} from "../composables/activeCards.js";
import {useSharedNow} from "../composables/now.js";
import {useScope} from "../composables/scope.js";
import DumpWindow from "./DumpWindow.vue";
import TerminalWindow from "./TerminalWindow.vue";
import OutputDialog from "./OutputDialog.vue";
import {useOpenInPlace} from "../composables/openInPlace.js";
import ChatDock from "./ChatDock.vue";
import DockGroup from "./DockGroup.vue";
import RunMenu from "./RunMenu.vue";
import DumpDock from "./DumpDock.vue";
import {withDayLines} from "../domain/dayLines.js";
import {dockedDump, dockedRows, isRun, keptRuns, streamRows} from "../domain/docks.js";
import {useDockedCards} from "../composables/dockedCards.js";
import {useRunGroup} from "../composables/runGroup.js";
import {DOCK_MOTION_MS} from "../kit/dockMotion.js";
import QuestionOverlay from "./QuestionOverlay.vue";
import UpdateOverlay from "./UpdateOverlay.vue";
import FileFeed from "./FileFeed.vue";
import Compose from "./Compose.vue";
import Turn from "./Turn.vue";
import PlanCard from "./PlanCard.vue";
import {planCardChoice} from "../state/planCardChoice.js";
import {seconds} from "../domain/row.js";
import {ui} from "../state/ui.js";
import {approveWithMessage} from "../actions/plans.js";

const scroller = ref(null);
const views = ref(null);
const docks = ref(null);
const props = defineProps({view: {type: String, default: ""}, hidden: {type: Array, default: () => defaultHidden()}});
const pane = computed(() => props.view || store.pane);
const scope = useScope();
const here = !scope.env && !scope.chat;
const rows = (table) => scope.rows(table);
const owner = computed(() =>
    here ? agent.value : [...rows("agents")].sort((a, b) => seconds(b.heard_at) - seconds(a.heard_at))[0] || null
);
const threadRoot = ref(null);
const askHere = (id) => !!threadRoot.value?.offsetParent && (openQuestion(id, threadRoot.value), true);
const outputOpen = ref(0);
const showOutput = (id) => !!threadRoot.value?.offsetParent && ((outputOpen.value = id), true);
let unask = () => {};
let unoutput = () => {};
onMounted(() => here && ((unask = openInChat("questions", askHere)), (unoutput = openInChat("outputs", showOutput))));
onUnmounted(() => (unask(), unoutput()));
const dumpHere = computed(() => store.dumping && !props.view);
const terminalOpen = computed(() => pane.value === "terminal" && !dumpHere.value);
const chatOpen = computed(() => pane.value !== "terminal" && !dumpHere.value);
const feeding = computed(() => pane.value === "feed" && feedOn.value && Boolean(owner.value));
const feedKey = computed(() => (owner.value ? `${owner.value.id}` : ""));
const quote = ref({text: "", ref: ""});
watch(
    () => store.quoting,
    (asked) => asked && ((quote.value = asked), (store.quoting = null)),
    {immediate: true}
);
const editing = ref(null);
const sessionNotice = ref("");
onOutboxNotice((text) => (sessionNotice.value = text));
const dumps = computed(() => rows("dumps"));
const dumpFiling = computed(() => dumps.value.filter((d) => !d.completed_at).sort((a, b) => a.id - b.id)[0] || null);

function openDump(id = 0) {
    store.pane = "chat";
    store.dumpSelected = id;
    store.dumping = true;
}

const dumpIdle = computed(() => ({
    icon: "inbox",
    label: dumpFiling.value ? `Dump ${dumpFiling.value.id} · filing` : "Dump files",
    title: "Add many files and notes at once. The agent sorts them by subject and files them",
    go: () => openDump(dumpFiling.value?.id || 0),
}));
const dumpOffer = {
    icon: "inbox",
    ...DUMP_OFFER,
    take: (files) => {
        store.dumpFiles = files;
        openDump(0);
    },
};

const chat = useActiveCards(computed(() => (scope.chat ? rows("messages") : mainChat(rows("messages")))));
const mine = computed(() => chat.value.filter((m) => m.author === "user" && !m.read_at));

function editLast() {
    const last = mine.value[mine.value.length - 1];
    if (last) editing.value = {id: last.id, ...quoted(last.text)};
}

function unedit() {
    editing.value = null;
}
const busy = computed(() => isBusy(owner.value));
const {waiting: waitingNow, open: waitingOpen, anchor: waitingAnchor, toggle: toggleWaiting} = useWaiting(undefined, owner);
const planCard = computed(() => cardPlan(rows("plans"), planCardChoice.value));
const dumpDock = computed(() => (store.dumping ? null : dockedDump(rows("dumps"))));
const dockNow = useSharedNow();
const dockCards = useDockedCards(chat);
const rowDocks = computed(() => dockedRows(dockCards.value, dockNow.value));
// the runs docked are drawn together (chat/DockGroup.vue), as cards or, from three at once, folded into one compact row; the rows docked
// from their inspectors are drawn alone
const runDocks = computed(() => keptRuns(rowDocks.value.filter(isRun)));
const grouped = useRunGroup(runDocks);
const aloneDocks = computed(() => rowDocks.value.filter((m) => !isRun(m)));
const dockCount = computed(() => aloneDocks.value.length + runDocks.value.length + [dumpDock.value, planCard.value].filter(Boolean).length);
const helping = computed(() =>
    subagentsOf(owner.value)
        .filter((sub) => sub.running)
        .at(-1)
);
const line = computed(() => (owner.value ? busyLine(owner.value, helping.value) : {doing: "working"}));
const planOpen = ref(true);
let lastTop = 0;
let lastScroll = 0;
let planTimer = 0;
const PLAN_SETTLE = 180;
const short = ref(false);
const SHORT_CHAT = 420;
const sizeWatch = new ResizeObserver(([entry]) => (short.value = entry.contentRect.height < SHORT_CHAT));
// the docks and the status line take their own room under the pane, so the pane changes height as they open, fold or leave: a reader
// following the foot stays at it, and the bubbles move up or down with the docks
const paneWatch = new ResizeObserver(() => scroller.value && !away.value && (scroller.value.scrollTop = scroller.value.scrollHeight));
// how near the foot counts as at it, past the fraction of a pixel a zoomed or fractional layout leaves under the last row
const AT_BOTTOM = 2;
const FOLD_AT = 8;
const FOLDED_PLAN = 32;
const FAR = 40;
const {
    away,
    missed,
    showNewest,
    follow: atTheFoot,
    toBottom: glideTo,
    left: readingUp,
    arrived,
} = useFollowing(scroller, AT_BOTTOM, () => false);
// away from the foot, messages that arrive are loaded but held off the screen, so nothing below the reader grows and moves the page;
// back at the foot, every held message appears
const readingPage = ref(null);
const releasingHeld = ref(false);
watch(away, (isAway) => {
    if (isAway) {
        readingPage.value = {ids: new Set(chat.value.map((message) => message.id)), newestAt: Math.max(0, ...chat.value.map((message) => seconds(message.created_at)))};
        return;
    }
    if (!readingPage.value) return;
    releasingHeld.value = true;
    comeIn.flush();
    readingPage.value = null;
    nextTick(() => {
        releasingHeld.value = false;
        if (!away.value) glideTo(false);
    });
}, {flush: "sync"});
const shownChat = computed(() => readingPage.value
    ? chat.value.filter((message) => readingPage.value.ids.has(message.id) || seconds(message.created_at) < readingPage.value.newestAt)
    : chat.value
);
const held = computed(() => chat.value.length - shownChat.value.length);
const settledOnce = ref(false);
const ready = ref(false);
const unseen = computed(() => shownChat.value.filter((m) => m.author === "agent" && !m.read_at).map((m) => m.id));

watch([unseen, ready], ([ids, isReady]) => here && isReady && markSeen(ids), {immediate: true});
const rendering = ref(false);
const topMark = ref(null);
const AHEAD = "200px 0px 0px 0px";
const scrolledUp = ref(false);
const NEAR_TOP = 200;
const GLIDE = 450;
let frame = 0;

const revoke = (p) => Object.values(p.previews || {}).forEach(URL.revokeObjectURL);
const {pending, promise, drop, change, keep, link, keyOf} = usePromised(revoke);
const thread = computed(() =>
    threadTurns(streamRows(shownChat.value, dockNow.value), pending.value, here && !!store.paging.more.messages, props.hidden)
);
watch(thread, (made) => made.keys.forEach((placeholder, ref) => link(ref, placeholder)), {immediate: true});
const turns = computed(() => withDayLines(thread.value.turns));
const turnsLoaded = computed(() => scope.loaded("messages"));
watch(turns, keep);

let glidedAt = 0;

function toBottom(smooth = false) {
    if (smooth) glidedAt = Date.now();
    glideTo(smooth);
}

// the chat taking itself to the foot as something arrives or settles: never while the reader's own hand scrolls, or a moment after, nor
// while a bubble the reader pressed opens, so it opens in place and the chat stays exactly where the reader has it
function followDown(smooth = false) {
    if (isByHand() || opening.isOpening()) return;
    toBottom(smooth);
}

// the one exception to the reader's own scroll winning: a message the reader sends takes them to the foot at once, wherever they were, and
// again once the new bubble has its height
function toFoot() {
    scrolledAt = 0;
    glidedAt = 0;
    glideTo(false);
    nextTick(() => requestAnimationFrame(() => away.value || glideTo(false)));
}

watch(
    () => ui.flash.at,
    () => nextTick(() => away.value || followDown(settledOnce.value))
);

watch(
    () => dumpHere.value || pane.value === "terminal",
    (aside) => {
        if (!aside && !away.value) nextTick(() => requestAnimationFrame(() => followDown()));
    }
);

const place = useReadingPlace(scroller);

function settled() {
    if (opening.grew()) return;
    if (away.value) place.hold();
    else if (!store.focus) followDown(settledOnce.value);
}

function scrolled() {
    watchScroll();
    if (away.value) place.mark();
    else place.forget();
}

let grew = null;
let added = null;
const opening = useOpenInPlace(scroller, FAR, readingUp);

function pressed(event) {
    if (isScrollbarPress(event, scroller.value)) scrolledByHand();
    opening.press(event);
}

// the keys that scroll the page move the chat by the reader's hand from wherever the focus is, outside a field they type in
const SCROLL_KEYS = new Set(["PageUp", "PageDown", "ArrowUp", "ArrowDown", "Home", "End", " "]);

function pagedByKey(event) {
    if (SCROLL_KEYS.has(event.key) && !event.target.closest?.("input, textarea, [contenteditable]")) scrolledByHand();
}

function keyed(event) {
    opening.keyed(event);
}

onMounted(() => {
    grew = new ResizeObserver(() => settled());
    const watchRows = () => {
        for (const el of scroller.value?.children || []) grew.observe(el);
    };
    watchRows();
    added = new MutationObserver(() => {
        watchRows();
        settled();
    });
    if (scroller.value) added.observe(scroller.value, {childList: true});
    if (views.value) sizeWatch.observe(views.value);
    if (scroller.value) paneWatch.observe(scroller.value);
    window.addEventListener("keydown", pagedByKey);
    frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => (rendering.value = true));
    });
});

// scrolled back, the chat keeps every row it holds while it refreshes; back at the foot it trims to its newest page
watch(away, (back) => (back ? scope.keepRows("messages") : scope.releaseRows("messages")));

const {loading: loadingOlder, older} = useScrollback(scroller, topMark, () => demand("rows.older", {scope, table: "messages"}), {
    ready: () => ready.value && settledOnce.value,
    scrolled: () => scrolledUp.value,
    margin: AHEAD,
});

onUnmounted(() => {
    grew?.disconnect();
    added?.disconnect();
    sizeWatch.disconnect();
    paneWatch.disconnect();
    window.removeEventListener("keydown", pagedByKey);
    clearTimeout(planTimer);
    cancelAnimationFrame(frame);
});

let scrolledAt = 0;
const BY_HAND = 600;
// a scroll the reader's hand made just now
const isByHand = () => Date.now() - scrolledAt < BY_HAND;
// a scroll up the reader made, by hand or by asking for a turn above; the pane pulled up by a row that shrank or a dock that folded
// is no reader leaving the foot
const isReaderMove = () => isByHand() || Boolean(store.focus);

// the reader's own hand on the pane always wins: a glide the chat started stops where it is, and the chat moves itself no more for
// a moment (followDown)
function scrolledByHand() {
    scrolledAt = Date.now();
    const s = scroller.value;
    if (s && Date.now() - glidedAt < GLIDE) s.scrollTo({top: s.scrollTop});
    glidedAt = 0;
}

function wheeled(e) {
    if (wheelsInside(e, scroller.value)) return;
    scrolledByHand();
    const s = scroller.value;
    if (e.deltaY < 0 && s && s.scrollHeight > s.clientHeight + AT_BOTTOM) {
        glidedAt = 0;
        readingUp();
    }
    if (e.deltaY > 0 && s && s.scrollHeight - s.scrollTop - s.clientHeight <= AT_BOTTOM) settlePlan(true);
}

// the docks open again at the foot and fold only on a scroll up: the pane gliding down to what arrived passes through a gap
// on its way, which folds nothing
function followPlan(s) {
    const gap = s.scrollHeight - s.scrollTop - s.clientHeight;
    const down = s.scrollTop > lastTop;
    const up = s.scrollTop < lastTop;
    lastTop = s.scrollTop;
    if (gap <= AT_BOTTOM && down) settlePlan(true);
    else if (up && isReaderMove() && gap > foldingRoom()) settlePlan(false);
    return gap;
}

function foldingRoom() {
    return planOpen.value && docks.value ? Math.max(FOLD_AT, docks.value.offsetHeight - FOLDED_PLAN) : FOLD_AT;
}

function settlePlan(open) {
    clearTimeout(planTimer);
    if (open) planOpen.value = true;
    else planTimer = setTimeout(() => (planOpen.value = false), PLAN_SETTLE);
}

function leftTheBottom(s) {
    const up = s.scrollTop < lastScroll;
    lastScroll = s.scrollTop;
    if (!up || !isReaderMove() || s.scrollHeight - s.scrollTop - s.clientHeight <= AT_BOTTOM) return;
    glidedAt = 0;
    readingUp();
    if (settledOnce.value) scrolledUp.value = true;
}

const offFoot = ref(false);

// a turn that arrives while the reader follows the foot is pushed in by the chat gliding up first, then faded in (arrival.js); one that
// arrives while the reader is away, while the tab is hidden or its latest page is read on return, or before the chat settled, just appears
// a message the user just sent, drawn before the journal has it, whose key is its placeholder's
const isOwnSent = (el) => (el.dataset?.ref || el.querySelector?.("[data-ref]")?.dataset.ref || "").startsWith("pending:");
const following = () => settledOnce.value && !away.value && !releasingHeld.value && !ui.away.tabHidden && !ui.away.readingLatest;
const arrivalPane = () => ({pane: scroller.value, follows: following});
const comeIn = arrivalQueue();
watch(
    () => ui.away.tabHidden,
    (tabHidden) => {
        if (!tabHidden) return;
        comeIn.flush();
    }
);
// back on the page, by the tab or the window's focus, the turns still queued to come in one by one are shown at once and the reader is at the
// foot, so nothing that came while they were away plays out in front of them
watch(
    () => ui.away.returnedAt,
    () => {
        comeIn.flush();
        if (!away.value) toFoot();
    }
);
// A tab refresh keeps the reader's place; only a reader already following returns to the bottom.
watch(
    () => ui.away.readingLatest,
    (reading) => reading || away.value || toFoot()
);
const growIn = (el, done) => (isOwnSent(el) ? arriveAtOnce(el, arrivalPane(), done) : comeIn(el, arrivalPane(), done));
const closeUp = (el, done) => (following() ? depart(el, done) : done());

function watchScroll() {
    const s = scroller.value;
    if (!s) return;
    const gap = followPlan(s);
    offFoot.value = gap > FAR;
    leftTheBottom(s);
    if (Date.now() - glidedAt < GLIDE) return;
    const far = gap > AT_BOTTOM;
    if (far && !away.value && !store.focus && !isByHand()) {
        followDown();
        return;
    }
    if (far && isReaderMove()) readingUp();
    else if (!far) atTheFoot();
    if (settledOnce.value && away.value) scrolledUp.value = true;
    if (scrolledUp.value && s.scrollTop < NEAR_TOP) older();
}

async function post(text, files) {
    if (editing.value) {
        await scope.api.change("messages", editing.value.id, {text: withQuote(editing.value.quote, text)});
        editing.value = null;
        return;
    }
    const replying = quote.value;
    // a comment on a row names its row with on and quotes nothing; the band shows the row's title alone
    const body = replying.on ? text : withQuote(replying.text, text);
    if (scope.chat) {
        quote.value = {text: "", ref: ""};
        await scope.chat.send(body);
        await scope.chat.refresh();
        toFoot();
        return;
    }
    const replyTo = replying.ref ? Number(replying.ref.split(":")[1]) : null;
    quote.value = {text: "", ref: ""};
    const id = token();
    const placeholder = await promised(body, files, id);
    await nextTick();
    toFoot();
    let sent;
    try {
        sent = await sendMessage(scope.env || route.value.env, {text: body, reply_target: replyTo, refers: replying.refers, on: replying.on}, files, id);
    } catch (e) {
        drop(placeholder);
        if (!quote.value.ref && !quote.value.text) quote.value = replying;
        throw e;
    }
    sent.delivered.then((delivered) => delivered || change(placeholder, {unsent: true}));
    if (replying.approves) sent.delivered.then((delivered) => delivered && approveWithMessage(replying.approves, sent.id));
}

function measured(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve([img.naturalWidth, img.naturalHeight]);
        img.onerror = () => resolve(null);
        img.src = url;
    });
}

async function promised(body, files, idempotency) {
    const previews = Object.fromEntries(files.map((f) => [f.name, URL.createObjectURL(f)]));
    const pictures = {};
    for (const f of files) {
        const size = f.type.startsWith("image/") ? await measured(previews[f.name]) : null;
        if (size) pictures[f.name] = size;
    }
    return promise(
        "messages",
        {text: body, idempotency},
        {author: "user", files: files.map((f) => f.name), previews, pictures, data: {}, reply_target: null, read_at: null}
    );
}

watch(busy, async () => {
    await nextTick();
    if (!away.value) followDown(settledOnce.value);
});

watch(
    () => (rendering.value ? turns.value.length : -1),
    async (n, before) => {
        await nextTick();
        if (!ready.value) {
            if (n < 0) return;
            ready.value = true;
            await nextTick();
            laidOut.value += 1;
        }
        if (loadingOlder.value) return;
        if (!away.value && settledOnce.value) glidedAt = Date.now();
        arrived(n - (before || 0), settledOnce.value);
        if (n && !settledOnce.value) setTimeout(() => (settledOnce.value = true), 300);
    },
    {immediate: true}
);

</script>

<template>
    <div ref="threadRoot" class="thread">
        <Transition name="dump">
            <DumpWindow v-if="dumpHere" />
        </Transition>
        <Transition name="terminal">
            <TerminalWindow v-if="terminalOpen" />
        </Transition>
        <template v-if="questionView.id && questionView.owner === threadRoot">
            <QuestionOverlay :key="questionView.id" />
        </template>
        <template v-if="updateView.id && updateView.owner === threadRoot">
            <UpdateOverlay :key="updateView.id" />
        </template>
        <template v-if="outputOpen">
            <OutputDialog :key="outputOpen" :n="outputOpen" @close="outputOpen = 0" />
        </template>
        <template v-if="chatOpen">
            <div :class="['thread-write', {hidden: feeding}]">
                <Transition name="rise">
                    <button
                        v-if="showNewest"
                        type="button"
                        :class="['thread-down', {'over-docks': dockCount}]"
                        :style="{'--docks': dockCount}"
                        :title="held || missed ? `${held || missed} arrived while you were reading` : 'Back to the newest'"
                        @click="toBottom()"
                    >
                        <Icon name="down" />
                        {{ held || missed ? `${held || missed} new` : "Newest" }}
                    </button>
                </Transition>
                <p v-if="sessionNotice" class="thread-notice" data-session-notice>{{ sessionNotice }}</p>
                <template v-if="editing">
                    <div class="thread-answering">
                        <span class="thread-answering-label">Editing message {{ editing.id }}</span>
                        <span class="thread-answering-text">{{ editing.text }}</span>
                        <button type="button" class="thread-answering-x" title="Leave it as it was (Esc)" @click="unedit">×</button>
                    </div>
                </template>
                <template v-if="!scope.chat || scope.chat.send">
                    <Compose
                        :placeholder="'Message the agent'"
                        submit="Send"
                        :send="post"
                        :waiting="waitingNow"
                        :quote="quote.text"
                        :quote-label="quote.label || 'Replying to'"
                        @unquote="quote = {text: '', ref: ''}"
                        @typing="toBottom(true)"
                        :preset="editing ? editing.text : ''"
                        :up="editLast"
                        :down="unedit"
                        :many="here ? dumpOffer : null"
                        :idle="here ? dumpIdle : null"
                        :figure-home="here"
                    />
                </template>
                <template v-if="waitingOpen && waitingNow">
                    <WaitingPanel :waiting="waitingNow" :anchor="waitingAnchor" @close="waitingOpen = false" />
                </template>
            </div>
            <div ref="views" class="thread-views">
                <div
                    ref="scroller"
                    :class="['thread-scroll', {focusing: store.focus, loading: !ready, hidden: feeding}]"
                    @scroll.passive="scrolled"
                    @wheel.passive="wheeled"
                    @touchmove.passive="scrolledByHand"
                    @keydown="keyed"
                    @pointerdown="pressed"
                >
                    <template v-if="rendering">
                        <div ref="topMark" class="thread-top" />
                        <template v-if="loadingOlder">
                            <Skeleton shape="older" label="Loading older messages" />
                        </template>
                        <template v-if="!turns.length">
                            <template v-if="turnsLoaded">
                                <p class="thread-empty">Nothing has been said here yet.</p>
                            </template>
                        </template>
                        <TransitionGroup :name="settledOnce ? 'turn' : ''" @enter="growIn" @leave="closeUp">
                            <Turn
                                v-for="t in turns"
                                :key="keyOf(t)"
                                :turn="t"
                                @reply="quote = $event"
                                @edit="editing = $event"
                                @grew="settled"
                            />
                        </TransitionGroup>
                    </template>
                </div>
                <template v-if="rendering">
                    <div :class="['chat-foot', {hidden: feeding || !ready}]" data-figure-chat-foot>
                        <div ref="docks" class="chat-docks" :data-figure-docked-bars="dockCount ? '' : null">
                            <TransitionGroup name="dock" :duration="DOCK_MOTION_MS">
                                <template v-for="docked in aloneDocks" :key="docked.id">
                                    <ChatDock :message="docked" :folded="short || !planOpen" />
                                </template>
                            </TransitionGroup>
                            <DockGroup :runs="runDocks" :grouped="grouped" :folded="short || !planOpen" />
                            <Transition name="dock" :duration="DOCK_MOTION_MS">
                                <DumpDock v-if="dumpDock" :key="dumpDock.id" :dump="dumpDock" :folded="short || !planOpen" />
                            </Transition>
                            <Transition name="dock" :duration="DOCK_MOTION_MS">
                                <PlanCard v-if="planCard" :key="planCard.id" :plan="planCard" :folded="short || !planOpen" />
                            </Transition>
                        </div>
                        <template v-if="busy && !waitingNow">
                            <div :class="['thread-turn', 'busy', {faded: offFoot}]" :aria-label="`The agent is ${line.doing}`">
                                <div class="thread-meta">
                                    <Dot kind="started" solid :size="6" />
                                    <RunningCommand :idle="line.doing" />
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div :class="['thread-turn', 'busy', {faded: offFoot}]" :aria-label="`The agent is ${waitingNow ? 'waiting' : 'idle'}`">
                                <div class="thread-meta">
                                    <Dot kind="queued" solid :size="6" />
                                    <template v-if="waitingNow">
                                        <button type="button" class="thread-waiting" title="Open the waiting list" @click="toggleWaiting">waiting</button>
                                    </template>
                                    <template v-else>
                                        <span>idle</span>
                                    </template>
                                </div>
                            </div>
                        </template>
                        <RunMenu />
                    </div>
                </template>
                <Transition name="pane">
                    <template v-if="feeding">
                        <FileFeed :key="feedKey" :agent="owner.id" :options="ui.threadFeed" @options="ui.threadFeed = $event" />
                    </template>
                </Transition>
            </div>
        </template>
    </div>
</template>

<style scoped>
.terminal-enter-active,
.terminal-leave-active {
    transition:
        transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 0.18s ease;
}

.terminal-leave-active {
    position: absolute;
    inset: 0;
}

.terminal-enter-from,
.terminal-leave-to {
    opacity: 0;
    transform: translateY(14px);
}

.turn-move {
    transition: transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.thread {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.thread-turn.busy {
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-self: stretch;
    width: 100%;
    max-height: 48px;
    transition:
        opacity 0.25s ease,
        max-height 0.25s ease,
        margin-top 0.25s ease;
}

.thread-turn.busy .thread-bubble {
    display: flex;
    align-self: flex-start;
    align-items: center;
    gap: 4px;
    padding: 10px 12px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: var(--bubble);
}

.thread-turn.busy {
    --tone: var(--accent);
    translate: 0 6px;
}

.thread-turn.busy .thread-meta {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
    white-space: nowrap;
    padding: 0 3px;
    font-size: 11px;
    color: var(--text-3);
}

.thread-waiting {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
}

.thread-waiting:hover {
    color: var(--text);
    text-decoration: underline;
}

.thread-meta-on {
    min-width: 0;
    overflow: hidden;
    margin-left: 6px;
    color: var(--text-4);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 10.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.thread-scroll.loading {
    position: absolute;
    visibility: hidden;
    inset: 0;
}

.thread-views {
    position: relative;
    order: 1;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

/* the line of what the agent is doing fades and gives up its row while the reader has scrolled up, so the folded docks
   sit right above the composer; back at the foot the row opens again under the docks */
.thread-turn.busy.faded {
    max-height: 0;
    margin-top: -7px;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
}

/* marks one after another sit closer together than the messages around them */
.thread-scroll
    :deep(.thread-turn:is(.skill, .card, .whisper, .subagent, .group) + .thread-turn:is(.skill, .card, .whisper, .subagent, .group)) {
    margin-top: -5px;
}

/* on a phone, whose marks always show their action, they keep 12 pixels between them for a thumb */
:global(
    html.phone
        .thread-scroll
        .thread-turn:is(.skill, .card, .whisper, .subagent, .group)
        + .thread-turn:is(.skill, .card, .whisper, .subagent, .group)
) {
    margin-top: 2px;
}

.thread-scroll {
    order: 1;
    overflow-anchor: none;
    flex: 1;
    min-height: 0;
    transition:
        opacity 0.18s,
        visibility 0s;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    --scroll-top-padding: 18px;
    /* a group's head sticks at the scroller's very top, so nothing shows above it in the padding */
    --fold-top: calc(-1 * var(--scroll-top-padding));
    padding: var(--scroll-top-padding) 8px 20px;
    /* bubbles scrolled under the foot fade out over its last stretch rather than end at a hard line; the padding keeps the newest clear of the fade */
    mask-image: linear-gradient(to bottom, #000 calc(100% - 20px), transparent);
}

.thread-scroll:has(.thread-turn:hover) :deep(.thread-turn:not(:hover) .thread-bubble) {
    opacity: 0.82;
}

.thread-scroll.focusing :deep(.thread-turn:not(.lit)) {
    opacity: 0.35;
    filter: blur(0.6px);
    transition:
        opacity 0.25s ease,
        filter 0.25s ease;
}

.thread-scroll.hidden {
    visibility: hidden;
    opacity: 0;
    transition:
        opacity 0.18s,
        visibility 0s 0.18s;
}

.pane-enter-active,
.pane-leave-active {
    transition: opacity 0.18s;
}

.pane-enter-from,
.pane-leave-to {
    opacity: 0;
}

.thread-write {
    order: 3;
    position: relative;
    flex: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0 calc(-1 * var(--home-gutter));
    padding: 8px var(--home-gutter) 12px;
}

.thread-write.hidden {
    display: none;
}

.thread-write :deep(.compose-box) {
    margin-right: 2px;
}

.status-enter-active {
    transition:
        opacity 0.22s ease-out,
        transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.status-leave-active {
    transition:
        opacity 0.16s ease-in,
        transform 0.16s ease-in;
}

.status-enter-from,
.status-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

.rise-enter-active {
    transition:
        opacity 0.22s ease-out,
        transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.rise-leave-active {
    transition:
        opacity 0.16s ease-in,
        transform 0.16s ease-in;
}

.rise-enter-from,
.rise-leave-to {
    opacity: 0;
    transform: translate(-50%, 8px);
}

.thread-down {
    position: absolute;
    bottom: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 11px;
    border: 1px solid var(--text);
    border-radius: 99px;
    background: var(--text);
    color: #0d0e10;
    font-size: 11.5px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
}

/* The docked bars and the line under them take their own room under the pane, so the pane's last bubble always ends above them */
.chat-foot {
    position: relative;
    z-index: 2;
    order: 2;
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 7px;
    padding: 0 8px;
}

/* the room under the foot belongs to its last row, so with the line faded and no docks the pane runs down to the composer and its
   bubbles fade out there, with no empty strip between */
.chat-foot > .thread-turn.busy {
    margin-bottom: 12px;
}

.chat-foot > .thread-turn.busy.faded {
    margin-bottom: 0;
}

.chat-foot:has(> .thread-turn.faded) > .chat-docks:has(> *) {
    margin-bottom: 12px;
}

.chat-foot.hidden {
    visibility: hidden;
}

/* the docks run the composer's whole width, out over the foot's own side padding, which only the status line keeps */
.chat-docks {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0 -8px;
}

.thread-down.over-docks {
    bottom: calc(100% + 20px + var(--docks) * 42px);
}

.thread-down:hover {
    background: #fff;
    border-color: #fff;
    color: #000;
}

.thread-down .ico {
    width: 13px;
    height: 13px;
    stroke-width: 2.1;
    color: inherit;
}

.thread-answering {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    font-size: 12px;
}

.thread-notice {
    margin: 0 0 6px;
    font-size: 12.5px;
    color: var(--text-2);
}

.thread-answering-label {
    flex: none;
    color: var(--accent-text);
}

.thread-answering-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-3);
}

.thread-answering-x {
    border: 0;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.thread-empty {
    padding: 18px 2px;
    color: var(--text-3);
}
</style>
