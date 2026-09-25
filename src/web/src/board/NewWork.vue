<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import ChatLine from "../kit/ChatLine.vue";
import ChatPanel from "../kit/ChatPanel.vue";
import FileSlip from "../kit/FileSlip.vue";
import FocusStage from "../kit/FocusStage.vue";
import Icon from "../kit/Icon.vue";
import Segmented from "../kit/Segmented.vue";
import {quoted} from "../format/quote.js";
import {store, word} from "../state/store.js";
import {rows} from "../sync/rows.js";
import {useFloatingChat} from "../composables/floatingChat.js";
import {useStepAbout} from "../composables/sequenceRuns.js";
import {FIRST_STEP, PICKED_LINES, STEP_LINES, STEP_WORDS} from "./stepLines.js";
import Suggestion from "./Suggestion.vue";
import AskedQuestion from "./AskedQuestion.vue";
import DraftDetail from "./DraftDetail.vue";
import ReadingRail from "./ReadingRail.vue";

const props = defineProps({open: Boolean, board: Object, stage: {type: String, default: ""}, starts: Boolean});
const emit = defineEmits(["close", "added"]);
const words = ref("");
const lines = ref([]);
const sent = ref([]);
const since = ref(0);
const lastSent = ref(0);
const picked = ref([]);
const adding = ref(false);
const added = ref(0);
const panel = ref(null);
const revealed = ref([]);
const docked = ref(false);
const tab = ref("chat");
const discarding = ref(false);
const failed = ref("");
const openedAt = ref(0);
const INPUT_LIMIT = 280;
const resumed = ref(false);
let resetTimer = 0;
let inFlight = null;
let sessions = 0;
const PENDING = Infinity;
const START_OVER = "Start over";
const shownDraft = ref(null);
const FADED = 400;
const HELD = 400;
const EXAMPLES = [
    "People sign in before they can change anything",
    "The board gets slow with many cards",
    "Show who changed a card and when",
];

const WIDE = window.matchMedia("(min-width: 1160px)");
const SMALL = window.matchMedia("(max-width: 760px)");
const tabs = ref(!WIDE.matches);
const phone = ref(SMALL.matches);
const viewHeight = ref(window.visualViewport ? window.visualViewport.height : window.innerHeight);
const fits = () => ((tabs.value = !WIDE.matches), (phone.value = SMALL.matches));
const measured = () => (viewHeight.value = window.visualViewport ? window.visualViewport.height : window.innerHeight);

const asked = computed(() => rows("message").filter((m) => sent.value.includes(m.data.idempotency)));
const replies = computed(() => {
    const refs = asked.value.map((m) => m.ref);
    return rows("comment").filter((c) => c.refs.some((ref) => refs.includes(ref)));
});
const boardQuestions = computed(() => (since.value ? store.board.questions.filter((q) => q.created >= since.value) : []));
const asking = computed(() => boardQuestions.value.find((q) => !q.completed));
const confirmed = computed(() => drafts.value.length > 0 || store.board.expected > 0);
const TYPING_FASTEST = 4;
const typingSpeed = computed(() => Math.min(TYPING_FASTEST, 1 + Math.max(0, drafts.value.length - 1) * 0.3));
const drafting = computed(() => (since.value && store.board.drafting) || {});
const phase = computed(() => drafting.value.phase || "");
const lost = computed(() => phase.value === "lost");
const halted = computed(() => phase.value === "stalled");
const step = useStepAbout(() => drafting.value.asked || []);
const stepAt = ref(0);
watch(step, () => (stepAt.value = Date.now() / 1000), {immediate: true});
const progress = computed(() => (drafting.value.log || []).at(-1));
const pickedSince = computed(() => boardQuestions.value.some((q) => q.completed > stepAt.value && q.outcome !== START_OVER));
const thinking = computed(() => {
    if (progress.value && progress.value.at > stepAt.value) return [progress.value.text];
    if (pickedSince.value) return PICKED_LINES;
    return STEP_LINES[step.value] || STEP_LINES[FIRST_STEP];
});
const startedOver = computed(() => boardQuestions.value.find((q) => q.completed && q.outcome === START_OVER));
const conversation = computed(() =>
    [
        ...lines.value,
        ...(resumed.value
            ? asked.value
                  .filter((m) => !lines.value.some((line) => line.id === m.data.idempotency))
                  .map((m) => ({id: m.ref, mine: true, at: m.created, text: m.brief || m.title}))
            : []),
        ...replies.value.map((c) => ({id: c.ref, typed: true, at: c.created, text: quoted(c.brief || c.title).text})),
        ...boardQuestions.value.map((q) => ({id: q.ref, question: q, at: q.created})),
        ...boardQuestions.value
            .filter((q) => q.completed && q.outcome && q.outcome !== START_OVER)
            .map((q) => ({id: `${q.ref}-answer`, mine: true, at: q.completed, text: q.outcome})),
    ].sort((a, b) => a.at - b.at)
);
const spoken = computed(() => conversation.value.filter((line) => line.text || line.question));
const drafts = computed(() =>
    rows("ticket").filter(
        (t) =>
            since.value && t.data.draft && Number(t.data.board) === props.board.n && t.created >= since.value && !t.deleted && !t.completed
    )
);
const outline = computed(() => (since.value && store.board.drafting.outline) || []);
const reading = computed(() => outline.value.length > 0);
const documentName = computed(
    () =>
        asked.value.find((m) => m.data.document)?.data.document ||
        drafts.value.find((t) => t.data.source && t.data.source !== "user")?.data.source ||
        ""
);
const pointed = ref(null);
const answered = (at) => replies.value.some((c) => c.created >= at) || boardQuestions.value.some((q) => q.created >= at);
const writing = computed(() => Boolean(lastSent.value) && !answered(lastSent.value));
const revising = computed(() => writing.value && drafts.value.length > 0);
const empty = computed(
    () => docked.value && phase.value === "drafting" && !writing.value && !asking.value && !drafts.value.length && !reading.value
);

