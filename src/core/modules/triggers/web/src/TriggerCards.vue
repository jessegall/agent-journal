<script setup>
import {computed, ref} from "vue";
import {Btn, Dialog, RowCards, useRows, useWindow} from "@journal/window-kit";
import NewTrigger from "./NewTrigger.vue";
import TriggerEditor from "./TriggerEditor.vue";

const context = useWindow();
const {rows, failure, loaded} = useRows("trigger list", ["trigger.*"]);
const drafting = ref(false);
const openedId = ref(null);
const refusal = ref("");
const opened = computed(() => rows.value.find((row) => row.id === openedId.value) || null);

const PATCH_LINES = {
    phrases: (phrases) => ["--phrases", ...phrases],
    action: (action) => ["--action", action],
    text: (text) => ["--text", text],
};

const headOf = (row) => `Trigger ${row.id} · ${row.action}`;
const footOf = (row) => (row.next_at ? `Next at ${new Date(row.next_at).toLocaleString()}` : `When these come up: ${row.phrases.join(", ")}`);

async function change(patch) {
    const [[field, value]] = Object.entries(patch);
    const answer = await context.run(["trigger", "edit", String(openedId.value), ...PATCH_LINES[field](value)]);
    refusal.value = answer.ok ? "" : answer.error;
}

async function strike() {
    const answer = await context.run(["trigger", "strike", String(openedId.value)]);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) openedId.value = null;
}

function open(row) {
    refusal.value = "";
    openedId.value = row.id;
}
</script>

<template>
    <RowCards noun="trigger" icon="bolt" :rows="rows" :failure="failure" :loaded="loaded" :head="headOf" :title="(row) => row.text" :foot="footOf" @new="drafting = true" @open="open">
        <template v-if="drafting">
            <NewTrigger @close="drafting = false" />
        </template>
        <template v-if="opened">
            <Dialog :title="`Trigger ${opened.id}`" @close="openedId = null">
                <TriggerEditor :trigger="opened" @change="change" />
                <template #foot>
                    <span class="note" role="status">{{ refusal }}</span>
                    <Btn kind="danger" data-trigger-strike @click="strike">End this trigger</Btn>
                    <Btn data-trigger-done @click="openedId = null">Done</Btn>
                </template>
            </Dialog>
        </template>
    </RowCards>
</template>

<style scoped>
.note {
    flex: 1;
    color: var(--text-3);
    font-size: 12px;
}
</style>
