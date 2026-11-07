<script setup>
import {computed, ref} from "vue";
import {AutoScrollPane, Btn, RowList, WindowRoom, useRows} from "@journal/window-kit";

// the conversation oldest first with its newest row at the foot, where the pane opens and stays as rows arrive; scrolling up stops that and
// shows Newest; each row says who wrote it, lined up with the card's tabs, its words, and at its end when
const props = defineProps({line: {type: String, required: true}, agent: {type: Number, default: null}, padding: {type: String, default: "8px 22px 8px 27px"}, helper: Boolean});
const {rows, failure, loaded, context} = useRows(props.line, ["hook_call.*"]);
const message = ref("");
const sending = ref(false);
const sendFailure = ref("");
async function send() {
    if (props.agent === null || !message.value.trim() || sending.value) return;
    sending.value = true;
    const answer = await context.run(props.helper ? ["helper", "send", String(props.agent), message.value] : ["message", "send", message.value, "--target-agent", String(props.agent)]);
    sendFailure.value = answer.ok ? "" : answer.error;
    if (answer.ok) message.value = "";
    sending.value = false;
}
function sendOnEnter(event) {
    if (event.shiftKey || event.isComposing) return;
    event.preventDefault();
    send();
}
const newest = computed(() => rows.value.at(-1)?.id ?? 0);
const timeOf = (row) => (row.time ? new Date(row.time).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", second: "2-digit"}) : "");
</script>

<template>
    <WindowRoom :padding="padding">
        <div class="transcript">
            <AutoScrollPane :row-count="newest">
                <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No conversation yet" hint="The agent’s messages and tool calls appear here.">
                    <template #default="{row}">
                        <span class="author" :data-author="row.author">{{ row.author }}</span>
                        <span class="text">{{ row.text }}</span>
                        <time class="time" data-row-time :datetime="row.time">{{ timeOf(row) }}</time>
                    </template>
                </RowList>
            </AutoScrollPane>
            <template v-if="agent !== null">
                <form class="agent-message" @submit.prevent="send">
                    <textarea v-model="message" aria-label="Message this agent" placeholder="Message this agent" rows="2" @keydown.enter="sendOnEnter" />
                    <Btn :disabled="sending || !message.trim()" @click="send">Send</Btn>
                    <template v-if="sendFailure"><p role="alert">{{ sendFailure }}</p></template>
                </form>
            </template>
        </div>
    </WindowRoom>
</template>

<style scoped>
.transcript {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.transcript :deep(.row-list-row) { padding: 8px 14px; }

.agent-message { display: flex; flex-wrap: wrap; flex: none; gap: 8px; padding: 10px 14px; border-top: 1px solid var(--border); }
.agent-message textarea { flex: 1; min-width: 0; padding: 8px; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); color: var(--text); font: inherit; resize: vertical; }
.agent-message p { flex-basis: 100%; margin: 0; color: var(--danger); }

.author {
    color: var(--text-3);
    font-size: 12px;
    min-width: 72px;
}

.time {
    flex: none;
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}

.text {
    flex: 1;
    white-space: pre-wrap;
}
</style>