const goal = computed(() => props.board.data.goal || props.board.goal || "");
const doneWhen = computed(() => props.board.data.done_when || props.board.done_when || []);
const clauseOf = (served) =>
    (typeof served === "number" || /^\d+$/.test(String(served)) ? doneWhen.value[Number(served) - 1] : served) || "";
const covers = (ticket) => (ticket ? (ticket.data.covers || ticket.covers || []).map(clauseOf).filter(Boolean) : []);

const summary = computed(() => {
    if (!since.value) return {text: "", step: ""};
    if (lost.value) return {text: drafting.value.reading || "Not clear yet", step: "Still reading the request"};
    const text = drafting.value.reading || (writing.value ? "Not clear yet" : "");
    if (phase.value === "drafting" && !writing.value && drafts.value.length) return {text, step: `${drafts.value.length} drafts ready`};
    if (asking.value) return {text, step: "Asking you"};
    return {text, step: STEP_WORDS[step.value] || (writing.value ? "Reading the request" : "")};
});
const summaryKey = computed(() => `${summary.value.text}|${summary.value.step}`);

const turn = computed(() => drafts.value.find((t) => !revealed.value.includes(t.n)));
const cards = computed(() => {
    const ahead = writing.value && confirmed.value ? Math.max(store.board.expected - drafts.value.length, 0) : 0;
    const slots = Array.from({length: ahead}, (_, i) => ({key: `slot-${i}`, order: drafts.value.length + i, ticket: null}));
    return [...drafts.value.map((ticket, order) => ({key: `ticket-${ticket.n}`, order, ticket})), ...slots];
});
const shownDrafts = computed(() => drafts.value.filter((t) => revealed.value.includes(t.n)));
const reveal = (n) => (revealed.value = [...revealed.value, n]);
const STALLED_AFTER = 120000;
const stalled = ref(false);
const lastAsked = ref("");
let stallTimer = 0;
watch(writing, (on) => on || (words.value = ""));
watch([writing, asking, () => drafts.value.length, progress], ([on]) => {
    clearTimeout(stallTimer);
    stalled.value = false;
    if (on) stallTimer = setTimeout(() => (stalled.value = writing.value && !asking.value), STALLED_AFTER);
});

const row = computed(() => {
    if (discarding.value) return "discard";
    if (failed.value) return "failed";
    if (!since.value) return handed.value ? "upload" : "chips";
    if (stalled.value || halted.value) return "stalled";
    if (writing.value && !asking.value) return "status";
    return "";
});
const placeholder = computed(() => {
    if (handing.value) return "Anything I should know? Optional";
    if (asking.value) return "Pick one, or answer in your own words";
    if (drafts.value.length) return "Change these drafts…";
    if (since.value) return "Anything to add?";
    return "Describe the work in your own words";
});
const tabOptions = computed(() => [
    {key: "chat", label: "Chat"},
    {key: "drafts", label: `Drafts ${drafts.value.length}`},
]);

const first = computed(() => props.stage || props.board.data.stages[0]);
const proposed = (ticket) =>
    Object.entries(ticket.data.dependencies || {})
        .filter(([, stance]) => stance === "proposed")
        .map(([ref]) => Number(ref.split(":")[1]));
