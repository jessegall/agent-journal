<script setup>
import {computed, onMounted, ref} from "vue";
import {Btn, MarkHost, RowList, fetchMarkDeclarations, interleaved, useRows} from "@journal/window-kit";

const {rows: messages, failure, load, context} = useRows("message list", ["message.*"]);
const {rows: marks} = useRows("chat-mark list", ["chat_mark.*"]);
const rows = computed(() => interleaved(messages.value, marks.value));
onMounted(fetchMarkDeclarations);
const text = ref("");
const sendFailure = ref("");

async function send() {
    const result = await context.run(["message", "send", text.value]);
    sendFailure.value = result.ok ? "" : result.error;
    if (result.ok) text.value = "";
    load();
}
</script>

<template>
    <div class="chat">
        <RowList :rows="rows" :failure="failure" empty="No messages yet">
            <template #default="{row}">
                <template v-if="row.kind === 'mark'">
                    <MarkHost :mark="row.row" />
                </template>
                <template v-else>
                    <span class="from">{{ row.row.type }}</span>
                    <span class="text">{{ row.row.text }}</span>
                </template>
            </template>
        </RowList>
        <form class="composer" @submit.prevent="send">
            <input v-model="text" class="composer-input" placeholder="Write a message" />
            <Btn kind="primary" :disabled="!text.trim()" @click="send">Send</Btn>
        </form>
        <template v-if="sendFailure">
            <p class="composer-failure">{{ sendFailure }}</p>
        </template>
    </div>
</template>

<style scoped>
.chat {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.from {
    min-width: 56px;
    color: var(--text-3);
    font-size: 12px;
}

.text {
    white-space: pre-wrap;
}

.composer {
    display: flex;
    gap: 8px;
}

.composer-input {
    flex: 1;
    min-width: 0;
    padding: 6px 10px;
    border: 1px solid var(--line);
    border-radius: 6px;
    color: var(--text);
    background: transparent;
}

.composer-failure {
    margin: 0;
    color: var(--text-2);
}
</style>
