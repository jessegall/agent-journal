<script setup>
import {computed, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import {installedPlugins} from "../composables/plugins.js";
import {matches, tabLine} from "../domain/settingsCatalog.js";
import {route} from "../route.js";
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import EmptyState from "../kit/EmptyState.vue";
import ListBox from "../kit/ListBox.vue";
import SettingNav from "../kit/SettingNav.vue";
import Switch from "../kit/Switch.vue";
import PluginSetting from "./PluginSetting.vue";

const props = defineProps({query: {type: String, default: ""}});
const emit = defineEmits(["saved"]);
const UNGROUPED = "";

const plugins = installedPlugins();
const configurable = computed(() => plugins.value.filter((p) => p.settings.length));
const chosen = ref(route.value.plugin);
const toggled = reactive({});
const current = ref("");

const plugin = computed(() => configurable.value.find((p) => p.name === chosen.value) || configurable.value[0] || null);
const flagsOf = (list) => list.filter((s) => s.type === "flag");
const visible = (p) => {
    const values = Object.fromEntries(p.settings.map((s) => [s.key, s.value]));
    return p.settings.filter((s) => !s.when.length || s.when.some((choice) => choice.every(([other, value]) => values[other] === value)));
};
const words = (s) => `${s.title} ${s.help} ${s.group}`;

function groupsOf(p) {
    const shown = visible(p);
    const out = new Map();
    for (const s of shown.filter((setting) => !setting.parent)) {
        const name = s.group || UNGROUPED;
        out.set(name, [...(out.get(name) || []), s]);
    }
    return [...out].map(([name, settings]) => {
        const all = settings.flatMap((s) => [s, ...shown.filter((child) => child.parent === s.key)]);
        const flags = flagsOf(all);
        const found = props.query.trim()
            ? settings.filter((s) => [s, ...childrenOf(shown, s)].some((x) => matches(words(x), props.query)))
            : settings;
        return {name, settings: found, shown, flags, folded: toggled[name] ?? (settings.every((s) => s.detail) && !props.query.trim())};
    });
}

const childrenOf = (shown, s) => shown.filter((child) => child.parent === s.key);
const groups = computed(() => (plugin.value ? groupsOf(plugin.value).filter((g) => g.settings.length) : []));
const onLine = (g) => (g.flags.length ? `${g.flags.filter((s) => s.value === "true").length} of ${g.flags.length} on` : g.settings.length);
const sections = computed(() =>
    configurable.value.map((p) => ({
        title: p.title,
        groups: groupsOf(p).map((g) => ({
            key: `${p.name}|${g.name}`,
            title: g.name || "Settings",
            mark: g.flags.length ? `${g.flags.filter((s) => s.value === "true").length} of ${g.flags.length}` : "",
            markTitle: "Rules switched on",
            head: null,
            items: [],
            danger: [],
        })),
    }))
);

async function change(key, value) {
    await api.configurePlugin(plugin.value.n, key, value);
    emit("saved", key);
}

async function all(group, on) {
    const next = String(on);
    await Promise.all(group.flags.filter((s) => s.value !== next).map((s) => api.configurePlugin(plugin.value.n, s.key, next)));
    emit("saved", group.name || "Settings");
}

async function toggle(on) {
    await api.act("plugin", plugin.value.n, on ? "enable" : "disable");
    emit("saved", plugin.value.title);
}

function pick(key) {
    const [name, group] = key.split("|");
    chosen.value = name;
    current.value = key;
    toggled[group] = true;
    requestAnimationFrame(() => document.querySelector(`[data-group="${group}"]`)?.scrollIntoView({block: "start"}));
}

watch(
    () => route.value.plugin,
    (name) => name && (chosen.value = name)
);
</script>

<template>
    <template v-if="!configurable.length">
        <EmptyState class="plugin-settings-empty" title="No plugin has settings">Install a plugin from the Plugins page.</EmptyState>
    </template>
    <template v-else>
        <div class="plugin-settings">
            <SettingNav class="plugin-settings-nav" :sections="sections" :current="current" @pick="pick" />
            <div class="plugin-settings-body">
                <p class="plugin-settings-line">{{ tabLine("plugins") }}</p>
                <div class="plugin-settings-head">
                    <h2 class="plugin-settings-title">{{ plugin.title }}</h2>
                    <Chip>{{ plugin.version }}</Chip>
                    <span class="plugin-settings-on">
                        {{ plugin.enabled ? "On" : "Off" }}
                        <Switch :on="plugin.enabled" :title="`Turn ${plugin.title} on or off`" @change="toggle" />
                    </span>
                </div>
                <p class="plugin-settings-line">{{ plugin.description }}</p>
                <template v-for="group in groups" :key="group.name">
                    <div :data-group="group.name">
                        <ListBox
                            folds
                            :title="group.name || 'Settings'"
                            :count="onLine(group)"
                            :open="!group.folded"
                            @toggle="toggled[group.name] = !group.folded"
                        >
                            <template v-if="group.flags.length > 1">
                                <div class="plugin-settings-all">
                                    <Btn small @click="all(group, true)">Turn all on</Btn>
                                    <Btn small @click="all(group, false)">Turn all off</Btn>
                                </div>
                            </template>
                            <template v-for="s in group.settings" :key="s.key">
                                <PluginSetting :setting="s" :children="childrenOf(group.shown, s)" @change="change" />
                            </template>
                        </ListBox>
                    </div>
                </template>
            </div>
        </div>
    </template>
</template>

<style scoped>
.plugin-settings {
    display: grid;
    grid-template-columns: 216px minmax(0, 1fr);
    align-items: start;
}

.plugin-settings-nav {
    position: sticky;
    top: var(--page-bar-height, 52px);
    max-height: calc(100vh - var(--page-bar-height, 52px) - 48px);
    overflow-y: auto;
    padding: 14px 10px;
}

.plugin-settings-head {
    display: flex;
    align-items: center;
    gap: 10px;
}

.plugin-settings-on {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    color: var(--text-3);
    font-size: 12.5px;
}

.plugin-settings-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-width: 0;
    padding: 26px 40px 40px;
    border-left: 1px solid var(--border);
}

.plugin-settings-body > * {
    max-width: 760px;
}

.plugin-settings-title {
    margin: 0;
    color: var(--text);
    font-size: 17px;
    font-weight: 600;
}

.plugin-settings-line {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
}

.plugin-settings-all {
    display: flex;
    gap: 8px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
}

.plugin-settings-empty {
    padding: 32px 16px;
}
</style>