const pickedDrafts = computed(() => drafts.value.filter((t) => picked.value.includes(t.n)));
const served = computed(() => new Set(pickedDrafts.value.flatMap(covers)));
const missing = computed(() => (picked.value.length ? doneWhen.value.filter((clause) => !served.value.has(clause)) : []));
const note = computed(() => {
    if (added.value) return `Added to ${first.value}`;
    if (revising.value) return "Redrafting…";
    if (writing.value && !drafts.value.length) return reading.value ? "Reading…" : "Drafting…";
    if (empty.value) return "No drafts";
    if (!picked.value.length)
        return writing.value
            ? `${drafts.value.length} drafted so far · click a card to pick it`
            : `${drafts.value.length} drafts · click the ones to add`;
    if (doneWhen.value.length)
        return `${picked.value.length} picked · covers ${doneWhen.value.length - missing.value.length} of ${doneWhen.value.length} done points`;
    return props.starts
        ? `${picked.value.length} picked · they go to ${first.value}; their agents start as room frees up`
        : `${picked.value.length} picked · they go to ${first.value}`;
});
const addLabel = computed(() => {
    if (added.value) return `Added ${added.value}`;
    if (adding.value) return `Adding ${picked.value.length}`;
    return picked.value.length ? `Add ${picked.value.length} to ${first.value}` : `Add to ${first.value}`;
});
const cardRect = (n) => document.querySelector(`.pick[data-ticket="${n}"]`)?.getBoundingClientRect();
const sameSet = (a, b) => a.length === b.length && a.every((n) => b.includes(n));
const presets = computed(() => {
    const shown = shownDrafts.value.map((t) => t.n);
    const groups = Object.entries(store.board.drafting.groups || {}).map(([name, tickets]) => ({
        key: `group:${name}`,
        name,
        tickets: tickets.map(Number).filter((n) => shown.includes(n)),
    }));
    return [{key: "all", name: "All", tickets: shown}, ...groups.filter((g) => g.tickets.length)].map((g) => ({
        ...g,
        label: `${g.name} ${g.tickets.length}`,
    }));
});
const preset = computed(() => presets.value.find((p) => picked.value.length && sameSet(p.tickets, picked.value))?.key || "");
const choose = (key) => (picked.value = [...presets.value.find((p) => p.key === key).tickets]);
const FLASH_MS = 1600;
const flashed = ref([]);
let appliedPicks = 0;
let flashTimer = 0;
const toggle = (n) => added.value || (picked.value = picked.value.includes(n) ? picked.value.filter((p) => p !== n) : [...picked.value, n]);
const unpicked = () => drafts.value.filter((t) => !picked.value.includes(t.n));
const drop = (tickets) => Promise.all(tickets.map((t) => api.act("ticket", t.n, "delete", {why: "not picked in New work"})));
const say = (mine, text, id = `line-${lines.value.length}`, kind = "") =>
    (lines.value = [...lines.value, {id, mine, kind, text, at: (conversation.value.at(-1)?.at || 0) + 0.001}]);

function onKey(e) {
    if (!props.open || shownDraft.value) return;
    if (e.key === "Escape") return (e.preventDefault(), escape());
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && picked.value.length) return (e.preventDefault(), add());
    const shown = shownDrafts.value[Number(e.key) - 1];
    if (shown && !e.target.closest("input,textarea,[contenteditable='true']")) (e.preventDefault(), toggle(shown.n));
}

watch([() => store.board.drafting.picks?.at || 0, since], ([at]) => {
    if (!since.value || at <= appliedPicks || at < since.value) return;
    appliedPicks = at;
    const chosen = (store.board.drafting.picks.tickets || []).map(Number).filter((n) => drafts.value.some((t) => t.n === n));
    flashed.value = drafts.value.map((t) => t.n).filter((n) => chosen.includes(n) !== picked.value.includes(n));
    picked.value = chosen;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => (flashed.value = []), FLASH_MS);
});

watch(
    () => drafts.value.length >= 1 || reading.value || phase.value === "drafting",
    (dock) => dock && (docked.value = true),
    {immediate: true}
);

const {openChat} = useFloatingChat();

const LISTENERS = {keydown: onKey, dragover: (e) => hovering(e), drop: (e) => dropped(e), paste: (e) => pastedFile(e)};
onMounted(() => {
    Object.entries(LISTENERS).forEach(([event, listener]) => window.addEventListener(event, listener));
    WIDE.addEventListener("change", fits);
    SMALL.addEventListener("change", fits);
    window.visualViewport && window.visualViewport.addEventListener("resize", measured);
});
onUnmounted(() => {
    Object.entries(LISTENERS).forEach(([event, listener]) => window.removeEventListener(event, listener));
    WIDE.removeEventListener("change", fits);
    SMALL.removeEventListener("change", fits);
    window.visualViewport && window.visualViewport.removeEventListener("resize", measured);
    clearTimeout(resetTimer);
    clearTimeout(flashTimer);
    clearTimeout(stallTimer);
});

