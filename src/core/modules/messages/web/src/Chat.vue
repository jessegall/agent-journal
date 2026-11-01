<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import DumpForm from "./DumpForm.vue";
import {Btn, DockStack, RunningCommand, Icon, MarkHost, MessageCard, RowList, markDeclaration, fetchDockDeclarations, fetchMarkDeclarations, interleaved, shownMarks, useRows, SHORT_CHAT, dockOpening} from "@journal/window-kit";

const {rows: messages, failure, loaded, load, older, context} = useRows("message list", ["message.*"], {incremental: true});
const {rows: allMarks, older: olderMarks} = useRows("chat-mark list", ["chat_mark.*"], {incremental: true});
const {rows: docked} = useRows("dock-item list", ["dock_item.*"]);
const {rows: notices, act: closeNotice} = useRows("notice list", ["notice.*"]);
const {rows: latestCalls} = useRows("hook-call list --limit 10", ["hook_call.*"]);
const marks = computed(() => shownMarks(allMarks.value, markDeclaration, (key) => context.option(key).value));
const outgoing = ref([]);
// a sent message shows at once as an echo, until its own row has been read: the echo is dropped when a message of the user with the same words has landed since
const echoes = computed(() => outgoing.value.filter((echo) => !messages.value.some((row) => row.type === "user" && row.text === echo.text && Date.parse(row.created_at) >= echo.created_at - ECHO_SLACK_MS)));
const rows = computed(() => interleaved([...messages.value, ...echoes.value], marks.value));
// the tool the agent has in hand: the newest hook call is the start of a tool, which no later call has ended
// the tool the agent last began, whichever it is, until the agent stops or a message of yours starts a new turn
const runningTool = computed(() => {
    const call = latestCalls.value.find((row) => ["pre_tool_use", "stop", "prompt", "session_start"].includes(row.hook));
    return call?.hook === "pre_tool_use" ? [call.tool, call.summary].filter(Boolean).join(" ") : "";
});
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

async function send() {
    const sent = {text: text.value, attached: attached.value};
    const files = sent.attached.flatMap((entry) => ["--file", entry.pending]);
    const line = sent.text || sent.attached.map((entry) => entry.name).join(", ");
    const echo = {id: `sending-${Date.now()}`, type: "user", text: line, created_at: Date.now(), files: [], local: true};
    outgoing.value = [...outgoing.value, echo];
    text.value = "";
    attached.value = [];
    sendFailure.value = "";
    focusComposer();
    const result = await context.run(["message", "send", line, ...files]);
    if (!result.ok) (sendFailure.value = result.error, text.value = sent.text, attached.value = sent.attached);
    outgoing.value = outgoing.value.filter((other) => other !== echo);
    await load();
}

const sendOnEnter = (event) => !event.shiftKey && (event.preventDefault(), sendable.value && send());
// the docked cards open when the chat is scrolled down to its foot and fold, a moment later, when it is scrolled up away from it
let paging = false;
// scrolled to the top, the page of older messages is read and added, and the view stays on the message it showed
async function pageOlder() {
    if (paging || !loaded.value) return;
    paging = true;
    const before = scroller.value.scrollHeight;
    const [more, moreMarks] = await Promise.all([older(), olderMarks()]);
    if (more || moreMarks) {
        await nextTick();
        scroller.value.scrollTop += scroller.value.scrollHeight - before;
    }
    paging = false;
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
const scrollToFoot = () => scroller.value?.scrollTo({top: scroller.value.scrollHeight, behavior: "smooth"});
const linkOf = (notice) => (notice.link.startsWith("http") ? notice.link : `#open=${notice.link}`);
</script>

<template>
    <div ref="chat" class="chat">
        <div data-notices class="notices">
            <template v-for="notice in notices" :key="notice.id">
                <div class="notice">
                    <span class="notice-dot" />
                    <span class="notice-text">{{ notice.title }}</span>
                    <a class="notice-link" :href="linkOf(notice)" :target="notice.link.startsWith('http') ? '_blank' : undefined">{{ notice.label }}</a>
                    <button type="button" class="notice-close" data-notice-close aria-label="Close" @click="closeNotice(['notice', 'close', String(notice.id)])">
                        <Icon name="close" :size="12" />
                    </button>
                </div>
            </template>
        </div>
        <div ref="scroller" class="history" @scroll="followScroll">
            <RowList :rows="rows" :failure="failure" :loaded="loaded" shape="messages" empty="No messages yet">
                <template #default="{row}">
                    <template v-if="row.kind === 'mark'">
                        <MarkHost :mark="row.row" />
                    </template>
                    <template v-else>
                        <MessageCard :message="row.row" />
                    </template>
                </template>
            </RowList>
        </div>
        <p class="running-strip"><span :class="['running-dot', {idle: !runningTool}]" /><RunningCommand :text="runningTool" idle="waiting" /></p>
        <div class="jump-holder">
            <button type="button" data-scroll-foot :class="['jump', {hidden: !awayFromFoot}]" @click="scrollToFoot">
                {{ arrived ? `${arrived} new` : "Newest" }}
            </button>
        </div>
        <DockStack :items="docked" :folded="short || !docksOpen" />
        <template v-if="dumping">
            <DumpForm :run="context.run" @made="dumping = false" @close="dumping = false" />
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
            <textarea ref="composerInput" v-model="text" class="composer-input" rows="3" placeholder="Message the agent" @keydown.enter="sendOnEnter" @paste="pasted" />
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

.jump-holder {
    position: relative;
    flex: none;
    height: 0;
}

.jump {
    position: absolute;
    z-index: 2;
    bottom: 8px;
    left: 50%;
    padding: 4px 12px;
    border: 1px solid var(--border-2);
    border-radius: 13px;
    background: var(--raised);
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    transform: translateX(-50%);
}

.jump:hover {
    color: var(--text);
}

.jump.hidden {
    visibility: hidden;
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
