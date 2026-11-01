<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import DumpForm from "./DumpForm.vue";
import {Btn, DockStack, Icon, MarkHost, MessageCard, RowList, markDeclaration, fetchDockDeclarations, fetchMarkDeclarations, interleaved, shownMarks, useRows, SHORT_CHAT, dockOpening} from "@journal/window-kit";

const {rows: messages, failure, loaded, load, context} = useRows("message list", ["message.*"]);
const {rows: allMarks} = useRows("chat-mark list", ["chat_mark.*"]);
const {rows: docked} = useRows("dock-item list", ["dock_item.*"]);
const {rows: notices, act: closeNotice} = useRows("notice list", ["notice.*"]);
const {rows: latestCalls} = useRows("hook-call list --limit 1", ["hook_call.*"]);
const marks = computed(() => shownMarks(allMarks.value, markDeclaration, (key) => context.option(key).value));
const rows = computed(() => interleaved(messages.value, marks.value));
// the tool the agent has in hand: the newest hook call is the start of a tool, which no later call has ended
const runningTool = computed(() => (latestCalls.value[0]?.hook === "pre_tool_use" ? latestCalls.value[0].tool : ""));
const FOLD_AFTER_MS = 180;
const chat = ref(null);
const docksOpen = ref(true);
const short = ref(false);
let lastTop = 0;
let folding = 0;
let sizeWatch = null;
onMounted(() => {
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
const dumping = ref(false);

async function send() {
    const result = await context.run(["message", "send", text.value]);
    sendFailure.value = result.ok ? "" : result.error;
    if (result.ok) text.value = "";
    load();
}

const sendOnEnter = (event) => !event.shiftKey && (event.preventDefault(), text.value.trim() && send());
// the docked cards open when the chat is scrolled down to its foot and fold, a moment later, when it is scrolled up away from it
function followScroll() {
    atTop.value = !scroller.value || scroller.value.scrollTop < 8;
    if (!scroller.value) return;
    const {scrollTop, scrollHeight, clientHeight} = scroller.value;
    const opening = dockOpening({top: scrollTop, before: lastTop, height: scrollHeight, shown: clientHeight});
    lastTop = scrollTop;
    if (opening === null) return;
    clearTimeout(folding);
    if (opening) docksOpen.value = true;
    else folding = setTimeout(() => (docksOpen.value = false), FOLD_AFTER_MS);
}
const scrollToTop = () => scroller.value?.scrollTo({top: 0, behavior: "smooth"});
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
            <template v-if="runningTool">
                <p data-running-tool class="running-tool"><span class="running-dot" />{{ runningTool }}</p>
            </template>
        </div>
        <button type="button" data-scroll-top :class="['scroll-top', {hidden: atTop}]" aria-label="Scroll to the top" @click="scrollToTop">
            <Icon name="up" :size="14" />
        </button>
        <DockStack :items="docked" :folded="short || !docksOpen" />
        <template v-if="dumping">
            <DumpForm :run="context.run" @made="dumping = false" @close="dumping = false" />
        </template>
        <form class="composer" @submit.prevent="send">
            <textarea v-model="text" class="composer-input" rows="3" placeholder="Message the agent" @keydown.enter="sendOnEnter" />
            <div class="composer-row">
                <button type="button" data-attach class="composer-attach" disabled title="A message holds text only, so there is nothing to attach a file to; Dump files takes files" aria-label="Attach a file">
                    <Icon name="clip" :size="16" />
                </button>
                <template v-if="text.trim()">
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

.running-tool {
    display: flex;
    gap: 8px;
    align-items: center;
    margin: 4px 10px;
    color: var(--text-3);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
}

.running-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
}

.scroll-top {
    position: absolute;
    right: 14px;
    top: 120px;
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border: 1px solid var(--border-2);
    border-radius: 50%;
    background: var(--bg);
    color: var(--text-2);
    cursor: pointer;
}

.scroll-top.hidden {
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
}

.composer-send {
    margin-left: auto;
}

.composer-failure {
    margin: 0;
    color: var(--text-2);
}
</style>
