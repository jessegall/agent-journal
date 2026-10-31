<script setup>
import {computed, onMounted, ref} from "vue";
import {Btn, DockStack, MarkHost, MessageCard, RowList, markDeclaration, fetchDockDeclarations, fetchMarkDeclarations, interleaved, shownMarks, useRows} from "@journal/window-kit";

const {rows: messages, failure, loaded, load, context} = useRows("message list", ["message.*"]);
const {rows: allMarks} = useRows("chat-mark list", ["chat_mark.*"]);
const {rows: docked} = useRows("dock-item list", ["dock_item.*"]);
const marks = computed(() => shownMarks(allMarks.value, markDeclaration, (key) => context.option(key).value));
const rows = computed(() => interleaved(messages.value, marks.value));
onMounted(() => Promise.all([fetchMarkDeclarations(), fetchDockDeclarations()]));
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
        <DockStack :items="docked" />
        <RowList class="history" :rows="rows" :failure="failure" :loaded="loaded" empty="No messages yet">
            <template #default="{row}">
                <template v-if="row.kind === 'mark'">
                    <MarkHost :mark="row.row" />
                </template>
                <template v-else>
                    <MessageCard :message="row.row" />
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
    height: 100%;
    min-height: 0;
}

.history {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
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
