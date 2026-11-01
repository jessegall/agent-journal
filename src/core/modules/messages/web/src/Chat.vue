<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import DumpForm from "./DumpForm.vue";
import {arrivalQueue, arriveAtOnce, Btn, depart, DockStack, PinsToggle, RunningCommand, Icon, MarkHost, MessageCard, RowList, Skeleton, markDeclaration, usePins, withDayLines, fetchDockDeclarations, fetchMarkDeclarations, interleaved, shownMarks, useRows, SHORT_CHAT, dockOpening} from "@journal/window-kit";

const {rows: messages, failure, loaded, load, older, context} = useRows("message list", ["message.*"], {incremental: true});
const {rows: allMarks, older: olderMarks} = useRows("chat-mark list", ["chat_mark.*"], {incremental: true});
const {rows: docked} = useRows("dock-item list", ["dock_item.*"]);
const {rows: notices, act: closeNotice} = useRows("notice list", ["notice.*"]);
const marks = computed(() => shownMarks(allMarks.value, markDeclaration, (key) => context.option(key).value));
const outgoing = ref([]);
// a sent message shows at once as an echo, until its own row has been read: the echo is dropped when a message of the user with the same words has landed since
const echoes = computed(() => outgoing.value.filter((echo) => !messages.value.some((row) => row.type === "user" && row.text === echo.text && Date.parse(row.created_at) >= echo.created_at - ECHO_SLACK_MS)));
const rows = computed(() => withDayLines(interleaved([...messages.value, ...echoes.value], marks.value)));
const {visible: pinned} = usePins(() => notices.value);
// the tool the agent has in hand, read each time a hook call lands, empty until it begins the next
const runningTool = ref("");
async function readTool() {
    const answer = await context.read("usage tool");
    runningTool.value = answer.ok ? answer.value.tool : "";
}
context.follow(["hook_call.*"], readTool);
readTool();
const FOLD_AFTER_MS = 180;
const ECHO_SLACK_MS = 2000;
const FOOT_PIXELS = 40;
const chat = ref(null);
const docksOpen = ref(true);
const short = ref(false);
let lastTop = 0;
let atFoot = true;
let folding = 0;
let sizeWatch = null;
onMounted(() => {
    focusComposer();
    Promise.all([fetchMarkDeclarations(), fetchDockDeclarations()]);
    if (chat.value && typeof ResizeObserver !== "undefined") {
        sizeWatch = new ResizeObserver(([entry]) => (short.value = entry.contentRect.height < SHORT_CHAT));
        sizeWatch.observe(chat.value);
    }
});
onUnmounted(() => {
    sizeWatch?.disconnect();
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
const focusComposer = () => nextTick(() => composerInput.value?.focus());
const dragging = ref(false);

async function attach(files) {
    for (const file of files) {
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
const composerQuote = computed(() => (editing.value ? `Editing message ${editing.value.id}` : `Reply to: ${replying.value?.text}`));
const editing = ref(null);
function startReply(message) {
    editing.value = null;
    replying.value = message;
    focusComposer();
}
async function removeMessage(message) {
    const result = await context.run(["message", "delete", String(message.id)]);
    sendFailure.value = result.ok ? "" : result.error;
    load();
}
// the arrow up in an empty box brings back the newest message of yours the agent has not read, to change it; the arrow down or escape leaves it
const lastUnread = () => messages.value.find((row) => row.type === "user" && !row.read_at);
function editUp(event) {
    if (text.value || !lastUnread()) return;
    event.preventDefault();
    editing.value = lastUnread();
    replying.value = null;
    text.value = editing.value.text;
}
function leaveEdit() {
    if (!editing.value) return;
    editing.value = null;
    text.value = "";
}
async function saveEdit() {
    const result = await context.run(["message", "edit", String(editing.value.id), "--text", text.value]);
    sendFailure.value = result.ok ? "" : result.error;
    if (result.ok) leaveEdit();
    load();
}

async function send() {
    if (editing.value) return saveEdit();
    const sent = {text: text.value, attached: attached.value};
    const files = sent.attached.flatMap((entry) => ["--file", entry.pending]);
    const line = sent.text || sent.attached.map((entry) => entry.name).join(", ");
    const echo = {id: `sending-${Date.now()}`, type: "user", text: line, created_at: Date.now(), files: [], local: true};
    outgoing.value = [...outgoing.value, echo];
    text.value = "";
    attached.value = [];
    sendFailure.value = "";
    focusComposer();
    const answering = replying.value;
    replying.value = null;
    const result = await context.run(answering && !files.length ? ["message", "reply", String(answering.id), line] : ["message", "send", line, ...files]);
    if (!result.ok) (sendFailure.value = result.error, text.value = sent.text, attached.value = sent.attached);
    outgoing.value = outgoing.value.filter((other) => other !== echo);
    await load();
}

// enter sends, with or without the command key; shift enter is a new line, and an open input method keeps its enter
const sendOnEnter = (event) => !event.shiftKey && !event.isComposing && (event.preventDefault(), sendable.value && send());
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
    if (paging.value || !loaded.value) return;
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
    atFoot = scrollHeight - scrollTop - clientHeight < FOOT_PIXELS;
    awayFromFoot.value = !atFoot;
    if (atFoot) arrived.value = 0;
    const opening = dockOpening({top: scrollTop, before: lastTop, height: scrollHeight, shown: clientHeight});
    lastTop = scrollTop;
    if (opening === null) return;
    clearTimeout(folding);
    if (opening) docksOpen.value = true;
    else folding = setTimeout(() => (docksOpen.value = false), FOLD_AFTER_MS);
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
watch(loaded, () => setTimeout(() => (settled = true), SETTLE_MS));
const comeIn = arrivalQueue();
const arrivalPane = () => ({pane: scroller.value, follows: () => settled && atFoot});
const rowOf = (element) => rows.value.find((row) => row.id === element.dataset.row)?.row;
const isEcho = (row) => Boolean(row?.local);
const arrival = {
    enter: (element, done) => {
        const row = rowOf(element);
        return isEcho(row) ? arriveAtOnce(element, arrivalPane(), done) : row?.type === "user" ? done() : comeIn(element, arrivalPane(), done);
    },
    leave: (element, done) => (!atFoot || !element.querySelector("[data-message]") ? done() : depart(element, done)),
};
const scrollToFoot = () => scroller.value?.scrollTo({top: scroller.value.scrollHeight, behavior: "smooth"});
const linkOf = (notice) => (notice.link.startsWith("http") ? notice.link : `#open=${notice.link}`);
</script>

<template>
    <div ref="chat" class="chat">
        <div data-notices class="notices">
            <template v-for="notice in pinned" :key="notice.id">
                <div class="notice">
                    <span class="notice-dot" />
                    <span class="notice-text">{{ notice.title }}</span>
                    <a class="notice-link" :href="linkOf(notice)" :target="notice.link.startsWith('http') ? '_blank' : undefined">{{ notice.label }}</a>
                    <button type="button" class="notice-close" data-notice-close aria-label="Close" @click="closeNotice(['notice', 'close', String(notice.id)])">
                        <Icon name="close" :size="12" />
                    </button>
                </div>
            </template>
            <PinsToggle :notices="notices" />
        </div>
        <div ref="scroller" class="history" @scroll="followScroll">
            <template v-if="paging">
                <Skeleton shape="older" label="Loading older messages" />
            </template>
            <RowList :rows="rows" :failure="failure" :loaded="loaded" :arrival="arrival" shape="messages" empty="No messages yet">
                <template #default="{row}">
                    <template v-if="row.kind === 'day'">
                        <p class="chat-day" data-day-line>{{ row.title }}</p>
                    </template>
                    <template v-else-if="row.kind === 'mark'">
                        <MarkHost :mark="row.row" />
                    </template>
                    <template v-else>
                        <MessageCard :message="row.row" @reply="startReply" @delete="removeMessage" />
                    </template>
                </template>
            </RowList>
        </div>
        <div class="jump-holder">
            <Transition name="rise">
                <button v-show="awayFromFoot" type="button" data-scroll-foot class="jump" :title="arrived ? `${arrived} arrived while you were reading` : 'Back to the newest'" @click="scrollToFoot">
                    <Icon name="down" />
                    {{ arrived ? `${arrived} new` : "Newest" }}
                </button>
            </Transition>
        </div>
        <p class="running-strip"><span :class="['running-dot', {idle: !runningTool}]" /><RunningCommand :text="runningTool" idle="waiting" /></p>
        <DockStack :items="docked" :folded="short || !docksOpen" />
        <template v-if="dumping">
            <DumpForm :run="context.run" @made="dumping = false" @close="dumping = false" />
        </template>
        <template v-if="replying || editing">
            <p class="composer-quote" data-composer-quote>
                <span class="composer-quote-text">{{ composerQuote }}</span>
                <button type="button" class="composer-quote-drop" aria-label="Leave it" @click="(replying = null), leaveEdit()">×</button>
            </p>
        </template>
        <form :class="['composer', {dragging}]" @submit.prevent="send" @dragover.prevent="dragging = true" @dragleave="dragging = false" @drop.prevent="dropped">
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
            <textarea ref="composerInput" v-model="text" class="composer-input" rows="3" placeholder="Message the agent" @keydown.enter="sendOnEnter" @keydown.up="editUp" @keydown.down="leaveEdit" @keydown.esc="leaveEdit" @paste="pasted" />
            <div class="composer-row">
                <input ref="picker" type="file" multiple hidden data-file-input @change="picked">
                <button type="button" data-attach class="composer-attach" title="Attach a file or an image" aria-label="Attach a file" @click="picker.click()">
                    <Icon name="clip" :size="16" />
                </button>
                <template v-if="sendable">
                    <Btn kind="primary" small class="composer-send" data-send @click="send">Send</Btn>
                </template>
                <template v-else>
                    <Btn small bordered class="composer-send" data-dump-files @click="dumping = !dumping">Dump files</Btn>
                </template>
                <template v-if="sendable && attached.length > 1">
                    <Btn small bordered class="composer-send" data-dump-offer @click="dumping = true">Dump {{ attached.length }} files</Btn>
                </template>
            </div>
        </form>
        <template v-if="sendFailure">
            <p class="composer-failure">{{ sendFailure }}</p>
        </template>
    </div>
</template>

<style scoped>
.chat {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
    min-height: 0;
}

.history {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

/* version 4's marks are quiet lines, about 28 pixels tall, in a muted colour */
.history :deep(.row-list-row) {
    padding: 1px 8px;
}

.history :deep(.mark.w-event) {
    color: var(--text-3);
}

.notices {
    display: flex;
    flex-direction: column;
    /* version 4's notices run edge to edge under the tab bar: out past the pane's padding on the sides and the top */
    margin: -16px -16px 0;
}

.notice {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 6px 10px;
    border-bottom: 1px solid var(--border);
    background: color-mix(in srgb, var(--accent) 10%, var(--bg));
    font-size: 13px;
}

.notice-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
}

.notice-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.notice-link {
    flex: none;
    padding: 2px 10px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    color: var(--text);
    font-size: 12px;
}

.notice-close {
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
    color: #0d0e10;
    font-size: 11.5px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
    transform: translateX(-50%);
}

.jump:hover {
    border-color: #fff;
    background: #fff;
    color: #000;
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
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 14px;
}

.composer-input {
    min-height: 54px;
    padding: 0;
    border: 0;
    outline: 0;
    color: var(--text);
    background: transparent;
    font: inherit;
    resize: none;
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
