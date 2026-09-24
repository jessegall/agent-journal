<script setup>
import {computed, nextTick, ref, watch} from "vue";
import {api} from "../api/client.js";
import {chatTurns} from "../domain/transcript.js";
import {rows} from "../sync/rows.js";
import Compose from "./Compose.vue";
import Turn from "./Turn.vue";

const props = defineProps({
    turns: {type: Array, required: true},
    session: {type: String, required: true},
    task: {type: String, default: ""},
});
const log = ref(null);
const sent = computed(() => rows("message").filter((m) => m.data.sent_to === props.session && m.seen[0] === "user"));
const relayed = computed(() => new Set(sent.value.map((m) => m.brief.trim())));
const spoken = computed(() => chatTurns(props.turns).filter((t) => !(t.who === "user" && relayed.value.has(t.brief.trim()))));
const lines = computed(() => [...spoken.value, ...sent.value].sort((a, b) => a.created - b.created));
const send = (text) => api.create("message", {brief: text, sent_to: props.session});
watch(
    () => lines.value.length,
    () => nextTick(() => log.value && (log.value.scrollTop = log.value.scrollHeight)),
    {immediate: true}
);
</script>

<template>
    <div class="subagent-chat">
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

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 13px;
}
</style>
