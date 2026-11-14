<script setup>
import {computed, reactive, ref, watch} from "vue";
import {Btn, ListTools, RowList, WindowRoom, TimeAgo, added as addedRow, removed, useListTools, useWindow} from "@journal/window-kit";

const view = useWindow();
const installed = view.props.installed;
const suggested = view.props.suggested;
const tools = useListTools(installed.rows, {title: (row) => row.title});
const typed = reactive({});

const installedNames = computed(() => new Set(installed.rows.value.map((row) => row.name)));
const offered = computed(() => suggested.rows.value.filter((row) => !installedNames.value.has(row.name)));
const notice = ref("");
const failure = computed(() => installed.actionFailure.value || suggested.actionFailure.value);
const added = reactive({name: "", target: ""});
const checkLines = computed(() => view.props.check.data.value?.lines ?? []);
const checkedAt = ref(null);

watch(view.props.check.data, (value) => {
    if (value) checkedAt.value = new Date().toISOString();
});

const checkLine = (row) => checkLines.value.find((line) => line.startsWith(`${row.name}  `))?.slice(row.name.length + 2);

async function refresh() {
    await view.reload(["installed", "suggested", "check"]);
}

async function add() {
    const pending = {id: `adding-${Date.now()}`, name: added.name.trim(), title: added.name.trim(), standing: "adding", auth: "", url: added.target.trim(), command: "", args: [], key_variable: ""};
    const result = await installed.act(["mcp", "add", added.name.trim(), added.target.trim()], addedRow(pending));
    if (!result.ok) return;
    Object.assign(added, {name: "", target: ""});
    await view.reload("check");
}

async function signIn(row) {
    const result = await installed.act(["message", "send", `Please sign in to ${row.title}: call mcp__${row.name}__authenticate, then complete_authentication, and tell me when it is done.`]);
    notice.value = result.ok ? `Asked the agent to sign in to ${row.title}; a browser window opens from its terminal.` : "";
}


async function install(row) {
    await suggested.act(["mcp", "install", row.name], removed(row.id));
    await view.reload("installed");
}

async function giveKey(row) {
    const key = (typed[row.name] || "").trim();
    if (!key) return;
    const result = await installed.act(["mcp", "key", row.name, key]);
    if (result.ok) typed[row.name] = "";
}
</script>

<template>
    <WindowRoom>
        <template v-if="failure">
            <p class="failure">{{ failure }}</p>
        </template>
        <template v-if="notice">
            <p class="notice" data-mcp-notice>{{ notice }}</p>
        </template>
        <div class="top">
            <h3 class="heading">Installed</h3>
            <template v-if="checkedAt">
                <span class="subject" data-mcp-checked>Checked <TimeAgo :at="checkedAt" /></span>
            </template>
            <Btn small data-mcp-refresh @click="refresh">Refresh</Btn>
        </div>
        <ListTools :tools="tools" />
        <RowList :rows="tools.shown.value" :failure="installed.failure.value" :loaded="installed.loaded.value" empty="No servers installed" hint="Install one of the suggested servers below, or add your own." :searching="tools.filtering.value">
            <template #default="{row}">
                <div class="server" :data-row="row.id">
                    <div class="head">
                        <span class="title">{{ row.title }}</span>
                        <span class="standing">{{ row.standing }}</span>
                        <template v-if="row.auth === 'oauth'">
                            <button type="button" data-mcp-sign-in @click="signIn(row)">Sign in</button>
                        </template>
                        <button type="button" @click="installed.act(['mcp', 'remove', row.name], removed(row.id))">Remove</button>
                    </div>
                    <code class="subject">{{ row.url || [row.command, ...row.args].join(" ") }}</code>
                    <template v-if="checkLine(row)">
                        <span class="subject" data-mcp-check>{{ checkLine(row) }}</span>
                    </template>
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
        <h3 class="heading">Add a server</h3>
        <form class="add" data-mcp-add @submit.prevent="add">
            <input v-model="added.name" placeholder="Name" aria-label="Name">
            <input v-model="added.target" placeholder="Its address, or the command that starts it" aria-label="Its address, or the command that starts it">
            <Btn small variant="primary" type="submit" :disabled="!added.name.trim() || !added.target.trim()">Add</Btn>
        </form>
        <h3 class="heading">Suggested</h3>
        <RowList :rows="offered" :failure="suggested.failure.value" :loaded="suggested.loaded.value" empty="Every suggested server is installed" hint="Suggested servers appear here until installed.">
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
    </WindowRoom>
</template>

<style scoped>
.failure {
    margin: 0 0 8px;
    color: var(--bad, var(--text-2));
    font-size: 12px;
}

.notice {
    margin: 0 0 8px;
    color: var(--text-2);
    font-size: 12px;
}

.top {
    display: flex;
    align-items: baseline;
    gap: 10px;
}

.top .heading {
    flex: 1;
}

.add {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.add input {
    flex: 1;
    min-width: 120px;
    padding: 4px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: inherit;
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
