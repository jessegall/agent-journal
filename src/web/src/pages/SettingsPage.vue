<script setup>
import {saveSetting} from "../actions/settings.js";
import {demo} from "../platform/demo.js";
import {narrow} from "../platform/view.js";
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import Icon from "../kit/Icon.vue";
import PageBar from "../kit/PageBar.vue";
import Segmented from "../kit/Segmented.vue";
import SettingGroup from "../kit/SettingGroup.vue";
import SettingNav from "../kit/SettingNav.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TextInput from "../kit/TextInput.vue";
import ServicesPanel from "./ServicesPanel.vue";
import DiagnosticsLog from "./DiagnosticsLog.vue";
import SettingsEnvironments from "./SettingsEnvironments.vue";
import SettingsTunnel from "./SettingsTunnel.vue";
import {LINKS, catalog, counted, counts, narrowed} from "../domain/settingsCatalog.js";
import {remember, remembered} from "../platform/storage.js";
import {useScrollSpy} from "../composables/scrollSpy.js";
import {useSlashFocus} from "../composables/slashFocus.js";
import {route} from "../route.js";
import {store} from "../state/store.js";

const VIEW = "journal.settings.view";
const view = ref(remembered(VIEW, "groups"));
const query = ref("");
const filter = ref("all");
const field = ref(null);
const current = ref("");
const chosen = ref("");
const services = ref(false);
const diagnostics = ref(false);
const stopping = ref(false);
const extension = ref(null);

const sections = computed(() =>
    catalog(store.spec || {}, store.settings || {}, {
        identity: store.identity,
        extension: extension.value,
        extensionZip: api.extensionZip(),
        demo,
        stopping: stopping.value,
    })
);
const shown = computed(() => narrowed(sections.value, query.value, filter.value));
const groups = computed(() => shown.value.flatMap((s) => s.groups));
const searching = computed(() => Boolean(query.value.trim()) || filter.value !== "all");
const total = computed(() => counts(sections.value));
const found = computed(() => groups.value.reduce((n, g) => n + counted(g), 0));
const filters = computed(() => [
    {key: "all", label: "All"},
    {key: "changed", label: "Changed", count: total.value.changed, dot: true},
    {key: "off", label: "Off", count: total.value.off},
]);
const screen = computed(() => {
    if (!narrow.value || searching.value || view.value !== "groups") return "page";
    return chosen.value ? "group" : "list";
});
const back = computed(() => narrow.value && (screen.value === "group" || view.value !== "groups"));
const phoneGroup = computed(() => groups.value.find((g) => g.key === chosen.value) || null);
const spied = computed(() => (screen.value === "page" && view.value === "groups" ? groups.value.map((g) => g.key) : []));

useScrollSpy(spied, current);
useSlashFocus(field);
watch(view, (key) => remember(VIEW, key));

function pick(key) {
    view.value = "groups";
    chosen.value = key;
    current.value = key;
    if (!narrow.value) requestAnimationFrame(() => document.querySelector(`[data-spy="${key}"]`)?.scrollIntoView({block: "start"}));
}

function open(key) {
    view.value = key;
    current.value = key;
}

function goBack() {
    chosen.value = "";
    view.value = "groups";
}

function showAll() {
    query.value = "";
    filter.value = "all";
}

async function stop() {
    stopping.value = true;
    try {
        await api.stop();
    } catch (e) {
        stopping.value = false;
    }
}

const BUTTON_ACTIONS = {services: () => (services.value = true), diagnostics: () => (diagnostics.value = true), stop};
const save = (row, value) => saveSetting(row.target, value);
const saveTiming = (row, next) => saveSetting(row.timing.target, next);
const act = (row, key) => BUTTON_ACTIONS[key]();

onMounted(async () => {
    extension.value = await api.extension();
});
</script>

<template>
    <section :class="['settings', {narrow}]">
        <PageBar>
            <TextInput
                ref="field"
                class="settings-find"
                icon="search"
                :value="query"
                :placeholder="view === 'environments' ? 'Find an environment' : 'Find a setting'"
                :aria-label="view === 'environments' ? 'Find an environment' : 'Find a setting'"
                @input="query = $event.target.value"
                @keydown.esc="query = ''"
            />
            <template v-if="view === 'groups'">
                <Segmented :options="filters" :value="filter" :fill="narrow" @pick="filter = $event" />
            </template>
            <span class="settings-scope">
                Applies to environment
                <span class="settings-env">{{ route.env }}</span>
            </span>
        </PageBar>

        <template v-if="back">
            <button type="button" class="settings-back" @click="goBack">
                <Icon name="back" :size="14" />
                Settings
            </button>
        </template>
        <SwitchCase :value="screen">
            <template #list>
                <SettingNav class="settings-phone-list" sheet :sections="sections" :links="LINKS" @pick="pick" @open="open" />
            </template>
            <template #group>
                <div class="settings-phone-group">
                    <template v-if="phoneGroup">
                        <SettingGroup sheet :group="phoneGroup" @change="save" @timing="saveTiming" @act="act" />
                    </template>
                </div>
            </template>
            <template #page>
                <div class="settings-body">
                    <template v-if="!narrow">
                        <SettingNav
                            class="settings-nav"
                            :sections="shown"
                            :links="LINKS"
                            :current="current"
                            :searching="searching"
                            @pick="pick"
                            @open="open"
                        />
                    </template>
                    <div class="settings-content">
                        <SwitchCase :value="view">
                            <template #environments>
                                <SettingsEnvironments :query="query" />
                            </template>
                            <template #tunnel>
                                <SettingsTunnel />
                            </template>
                            <template #default>
                                <div class="settings-column">
                                    <template v-if="searching && groups.length">
                                        <div class="settings-found">{{ found }} settings in {{ groups.length }} groups</div>
                                    </template>
                                    <template v-for="group in groups" :key="group.key">
                                        <SettingGroup :group="group" :sheet="narrow" @change="save" @timing="saveTiming" @act="act" />
                                    </template>
                                    <template v-if="!groups.length">
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

        <template v-if="services">
            <ServicesPanel @close="services = false" />
        </template>
        <template v-if="diagnostics">
            <DiagnosticsLog @close="diagnostics = false" />
        </template>
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

.settings-found {
    color: var(--text-3);
    font-size: 12.5px;
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

.settings-back {
    display: inline-flex;
    align-self: flex-start;
    align-items: center;
    gap: 6px;
    margin: 16px 16px 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 15px;
    cursor: pointer;
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
