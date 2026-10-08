<script setup>
import {saveSetting} from "../actions/settings.js";
import {stopJournal} from "../actions/stopJournal.js";
import {demo} from "../platform/demo.js";
import {narrow} from "../platform/view.js";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import Icon from "../kit/Icon.vue";
import PageBar from "../kit/PageBar.vue";
import Segmented from "../kit/Segmented.vue";
import SettingGroup from "../kit/SettingGroup.vue";
import SettingNav from "../kit/SettingNav.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TabBar from "../kit/TabBar.vue";
import TextInput from "../kit/TextInput.vue";
import Toast from "../kit/Toast.vue";
import AgentVoice from "./AgentVoice.vue";
import ServicesList from "./ServicesList.vue";
import DiagnosticsLog from "./DiagnosticsLog.vue";
import SettingsEnvironments from "./SettingsEnvironments.vue";
import PluginSettings from "./PluginSettings.vue";
import SettingsRegion from "./SettingsRegion.vue";
import SettingsConnection from "./SettingsConnection.vue";
import SettingsTunnel from "./SettingsTunnel.vue";
import {TABS, catalog, counts, inTab, narrowed, tabCounts, tabLine} from "../domain/settingsCatalog.js";
import {remember, remembered} from "../platform/storage.js";
import {useScrollSpy} from "../composables/scrollSpy.js";
import {useSlashFocus} from "../composables/slashFocus.js";
import {route} from "../route.js";
import {store} from "../state/store.js";

const TAB = "journal.settings.tab";
const LISTED = ["agent", "features", "system", "sharing", "developer"];
const FLUSH = ["plugins", "environments"];
const known = (key) => TABS.some((t) => t.key === key);
const opening = (...keys) => keys.find(known) || TABS[0].key;
const tab = ref(opening(route.value.sub, remembered(TAB, "")));
const query = ref("");
const filter = ref("all");
const field = ref(null);
const current = ref("");
const chosen = ref("");
const diagnostics = ref(false);
const stopping = ref(false);
const extension = ref(null);
const saved = ref(null);

const sections = computed(() =>
    store.settings
        ? catalog(store.spec || {}, store.settings, {
              identity: store.identity,
              extension: extension.value,
              extensionZip: api.extensionZip(),
              stoppable: !demo,
              stopping: stopping.value,
          })
        : []
);
const matched = computed(() => narrowed(sections.value, query.value, filter.value));
const searching = computed(() => Boolean(query.value.trim()) || filter.value !== "all");
const listed = computed(() => LISTED.includes(tab.value));
const across = computed(() => searching.value && listed.value);
const regions = computed(() => {
    const keys = across.value ? LISTED : [tab.value];
    return TABS.filter((t) => keys.includes(t.key))
        .map((t) => ({...t, sections: inTab(matched.value, t.key)}))
        .map((r) => ({...r, groups: r.sections.flatMap((s) => s.groups)}))
        .filter((r) => r.groups.length || !across.value);
});
const navSections = computed(() => (across.value ? matched.value : inTab(matched.value, tab.value)));
const groups = computed(() => regions.value.flatMap((r) => r.groups));
const total = computed(() => counts(sections.value));
const found = computed(() => tabCounts(matched.value));
const tabs = computed(() =>
    TABS.map((t) => ({key: t.key, title: t.title, count: across.value && LISTED.includes(t.key) ? found.value[t.key] : undefined}))
);
const filters = computed(() => [
    {key: "all", label: "All"},
    {key: "changed", label: "Changed", title: "Settings you changed from their default", count: total.value.changed, dot: true},
    {key: "off", label: "Off", count: total.value.off},
]);
const ASKING = {environments: "Find an environment", plugins: "Find a setting of a plugin"};
const asking = computed(() => ASKING[tab.value] || "Find a setting in every tab");
const tabGroups = computed(() => navSections.value.flatMap((s) => s.groups));
const onlyGroup = computed(() => (tabGroups.value.length === 1 ? tabGroups.value[0].key : ""));
const activeGroup = computed(() => chosen.value || onlyGroup.value);
const screen = computed(() => {
    if (!narrow.value || searching.value || !listed.value) return "page";
    return activeGroup.value ? "group" : "list";
});
const back = computed(() => narrow.value && screen.value === "group" && Boolean(chosen.value));
const phoneGroup = computed(() => groups.value.find((g) => g.key === activeGroup.value) || null);
const spied = computed(() => (screen.value === "page" && listed.value ? groups.value.map((g) => g.key) : []));

