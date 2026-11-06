<script setup>
import {computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch} from "vue";
import {useComposerHeight} from "./composerHeight.js";
import DumpForm from "./DumpForm.vue";
import QuestionOverlay from "./QuestionOverlay.vue";
import {READ_RATES, coalesced, Btn, DockStack, FigureFloors, Icon, MarkGroup, MarkHost, MessageCard, PinsToggle, RowList, RunningCommand, SHORT_CHAT, Skeleton, SwitchCase, VoiceFigure, arrivalQueue, arriveAtOnce, depart, dockOpening, fetchDockDeclarations, fetchMarkDeclarations, foldedMarks, interleaved, markDeclaration, openInChat, patched, removed, shownMarks, usePins, WindowApi, withDayLines} from "@journal/window-kit";

const PAGE_ROWS = 50;

const windowApi = new WindowApi({state: () => ({"messages.limit": PAGE_ROWS, "marks.limit": PAGE_ROWS})});
const {rows: messages, failure, loaded, load, loadLatest, older, act, context} = windowApi.rows("messages", {pageSize: PAGE_ROWS, incremental: true});
context.markMotion = ref(false);
async function readMarkMotion() {
    const answer = await context.read("setting show journal.core.developer.tools.mark-motion");
    context.markMotion.value = answer.ok && answer.value.value === true;
}
context.follow(["setting.*"], readMarkMotion);
readMarkMotion();
const {rows: allMarks, older: olderMarks, loadLatest: latestMarks} = windowApi.rows("marks", {pageSize: PAGE_ROWS, incremental: true});
const {rows: docked} = windowApi.rows("docks");
const dockedRows = computed(() => new Set(docked.value.filter((item) => item.state === "docked").map((item) => `${item.target_model}:${item.target_id}`)));
const {rows: pins, act: runOnPin} = windowApi.rows("pins");
const openQuestion = ref(0);
const releaseQuestions = openInChat("question", (id) => {
    openQuestion.value = id;
    return true;
});
onUnmounted(releaseQuestions);
const marks = computed(() => shownMarks(allMarks.value, markDeclaration, (key) => context.option(key).value));
const outgoing = ref([]);
// a sent message shows at once as an echo, until its own row has been read: the echo goes for good when a message of the user with the same words has landed since, so an edit of that row brings it back no more
const landed = (echo) => messages.value.some((row) => row.type === echo.type && row.text === echo.text && Date.parse(row.created_at) >= echo.created_at - ECHO_SLACK_MS);
watch(messages, () => {
    const kept = outgoing.value.filter((echo) => !landed(echo));
    if (kept.length !== outgoing.value.length) outgoing.value = kept;
});
const rows = computed(() => withDayLines(foldedMarks(interleaved([...messages.value, ...outgoing.value.filter((echo) => !landed(echo))], marks.value), markDeclaration)));
const {visible: pinned} = usePins(() => pins.value);
const quoteOf = (message) => messages.value.find((row) => row.id === message.parent_id)?.text ?? "";
// the tool the agent has in hand, read each time a hook call lands, empty until it begins the next
// the figure is the one the pane names, or by default the voice the user chose, shown as the figure settings say: always, only while the agent works, or never
const VOICE_SETTINGS = ["profile", "avatar", "avatar-shown"];
const voice = ref(null);
async function readVoice() {
    const answers = await Promise.all(VOICE_SETTINGS.map((key) => context.read(`setting show journal.core.voices.${key}`)));
    const [profile, avatar, shown] = answers.map((answer) => (answer.ok ? answer.value.value : null));
    voice.value = answers.every((answer) => answer.ok) ? {profile, avatar, avatar_shown: shown} : null;
}
context.follow(["setting.*"], readVoice);
readVoice();
const voiceFigure = () => {
    if (!voice.value?.avatar || voice.value.avatar_shown === "never") return "";
    return voice.value.avatar_shown === "working" && !runningTool.value ? "" : voice.value.profile;
};
const figureVoice = computed(() => {
    const chosen = context.option("figure").value;
    if (chosen === "voice") return voiceFigure();
    return chosen && chosen !== "none" ? chosen : "";
});
const runningTool = ref("");
const waitingFor = ref("");
const thinking = ref(false);
const asking = ref(false);
const heardAt = ref(Date.now() / 1000);
// a face put on a message already in the chat is answered by the figure; faces on messages that page in are not
const facesOf = (row) => JSON.parse(row.reactions || "[]").map((face) => `${face.actor_type}:${face.emoji}`);
const FACES_KEPT = 20;
const newFaces = ref([]);
let seenFaces = new Map();
// watched by the faces themselves, so a row changed in place is seen too
const faceSignature = computed(() => messages.value.map((row) => `${row.id}:${facesOf(row).join("")}`).join("|"));
watch(faceSignature, () => {
    const rows = messages.value;
    const landed = rows.filter((row) => seenFaces.has(row.id)).flatMap((row) => facesOf(row).filter((face) => !seenFaces.get(row.id).includes(face)).map((face) => {
        const [author, emoji] = face.split(":");
        return {author, emoji, message_id: row.id, created_at: new Date().toISOString()};
    }));
    if (landed.length) newFaces.value = [...newFaces.value, ...landed].slice(-FACES_KEPT);
    seenFaces = new Map(rows.map((row) => [row.id, facesOf(row)]));
}, {immediate: true});
// the figure stays on the page until its exit has played once it should go, and is put on the page only when it should be there
const figureHere = computed(() => Boolean(figureVoice.value));
const shownVoice = ref("");
watch(figureVoice, (chosen) => {
    if (chosen) shownVoice.value = chosen;
}, {immediate: true});
async function readTool() {
    heardAt.value = Date.now() / 1000;
    const answer = await context.read("usage tool", {deferred: true});
    runningTool.value = answer.ok ? answer.value.tool : "";
    waitingFor.value = answer.ok ? answer.value.wait_target : "";
    thinking.value = answer.ok ? Boolean(answer.value.thinking) : false;
    asking.value = answer.ok ? Boolean(answer.value.asking) : false;
}
context.follow(["hook_call.*", "dock_item.*", "process_part.*"], coalesced(readTool, READ_RATES.runningTool));
readTool();
const FOLD_AFTER_MS = 500;
const ECHO_SLACK_MS = 2000;
const FOOT_PIXELS = 40;
const chat = ref(null);
const docksOpen = ref(true);
const short = ref(false);
let lastTop = 0;
let atFoot = true;
let folding = 0;
let sizeWatch = null;
let footWatch = null;
onMounted(() => {
    focusComposer();
    Promise.all([fetchMarkDeclarations(), fetchDockDeclarations()]);
    if (chat.value && typeof ResizeObserver !== "undefined") {
        sizeWatch = new ResizeObserver(([entry]) => (short.value = entry.contentRect.height < SHORT_CHAT));
        sizeWatch.observe(chat.value);
        // the history shrinks each frame while the composer grows: a chat at its foot stays there
        footWatch = new ResizeObserver(() => atFoot && scroller.value && (scroller.value.scrollTop = scroller.value.scrollHeight));
        footWatch.observe(scroller.value);
    }
});
onUnmounted(() => {
    sizeWatch?.disconnect();
    footWatch?.disconnect();
    clearTimeout(folding);
});
const text = ref("");
const sendFailure = ref("");
const scroller = ref(null);
const atTop = ref(true);
const awayFromFoot = ref(false);
const arrived = ref(0);
const dumping = ref(false);
const attached = ref([]);
const picker = ref(null);
const composerInput = ref(null);
useComposerHeight(composerInput, text);
const focusComposer = () => nextTick(() => composerInput.value?.focus());

