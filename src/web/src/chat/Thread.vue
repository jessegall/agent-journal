<script setup>
import {subagentsOf} from "../domain/subagents.js";
import {busyLine} from "../domain/agentState.js";
import {openQuestion, questionView} from "../state/overlays.js";
import {agent} from "../composables/leadAgent.js";
import {feedOn} from "../composables/settings.js";
import {store} from "../state/store.js";
import {cardPlan} from "../domain/plans.js";
import {useWaiting} from "../composables/waiting.js";
import WaitingPanel from "./WaitingPanel.vue";
import {DEFAULT_HIDDEN} from "../domain/chatVisibility.js";
import Dot from "../kit/Dot.vue";
import RunningCommand from "./RunningCommand.vue";
import {useScrollback} from "../composables/scrollback.js";
import {useFollowing} from "../composables/following.js";
import {useReadingPlace} from "../composables/readingPlace.js";
import Skeleton from "../kit/Skeleton.vue";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {markSeen} from "../sync/seen.js";
import {sendMessage, token} from "./outbox.js";
import {usePromised} from "../composables/promised.js";
import Icon from "../kit/Icon.vue";
import {openInChat, route} from "../route.js";
import {quoted, withQuote} from "../format/quote.js";
import {laidOut} from "../platform/view.js";
import {mainChat, threadTurns} from "../domain/thread.js";
import {DUMP_OFFER} from "../domain/dumpPile.js";
import {useLiveOutputs} from "../composables/liveOutputs.js";
import {useSharedNow} from "../composables/now.js";
import {useScope} from "../composables/scope.js";
import DumpWindow from "./DumpWindow.vue";
import TerminalWindow from "./TerminalWindow.vue";
import OutputDialog from "./OutputDialog.vue";
import DumpDock from "./DumpDock.vue";
import {dockedDump, dockedRows, streamRows} from "../domain/docks.js";
import RowDock from "./RowDock.vue";
import WatchDock from "./WatchDock.vue";
import QuestionOverlay from "./QuestionOverlay.vue";
import FileFeed from "./FileFeed.vue";
import Compose from "./Compose.vue";
import Turn from "./Turn.vue";
import PlanCard from "./PlanCard.vue";
import {seconds} from "../domain/row.js";
import {ui} from "../state/ui.js";

const scroller = ref(null);
const props = defineProps({view: {type: String, default: ""}, hidden: {type: Array, default: () => DEFAULT_HIDDEN}});
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

const chat = useLiveOutputs(computed(() => (scope.chat ? rows("messages") : mainChat(rows("messages")))));
const mine = computed(() => chat.value.filter((m) => m.author === "user" && !m.read_at));

function editLast() {
    const last = mine.value[mine.value.length - 1];
    if (last) editing.value = {id: last.id, ...quoted(last.text)};
}

function unedit() {
    editing.value = null;
}
const busy = computed(() => !!owner.value && ["working", "compacting"].includes(owner.value.status));
const {waiting: waitingNow, open: waitingOpen, anchor: waitingAnchor, toggle: toggleWaiting} = useWaiting(undefined, owner);
const planCard = computed(() => cardPlan(rows("plans")));
const dumpDock = computed(() => (store.dumping ? null : dockedDump(rows("dumps"))));
const dockNow = useSharedNow();
const rowDocks = computed(() => dockedRows(chat.value, dockNow.value));
const dockCount = computed(() => rowDocks.value.length + [dumpDock.value, planCard.value].filter(Boolean).length);
const helping = computed(() =>
    subagentsOf(owner.value)
        .filter((sub) => sub.running)
        .at(-1)
);
const line = computed(() => (owner.value ? busyLine(owner.value, helping.value) : {thinking: "", doing: "working"}));
const planOpen = ref(true);
let lastTop = 0;
let lastScroll = 0;
let planTimer = 0;
const PLAN_SETTLE = 180;
const PLAN_MOVE = 500;
const short = ref(false);
const SHORT_CHAT = 420;
const sizeWatch = new ResizeObserver(([entry]) => (short.value = entry.contentRect.height < SHORT_CHAT));
const AT_BOTTOM = 2;
const FOLD_AT = 8;
const FOLDED_PLAN = 32;
const FAR = 40;
const {away, missed, showNewest, follow: atTheFoot, toBottom: glideTo, left: readingUp, arrived} = useFollowing(scroller, FAR);
const settledOnce = ref(false);
const ready = ref(false);
const unseen = computed(() =>
    chat.value
        .filter((m) => m.author === "agent" && !m.read_at)
        .map((m) => m.id)
);

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
const thread = computed(() => threadTurns(streamRows(chat.value, dockNow.value), pending.value, here && !!store.paging.more.messages, props.hidden));
watch(thread, (made) => made.keys.forEach((placeholder, ref) => link(ref, placeholder)), {immediate: true});
const turns = computed(() => thread.value.turns);
const turnsLoaded = computed(() => scope.loaded("messages"));
watch(turns, keep);