function greet() {
    say(false, `What do you want to get done on ${props.board.title}?`, "greet", "lead");
    say(
        false,
        "Say it in a sentence. I ask a few short questions until I understand, then draft tickets for you to pick from.",
        "intro",
        "aside"
    );
}

watch(
    () => props.open,
    (open) => {
        if (!open) return;
        if (resetTimer) (clearTimeout(resetTimer), (resetTimer = 0), startAnew());
        openedAt.value = Date.now() / 1000;
        if (!lines.value.length) greet();
        if (!since.value && store.board.drafting.since) resume(store.board.drafting);
        nextTick(() => panel.value && panel.value.focus());
    },
    {immediate: true}
);

async function send(text) {
    discarding.value = false;
    if (handing.value) return hand();
    if (asking.value) {
        words.value = "";
        lastSent.value = PENDING;
        const done = await api.act("question", asking.value.n, word("question", "complete"), {how: text});
        lastSent.value = done.completed;
        return;
    }
    const id = crypto.randomUUID();
    say(true, text, id);
    words.value = "";
    lastSent.value = PENDING;
    lastAsked.value = text;
    await ask(text, id);
}

const handed = ref(null);
const picker = ref(null);
const handing = computed(() => Boolean(handed.value) && !since.value);

function take(file) {
    if (since.value || !file) return;
    failed.value = "";
    handed.value = file;
}

async function hand() {
    const text = words.value.trim();
    const file = handed.value;
    failed.value = "";
    words.value = "";
    say(true, text || `Draft tickets from ${file.name}`, `hand-${sessions}`);
    lastSent.value = PENDING;
    since.value = PENDING;
    const id = crypto.randomUUID();
    const session = sessions;
    sent.value = [...sent.value, id];
    try {
        await api.upload("board", props.board.n, file);
        inFlight = api.handWork(props.board.n, file.name, text, id);
        const made = await inFlight;
        inFlight = null;
        handed.value = null;
        if (session !== sessions) return;
        if (since.value === PENDING) since.value = made.created;
        lastSent.value = made.created;
    } catch (e) {
        inFlight = null;
        if (session !== sessions) return;
        lines.value = lines.value.filter((line) => line.id !== `hand-${sessions}`);
        sent.value = sent.value.filter((s) => s !== id);
        since.value = 0;
        lastSent.value = 0;
        failed.value = file.name;
    }
}

function dropped(e) {
    const file = e.dataTransfer && e.dataTransfer.files[0];
    if (!props.open || !file || since.value) return;
    e.preventDefault();
    take(file);
}

function pastedFile(e) {
    const file = props.open && e.clipboardData && e.clipboardData.files[0];
    if (!file || since.value) return;
    e.preventDefault();
    take(file);
}

const hovering = (e) => props.open && !since.value && e.preventDefault();

function filed(text, id) {
    if (drafts.value.length) return api.reviseWork(props.board.n, text, id);
    if (sent.value.length) return api.followUpWork(props.board.n, text, id);
    since.value = PENDING;
    return api.requestWork(props.board.n, text, id);
}

async function ask(text, id = crypto.randomUUID()) {
    const session = sessions;
    inFlight = filed(text, id);
    sent.value = [...sent.value, id];
    const made = await inFlight;
    inFlight = null;
    if (session !== sessions) return;
    if (since.value === PENDING) since.value = made.created;
    lastSent.value = made.created;
}

function askAgain() {
    stalled.value = false;
    lastSent.value = PENDING;
    ask(lastAsked.value || asked.value[0]?.brief || asked.value[0]?.title || "");
}

const retrying = ref(false);

async function retry() {
    retrying.value = true;
    try {
        await api.act("board", props.board.n, "retry");
        lastSent.value = Date.now() / 1000;
    } finally {
        retrying.value = false;
    }
}

function example(text) {
    words.value = text;
    panel.value.focus();
}

function again() {
    tab.value = "chat";
    say(false, "What should the new set do differently?");
    panel.value.focus();
}

const pause = (ms) => new Promise((done) => setTimeout(done, ms));

async function add() {
    if (adding.value || added.value) return;
    adding.value = true;
    const drafted = [...drafts.value];
    const keep = drafted.map((t) => t.n).filter((n) => picked.value.includes(n));
    for (const n of keep) await api.act("ticket", n, "confirm");
    for (const t of drafted.filter((d) => keep.includes(d.n) && proposed(d).length)) {
        const only = proposed(t).filter((n) => keep.includes(n) || !drafted.some((d) => d.n === n));
        await (only.length
            ? api.act("ticket", t.n, "accept_dependencies", {only: only.join(",")})
            : api.act("ticket", t.n, "decline_dependencies"));
    }
    if (props.starts || first.value !== props.board.data.stages[0]) for (const n of keep) await api.moveTicket(n, first.value);
    if (keep.length) await api.act("board", props.board.n, "added", {tickets: keep.join(",")});
    adding.value = false;
    added.value = keep.length;
    await pause(HELD);
    if (keep.length) openChat();
    emit("added", keep.length);
    finish();
}