// words put in without an input event, as dictation does, are in the box and not in text; a redraw must not write over them, so the box takes
// text only when it still shows what text last gave it, and words it holds beyond that are taken into text
let shownInBox = "";
function takeFromBox() {
    if (composerInput.value && composerInput.value.value !== shownInBox) shownInBox = text.value = composerInput.value.value;
}
const vComposerText = {
    created(element, {value}) {
        element.value = shownInBox = value;
    },
    beforeUpdate(element, {value}) {
        if (element.value !== shownInBox) takeFromBox();
        else if (element.value !== value) element.value = shownInBox = value;
    },
};
function typed(event) {
    shownInBox = text.value = event.target.value;
}
// words put in with no input event are read from the box at each moment they could be lost or needed: when the box gets focus or a key comes up in
// it, when a press lands on the row of buttons (which decides whether there is anything to send), when the window is come back to, before the
// box is taken off the page, and before a send
// dictation pastes into the focused field only, and coming back to the window leaves nothing focused: the box takes the focus back when
// nothing else holds it, so the next words land in it
function returned() {
    takeFromBox();
    if (document.activeElement === document.body || document.activeElement === null) focusComposer();
}
onMounted(() => {
    window.addEventListener("focus", returned);
    document.addEventListener("visibilitychange", returned);
});
onBeforeUnmount(() => {
    takeFromBox();
    if (!editing.value) keepDraft(text.value);
    window.removeEventListener("focus", returned);
    document.removeEventListener("visibilitychange", returned);
});
const dragging = ref(false);