let glidedAt = 0;

function toBottom(smooth = false) {
    if (smooth) glidedAt = Date.now();
    glideTo(smooth);
}

watch(
    () => ui.flash.at,
    () => nextTick(() => away.value || toBottom(settledOnce.value))
);

watch(
    () => dumpHere.value || pane.value === "terminal",
    (away) => {
        if (!away) nextTick(() => requestAnimationFrame(() => toBottom()));
    }
);

const place = useReadingPlace(scroller);

function settled() {
    if (away.value) place.hold();
    else if (!store.focus) toBottom(settledOnce.value);
}

function scrolled() {
    watchScroll();
    if (away.value) place.mark();
    else place.forget();
}

let grew = null;
let added = null;

onMounted(() => {
    grew = new ResizeObserver(settled);
    const watchRows = () => {
        for (const el of scroller.value?.children || []) grew.observe(el);
    };
    watchRows();
    added = new MutationObserver(() => {
        watchRows();
        settled();
    });
    if (scroller.value) added.observe(scroller.value, {childList: true});
    if (scroller.value) sizeWatch.observe(scroller.value);
    frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => (rendering.value = true));
    });
});

const {loading: loadingOlder, older} = useScrollback(scroller, topMark, () => scope.earlier("messages"), {
    ready: () => ready.value && settledOnce.value && scrolledUp.value && Boolean(scroller.value),
    margin: AHEAD,
});

onUnmounted(() => {
    grew?.disconnect();
    added?.disconnect();
    sizeWatch.disconnect();
    clearTimeout(planTimer);
    cancelAnimationFrame(frame);
});

let scrolledAt = 0;
const BY_HAND = 600;

function scrolledByHand() {
    scrolledAt = Date.now();
}

function wheeled(e) {
    scrolledByHand();
    const s = scroller.value;
    if (e.deltaY < 0 && s && s.scrollHeight > s.clientHeight + AT_BOTTOM) {
        glidedAt = 0;
        readingUp();
    }
    if (e.deltaY > 0 && s && s.scrollHeight - s.scrollTop - s.clientHeight <= AT_BOTTOM) settlePlan(true);
}

function followPlan(s) {
    const gap = s.scrollHeight - s.scrollTop - s.clientHeight;
    const down = s.scrollTop > lastTop;
    lastTop = s.scrollTop;
    if (gap <= AT_BOTTOM && down) settlePlan(true);
    else if (gap > foldingRoom(s)) settlePlan(false);
    return gap;
}

function foldingRoom(s) {
    const dock = s.querySelector(".chat-docks");
    return planOpen.value && dock ? Math.max(FOLD_AT, dock.offsetHeight - FOLDED_PLAN) : FOLD_AT;
}

function settlePlan(open) {
    clearTimeout(planTimer);
    if (open) planOpen.value = true;
    else planTimer = setTimeout(() => (planOpen.value = false), PLAN_SETTLE);
}

watch(planOpen, (open) => open && holdBottom());

function holdBottom() {
    const s = scroller.value;
    const dock = s?.querySelector(".chat-docks");
    if (!dock) return;
    const pin = new ResizeObserver(() => planOpen.value && (s.scrollTop = s.scrollHeight));
    pin.observe(dock);
    setTimeout(() => pin.disconnect(), PLAN_MOVE);
}

function leftTheBottom(s) {
    const up = s.scrollTop < lastScroll - 1;
    lastScroll = s.scrollTop;
    if (!up || s.scrollHeight - s.scrollTop - s.clientHeight <= AT_BOTTOM) return;
    glidedAt = 0;
    readingUp();
    if (settledOnce.value) scrolledUp.value = true;
}