function startOver() {
    Promise.resolve(inFlight).finally(() => api.cancelWork(props.board.n));
    startAnew();
    greet();
    nextTick(() => panel.value.focus());
}

function escape() {
    if (added.value) return finish();
    if (adding.value) return;
    if (discarding.value) return (discarding.value = false);
    cancel();
}

function cancel() {
    if (since.value && !discarding.value) return (discarding.value = true);
    finish();
}

function finish() {
    discarding.value = false;
    emit("close");
    Promise.resolve(inFlight).finally(() => api.cancelWork(props.board.n));
    resetTimer = setTimeout(() => ((resetTimer = 0), startAnew()), FADED);
}

watch(asking, (current, before) => {
    if (!before || current || startedOver.value) return;
    lastSent.value = boardQuestions.value.find((q) => q.n === before.n)?.completed || lastSent.value;
});

watch(startedOver, async (q) => {
    if (!q) return;
    await drop(unpicked());
    startAnew();
    greet();
});

function resume(drafting) {
    resumed.value = true;
    since.value = drafting.since;
    sent.value = [drafting.idempotency];
    lastSent.value = Math.max(drafting.since, ...store.board.questions.map((q) => q.completed || 0));
}

function startAnew() {
    sessions += 1;
    resumed.value = false;
    docked.value = false;
    tab.value = "chat";
    discarding.value = false;
    failed.value = "";
    revealed.value = [];
    pointed.value = null;
    stalled.value = false;
    words.value = "";
    handed.value = null;
    lines.value = [];
    sent.value = [];
    since.value = 0;
    lastSent.value = 0;
    picked.value = [];
    added.value = 0;
    flashed.value = [];
    appliedPicks = 0;
}
</script>