async function attach(files) {
    for (const file of files) {
        // a message holds one file per name, so a second file of the same name is left out
        if (attached.value.some((entry) => entry.name === file.name)) continue;
        const entry = {name: file.name, pending: "", failure: ""};
        attached.value = [...attached.value, entry];
        const result = await context.upload(file);
        entry.pending = result.ok ? result.value : "";
        entry.failure = result.ok ? "" : result.error;
        attached.value = [...attached.value];
    }
    focusComposer();
}
const picked = (event) => {
    attach([...event.target.files]);
    event.target.value = "";
};
const pasted = (event) => {
    const files = [...(event.clipboardData?.files ?? [])];
    if (files.length) (event.preventDefault(), attach(files));
};
const dropped = (event) => {
    dragging.value = false;
    attach([...(event.dataTransfer?.files ?? [])]);
};
const removeAttached = (entry) => (attached.value = attached.value.filter((other) => other !== entry));
const sendable = computed(() => (text.value.trim() || attached.value.length) && attached.value.every((entry) => entry.pending));

const replying = ref(null);
const commenting = ref(null);
const composerQuote = computed(() => {
    if (editing.value) return `Editing message ${editing.value.id}`;
    return commenting.value ? `Comment on: ${commenting.value.text}` : `Reply to: ${replying.value?.text}`;
});
const editing = ref(null);
function startReply(message) {
    editing.value = null;
    commenting.value = null;
    replying.value = message;
    focusComposer();
}
// a comment on a message goes through the composer as a reply does, under the word Comment
function startComment(message) {
    editing.value = null;
    replying.value = null;
    commenting.value = message;
    focusComposer();
}
// a face shows at once, put on or taken off as the command will leave it, and goes back with the reason if the server refuses
async function reactTo(message, face) {
    const faces = JSON.parse(message.reactions || "[]");
    const had = faces.some((held) => held.actor_type === "user" && held.emoji === face);
    const left = had ? faces.filter((held) => !(held.actor_type === "user" && held.emoji === face)) : [...faces, {emoji: face, actor_type: "user"}];
    const result = await act(["message", "react", String(message.id), face], patched(message.id, {reactions: JSON.stringify(left)}));
    sendFailure.value = result.ok ? "" : result.error;
}

async function removeMessage(message) {
    const result = await act(["message", "delete", String(message.id)], removed(message.id));
    sendFailure.value = result.ok ? "" : result.error;
}
// the arrow up in an empty box brings back the newest message of yours the agent has not read, to change it; the arrow down or escape leaves it
const lastOwn = () => outgoing.value.at(-1) ?? messages.value.find((row) => ["user", "comment"].includes(row.type));
function editUp(event) {
    if (text.value || !lastOwn()) return;
    event.preventDefault();
    editing.value = lastOwn();
    replying.value = null;
    commenting.value = null;
    text.value = editing.value.text;
}
function leaveEdit() {
    if (!editing.value) return;
    editing.value = null;
    text.value = "";
}
// the edit shows at once, and goes back with the words in the composer if the server refuses it
async function saveEdit() {
    const row = editing.value;
    const before = row.text;
    const words = text.value;
    row.text = words;
    leaveEdit();
    // a message on its way has no number to edit: it goes with these words, or is edited once its send has answered
    if (row.local) return;
    const result = await context.run(["message", "edit", String(row.id), "--text", words]);
    sendFailure.value = result.ok ? "" : result.error;
    if (!result.ok) {
        row.text = before;
        editing.value = row;
        text.value = words;
    }
    load();
}

// what the composer's words go as: a comment, a reply, or a new message; a message with files is always new
function sentLine(answering, commented, line, files) {
    if (commented && !files.length) return ["message", "comment", String(commented.id), line];
    return answering && !files.length ? ["message", "reply", String(answering.id), line] : ["message", "send", line, ...files];
}

