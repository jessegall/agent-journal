<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import {pluginFrom} from "../../composables/plugins.js";
import {usePluginInstall} from "../../composables/pluginInstall.js";
import {dotOf, isRunning, stateWord} from "../../domain/services.js";
import Switch from "../../kit/Switch.vue";
import ActionSheet from "../kit/ActionSheet.vue";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import {toast} from "../kit/toast.js";
import FormSheet from "../kit/FormSheet.vue";
import PhonePage from "./PhonePage.vue";
import PhonePluginPreview from "./PhonePluginPreview.vue";
import PhoneTerm from "./PhoneTerm.vue";
import {runsAllowed} from "../runs.js";

const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);
const plugin = ref(null);
const services = ref([]);
const pages = ref([]);
const log = ref("");
const reading = ref(false);
const asking = ref("");
const busy = ref("");

const {previewed, outcome, live, upgrade, install, closePreview} = usePluginInstall(busy);
const dashboards = computed(() => (plugin.value ? plugin.value.dashboards : []));

async function load() {
    plugin.value = pluginFrom(await api.show("plugin", props.target));
    const [running, shown] = await Promise.all([api.services(), api.pages()]);
    services.value = running.filter((s) => s.plugin === plugin.value.name);
    pages.value = shown.filter((page) => page.plugin === plugin.value.name);
}

async function act(action, body = {}, saying = "") {
    try {
        await api.act("plugin", plugin.value.n, action, body);
        if (saying) toast(saying);
    } catch (error) {
        toast(error.message);
    }
    await load().catch(() => {});
}

async function readLog() {
    reading.value = !reading.value;
    if (reading.value) log.value = (await api.pluginLog(plugin.value.name)).log;
}

async function clearLog() {
    await api.clearPluginLog(plugin.value.n);
    log.value = "";
}

async function remove(everything) {
    await act("remove", {how: "removed from the phone"});
    if (everything) await act("purge");
    emit("back");
}

const REMOVALS = [
    {key: "keep", label: "Remove, keep its settings and saved files", sub: "Its settings and caches stay in case you install it again", danger: true, run: () => remove(false)},
    {key: "all", label: "Remove everything", sub: "What it kept of its own goes too", danger: true, run: () => remove(true)},
];

function closed() {
    closePreview();
    load().catch(() => {});
}

const settingsLine = computed(() => `${plugin.value.settings.length} ${plugin.value.settings.length === 1 ? "setting" : "settings"}`);

onMounted(load);
</script>

<template>
    <PhonePage :title="plugin ? plugin.title : 'Plugin'" :line="plugin ? plugin.description : ''" :back="back" @back="emit('back')">
        <template v-if="plugin">
            <CellGroup>
                <Cell label="Version" :sub="`${plugin.version} · ${plugin.commit}`" still />
                <Cell label="Installed from" :sub="plugin.source" still />
                <Cell :label="plugin.enabled ? 'On' : 'Off'" sub="Turn the plugin on or off" still>
                    <template #end>
                        <template v-if="plugin.enabled || runsAllowed">
                            <Switch large :on="plugin.enabled" :title="plugin.title" @change="act($event ? 'enable' : 'disable')" />
                        </template>
                    </template>
                </Cell>
            </CellGroup>
            <CellGroup head="Open">
                <template v-if="plugin.settings.length">
                    <Cell label="Settings" :sub="settingsLine" icon="settings" @pick="emit('open', `pluginsettings:${plugin.n}`)" />
                </template>
                <template v-for="board in dashboards" :key="board.name">
                    <Cell :label="board.title" sub="Dashboard" icon="gauge" @pick="emit('open', `dash:${plugin.n}|${board.name}`)" />
                </template>
                <template v-for="page in pages" :key="page.name">
                    <Cell :label="page.title" sub="A page this plugin adds" icon="webpage" @pick="emit('open', `ppage:${page.plugin}.${page.name}`)" />
                </template>
                <Cell :label="reading ? 'Hide the plugin log' : 'Plugin log'" icon="terminal" :chevron="false" @pick="readLog" />
            </CellGroup>
            <template v-if="reading">
                <PhoneTerm :text="log || 'Nothing is logged yet.'" />
                <CellGroup>
                    <Cell label="Clear the plugin log" :chevron="false" @pick="clearLog" />
                </CellGroup>
            </template>
            <template v-if="services.length">
                <CellGroup head="Plugin services">
                    <template v-for="s in services" :key="s.id">
                        <Cell :label="s.service" :sub="s.why" :count="stateWord(s)" :hot="dotOf(s) === 'failed'" @pick="emit('open', `service:${s.id}`)" />
                    </template>
                </CellGroup>
            </template>
            <CellGroup head="Manage">
                <template v-if="runsAllowed">
                    <Cell label="Check for updates" sub="Shows what changes before anything runs" tone="accent" :chevron="false" @pick="upgrade(plugin)" />
                    <Cell label="Run setup again" sub="Its settings stay. Its services restart." :chevron="false" @pick="asking = 'setup'" />
                </template>
                <Cell label="Remove" sub="Its pages, settings and services go" tone="danger" :chevron="false" @pick="asking = 'remove'" />
            </CellGroup>
        </template>
    </PhonePage>
    <template v-if="asking === 'setup'">
        <FormSheet
            :title="`Run the setup of ${plugin.title} again?`"
            sub="Its settings stay. Its services restart."
            button="Run setup again"
            @close="asking = ''"
            @submit="act('upgrade', {yes: true, again: true}, 'Setup ran again')"
        />
    </template>
    <template v-if="asking === 'remove'">
        <ActionSheet :title="`Remove ${plugin.title}`" about="Its services stop and its folder goes" :actions="REMOVALS" @close="asking = ''" />
    </template>
    <template v-if="previewed">
        <PhonePluginPreview :previewed="previewed" :outcome="outcome" :live="live" :busy="busy" @close="closed" @install="install('')" />
    </template>
</template>