<template>
    <FocusStage :open="open" glow spread brisk :docked="docked" :escapes="false">
        <div
            :class="['new-work', {docked, tabs, phone, drafted: tabs && tab === 'drafts', revising, confirmed: added > 0}]"
            :style="{'--view': `${viewHeight}px`}"
        >
            <div class="stage">
                <div class="talk">
                    <ChatPanel
                        ref="panel"
                        v-model="words"
                        :locked="adding || added > 0"
                        :limit="INPUT_LIMIT"
                        :placeholder="placeholder"
                        @send="send"
                    >
                        <template #head>
                            <div class="head">
                                <span class="head-title">
                                    New work
                                    <span class="head-board">{{ board.title }}</span>
                                </span>
                                <Btn small @click="cancel">Cancel</Btn>
                            </div>
                            <div class="sub">
                                <Transition name="layer">
                                    <template v-if="tabs && docked">
                                        <div key="tabs" class="sub-layer">
                                            <Segmented fill :options="tabOptions" :value="tab" @pick="(key) => (tab = key)" />
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div key="reading" class="sub-layer">
                                            <Transition name="layer">
                                                <div :key="summaryKey" class="reading" :title="summary.text">
                                                    <template v-if="summary.text">
                                                        <span class="reading-text">{{ summary.text }}</span>
                                                    </template>
                                                    <template v-else>
                                                        <span class="reading-text quiet">I'll say here what I think you mean.</span>
                                                    </template>
                                                    <span class="reading-step">{{ summary.step }}</span>
                                                </div>
                                            </Transition>
                                        </div>
                                    </template>
                                </Transition>
                            </div>
                            <p class="announce" aria-live="polite">{{ summary.text }}</p>
                        </template>
                        <template v-for="line in spoken" :key="line.id">
                            <template v-if="line.question">
                                <AskedQuestion :question="line.question" chat />
                            </template>
                            <template v-else-if="line.kind">
                                <ChatLine :kind="line.kind" :text="line.text" />
                            </template>
                            <template v-else>
                                <ChatLine :text="line.text" :mine="line.mine" :typed="Boolean(line.typed) && line.at > openedAt" />
                            </template>
                        </template>
                        <template v-if="lost">
                            <div class="lost">
                                <ChatLine
                                    text="I still don't know what you want. Let's start over: say it again in other words, or give me an example."
                                />
                                <Btn kind="primary" small @click="startOver">
                                    <Icon name="restore" :size="12" />
                                    Start over
                                </Btn>
                            </div>
                        </template>
                        <template #row>
                            <Transition name="layer">
                                <template v-if="row === 'chips'">
                                    <div key="chips" class="row-layer chips">
                                        <template v-for="text in EXAMPLES" :key="text">
                                            <Btn small @click="example(text)">{{ text }}</Btn>
                                        </template>
                                    </div>
                                </template>
                                <template v-else-if="row === 'upload'">
                                    <div key="upload" class="row-layer">
                                        <FileSlip class="slip" :file="handed" removable @remove="handed = null" />
                                        <Btn kind="primary" small @click="hand">Read it and draft tickets</Btn>
                                    </div>
                                </template>
                                <template v-else-if="row === 'failed'">
                                    <div key="failed" class="row-layer">
                                        <span class="row-text bad">Couldn't upload {{ failed }}.</span>
                                        <Btn small @click="hand">Try again</Btn>
                                    </div>
                                </template>
                                <template v-else-if="row === 'stalled'">
                                    <div key="stalled" class="row-layer">
                                        <span class="row-text">
                                            {{
                                                halted
                                                    ? drafting.stalled || "The drafting stopped."
                                                    : "No answer yet. The agent may be busy with other work."
                                            }}
                                        </span>
                                        <template v-if="halted">
                                            <Btn small :busy="retrying" @click="retry">Retry</Btn>
                                        </template>
                                        <template v-else>
                                            <Btn small @click="askAgain">Ask again</Btn>
                                        </template>
                                    </div>
                                </template>
                                <template v-else-if="row === 'status'">
                                    <div key="status" class="row-layer">
                                        <ChatLine bare shuffled :notes="thinking" />
                                    </div>
                                </template>
                                <template v-else-if="row === 'discard'">
                                    <div key="discard" class="row-layer">
                                        <span class="row-text">Discard this conversation?</span>
                                        <Btn small @click="discarding = false">Keep</Btn>
                                        <Btn kind="danger" small @click="finish">Discard</Btn>
                                    </div>
                                </template>
                            </Transition>
                        </template>
                        <template #tool>
                            <template v-if="!since">
                                <Btn small title="Draft tickets from a document" @click="picker.click()">
                                    <Icon name="paperclip" />
                                </Btn>
                            </template>
                            <input ref="picker" type="file" hidden @change="take($event.target.files[0])" />
                        </template>
                    </ChatPanel>
                </div>
                <section class="pane" aria-label="Drafts">
                    <div class="bar">
                        <div class="note">
                            <span class="note-main">{{ note }}</span>
                            <template v-if="missing.length">
                                <span class="note-sub" :title="missing.join('; ')">Missing: {{ missing.join("; ") }}</span>
                            </template>
                        </div>
                        <template v-if="presets.length > 1 && !phone">
                            <Segmented class="presets" :options="presets" :value="preset" @pick="choose" />
                        </template>
                        <Btn small :disabled="!shownDrafts.length || writing || added > 0" @click="again">Ask for a different set</Btn>
                        <Btn kind="primary" small class="add" :busy="adding" :disabled="!picked.length || added > 0" @click="add">
                            {{ addLabel }}
                        </Btn>
                    </div>
                    <div class="pane-body">
                        <template v-if="reading">
                            <ReadingRail
                                class="rail"
                                :name="documentName"
                                :sections="outline"
                                :drafted="drafts.length"
                                :pointed="pointed"
                            />
                        </template>
                        <div class="grid">
                            <template v-if="goal || doneWhen.length">
                                <div class="brief">
                                    <template v-if="goal">
                                        <p class="brief-goal">{{ goal }}</p>
                                    </template>
                                    <template v-if="doneWhen.length">
                                        <ol class="brief-done">
                                            <template v-for="clause in doneWhen" :key="clause">
                                                <li :class="{missing: missing.includes(clause)}">{{ clause }}</li>
                                            </template>
                                        </ol>
                                    </template>
                                </div>
                            </template>
                            <TransitionGroup tag="div" name="pick" class="picks">
                                <template v-for="card in cards" :key="card.key">
                                    <Suggestion
                                        :ticket="card.ticket"
                                        :order="card.order"
                                        :active="Boolean(card.ticket) && card.ticket === turn"
                                        :paused="Boolean(asking)"
                                        :speed="typingSpeed"
                                        :hurry="drafts.length > 0 && !writing"
                                        :picked="Boolean(card.ticket) && picked.includes(card.ticket.n)"
                                        :covers="covers(card.ticket)[0] || ''"
                                        :class="{flash: Boolean(card.ticket) && flashed.includes(card.ticket.n)}"
                                        @toggle="toggle(card.ticket.n)"
                                        @revealed="reveal(card.ticket.n)"
                                        @more="(from) => (shownDraft = {ticket: card.ticket, from})"
                                        @mouseenter="pointed = card.ticket"
                                        @mouseleave="pointed = null"
                                    />
                                </template>
                            </TransitionGroup>
                            <template v-if="empty">
                                <p class="empty">No tickets came out of this. Say more in the chat, or ask for a different set.</p>
                            </template>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <template v-if="shownDraft">
            <DraftDetail
                :ticket="shownDraft.ticket"
                :from="shownDraft.from"
                :picked="picked.includes(shownDraft.ticket.n)"
                :measure="() => cardRect(shownDraft.ticket.n)"
                @keep="toggle(shownDraft.ticket.n)"
                @close="shownDraft = null"
            />
        </template>
    </FocusStage>