// messages leave one at a time, in the order they were written, each with the words its echo holds when its turn comes; words changed after it left follow as an edit
let delivered = Promise.resolve();
async function deliver(echo, answering, commented, files, sent) {
    let words = echo.text;
    const result = await context.run(sentLine(answering, commented, words, files));
    if (!result.ok) (sendFailure.value = result.error, text.value = echo.text === sent.line ? sent.text : echo.text, attached.value = sent.attached, commenting.value = commented);
    while (result.ok && echo.text !== words) {
        words = echo.text;
        const edited = await context.run(["message", "edit", String(result.value.id), "--text", words]);
        sendFailure.value = edited.ok ? "" : edited.error;
    }
    await load();
    outgoing.value = outgoing.value.filter((other) => other.id !== echo.id);
}

function send() {
    takeFromBox();
    if (editing.value) return saveEdit();
    const sent = {text: text.value, attached: attached.value, line: text.value || attached.value.map((entry) => entry.name).join(", ")};
    const files = sent.attached.flatMap((entry) => ["--file", entry.pending]);
    const line = sent.line;
    const answering = replying.value;
    const commented = commenting.value;
    const comment = commented && !files.length;
    const echo = {id: `sending-${Date.now()}`, type: comment ? "comment" : "user", commented_row: comment ? `message:${commented.id}` : "", text: line, created_at: Date.now(), files: [], local: true};
    outgoing.value = [...outgoing.value, echo];
    const held = outgoing.value.at(-1);
    // a sent message takes the reader to the foot at once, also one who had scrolled up, so the rows watch below sets the scroll with no glide
    atFoot = true;
    awayFromFoot.value = false;
    arrived.value = 0;
    text.value = "";
    attached.value = [];
    sendFailure.value = "";
    focusComposer();
    replying.value = null;
    commenting.value = null;
    delivered = delivered.then(() => deliver(held, answering, commented, files, sent));
    return delivered;
}

