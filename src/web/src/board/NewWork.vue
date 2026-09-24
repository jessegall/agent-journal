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
const panel = ref(null);
const revealed = ref([]);
const docked = ref(false);
const INPUT_LIMIT = 280;
const OPEN_TURNS = 2;
const GROW_MS = 450;
const tall = ref(false);
const resumed = ref(false);
const grown = ref(false);
let growTimer = 0;
let resetTimer = 0;
let inFlight = null;
let sessions = 0;
const PENDING = Infinity;
let typedAnswer = false;
const START_OVER = "Start over";
const shownDraft = ref(null);
const FADED = 400;
const EXAMPLES = [
    "I want people to sign in before they can change anything",
    "Let someone invite a teammate to this project",
    "Show who changed a card and when",
    "The board gets slow once there are many cards",
    "A weekly summary of what moved",
];
const EXAMPLE_MS = 6000;
const example = ref(0);
let exampleTimer = 0;
const UNSURE = [
    "Reading what you wrote",
    "Taking in your words",
    "Looking for the heart of it",
    "Reading it once more, slowly",
    "Finding where to begin",
    "Listening for what you need",
    "Getting a first sense of it",
    "Noting the words that matter",
    "Looking at the board for context",
    "Seeing who this is for",
    "Sorting the ask from the detail",
    "Working out the kind of work",
    "Checking what the board already has",
    "Looking for the problem behind it",
    "Picturing what you have in mind",
    "Starting from your own words",
    "Gathering the first clues",
    "Holding off on guesses",
    "Finding the question to ask",
    "Getting my bearings",
];
const UNDERSTANDING = [
    "Still working out what you mean",
    "Trying another reading",
    "Looking for what I missed",
    "Weighing two ways to read it",
    "Asking myself what you'd expect",
    "Checking my guess against your words",
    "Finding the part I'm unsure of",
    "Looking for a clearer angle",
    "Working out what done looks like",
    "Thinking about who uses it",
    "Trying to see it your way",
    "Figuring out the scope",
    "Separating the wish from the must",
    "Looking for an example to hold on to",
    "Reading between the lines",
    "Tracing it back to the problem",
    "Finding the one question that helps",
    "Setting my first guess aside",
    "Seeing what's still open",
    "Getting closer",
];
const PINNING = [
    "Pinning it down",
    "Narrowing it to what matters",
    "Drawing the edges",
    "Deciding what's in and what's out",
    "Checking the parts fit together",
    "Naming the pieces",
    "Settling the open questions",
    "Finding the smallest useful version",
    "Lining up the details",
    "Checking it against the board",
    "Ruling out what it isn't",
    "Firming up the scope",
    "Choosing between two readings",
    "Tightening the wording",
    "Checking what depends on what",
    "Spotting what's still vague",
    "Matching it to what exists",
    "Holding the shape steady",
    "Closing the last gaps",
    "Almost there",
];
const CONCRETE = [
    "Making it concrete",
    "Turning it into steps",
    "Picturing the finished thing",
    "Working out the first piece",
    "Sketching how it splits",
    "Checking each piece stands alone",
    "Giving each part a name",
    "Deciding the order",
    "Thinking about how you'd check it",
    "Writing down what done means",
    "Putting numbers on it",
    "Finding where it touches the code",
    "Weighing the size of each part",
    "Checking nothing is missing",
    "Keeping the steps small",
    "Looking for the risky bit",
    "Getting the shape right",
    "Checking it reads plainly",
    "Getting the first draft ready",
    "Nearly ready to draft",
];
const SCOPING = [
    "Settling the scope",
    "Nearly there",
    "Weighing how big the first version is",
    "Deciding what can wait",
    "Finding the first useful slice",
    "Checking it isn't too broad",
    "Drawing the line for version one",
    "Sorting now from later",
    "Keeping the first step small",
    "Checking the scope with you in mind",
    "Deciding where it stops",
    "Trimming what isn't needed yet",
    "Picking what matters most",
    "Checking one question is worth asking",
    "Choosing between broad and narrow",
    "Keeping it to what you asked",
    "Looking at the size of it",
    "Marking what comes after",
    "Getting ready to draft",
    "One last check before drafting",
];
const EXPLORING = [UNSURE, UNDERSTANDING, PINNING, CONCRETE, SCOPING];
const DRAFTING = [
    "Looking at what is already there",
    "Deciding what can ship on its own",
    "Splitting it into pieces",
    "Keeping each piece small enough",
    "Checking each piece stands alone",
    "Weighing what comes first",
    "Finding what waits on what",
    "Naming each ticket",
    "Writing a line for each card",
    "Writing what each one does",
    "Writing why each one matters",
    "Writing what each one touches",
    "Writing when each one is done",
    "Checking for risk outside the project",
    "Linking what was read for it",
    "Checking the cards on other boards",
    "Making sure nothing is drafted twice",
    "Leaving out what you did not ask for",
    "Keeping the steps inside the tickets",
    "Putting them in the order they run",
    "Checking the count",
    "Reading the drafts again",
    "Tidying the wording",
    "Writing the tickets",
    "Getting the drafts ready to pick",
];
const REVISING = [
    "Reading your change",
    "Finding the cards it is about",
    "Leaving the other cards alone",
    "Checking what you asked to drop",
    "Checking what you asked to add",
    "Rewording the card",
    "Changing the line on the card",
    "Changing what the card says it does",
    "Checking the order still holds",
    "Checking what waits on what",
    "Making the new card fit the others",
    "Keeping the change small",
    "Checking nothing else moved",
    "Reading the drafts again",
    "Checking the count",
    "Tidying the wording",
    "Checking the change against your words",
    "Making sure it reads plainly",
    "Checking no card says it twice",
    "Checking the new card stands alone",
    "Keeping the steps inside the tickets",
    "Linking what was read for it",
    "Checking for risk outside the project",
    "Writing one line about it",
    "Getting the drafts back to you",
];