useScrollSpy(spied, current);
useSlashFocus(field);
watch(tab, (key) => {
    remember(TAB, key);
    chosen.value = "";
});
watch(
    () => route.value.sub,
    (key) => known(key) && (tab.value = key)
);

function openTab(key) {
    tab.value = key;
    location.replace(`#/${route.value.env}/settings?sub=${key}`);
    if (across.value) nextTick(() => document.querySelector(`[data-tab="${key}"]`)?.scrollIntoView({block: "start"}));
}

function pick(key) {
    chosen.value = key;
    current.value = key;
    if (!narrow.value) requestAnimationFrame(() => document.querySelector(`[data-spy="${key}"]`)?.scrollIntoView({block: "start"}));
}

function showAll() {
    query.value = "";
    filter.value = "all";
}

async function stop() {
    stopping.value = true;
    try {
        await stopJournal();
    } catch (e) {
        stopping.value = false;
    }
}

const BUTTON_ACTIONS = {diagnostics: () => (diagnostics.value = true), stop};

async function change(target, label, value) {
    await saveSetting(target, value);
    saved.value = {text: `Saved: ${label}`};
}

const save = (row, value) => change(row.target, row.label, value);
const saveTiming = (row, next) => change(row.timing.target, row.label, next);
const act = (row, key) => BUTTON_ACTIONS[key]();

onMounted(async () => {
    extension.value = await api.extension();
});
</script>

<template>
    <section :class="['settings', {narrow}]">
        <PageBar>
            <TabBar :tabs="tabs" :model-value="across ? '' : tab" @update:model-value="openTab" />
            <span class="settings-scope">
                Applies to environment
                <span class="settings-env">{{ route.env }}</span>
            </span>
        </PageBar>
        <PageBar>
            <TextInput
                ref="field"
                class="settings-find"
                icon="search"
                :value="query"
                :placeholder="asking"
                :aria-label="asking"
                @input="query = $event.target.value"
                @keydown.esc="query = ''"
            />
            <template v-if="listed">
                <Segmented :options="filters" :value="filter" :fill="narrow" @pick="filter = $event" />
            </template>
            <span class="settings-saved">Changes are saved as you make them</span>
        </PageBar>

        <template v-if="back">
            <Btn kind="text" class="settings-back" @click="chosen = ''">
                <Icon name="back" :size="14" />
                {{ TABS.find((t) => t.key === tab).title }}
            </Btn>
        </template>
        <SwitchCase :value="screen">
            <template #list>
                <p class="settings-line phone">{{ tabLine(tab) }}</p>
                <SettingNav class="settings-phone-list" sheet :sections="navSections" @pick="pick" />
            </template>
            <template #group>
                <div class="settings-phone-group">
                    <template v-if="phoneGroup">
                        <SettingGroup sheet :group="phoneGroup" @change="save" @timing="saveTiming" @act="act">
                            <template v-if="phoneGroup.key === 'voice'" #before>
                                <AgentVoice />
                            </template>
                        </SettingGroup>
                    </template>
                    <template v-if="tab === 'sharing'">
                        <SettingsTunnel />
                        <SettingsConnection />
                    </template>
                </div>
            </template>
            <template #page>
                <div :class="['settings-body', {plain: !listed}]">
                    <template v-if="!narrow && listed">
                        <SettingNav class="settings-nav" :sections="navSections" :current="current" :searching="searching" @pick="pick" />
                    </template>
                    <div :class="['settings-content', {flush: FLUSH.includes(tab)}]">
                        <SwitchCase :value="tab">
                            <template #environments>
                                <p class="settings-line">{{ tabLine("environments") }}</p>
                                <SettingsEnvironments :query="query" />
                            </template>
                            <template #services>
                                <p class="settings-line">{{ tabLine("services") }}</p>
                                <ServicesList />
                            </template>
                            <template #plugins>
                                <PluginSettings :query="query" @saved="saved = {text: `Saved: ${$event}`}" />
                            </template>
                            <template #default>
                                <div class="settings-column">
                                    <template v-for="region in regions" :key="region.key">
                                        <SettingsRegion
                                            :region="region"
                                            :across="across"
                                            :sheet="narrow"
                                            @change="save"
                                            @timing="saveTiming"
                                            @act="act"
                                        />
                                    </template>
                                    <template v-if="!groups.length && store.settings">
                                        <EmptyState class="settings-empty" title="No setting matches">
                                            Try other words, or
                                            <Btn class="settings-reset" @click="showAll">show every setting</Btn>
                                            .
                                        </EmptyState>
                                    </template>
                                </div>
                            </template>
                        </SwitchCase>
                    </div>
                </div>
            </template>
        </SwitchCase>

        <template v-if="diagnostics">
            <DiagnosticsLog @close="diagnostics = false" />
        </template>
        <Toast :toast="saved" :lasts="2500" @done="saved = null" />
    </section>