// enter sends, with or without the command key; shift enter is a new line, and an open input method keeps its enter
const sendOnEnter = (event) => !event.shiftKey && !event.isComposing && (event.preventDefault(), takeFromBox(), sendable.value && send());
// the slash key goes to the box from anywhere in the page that is not itself being typed in
const TYPING_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);
function slashFocus(event) {
    if (event.key !== "/" || event.metaKey || event.ctrlKey || TYPING_TAGS.has(event.target?.tagName) || event.target?.isContentEditable) return;
    event.preventDefault();
    focusComposer();
}
window.addEventListener("keydown", slashFocus);
onUnmounted(() => window.removeEventListener("keydown", slashFocus));
// the words typed survive the window being closed or the page reloaded, one draft for each environment
const draftKey = `journal.draft.${context.environment}`;
function readDraft() {
    try {
        return localStorage.getItem(draftKey) ?? "";
    } catch {
        return "";
    }
}
function keepDraft(words) {
    try {
        if (words) localStorage.setItem(draftKey, words);
        else localStorage.removeItem(draftKey);
    } catch {
        return;
    }
}
text.value = readDraft();
watch(text, (words) => !editing.value && keepDraft(words));
// the docked cards open when the chat is scrolled down to its foot and fold, a moment later, when it is scrolled up away from it
const paging = ref(false);
// scrolled to the top, the page of older messages is read and added, and the view stays on the message it showed
async function pageOlder() {
    if (returning || paging.value || !loaded.value) return;
    paging.value = true;
    const before = scroller.value.scrollHeight;
    const [more, moreMarks] = await Promise.all([older(), olderMarks()]);
    if (more || moreMarks) {
        await nextTick();
        scroller.value.scrollTop += scroller.value.scrollHeight - before;
    }
    paging.value = false;
}
function followScroll() {
    atTop.value = !scroller.value || scroller.value.scrollTop < 8;
    if (atTop.value && scroller.value) pageOlder();
    if (!scroller.value) return;
    const {scrollTop, scrollHeight, clientHeight} = scroller.value;
    atFoot = scrollHeight - scrollTop - clientHeight < FOOT_PIXELS || (atFoot && scrollTop >= lastTop);
    awayFromFoot.value = !atFoot;
    if (atFoot) arrived.value = 0;
    const opening = dockOpening({top: scrollTop, before: lastTop, height: scrollHeight, shown: clientHeight});
    lastTop = scrollTop;
    if (opening === null && !folding) return;
    clearTimeout(folding);
    folding = 0;
    if (opening) docksOpen.value = true;
    else folding = setTimeout(() => { docksOpen.value = false; folding = 0; }, FOLD_AFTER_MS);
}
// the newest message and mark are at the foot: a chat that was at its foot stays there as rows land, one scrolled up is left where it is
watch(() => messages.value[0]?.id, (newest, before) => {
    if (before && newest > before && !atFoot) arrived.value += 1;
});
watch([rows, loaded], async () => {
    await nextTick();
    if (atFoot && scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight;
});
// a row that lands while the reader follows the foot comes in as version 4's did: the chat glides up, then the row fades in; the first rows and a page of older ones just appear
const SETTLE_MS = 1500;
let settled = false;
let settleTimer = 0;
watch(loaded, () => (settleTimer = setTimeout(() => (settled = true), SETTLE_MS)));
const comeIn = arrivalQueue();
let returning = false;
const arrivalPane = () => ({pane: scroller.value, follows: () => settled && atFoot && !document.hidden && !returning});
const rowOf = (element) => rows.value.find((row) => row.id === element.dataset.row)?.row;
const isEcho = (row) => Boolean(row?.local);
const arrival = {
    enter: (element, done) => {
        const row = rowOf(element);
        return isEcho(row) ? arriveAtOnce(element, arrivalPane(), done) : ["user", "comment"].includes(row?.type) ? done() : comeIn(element, arrivalPane(), done);
    },
    leave: (element, done) => (returning || !atFoot || !element.querySelector("[data-message]") || element.dataset.row.startsWith("message:sending-") ? done() : depart(element, done)),
};
async function refreshChat() {
    comeIn.flush();
    if (document.hidden || returning) return;
    returning = true;
    atFoot = true;
    awayFromFoot.value = false;
    arrived.value = 0;
    try {
        await Promise.all([loadLatest(), latestMarks()]);
        await nextTick();
        if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight;
    } finally {
        returning = false;
    }
}
document.addEventListener("visibilitychange", refreshChat);
onUnmounted(() => {
    document.removeEventListener("visibilitychange", refreshChat);
    clearTimeout(settleTimer);
    comeIn.flush();
});
const scrollToFoot = () => scroller.value?.scrollTo({top: scroller.value.scrollHeight, behavior: "smooth"});
const linkOf = (pin) => (pin.link.startsWith("http") ? pin.link : `#open=${pin.link}`);
// a pin that holds a ! command is a button: it types the command into the main agent's terminal through the journal
const isCommand = (pin) => pin.link.startsWith("!");
async function runCommand(pin) {
    const main = await context.read("agent main");
    if (main.ok && main.value.id) await runOnPin(["agent", "type", String(main.value.id), pin.link]);
}
</script>

<template>
    <div ref="chat" class="chat" data-figure-world>
        <div data-pins class="pins">
            <template v-for="pin in pinned" :key="pin.id">
                <div class="pin">
                    <span class="pin-dot" />
                    <span class="pin-text">{{ pin.title }}</span>
                    <template v-if="isCommand(pin)">
                        <button type="button" class="pin-link" data-pin-run :title="pin.link" @click="runCommand(pin)">{{ pin.label }}</button>
                    </template>
                    <template v-else>
                        <a class="pin-link" :href="linkOf(pin)" :target="pin.link.startsWith('http') ? '_blank' : undefined">{{ pin.label }}</a>
                    </template>
                    <button type="button" class="pin-close" data-pin-close aria-label="Close" @click="runOnPin(['pin', 'close', String(pin.id)])">
                        <Icon name="close" :size="12" />
                    </button>
                </div>
            </template>
            <PinsToggle :pin-rows="pins" />
        </div>
        <div ref="scroller" class="history" data-figure-scroll @scroll="followScroll">
            <template v-if="paging">
                <Skeleton shape="older" label="Loading older messages" />
            </template>
            <RowList :rows="rows" :failure="outgoing.length ? '' : failure" :loaded="loaded" :arrival="arrival" shape="messages" empty="No messages yet" hint="Send a message below to start a conversation.">
                <template #default="{row}">
                    <SwitchCase :value="row.type">
                        <template #day>
                            <p class="chat-day" data-day-line>{{ row.title }}</p>
                        </template>
                        <template #mark>
                            <MarkHost :mark="row.row" :docked="dockedRows.has(`${row.row.target_model}:${row.row.target_id}`)" />
                        </template>
                        <template #mark-group>
                            <MarkGroup :group="row" />
                        </template>
                        <template #default>
                            <MessageCard :message="row.row" :quote="quoteOf(row.row)" @reply="startReply" @comment="startComment" @delete="removeMessage" @react="reactTo" />
                        </template>
                    </SwitchCase>
                </template>
            </RowList>
        </div>
        <div class="jump-holder">
            <Transition name="rise">
                <button v-show="awayFromFoot" type="button" data-scroll-foot data-figure-newest class="jump" :title="arrived ? `${arrived} arrived while you were reading` : 'Jump to latest'" @click="scrollToFoot">
                    <Icon name="down" />
                    {{ arrived ? `${arrived} new` : "Newest" }}
                </button>
            </Transition>
        </div>
        <template v-if="context.option('floors').value">
            <FigureFloors />
        </template>
        <p class="running-strip"><span :class="['running-dot', {idle: !runningTool}]" /><RunningCommand :text="runningTool" :idle="waitingFor ? `waiting for ${waitingFor}` : 'waiting'" /></p>
        <div data-figure-chat-foot class="chat-foot">
            <DockStack :items="docked" :folded="short" :collapsed="!docksOpen" :data-figure-docked-bars="dockedRows.size ? '' : null" />
        </div>
        <template v-if="dumping">
            <DumpForm :run="context.run" @made="dumping = false" @close="dumping = false" />
        </template>
        <template v-if="replying || commenting || editing">
            <p class="composer-quote" data-composer-quote>
                <span class="composer-quote-text">{{ composerQuote }}</span>
                <button type="button" class="composer-quote-drop" aria-label="Cancel" @click="(replying = null), (commenting = null), leaveEdit()">×</button>
            </p>
        </template>
        <form data-figure-home :class="['composer', {dragging}]" @submit.prevent="send" @dragover.prevent="dragging = true" @dragleave="dragging = false" @drop.prevent="dropped">
            <template v-if="shownVoice">
                <VoiceFigure :voice="shownVoice" :here="figureHere" :running="runningTool" :heard-at="heardAt" :thinking="thinking" :waiting-for="waitingFor" :asking="asking" :marks="allMarks" :messages="messages" :faces="newFaces" @gone="shownVoice = ''" />
            </template>
            <template v-if="attached.length">
                <ul class="attached" data-attached>
                    <template v-for="entry in attached" :key="entry.name + entry.pending">
                        <li :class="['attached-file', {failed: entry.failure}]" :title="entry.failure">
                            <span>{{ entry.name }}</span>
                            <template v-if="!entry.pending && !entry.failure"><span class="attached-wait">sending</span></template>
                            <button type="button" aria-label="Remove" @click="removeAttached(entry)"><Icon name="close" :size="10" /></button>
                        </li>
                    </template>
                </ul>
            </template>
            <textarea ref="composerInput" v-composer-text="text" class="composer-input" rows="3" placeholder="Message the agent" @focus="takeFromBox" @keyup="takeFromBox" @keydown.enter="sendOnEnter" @keydown.up="editUp" @keydown.down="leaveEdit" @keydown.esc="leaveEdit" @input="typed" @paste="pasted" />
            <div class="composer-row" @pointerdown="takeFromBox">
                <input ref="picker" type="file" multiple hidden data-file-input @change="picked">
                <button type="button" data-attach class="composer-attach" title="Attach a file or an image" aria-label="Attach a file" @click="picker.click()">
                    <Icon name="clip" :size="16" />
                </button>
                <template v-if="sendable">
                    <Btn variant="primary" small class="composer-send" data-send @click="send">Send</Btn>
                </template>
                <template v-else>
                    <Btn small bordered class="composer-send" data-dump-files @click="dumping = !dumping">Dump files</Btn>
                </template>
                <template v-if="sendable && attached.length > 1 && !text.trim()">
                    <Btn small bordered class="composer-send" data-dump-offer @click="dumping = true">Dump {{ attached.length }} files</Btn>
                </template>
            </div>
        </form>
        <template v-if="sendFailure">
            <p class="composer-failure">{{ sendFailure }}</p>
        </template>
        <template v-if="openQuestion">
            <QuestionOverlay :key="openQuestion" :id="openQuestion" @close="openQuestion = 0" />
        </template>
    </div>
</template>

<style scoped>
.chat {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-sizing: border-box;
    /* no padding on top: the history scrolls right up to the tab bar */
    height: 100%;
    padding: 0 12px 8px;
    min-height: 0;
    container-type: size;
}

.history {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    /* bubbles scrolled under the foot fade out over its last stretch, as in version 4 */
    mask-image: linear-gradient(to bottom, #000 calc(100% - 8px), transparent);
}

/* version 4's spacing: 10 pixels between items, 18 above the first and 20 below the last, inside the scroll area */
.history :deep(.row-list) {
    gap: 10px;
    padding: 18px 0 8px;
}

/* version 4's marks are quiet lines, about 28 pixels tall, in a muted colour */
.history :deep(.row-list-row:hover) {
    background: none;
}

.history :deep(.row-list-row) {
    padding: 0 8px;
}

/* marks one after another sit closer together than the messages around them */
.history :deep(.row-list-row:has(.mark) + .row-list-row:has(.mark)) {
    margin-top: -5px;
}

/* on a phone, whose marks always show their action, they keep 12 pixels between them for a thumb */
:global(html.phone .history .row-list-row:has(.mark) + .row-list-row:has(.mark)) {
    margin-top: 2px;
}

.history :deep(.mark.w-event) {
    color: var(--text-3);
}

.pins {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    /* version 4's pins run edge to edge under the tab bar: out past the pane's padding on the sides, and with no gap to the history below */
    margin: 0 -12px -8px;
}

.pin {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 6px 10px;
    border-bottom: 1px solid var(--border);
    background: color-mix(in srgb, var(--accent) 10%, var(--bg));
    font-size: 13px;
}

.pin-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
}

.pin-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.pin-link {
    flex: none;
    padding: 2px 10px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    color: var(--text);
    font-size: 12px;
}

.pin-close {
    flex: none;
    border: 0;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.running-strip {
    display: flex;
    flex: none;
    gap: 8px;
    align-items: center;
    margin: 0;
    padding: 4px 14px;
    color: var(--text-3);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
}

.running-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
}

.running-dot.idle {
    background: var(--text-4);
}

.chat-day {
    margin: 0;
    padding: 4px 0;
    color: var(--text-4);
    font-size: 10.5px;
    text-align: center;
}

/* docks stack up to the top of the chat and scroll once they are taller than it, so the composer stays in view */
.chat-foot {
    flex: 0 1 auto;
    min-height: 0;
    overflow-y: auto;
}

.jump-holder {
    position: relative;
    flex: none;
    height: 0;
}

.jump {
    position: absolute;
    z-index: 3;
    bottom: 6px;
    left: 50%;
    display: inline-flex;
    gap: 5px;
    align-items: center;
    padding: 4px 11px;
    border: 1px solid var(--text);
    border-radius: 99px;
    background: var(--text);
    color: var(--bg);
    font-size: 11.5px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
    transform: translateX(-50%);
}

.jump:hover {
    border-color: var(--text-2);
    background: var(--text-2);
    color: var(--bg);
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

.composer-quote {
    display: flex;
    flex: none;
    gap: 8px;
    align-items: center;
    margin: 0 0 6px;
    padding: 4px 10px;
    border-left: 2px solid var(--accent);
    color: var(--text-3);
    font-size: 12.5px;
}

.composer-quote-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.composer-quote-drop {
    flex: none;
    border: 0;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.composer {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 14px;
}

.composer-input {
    padding: 0;
    border: 0;
    outline: 0;
    color: var(--text);
    background: transparent;
    font: inherit;
    line-height: 1.45;
    resize: none;
    transition: height 160ms var(--ease);
}

@media (prefers-reduced-motion: reduce) {
    .composer-input {
        transition: none;
    }
}

.composer-row {
    display: flex;
    gap: 8px;
    align-items: center;
}

.composer-attach {
    border: 0;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.composer.dragging {
    border-color: var(--accent);
}

.attached {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.attached-file {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    padding: 2px 8px;
    border: 1px solid var(--border-2);
    border-radius: 999px;
    font-size: 12px;
}

.attached-file.failed {
    border-color: var(--text-3);
    text-decoration: line-through;
}

.attached-file button {
    border: 0;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.attached-wait {
    color: var(--text-3);
}

.composer-send {
    margin-left: auto;
}

.composer-failure {
    margin: 0;
    color: var(--text-2);
}
</style>
