<script setup>
import {computed, ref, watch} from "vue";
import {ActionsMenu, Btn, CardPage, Icon, Skeleton, TimeAgo, removed, useWindow} from "@journal/window-kit";
import NewServer from "./NewServer.vue";
import ServerKey from "./ServerKey.vue";
import {INSTALLED, SUGGESTED, installedCard, integrationFields, serverMenu, suggestedCard} from "./integrationWords.js";

// the servers as cards in the groups Installed and Suggested; Settings-like actions are in each card's Actions, and the foot holds the one action that waits
const view = useWindow();
const installed = view.props.installed;
const suggested = view.props.suggested;
const notice = ref("");
const keying = ref(null);
const isMaking = ref(false);
const checkedAt = ref(null);
const failure = computed(() => installed.actionFailure.value || suggested.actionFailure.value);
const checkLines = computed(() => view.props.check.data.value?.lines ?? []);
const checkLine = (row) => checkLines.value.find((line) => line.startsWith(`${row.name}  `))?.slice(row.name.length + 2);
const names = computed(() => new Set(installed.rows.value.map((row) => row.name)));
const items = computed(() => [
    ...installed.rows.value.map((row) => installedCard(row, checkLine(row))),
    ...suggested.rows.value.filter((row) => !names.value.has(row.name)).map(suggestedCard),
]);

watch(view.props.check.data, (value) => {
    if (value) checkedAt.value = new Date().toISOString();
});

const refresh = () => view.reload(["installed", "suggested", "check"]);

async function signIn(row) {
    const result = await installed.act(["message", "send", `Please sign in to ${row.title}: call mcp__${row.name}__authenticate, then complete_authentication, and tell me when it is done.`]);
    notice.value = result.ok ? `Asked the agent to sign in to ${row.title}; a browser window opens from its terminal.` : "";
}

async function install(row) {
    await suggested.act(["mcp", "install", row.name], removed(row.id));
    await view.reload("installed");
}

const menuOf = (item) => serverMenu(item, {
    check: refresh,
    signIn: () => signIn(item.row),
    secret: () => (keying.value = item.row),
    remove: () => installed.act(["mcp", "remove", item.row.name], removed(item.row.id)),
});
const place = (item) => (item.group === INSTALLED ? {head: item.title, items: menuOf(item)} : {head: item.title, items: [{label: "Install", group: "open", run: () => install(item.row)}]});
</script>

<template>
    <CardPage title="Integrations" :items="items" :fields="integrationFields" :place="place" empty-title="No servers installed" data-integrations>
        <template #primary>
            <Btn small variant="primary" data-mcp-new @click="isMaking = true"><Icon name="plus" :size="12" />New</Btn>
        </template>
        <template #actions>
            <span v-if="checkedAt" class="checked" data-mcp-checked>Checked <TimeAgo :at="checkedAt" /></span>
            <Btn small data-mcp-refresh @click="refresh">Refresh</Btn>
        </template>
        <template #empty>
            <Skeleton v-if="!installed.loaded.value" shape="cards" />
            <p v-else class="note">Install one of the suggested servers, or add your own.</p>
        </template>
        <template #card="{item}">
            <template v-if="item.group === INSTALLED && notice"><p v-if="item.row.auth === 'oauth'" class="note" data-mcp-notice>{{ notice }}</p></template>
            <p v-if="failure && item.group === INSTALLED" class="note" role="alert">{{ failure }}</p>
        </template>
        <template #foot="{item}">
            <Btn v-if="item.group === SUGGESTED" small bordered data-mcp-install @click="install(item.row)">Install</Btn>
            <Btn v-else-if="item.fault" small bordered data-mcp-check @click="refresh">Check</Btn>
            <Btn v-else-if="item.row.auth === 'oauth'" small bordered data-mcp-sign-in @click="signIn(item.row)">Sign in</Btn>
        </template>
        <template #card-actions="{item}">
            <ActionsMenu v-if="item.group === INSTALLED" :items="menuOf(item)" :head="item.title" />
        </template>
    </CardPage>
    <template v-if="isMaking"><NewServer @close="isMaking = false" /></template>
    <template v-if="keying"><ServerKey :row="keying" @close="keying = null" /></template>
</template>

<style scoped>
.note {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.checked {
    color: var(--text-3);
    font-size: 12px;
}
</style>
