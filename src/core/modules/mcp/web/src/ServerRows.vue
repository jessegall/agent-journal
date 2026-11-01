<script setup>
import {computed, reactive} from "vue";
import {RowList, useRows} from "@journal/window-kit";

const installed = useRows("mcp list", []);
const suggested = useRows("mcp suggested", []);
const typed = reactive({});

const installedNames = computed(() => new Set(installed.rows.value.map((row) => row.name)));
const offered = computed(() => suggested.rows.value.filter((row) => !installedNames.value.has(row.name)));
const failure = computed(() => installed.actionFailure.value || suggested.actionFailure.value);

async function install(row) {
    await suggested.act(["mcp", "install", row.name]);
    await installed.load();
}

async function giveKey(row) {
    const key = (typed[row.name] || "").trim();
    if (!key) return;
    const result = await installed.act(["mcp", "key", row.name, key]);
    if (result.ok) typed[row.name] = "";
}
</script>

<template>
    <template v-if="failure">
        <p class="failure">{{ failure }}</p>
    </template>
    <h3 class="heading">Installed</h3>
    <RowList :rows="installed.rows.value" :failure="installed.failure.value" :loaded="installed.loaded.value" empty="No servers installed">
        <template #default="{row}">
            <div class="server" :data-row="row.id">
                <div class="head">
                    <span class="title">{{ row.title }}</span>
                    <span class="standing">{{ row.standing }}</span>
                    <button type="button" @click="installed.act(['mcp', 'remove', row.name])">Remove</button>
                </div>
                <template v-if="row.standing === 'needs its key'">
                    <form class="key" @submit.prevent="giveKey(row)">
                        <label :for="`key-${row.name}`">{{ row.key_variable }}</label>
                        <input :id="`key-${row.name}`" v-model="typed[row.name]" type="password" autocomplete="off" placeholder="Paste the key">
                        <button type="submit">Save</button>
                    </form>
                </template>
            </div>
        </template>
    </RowList>
    <h3 class="heading">Suggested</h3>
    <RowList :rows="offered" :failure="suggested.failure.value" :loaded="suggested.loaded.value" empty="Every suggested server is installed">
        <template #default="{row}">
            <div class="server">
                <div class="head">
                    <span class="title">{{ row.title }}</span>
                    <button type="button" @click="install(row)">Install</button>
                </div>
                <span class="subject">{{ row.subject }}</span>
            </div>
        </template>
    </RowList>
</template>

<style scoped>
.failure {
    margin: 0 0 8px;
    color: var(--bad, var(--text-2));
    font-size: 12px;
}

.heading {
    margin: 12px 0 6px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 600;
}

.server {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
}

.head {
    display: flex;
    align-items: baseline;
    gap: 10px;
}

.title {
    flex: 1;
    font-weight: 600;
}

.standing,
.subject,
.key label {
    color: var(--text-3);
    font-size: 12px;
}

.key {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.key input {
    padding: 4px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: inherit;
    font-size: 12px;
}

button {
    padding: 2px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: inherit;
    font-size: 12px;
    cursor: pointer;
}
</style>