</template>

<style scoped>
/* One stage, fixed from the first frame: nothing in it changes width or height. The conversation keeps its 680px
   and only moves (transform); the drafts pane is revealed by a wipe (clip-path). Only opacity, transform and
   clip-path animate. */
.new-work {
    --w: min(1400px, calc(100vw - 48px));
    --h: min(720px, calc(var(--view, 100dvh) - 48px));
    --talk: 680px;
    --gap: 16px;

    position: absolute;
    inset: 0;
}

.new-work.tabs {
    --w: min(680px, calc(100vw - 16px));
    --h: min(820px, calc(var(--view, 100dvh) - 16px));
}

.stage {
    position: absolute;
    top: calc((var(--view, 100dvh) - var(--h)) / 2);
    left: calc((100vw - var(--w)) / 2);
    width: var(--w);
    height: var(--h);
}

.talk {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: var(--talk);
    transform: translateX(calc((var(--w) - var(--talk)) / 2));
    transition: transform 0.42s var(--ease);
}

.docked .talk {
    transform: none;
}

.tabs .talk {
    width: 100%;
    transform: none;
}

.phone .talk {
    --chat-row: 52px;
}

.talk :deep(.log),
.talk :deep(.row),
.talk :deep(.compose) {
    transition:
        opacity 0.32s ease-out,
        transform 0.32s var(--ease);
}

.drafted .talk :deep(.log),
.drafted .talk :deep(.row),
.drafted .talk :deep(.compose) {
    opacity: 0;
    transform: translateX(-20%);
    pointer-events: none;
    transition:
        opacity 0.32s ease-in,
        transform 0.32s var(--ease);
}

.head {
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    height: 52px;
    padding: 0 8px 0 16px;
    border-bottom: 1px solid var(--border);
    box-sizing: border-box;
}

.head-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.head-board {
    margin-left: 6px;
    color: var(--text-4);
    font-weight: 400;
}

.sub {
    position: relative;
    flex: none;
    height: 49px;
    border-bottom: 1px solid var(--border);
    box-sizing: border-box;
}

.sub-layer {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    padding: 0 16px;
}

.tabs .sub-layer:has(.segmented) {
    padding: 0 6px;
}

.reading {
    position: absolute;
    inset: 0 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
}

.reading-text {
    overflow: hidden;
    color: var(--text);
    font-size: 13px;
    line-height: 18px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.reading-text.quiet {
    color: var(--text-4);
}

.reading-step {
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 16px;
}

.announce {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    overflow: hidden;
    clip-path: inset(50%);
}

.row-layer {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;
}

.chips {
    overflow-x: auto;
    scrollbar-width: none;
}

.chips > :deep(*) {
    flex: none;
}

.row-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    font-size: 12.5px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.phone .row-text {
    line-height: 16px;
    white-space: normal;
}

.row-text.bad {
    color: var(--danger);
}

.slip {
    flex: 1;
    min-width: 0;
}

.lost {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
}

/* The fixed rows swap by crossfade: out 120ms, in 180ms starting 60ms later, 3px of travel. */
.layer-enter-active {
    transition:
        opacity 0.18s ease-out 0.06s,
        transform 0.18s var(--ease) 0.06s;
}

.layer-leave-active {
    transition:
        opacity 0.12s ease-in,
        transform 0.12s ease-in;
}

.layer-enter-from {
    opacity: 0;
    transform: translateY(3px);
}

.layer-leave-to {
    opacity: 0;
    transform: translateY(-3px);
}

.pane {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: calc(var(--talk) + var(--gap));
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border-2);
    border-radius: 16px;
    background: rgba(24, 25, 28, 0.94);
    backdrop-filter: blur(20px);
    box-shadow: 0 28px 80px rgba(0, 0, 0, 0.55);
    opacity: 0;
    clip-path: inset(0 100% 0 0 round 16px);
    pointer-events: none;
    transition:
        opacity 0.24s ease-in,
        clip-path 0.24s ease-in;
}

.docked .pane {
    opacity: 1;
    clip-path: inset(0 0 0 0 round 16px);
    pointer-events: auto;
    transition:
        opacity 0.24s ease-out 0.12s,
        clip-path 0.42s var(--ease) 0.12s;
}