const asked = computed(() => rows("message").filter((m) => sent.value.includes(m.data.idempotency)));
const replies = computed(() => {
    const refs = asked.value.map((m) => m.ref);
    return rows("comment").filter((c) => c.refs.some((ref) => refs.includes(ref)));
});
const boardQuestions = computed(() => (since.value ? store.board.questions.filter((q) => q.created >= since.value) : []));
const asking = computed(() => boardQuestions.value.find((q) => !q.completed));
const choosing = computed(() => Boolean(asking.value && asking.value.data.final));
const confirmed = computed(() => drafts.value.length > 0 || store.board.expected > 0);
const answeredQuestions = computed(() => boardQuestions.value.filter((q) => q.completed && q.outcome !== START_OVER).length);
const TYPING_FASTEST = 4;
const typingSpeed = computed(() => Math.min(TYPING_FASTEST, 1 + Math.max(0, drafts.value.length - 1) * 0.3));
const allDrafted = computed(() => drafts.value.length > 0 && drafts.value.length >= store.board.expected);
const drafting = computed(() => (since.value && store.board.drafting) || {});
const phase = computed(() => drafting.value.phase || "");
const lost = computed(() => phase.value === "lost");
const scored = computed(() => (phase.value === "exploring" ? drafting.value.score || 0 : answeredQuestions.value ? 2 : 0));
const thinking = computed(() =>
    allDrafted.value
        ? REVISING
        : confirmed.value || phase.value === "drafting"
          ? DRAFTING
          : EXPLORING[Math.min(scored.value, EXPLORING.length - 1)]
);
const startedOver = computed(() => boardQuestions.value.find((q) => q.completed && q.outcome === START_OVER));
const conversation = computed(() =>
    [
        ...lines.value,
        ...(resumed.value
            ? asked.value
                  .filter((m) => !lines.value.some((line) => line.id === m.data.idempotency))
                  .map((m) => ({id: m.ref, mine: true, at: m.created, text: m.brief || m.title}))
            : []),
        ...replies.value.map((c) => ({id: c.ref, mine: false, typed: true, at: c.created, text: quoted(c.brief || c.title).text})),
        ...boardQuestions.value
            .filter((q) => q.completed)
            .map((q) => ({id: q.ref, record: true, at: q.completed, text: `Asked: ${q.title} → ${q.outcome}`})),
    ].sort((a, b) => a.at - b.at)
);
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
const view = ref("drafts");
const views = computed(() => [
    {key: "drafts", label: `Drafts ${drafts.value.length}`},
    {key: "document", label: "Document"},
]);
const answered = (at) => replies.value.some((c) => c.created >= at) || boardQuestions.value.some((q) => q.created >= at);
const writing = computed(() => Boolean(lastSent.value) && !answered(lastSent.value));
const agentsTurn = computed(() => writing.value && !asking.value && !lost.value);
const spoken = computed(() => conversation.value.filter((line) => line.text));
const lastMine = computed(() => conversation.value.findLastIndex((line) => line.mine));
const agentLine = computed(() => conversation.value.findLast((line) => !line.mine && !line.record && line.text));
const held = computed(() => replies.value.length > 0 && !grown.value);
const latest = computed(() => ((asking.value && grown.value) || held.value || !agentLine.value ? [] : [agentLine.value]));
const agentAnswered = computed(() => Boolean(asking.value) || replies.value.length > 0);
const dockedAt = ref(0);
const echo = computed(() =>
    docked.value || drafts.value.length || (words.value && !writing.value) || lastMine.value < 0
        ? ""
        : conversation.value[lastMine.value].text
);
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
watch([writing, asking, () => drafts.value.length], ([on]) => {
    clearTimeout(stallTimer);
    stalled.value = false;
    if (on) stallTimer = setTimeout(() => (stalled.value = writing.value && !asking.value), STALLED_AFTER);
});
const first = computed(() => props.stage || props.board.data.stages[0]);
const unpicked = () => drafts.value.filter((t) => !picked.value.includes(t.n));
const proposed = (ticket) =>
    Object.entries(ticket.data.dependencies || {})
        .filter(([, stance]) => stance === "proposed")
        .map(([ref]) => Number(ref.split(":")[1]));
