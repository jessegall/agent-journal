<script setup>
import {computed, nextTick, ref, watch} from "vue";
import {api} from "../api/client.js";
import {standing} from "../composables/agentLinks.js";
import {chatTurns} from "../domain/transcript.js";
import {rows} from "../sync/rows.js";
import Compose from "./Compose.vue";
import Notice from "./Notice.vue";
import Turn from "./Turn.vue";

const props = defineProps({
    turns: {type: Array, required: true},
    session: {type: String, required: true},
    task: {type: String, default: ""},
});
const log = ref(null);
const sent = computed(() => rows("message").filter((m) => m.data.sent_to === props.session && m.seen[0] === "user"));
const sentTexts = computed(() => new Set(sent.value.map((m) => m.brief.trim())));
const transcriptLines = computed(() => chatTurns(props.turns).filter((t) => !(t.who === "user" && sentTexts.value.has(t.brief.trim()))));
const lines = computed(() => [...transcriptLines.value, ...sent.value].sort((a, b) => a.created - b.created));
const pins = computed(() =>
    rows("notice").filter((notice) => notice.data.agent === props.session && !notice.completed && !standing(notice))
);
const send = (text) => api.create("message", {brief: text, sent_to: props.session});
watch(
    () => lines.value.length,
    () => nextTick(() => log.value && (log.value.scrollTop = log.value.scrollHeight)),
    {immediate: true}
);
</script>

<template>
    <div class="subagent-chat">
        <template v-if="pins.length">
            <div class="pins">
                <template v-for="pin in pins" :key="pin.n">
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
        <div class="composer">
            <Compose :send="send" :placeholder="task ? `Message ${task}` : 'Message the subagent'" />
        </div>
    </div>
</template>

<style scoped>
.subagent-chat {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.composer {
    flex: none;
    padding: 0 24px 16px;
}

.log {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 12px 24px;
}

.pins {
    display: flex;
    flex: none;
    flex-direction: column;
}

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 13px;
}
</style>