.tabs .pane,
.tabs.docked .pane {
    top: 102px;
    right: 1px;
    bottom: 1px;
    left: 1px;
    border: 0;
    border-radius: 0 0 15px 15px;
    background: var(--raised);
    box-shadow: none;
    backdrop-filter: none;
    clip-path: none;
    opacity: 0;
    transform: translateX(calc(100% + 16px));
    pointer-events: none;
    transition:
        opacity 0.32s ease-in,
        transform 0.32s var(--ease);
}

.tabs.drafted .pane {
    opacity: 1;
    transform: none;
    pointer-events: auto;
    transition:
        opacity 0.32s ease-out,
        transform 0.32s var(--ease);
}

.bar {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    height: 52px;
    padding: 0 8px 0 16px;
    border-bottom: 1px solid var(--border);
}

.tabs .bar {
    order: 2;
    flex-wrap: wrap;
    align-content: center;
    row-gap: 6px;
    height: 88px;
    padding: 0 8px;
    border-top: 1px solid var(--border);
    border-bottom: 0;
}

.note {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
    line-height: 16px;
}

.tabs .note {
    flex: 1 0 100%;
    flex-direction: row;
    gap: 8px;
    height: 20px;
    align-items: center;
}

.note-main,
.note-sub {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.note-main {
    color: var(--text-3);
    font-size: 13px;
}

.tabs .note-main {
    flex: none;
    font-size: 12.5px;
}

.note-sub {
    color: var(--warn, var(--blocking));
    font-size: 11.5px;
}

.presets {
    flex: 0 1 auto;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
}

.presets :deep(.segmented-option) {
    white-space: nowrap;
}

.add {
    min-width: 140px;
    font-variant-numeric: tabular-nums;
}

.tabs .bar > :deep(.btn) {
    flex: 1;
}

.tabs .note {
    justify-content: flex-start;
}

.phone .head > :deep(.btn),
.phone .bar > :deep(.btn),
.phone .row-layer > :deep(.btn) {
    min-height: 40px;
}

.pane-body {
    display: flex;
    flex: 1;
    min-height: 0;
}

.tabs .pane-body {
    flex-direction: column;
}

.rail {
    flex: none;
    width: 240px;
    padding: 16px 12px 16px 16px;
    border-right: 1px solid var(--border);
}

.tabs .rail {
    width: auto;
    max-height: 40%;
    padding: 12px;
    border-right: 0;
    border-bottom: 1px solid var(--border);
}

.grid {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 16px;
    scrollbar-width: none;
}

.tabs .grid {
    padding: 12px;
}

.brief {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
}

.brief-goal {
    margin: 0;
    color: var(--text);
    font-weight: 500;
}

.brief-done {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding-left: 18px;
    color: var(--text-2);
    font-size: 12.5px;
}

.brief-done li.missing {
    color: var(--warn, var(--blocking));
}

.picks {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: minmax(200px, auto);
    align-content: start;
    gap: 12px;
}

.tabs .picks {
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(150px, auto);
    gap: 10px;
}

.picks > :deep(.pick) {
    transition:
        opacity 0.24s ease-out,
        border-color 0.12s ease-out,
        box-shadow 0.12s ease-out,
        transform 0.25s var(--ease);
}

.revising .picks > :deep(.pick) {
    opacity: 0.4;
    pointer-events: none;
}

.confirmed .picks > :deep(.pick:not(.picked)) {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
}

.pick-move {
    transition: transform 0.32s var(--ease);
}

.pick-leave-active {
    transition: opacity 0.12s ease-in;
}

.pick-leave-to {
    opacity: 0;
}

.flash {
    animation: pick-flash 1.6s ease-out;
}

@keyframes pick-flash {
    20% {
        box-shadow:
            0 0 0 2px var(--accent),
            0 0 32px -6px var(--accent);
    }
}

.empty {
    margin: 48px auto 0;
    max-width: 320px;
    color: var(--text-3);
    text-align: center;
    text-wrap: pretty;
    animation: fade-in 0.24s ease-out 0.18s both;
}

@media (prefers-reduced-motion: reduce) {
    .talk,
    .pane,
    .docked .pane,
    .tabs .pane,
    .tabs.drafted .pane,
    .talk :deep(.log),
    .talk :deep(.row),
    .talk :deep(.compose),
    .layer-enter-active,
    .layer-leave-active {
        transition-duration: 0.12s;
        transition-delay: 0s;
    }

    .talk,
    .docked .talk,
    .tabs .pane,
    .drafted .talk :deep(.log),
    .drafted .talk :deep(.row),
    .drafted .talk :deep(.compose) {
        transform: none;
    }

    .flash {
        animation: none;
    }
}
</style>
