<script setup>
import {computed, ref} from "vue";
import {Btn, Dialog, Icon, ago, Skeleton, useRows, useWindow} from "@journal/window-kit";
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
    <div class="cards-page">
        <div class="cards-bar">
            <span class="cards-count">{{ rows.length }} {{ rows.length === 1 ? "trigger" : "triggers" }}</span>
            <Btn small bordered data-trigger-new @click="drafting = true"><Icon name="plus" :size="12" /> New trigger</Btn>
        </div>
        <div class="cards">
            <template v-if="!loaded">
                <Skeleton shape="cards" />
            </template>
            <template v-else-if="failure">
                <p class="cards-note">{{ failure }}</p>
            </template>
            <template v-else-if="loaded && !rows.length">
                <p class="cards-note">No triggers yet</p>
            </template>
            <template v-for="row in rows" :key="row.id">
                <button type="button" class="card" :data-row="row.id" @click="open(row)">
                    <span class="card-head"><Icon name="bolt" class="card-icon" /> Trigger {{ row.id }} · {{ row.action }}<span class="card-age">{{ ago(row.created_at) }}</span></span>
                    <span class="card-title">{{ row.text }}</span>
                    <span class="card-foot">{{ row.next_at ? `Next at ${new Date(row.next_at).toLocaleString()}` : `When these come up: ${row.phrases.join(", ")}` }}</span>
                </button>
            </template>
        </div>
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
    </div>
</template>

<style scoped>
.cards-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.cards-bar {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    padding: 8px 20px;
    border-bottom: 1px solid var(--border);
}

.cards-count,
.note {
    color: var(--text-3);
    font-size: 12px;
}

.note {
    flex: 1;
}

.cards {
    flex: 1;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
    align-content: start;
    padding: 16px 20px;
}

.card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 110px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    color: inherit;
    text-align: left;
    cursor: pointer;
}

.card:hover {
    border-color: var(--border-strong, var(--border));
}

.card-head {
    display: flex;
    gap: 6px;
    align-items: center;
    color: var(--text-2);
    font-size: 13px;
}

.card-icon {
    width: 14px;
    height: 14px;
}

.card-title {
    font-weight: 600;
}

.card-foot {
    margin-top: auto;
    color: var(--text-3);
    font-size: 12px;
}

.cards-note {
    margin: 0;
    color: var(--text-2);
}
.card-age {
    margin-left: auto;
}
</style>