const note = computed(() => {
    if (asking.value) return "Pick one above, or type your own.";
    if (writing.value && !picked.value.length) return `${drafts.value.length} drafted so far. Click a card to pick it.`;
    if (!picked.value.length) return "Click a card to pick it.";
    return props.starts ? `They go to ${first.value}; their agents start as room frees up.` : `They go to ${first.value}, ready to start.`;
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
const toggle = (n) => (picked.value = picked.value.includes(n) ? picked.value.filter((p) => p !== n) : [...picked.value, n]);
const drop = (tickets) => Promise.all(tickets.map((t) => api.act("ticket", t.n, "delete", {why: "not picked in New work"})));
const say = (mine, text, id = `line-${lines.value.length}`) =>
    (lines.value = [...lines.value, {id, mine, text, typed: !mine, at: (conversation.value.at(-1)?.at || 0) + 0.001}]);

function onKey(e) {
    if (!props.open || shownDraft.value) return;
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
    () => drafts.value.length >= 1 || replies.value.length >= OPEN_TURNS || reading.value || phase.value === "drafting",
    (dock) => dock && ((dockedAt.value = conversation.value.at(-1)?.at || 0), (docked.value = true)),
    {immediate: true}
);

const {openChat} = useFloatingChat();
const LISTENERS = {keydown: onKey, dragover: (e) => hovering(e), drop: (e) => dropped(e), paste: (e) => pastedFile(e)};
onMounted(() => Object.entries(LISTENERS).forEach(([event, listener]) => window.addEventListener(event, listener)));
onUnmounted(() => {
    Object.entries(LISTENERS).forEach(([event, listener]) => window.removeEventListener(event, listener));
    clearInterval(exampleTimer);
    clearTimeout(growTimer);
    clearTimeout(resetTimer);
    clearTimeout(flashTimer);
});

const greet = () => say(false, `What do you want to get done on ${props.board.title}?`);

function showExamples() {
    clearInterval(exampleTimer);
    example.value = 0;
    exampleTimer = setInterval(() => (example.value = (example.value + 1) % EXAMPLES.length), EXAMPLE_MS);
}

watch(
    () => props.open,
    (open) => {
        if (!open) return clearInterval(exampleTimer);
        if (resetTimer) (clearTimeout(resetTimer), (resetTimer = 0), startAnew());
        if (!lines.value.length) greet();
        if (!since.value && store.board.drafting.since) resume(store.board.drafting);
        if (!since.value) showExamples();
        nextTick(() => panel.value.focus());
    },
    {immediate: true}
);

async function send(text) {
    const id = crypto.randomUUID();
    say(true, text, id);
    clearInterval(exampleTimer);
    lastSent.value = PENDING;
    if (asking.value) {
        typedAnswer = true;
        const done = await api.act("question", asking.value.n, word("question", "complete"), {how: text});
        lastSent.value = done.completed;
        return;
    }
    lastAsked.value = text;
    await ask(text, id);
}

const handed = ref(null);
const picker = ref(null);
const handing = computed(() => Boolean(handed.value) && !since.value);

function take(file) {
    if (since.value || !file) return;
    handed.value = file;
}

async function hand() {
    const text = words.value.trim();
    const file = handed.value;
    words.value = "";
    say(true, text || `Draft tickets from ${file.name}`);
    clearInterval(exampleTimer);
    lastSent.value = PENDING;
    since.value = PENDING;
    const id = crypto.randomUUID();
    const session = sessions;
    sent.value = [...sent.value, id];
    await api.upload("board", props.board.n, file);
    inFlight = api.handWork(props.board.n, file.name, text, id);
    const made = await inFlight;
    inFlight = null;
    handed.value = null;
    if (session !== sessions) return;
    if (since.value === PENDING) since.value = made.created;
    lastSent.value = made.created;
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
    ask(lastAsked.value);
}

function again() {
    say(false, "What should the new set do differently?");
    panel.value.focus();
}

async function add() {
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
    if (keep.length) {
        await api.act("board", props.board.n, "added", {tickets: keep.join(",")});
        openChat();
    }
    adding.value = false;
    emit("added", keep.length);
    finish();
}

function startOver() {
    Promise.resolve(inFlight).finally(() => api.cancelWork(props.board.n));
    startAnew();
    greet();
    showExamples();
    nextTick(() => panel.value.focus());
}

function finish() {
    emit("close");
    Promise.resolve(inFlight).finally(() => api.cancelWork(props.board.n));
    resetTimer = setTimeout(() => ((resetTimer = 0), startAnew()), FADED);
}

watch(agentAnswered, (on) => {
    if (!on || tall.value) return;
    tall.value = true;
    growTimer = setTimeout(() => (grown.value = true), GROW_MS);
});

watch(asking, (current, before) => {
    if (!before || current || startedOver.value) return;
    if (!typedAnswer) say(true, "");
    typedAnswer = false;
    lastSent.value = boardQuestions.value.find((q) => q.n === before.n)?.completed || lastSent.value;
});

watch(choosing, (final) => final && (words.value = ""));

watch(startedOver, async (q) => {
    if (!q) return;
    await drop(unpicked());
    startAnew();
    greet();
    showExamples();
});

function resume(drafting) {
    resumed.value = true;
    since.value = drafting.since;
    sent.value = [drafting.idempotency];
    lastSent.value = Math.max(drafting.since, ...store.board.questions.map((q) => q.completed || 0));
}

function startAnew() {
    sessions += 1;
    clearTimeout(growTimer);
    typedAnswer = false;
    resumed.value = false;
    docked.value = false;
    dockedAt.value = 0;
    revealed.value = [];
    pointed.value = null;
    view.value = "drafts";
    stalled.value = false;
    tall.value = false;
    grown.value = false;
    words.value = "";
    handed.value = null;
    lines.value = [];
    sent.value = [];
    since.value = 0;
    lastSent.value = 0;
    picked.value = [];
    flashed.value = [];
    appliedPicks = 0;
}
</script>

<template>
    <FocusStage :open="open" glow spread :docked="docked" :escapes="false">
        <Transition name="rail">
            <template v-if="reading">
                <div :class="['rail', {shown: view === 'document'}]">
                    <ReadingRail :name="documentName" :sections="outline" :drafted="drafts.length" :pointed="pointed" />
                </div>
            </template>
        </Transition>
        <div :class="['work', {on: docked, reading, document: view === 'document'}]">
            <template v-if="reading">
                <div class="views">
                    <Segmented :options="views" :value="view" @pick="(key) => (view = key)" />
                </div>
            </template>
            <div class="bar">
                <span class="note">{{ note }}</span>
                <div :class="['bar-actions', {on: shownDrafts.length}]">
                    <Segmented class="presets" :options="presets" :value="preset" @pick="choose" />
                    <Btn small @click="again">Ask for a different set</Btn>
                    <Btn kind="primary" small :busy="adding" :disabled="!picked.length" @click="add">
                        {{ picked.length ? `Add ${picked.length} to ${first}` : `Add to ${first}` }}
                    </Btn>
                </div>
            </div>
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
                        @toggle="toggle(card.ticket.n)"
                        @revealed="reveal(card.ticket.n)"
                        @more="(from) => (shownDraft = {ticket: card.ticket, from})"
                        :class="{flash: Boolean(card.ticket) && flashed.includes(card.ticket.n)}"
                        @mouseenter="pointed = card.ticket"
                        @mouseleave="pointed = null"
                    />
                </template>
            </TransitionGroup>
        </div>
        <div :class="['dock', {docked, short: !tall && !lost, reading, thinking: agentsTurn}]">
            <ChatPanel
                ref="panel"
                v-model="words"
                fill
                :closable="!docked"
                @close="finish"
                :locked="adding"
                :limit="docked ? 0 : INPUT_LIMIT"
                :without-input="choosing || lost"
                :waiting="agentsTurn"
                :echo="echo"
                :hint="since ? '' : `“${EXAMPLES[example]}”`"
                :placeholder="
                    handing
                        ? 'Anything I should know? Optional'
                        : drafts.length
                          ? 'Say what to change'
                          : 'Describe the work in your own words'
                "
                @send="send"
            >
                <template v-if="!since" #attached>
                    <template v-if="handed">
                        <FileSlip :file="handed" removable @remove="handed = null" />
                        <div class="hand-row">
                            <span class="hand-note">
                                I read all of it, then draft one ticket per piece of work. Nothing goes on the board until you pick it.
                            </span>
                            <Btn kind="primary" small @click="hand">Read it and draft tickets</Btn>
                        </div>
                    </template>
                    <template v-else>
                        <span class="hand-offer">
                            <Btn small @click="picker.click()">
                                <Icon name="paperclip" />
                                From a document
                            </Btn>
                        </span>
                    </template>
                    <input ref="picker" type="file" hidden @change="take($event.target.files[0])" />
                </template>
                <template #head>
                    <div :class="['head', {on: docked}]">
                        <span class="head-title">
                            New work
                            <span class="head-board">{{ board.title }}</span>
                        </span>
                        <Btn small title="Cancel" @click="finish">Cancel</Btn>
                    </div>
                </template>
                <template v-if="docked">
                    <template v-for="line in spoken" :key="line.id">
                        <template v-if="line.record">
                            <span class="record">{{ line.text }}</span>
                        </template>
                        <template v-else>
                            <ChatLine :text="line.text" :mine="line.mine" :typed="line.typed && line.at > dockedAt" />
                        </template>
                    </template>
                </template>
                <template v-else>
                    <Transition name="said" mode="out-in" appear>
                        <template v-if="latest.length">
                            <p :key="latest[0].id" class="prompt">{{ latest[0].text }}</p>
                        </template>
                    </Transition>
                </template>
                <Transition name="fold">
                    <template v-if="!since">
                        <div class="context">
                            <p>Say it in a sentence. I say back what I think you mean, you confirm, and then I draft the tickets.</p>
                        </div>
                    </template>
                </Transition>
                <Transition name="asked" mode="out-in">
                    <template v-if="asking && (grown || docked)">
                        <AskedQuestion :key="`question-${asking.n}`" :question="asking" :chat="docked" />
                    </template>
                    <template v-else-if="lost">
                        <div key="lost" class="lost">
                            <ChatLine
                                text="I still don't know what you want. Let's start over: say it again in other words, or give me an example."
                            />
                            <Btn kind="primary" small @click="startOver">
                                <Icon name="restore" :size="12" />
                                Start over
                            </Btn>
                        </div>
                    </template>
                    <template v-else-if="writing || asking">
                        <ChatLine key="thinking" thinking shuffled :notes="thinking" />
                    </template>
                </Transition>
                <template v-if="stalled">
                    <ChatLine text="No answer yet. The agent may be busy with other work." />
                    <Btn small @click="askAgain">Ask again</Btn>
                </template>
            </ChatPanel>
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
.hand-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.hand-note {
    flex: 1;
    color: var(--text-3);
    font-size: 12.5px;
}

.hand-offer {
    display: flex;
    align-items: center;
    gap: 10px;
}

.dock {
    position: absolute;
    top: calc(50% - min(200px, 26vh));
    left: calc(50% - min(340px, 50% - 16px));
    width: min(680px, calc(100% - 32px));
    height: min(400px, 52vh);
    transition:
        top var(--move),
        left var(--move),
        width var(--move),
        height var(--move);
}

.dock.short:not(.docked) {
    height: min(260px, 40vh);
}

.dock:not(.docked) {
    transition-duration: 0.7s;
}

.dock.thinking:not(.docked) {
    left: calc(50% - min(300px, 50% - 28px));
    width: min(600px, calc(100% - 56px));
}

.lost {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
}

.dock.docked {
    top: 20px;
    left: 20px;
    width: 400px;
    height: calc(100% - 40px);
}

.dock.docked.reading {
    left: calc(100% - 360px);
    width: 340px;
}

.rail {
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 20px;
    display: flex;
    flex-direction: column;
    width: 284px;
    padding: 16px 12px;
    border: 1px solid var(--border-2);
    border-radius: 16px;
    background: rgba(24, 25, 28, 0.94);
    backdrop-filter: blur(20px);
    box-shadow: 0 28px 80px rgba(0, 0, 0, 0.55);
    box-sizing: border-box;
}

.rail-enter-active {
    transition:
        opacity var(--fade) 0.08s,
        transform var(--move) 0.08s;
}

.rail-leave-active {
    transition: opacity var(--fade);
}

.rail-enter-from {
    opacity: 0;
    transform: translateX(-16px);
}

.rail-leave-to {
    opacity: 0;
}

.views {
    display: none;
}

.head {
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    height: 0;
    overflow: hidden;
    padding: 0 8px 0 16px;
    border-bottom: 1px solid transparent;
    opacity: 0;
    transition:
        height var(--move),
        opacity 0.2s,
        border-color 0.2s;
}

.head.on {
    height: 48px;
    border-bottom-color: var(--border);
    opacity: 1;
    transition:
        height var(--move),
        opacity var(--fade) 0.2s,
        border-color var(--fade) 0.2s;
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

.work {
    position: absolute;
    top: 20px;
    right: 20px;
    bottom: 20px;
    left: 440px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    opacity: 0;
    pointer-events: none;
    transform: translateX(16px);
    transition:
        opacity var(--fade),
        transform var(--move),
        left var(--move),
        right var(--move);
}

.work.on {
    opacity: 1;
    pointer-events: auto;
    transform: none;
    transition:
        opacity var(--fade) 0.08s,
        transform var(--move) 0.08s,
        left var(--move),
        right var(--move);
}

.work.reading {
    right: 380px;
    left: 324px;
}

.bar {
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    height: 44px;
    padding: 0 6px 0 14px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: rgba(24, 25, 28, 0.94);
    backdrop-filter: blur(20px);
}

.bar-actions {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 8px;
    opacity: 0;
    pointer-events: none;
    transform: translateY(3px);
    transition:
        opacity var(--fade),
        transform var(--move);
}

.bar-actions.on {
    opacity: 1;
    pointer-events: auto;
    transform: none;
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

.picks > .flash {
    animation: pick-flash 1.6s ease-out;
}

@keyframes pick-flash {
    20% {
        box-shadow:
            0 0 0 2px var(--accent),
            0 0 32px -6px var(--accent);
    }
}

.picks {
    display: grid;
    flex: 1 1 auto;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: minmax(220px, auto);
    align-content: start;
    gap: 14px;
    min-height: 0;
    overflow-y: auto;
    padding: 2px 2px 8px;
    scrollbar-width: none;
}

.pick-move {
    transition: transform var(--move);
}

.pick-leave-active {
    transition:
        opacity 0.2s cubic-bezier(0.4, 0, 1, 1),
        transform 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.pick-leave-to {
    opacity: 0;
    transform: scale(0.98);
}

.context {
    display: grid;
    grid-template-rows: 1fr;
    animation: stage-in var(--fade) 0.55s backwards;
}

.context > p {
    min-height: 0;
    margin: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 13px;
    line-height: 20px;
}

.fold-leave-active {
    transition:
        opacity var(--fade),
        grid-template-rows var(--move) 0.15s,
        margin-bottom var(--move) 0.15s;
}

.fold-leave-to {
    grid-template-rows: 0fr;
    margin-bottom: -10px;
    opacity: 0;
}

@keyframes stage-in {
    from {
        opacity: 0;
        transform: translateY(6px);
    }
}

.asked-enter-active,
.said-enter-active {
    transition:
        opacity var(--fade),
        transform var(--move);
}

.asked-leave-active,
.said-leave-active {
    transition: opacity var(--fade);
}

.asked-enter-from,
.said-enter-from {
    opacity: 0;
    transform: translateY(6px);
}

.asked-leave-to,
.said-leave-to {
    opacity: 0;
}

.prompt {
    margin: 0;
    color: var(--text);
    font-size: 17px;
    font-weight: 500;
    line-height: 26px;
}

.record {
    align-self: flex-start;
    color: var(--text-3);
    font-size: 12px;
    animation: fade-in var(--fade) both;
}

.note {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

@media (max-width: 760px) {
    .dock:not(.docked, .short) {
        top: calc(50% - min(280px, 36vh));
        height: min(560px, 72vh);
    }

    .dock.docked {
        top: 50%;
        left: 12px;
        width: calc(100% - 24px);
        height: calc(50% - 12px);
    }

    .work {
        top: 12px;
        right: 12px;
        bottom: calc(50% + 12px);
        left: 12px;
    }

    .picks {
        grid-template-columns: 1fr;
    }

    .dock.docked.reading {
        left: 12px;
        width: calc(100% - 24px);
    }

    .work.reading {
        right: 12px;
        left: 12px;
    }

    .views {
        display: flex;
        flex: none;
        height: 32px;
    }

    .work.document .bar,
    .work.document .picks {
        visibility: hidden;
    }

    .rail {
        top: 56px;
        right: 12px;
        bottom: calc(50% + 12px);
        left: 12px;
        width: auto;
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--fade);
    }

    .rail.shown {
        opacity: 1;
        pointer-events: auto;
    }
}

@media (prefers-reduced-motion: reduce) {
    .dock,
    .head,
    .rail,
    .rail-enter-active,
    .work,
    .bar-actions,
    .asked-enter-active,
    .asked-leave-active,
    .said-enter-active,
    .said-leave-active,
    .fold-leave-active {
        transition-duration: 0.01ms;
        transition-delay: 0s;
    }
}
</style>
