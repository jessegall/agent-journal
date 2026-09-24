<script setup>
import {computed, nextTick, ref, watch} from "vue";
import {api} from "../api/client.js";
import {kindOf, useAgentLinks} from "../composables/agentLinks.js";
import {chatTurns} from "../domain/transcript.js";
import {rows} from "../sync/rows.js";
import Compose from "./Compose.vue";
import Notice from "./Notice.vue";
import Turn from "./Turn.vue";

const props = defineProps({
    turns: {type: Array, required: true},
    agent: {type: Number, required: true},
    session: {type: String, required: true},
    task: {type: String, default: ""},
});
const log = ref(null);
const sent = computed(() => rows("message").filter((m) => m.data.sent_to === props.session && m.seen[0] === "user"));
const sentTexts = computed(() => new Set(sent.value.map((m) => m.brief.trim())));
const transcriptLines = computed(() => chatTurns(props.turns).filter((t) => !(t.who === "user" && sentTexts.value.has(t.brief.trim()))));
const lines = computed(() => [...transcriptLines.value, ...sent.value].sort((a, b) => a.created - b.created));
const links = useAgentLinks(() => [props.agent, props.session]);
const linkPins = computed(() =>
    links.value.map((href) => ({
        n: href,
        title: `${kindOf(href)} · ${href.replace(/^https?:\/\//, "")}`,
        data: {link: href, label: "Open", tone: "note"},
    }))
);
const ownPins = computed(() => rows("notice").filter((notice) => notice.data.agent === props.session && !notice.completed));
const send = (text) => api.create("message", {brief: text, sent_to: props.session});
watch(
    () => lines.value.length,
    () => nextTick(() => log.value && (log.value.scrollTop = log.value.scrollHeight)),
    {immediate: true}
);
</script>

<template>
    <div class="subagent-chat">
        <template v-if="linkPins.length || ownPins.length">
            <div class="pins">
                <template v-for="pin in linkPins" :key="pin.n">
                    <Notice :notice="pin" fixed />
                </template>
                <template v-for="pin in ownPins" :key="pin.n">
                    <Notice :notice="pin" />
                </template>
            </div>
        </template>
        <div ref="log" class="log">
            <template v-for="turn in lines" :key="turn.ref">
                <Turn :turn="turn" />
            </template>
            <template v-if="!lines.length">
                <p class="none">Nothing said yet.</p>
            </template>
        </div>
        <Compose :send="send" :placeholder="task ? `Message ${task}` : 'Message the subagent'" />
    </div>
</template>

<style scoped>
.subagent-chat {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-height: 0;
}

.log {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0 2px;
}

.pins {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 6px;
}

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 13px;
}
</style>
