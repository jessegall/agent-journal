<script setup>
import {nextTick, onMounted, ref, watch} from "vue";
import {api} from "../api.js";
import {live} from "../live.js";
import AgentCard from "../kit/AgentCard.vue";
import QuestionCard from "../kit/QuestionCard.vue";

const messages = ref([]);
const questions = ref([]);
const agents = ref([]);
const text = ref("");
const thread = ref(null);

const PAGE = 50;
const older = ref(true);

async function load() {
    const [page, open, live] = await Promise.all([api.messages(PAGE), api.questions(), api.agents()]);
    messages.value = page.reverse();
    older.value = page.length === PAGE;
    questions.value = open;
    agents.value = live;
    await nextTick();
    if (thread.value) thread.value.scrollTop = thread.value.scrollHeight;
}

async function loadOlder() {
    const page = await api.messages(PAGE, messages.value[0]?.id);
    messages.value = [...page.reverse(), ...messages.value];
    older.value = page.length === PAGE;
}

async function send() {
    const line = text.value.trim();
    if (!line) return;
    text.value = "";
    await api.sendMessage(line);
    await load();
}

function onKey(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        send();
    }
}

const when = (at) => (at ? new Date(at).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}) : "");

onMounted(load);
watch(() => live.version, load);
</script>

<template>
    <div class="home">
        <div class="thread-wrap">
            <div ref="thread" class="thread">
                <button v-if="older && messages.length" class="btn" type="button" @click="loadOlder">Older messages</button>
                <div v-if="!messages.length" class="empty">Nothing said here yet. Write to the agent below; it answers in this thread.</div>
                <div v-for="m in messages" :key="m.id" :class="['bubble', m.author]">
                    <span v-if="m.reply_to" class="reply-to">answers {{ m.reply_to }}</span>
                    {{ m.text }}
                    <span class="when">{{ m.author }} · {{ when(m.created_at) }}<template v-if="m.author === 'user' && m.read_at"> · read</template></span>
                </div>
            </div>
            <form class="compose" @submit.prevent="send">
                <textarea v-model="text" class="field" placeholder="Write to the agent. Enter sends, Shift+Enter is a new line." @keydown="onKey" />
                <button class="btn primary" type="submit">Send</button>
            </form>
        </div>
        <div class="rail">
            <AgentCard v-for="a in agents.filter((a) => a.state !== 'ended')" :key="a.id" :agent="a" />
            <div v-if="!agents.some((a) => a.state !== 'ended')" class="card"><h3>No agent running here</h3><div class="line">Start one with <b>journal claude</b> in the project.</div></div>
            <QuestionCard v-for="q in questions.filter((q) => q.answer === null)" :key="q.id" :question="q" @answered="load" />
        </div>
    </div>
</template>