function watchScroll() {
    const s = scroller.value;
    if (!s) return;
    const gap = followPlan(s);
    leftTheBottom(s);
    if (Date.now() - glidedAt < GLIDE) return;
    const far = gap > FAR;
    if (far && !away.value && !store.focus && Date.now() - scrolledAt > BY_HAND) {
        toBottom();
        return;
    }
    if (far) readingUp();
    else atTheFoot();
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
    const body = withQuote(replying.text, text);
    if (scope.chat) {
        quote.value = {text: "", ref: ""};
        await scope.chat.send(body);
        await scope.chat.refresh();
        return;
    }
    const replyTo = replying.ref ? Number(replying.ref.split(":")[1]) : null;
    quote.value = {text: "", ref: ""};
    const id = token();
    const placeholder = await promised(body, files, id);
    await nextTick();
    toBottom(true);
    let sent;
    try {
        sent = await sendMessage(scope.env || route.value.env, {text: body, reply_target: replyTo}, files, id);
    } catch (e) {
        drop(placeholder);
        if (!quote.value.ref && !quote.value.text) quote.value = replying;
        throw e;
    }
    sent.delivered.then((delivered) => delivered || change(placeholder, {unsent: true}));
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
    if (!away.value) toBottom(settledOnce.value);
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
        <template v-if="outputOpen">
            <OutputDialog :key="outputOpen" :id="outputOpen" @close="outputOpen = 0" />
        </template>
        <template v-if="chatOpen">
            <div :class="['thread-write', {hidden: feeding}]">
                <Transition name="rise">
                    <button
                        v-if="showNewest"
                        type="button"
                        :class="['thread-down', {'over-docks': dockCount}]"
                        :style="{'--docks': dockCount}"
                        :title="missed ? `${missed} arrived while you were reading` : 'Back to the newest'"
                        @click="toBottom()"
                    >
                        <Icon name="down" />
                        {{ missed ? `${missed} new` : "Newest" }}
                    </button>
                </Transition>
                <template v-if="editing">
                    <div class="thread-answering">
                        <span class="thread-answering-label">Editing message {{ editing.id }}</span>
                        <span class="thread-answering-text">{{ editing.text }}</span>
                        <button type="button" class="thread-answering-x" title="Leave it as it was (Esc)" @click="unedit">×</button>
                    </div>
                </template>
                <template v-if="!scope.chat || scope.chat.send">
                    <Compose
                        :send="post"
                        :waiting="waitingNow"
                        @waiting-list="toggleWaiting"
                        :quote="quote.text"
                        quote-label="Replying to"
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
            <div class="thread-views">
                <div
                    ref="scroller"
                    :class="['thread-scroll', {focusing: store.focus, loading: !ready, hidden: feeding}]"
                    @scroll.passive="scrolled"
                    @wheel.passive="wheeled"
                    @touchmove.passive="scrolledByHand"
                    @keydown="scrolledByHand"
                    @pointerdown="scrolledByHand"
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
                        <TransitionGroup :name="settledOnce ? 'turn' : ''">
                            <Turn
                                v-for="t in turns"
                                :key="keyOf(t)"
                                :turn="t"
                                @reply="quote = $event"
                                @edit="editing = $event"
                                @grew="settled"
                            />
                        </TransitionGroup>
                        <div :class="['chat-docks', {docked: dockCount}]" :data-figure-docked-bars="dockCount ? '' : null">
                            <TransitionGroup name="dock">
                                <template v-for="docked in rowDocks" :key="docked.id">
                                    <template v-if="docked.data.output">
                                        <WatchDock :message="docked" :folded="short || !planOpen" />
                                    </template>
                                    <template v-else>
                                        <RowDock :message="docked" :folded="short || !planOpen" />
                                    </template>
                                </template>
                            </TransitionGroup>
                            <Transition name="dock">
                                <DumpDock v-if="dumpDock" :key="dumpDock.id" :dump="dumpDock" :folded="short || !planOpen" />
                            </Transition>
                            <Transition name="dock">
                                <PlanCard v-if="planCard" :key="planCard.id" :plan="planCard" :folded="short || !planOpen" />
                            </Transition>
                        </div>
                        <div v-if="busy && !waitingNow" class="thread-turn busy" :aria-label="`The agent is ${line.doing || 'thinking'}`">
                            <div class="thread-meta">
                                <Dot kind="started" solid :size="6" />
                                <template v-if="line.thinking">
                                    <span>thinking</span>
                                    <span class="thread-meta-on thought">{{ line.thinking }}</span>
                                </template>
                                <template v-else>
                                    <RunningCommand :idle="line.doing" />
                                </template>
                            </div>
                        </div>
                        <div v-else class="thread-turn busy" :aria-label="`The agent is ${waitingNow ? 'waiting' : 'idle'}`">
                            <div class="thread-meta">
                                <Dot kind="queued" solid :size="6" />
                                <span>{{ waitingNow ? "waiting" : "idle" }}</span>
                            </div>
                        </div>
                    </template>
                </div>
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

.turn-enter-active {
    transition:
        opacity 0.26s ease-out,
        transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.turn-enter-from {
    opacity: 0;
    transform: translateY(9px);
}

.turn-leave-active {
    position: absolute;
    transition: opacity 0.16s ease-in;
}

.turn-leave-to {
    opacity: 0;
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
}

.thread-turn.busy .thread-bubble {
    display: flex;
    align-self: flex-start;
    align-items: center;
    gap: 4px;
    padding: 10px 12px;
    border: 1px solid #232529;
    border-radius: 9px;
    background: #161719;
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

.thread-meta-on.thought {
    font-family: inherit;
    font-style: italic;
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
    gap: 7px;
    padding: 14px 8px 12px;
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

.chat-docks {
    position: sticky;
    bottom: 0;
    z-index: 2;
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 6px;
    width: 100%;
}

.chat-docks.docked {
    margin-top: auto;
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