</template>

<style scoped>
.settings {
    display: flex;
    flex-direction: column;
    padding-bottom: 48px;
}

.settings-find {
    flex: 0 1 300px;
}

.settings-saved {
    margin-left: auto;
    color: var(--text-3);
    font-size: 12px;
}

.settings-line {
    margin: 0 0 18px;
    color: var(--text-2);
    font-size: 13px;
}

.settings-line.phone {
    margin: 0;
    padding: 12px 16px 4px;
}

.settings-body.plain {
    display: block;
}

.settings-content.flush {
    padding: 0;
}

.settings-content.flush > .settings-line {
    margin: 0;
    padding: 20px 16px 14px;
}

.settings-body.plain .settings-content {
    border-left: 0;
}

.settings-scope {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    color: var(--text-3);
    font-size: 12px;
}

.settings-env {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 1px 8px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    color: var(--text-2);
}

.settings-env::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
}

.settings-body {
    display: grid;
    grid-template-columns: 216px minmax(0, 1fr);
    align-items: start;
}

.settings-nav {
    position: sticky;
    top: var(--page-bar-height, 52px);
    max-height: calc(100vh - var(--page-bar-height, 52px) - 48px);
    overflow-y: auto;
    padding: 14px 10px;
}

.settings-content {
    min-width: 0;
    min-height: 100%;
    padding: 26px 40px 40px;
    border-left: 1px solid var(--border);
}

.settings-column {
    display: flex;
    flex-direction: column;
    gap: 30px;
    max-width: 760px;
}

.settings-empty {
    padding: 32px 16px;
}

.settings-reset {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
}

.settings-reset:hover {
    color: var(--text);
}

.settings-back :deep(.btn-label) {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.settings-back {
    align-self: flex-start;
    margin: 16px 16px 0;
    color: var(--accent-text);
    font-size: 15px;
}

.settings.narrow .settings-body {
    display: block;
}

.settings.narrow .settings-content {
    padding: 16px;
    border-left: 0;
}

.settings.narrow .settings-scope {
    display: none;
}

.settings.narrow .settings-find {
    flex: 1 1 100%;
}

.settings-phone-list {
    padding: 0 16px 16px;
}

.settings-phone-group {
    display: flex;
    flex-direction: column;
    padding: 16px;
}
</style>
