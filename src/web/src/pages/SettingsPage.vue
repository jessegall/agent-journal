<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import ListBox from "../kit/ListBox.vue";
import PageBar from "../kit/PageBar.vue";
import SettingRow from "../kit/SettingRow.vue";
import Switch from "../kit/Switch.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TabBar from "../kit/TabBar.vue";
import TextInput from "../kit/TextInput.vue";
import FeaturePanel from "./FeaturePanel.vue";
import SettingsEnvironments from "./SettingsEnvironments.vue";
import Section from "./Section.vue";
import {changed, features, flip, haystack, isOn, matches, whenWords} from "./featureSettings.js";
import {saveViewerSetting, viewerSetting} from "../composables/viewerSetting.js";
import {remember, remembered} from "../composables/remembered.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";

const TAB = "journal.settings.tab";
const tab = ref(remembered(TAB, "options"));
const query = ref("");
const filter = ref("all");
const field = ref(null);
const chosen = ref("");
const extension = ref(null);
const stopping = ref(false);
const fixedOpen = ref(false);
const feature = computed(() => features.value.find((f) => f.name === chosen.value) || null);

const delivers = (how) => {
    const set = (store.settings && store.settings.delivery) || {};
    return how in set ? !!set[how] : true;
};

async function setDelivery(how, value) {
    await api.saveSettings({delivery: {...((store.settings && store.settings.delivery) || {}), [how]: value}});
}

const viewerOn = (key) => (store.settings?.viewer || {})[key] !== false;

const worded = (row) => ({...row, words: `${row.title} ${row.text} ${row.keywords || ""}`});

const viewerRows = computed(() =>
    [
        {
            key: "away",
            kind: "switch",
            title: "While you were away card",
            text: "When you come back to this tab, a card lists what the agent did meanwhile.",
            on: viewerOn("away"),
            changed: !viewerOn("away"),
            set: (v) => saveViewerSetting("away", v),
        },
        {
            key: "tour",
            kind: "switch",
            title: "Home tour",
            text: "A few short steps that show you around Home. Turns off once you finish or skip it.",
            on: !viewerSetting("tour_seen", false),
            changed: false,
            set: (v) => saveViewerSetting("tour_seen", !v),
        },
    ].map(worded)
);

const journalRows = computed(() =>
    [
        {
            key: "color",
            kind: "color",
            title: "Project color",
            text: "The colored band that tells this project apart from other open journals.",
            keywords: "colour band identity",
            changed: Boolean(store.identity && store.identity.custom_color),
        },
        {
            key: "channel",
            kind: "switch",
            title: "Send lines through the channel",
            text: "The agent reads your lines mid-turn. When off, they are typed into its terminal instead.",
            keywords: "delivery",
            on: delivers("channel"),
            changed: !delivers("channel"),
            set: (v) => setDelivery("channel", v),
        },
        {
            key: "extension",
            kind: "extension",
            title: "Chrome extension",
            text: "Puts the chat on any web page and lets the agent see and use the tab.",
            keywords: "browser download",
        },
    ].map(worded)
);

const featureRows = computed(() =>
    [...features.value]
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((f) => ({
            key: f.name,
            feature: f,
            title: f.title,
            text: f.abstract,
            words: haystack(f),
            on: f.fixed ? undefined : isOn(f),
            changed: changed(f),
            when: isOn(f) ? whenWords(f.when) : "",
        }))
);

const stopRow = {
    key: "stop",
    title: "Stop the journal",
    text: "Closes the viewer, the engine and every plugin service. Nothing is deleted; journal claude starts it again.",
    words: "stop the journal shut down quit engine viewer",
};

const passes = (row) =>
    matches(row.words, query.value) && (filter.value === "all" || (filter.value === "changed" ? row.changed : row.on === false));
const shown = (list) => list.filter(passes);
const everything = computed(() => [...viewerRows.value, ...journalRows.value, ...featureRows.value]);
const filters = computed(() => [
    {key: "all", title: "All"},
    {key: "changed", title: "Changed", count: everything.value.filter((row) => row.changed).length},
    {key: "off", title: "Off", count: everything.value.filter((row) => row.on === false).length},
]);
const sections = computed(() => ({
    viewer: shown(viewerRows.value),
    journal: shown(journalRows.value),
    features: shown(featureRows.value).filter((row) => !row.feature.fixed),
    fixed: shown(featureRows.value).filter((row) => row.feature.fixed),
    stop: shown([stopRow]),
}));
const pageTabs = computed(() => [
    {key: "options", title: "Options"},
    {key: "environments", title: "Environments", count: rows("environment").filter((e) => !e.completed).length},
]);
watch(tab, (key) => remember(TAB, key));
const nothing = computed(() => Object.values(sections.value).every((list) => !list.length));

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

async function saveColor(color) {
    store.identity = await api.saveIdentity({color});
}

function onKey(e) {
    if (e.key !== "/" || e.target.closest("input,textarea,[contenteditable]")) return;
    e.preventDefault();
    field.value && field.value.focus();
}

onMounted(async () => {
    window.addEventListener("keydown", onKey);
    extension.value = await api.extension();
});
onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<template>
    <section class="settings">
        <PageBar>
            <TabBar v-model="tab" :tabs="pageTabs" />
            <TextInput
                ref="field"
                class="settings-find"
                icon="search"
                :value="query"
                :placeholder="tab === 'environments' ? 'Find an environment' : 'Find a setting'"
                :aria-label="tab === 'environments' ? 'Find an environment' : 'Find a setting'"
                @input="query = $event.target.value"
                @keydown.esc="query = ''"
            />
            <template v-if="tab === 'options'">
                <TabBar v-model="filter" :tabs="filters" />
            </template>
        </PageBar>

        <SwitchCase :value="tab">
            <template #environments>
                <SettingsEnvironments :query="query" />
            </template>
            <template #options>
                <template v-if="sections.viewer.length">
                    <ListBox sticky title="This viewer" :count="sections.viewer.length">
                        <template v-for="row in sections.viewer" :key="row.key">
                            <SettingRow :title="row.title" :text="row.text" :tag="row.changed ? 'Changed' : ''">
                                <template #control>
                                    <Switch :on="row.on" @change="row.set" />
                                </template>
                            </SettingRow>
                        </template>
                    </ListBox>
                </template>

                <template v-if="sections.journal.length">
                    <ListBox sticky title="This journal" :count="sections.journal.length">
                        <template v-for="row in sections.journal" :key="row.key">
                            <SettingRow :title="row.title" :text="row.text" :tag="row.changed ? 'Changed' : ''">
                                <template #control>
                                    <SwitchCase :value="row.kind">
                                        <template #switch>
                                            <Switch :on="row.on" @change="row.set" />
                                        </template>
                                        <template #color>
                                            <Section @save-color="saveColor" />
                                        </template>
                                        <template #extension>
                                            <template v-if="extension && extension.available">
                                                <template v-if="extension.store">
                                                    <a class="settings-link" :href="extension.store" target="_blank" rel="noopener">
                                                        Add to Chrome
                                                    </a>
                                                </template>
                                                <a class="settings-link" :href="api.extensionZip()">Download</a>
                                            </template>
                                        </template>
                                    </SwitchCase>
                                </template>
                            </SettingRow>
                        </template>
                    </ListBox>
                </template>

                <template v-if="sections.features.length">
                    <ListBox sticky :title="`Features on ${route.env}`" :count="sections.features.length">
                        <template v-for="row in sections.features" :key="row.key">
                            <SettingRow
                                compact
                                :title="row.title"
                                :text="row.text"
                                :tag="row.changed ? 'Changed' : ''"
                                opens
                                @open="chosen = row.key"
                            >
                                <template v-if="row.when">
                                    <span>Runs {{ row.when }}</span>
                                </template>
                                <template #control>
                                    <Switch :on="row.on" @change="(v) => flip(row.key, v)" />
                                </template>
                            </SettingRow>
                        </template>
                    </ListBox>
                </template>

                <template v-if="sections.fixed.length">
                    <ListBox
                        sticky
                        folds
                        title="Always on"
                        :count="sections.fixed.length"
                        :open="fixedOpen || Boolean(query)"
                        @toggle="fixedOpen = !fixedOpen"
                    >
                        <template v-for="row in sections.fixed" :key="row.key">
                            <SettingRow
                                compact
                                :title="row.title"
                                :text="row.text"
                                :tag="row.changed ? 'Changed' : ''"
                                opens
                                @open="chosen = row.key"
                            >
                                <template v-if="row.when">
                                    <span>Runs {{ row.when }}</span>
                                </template>
                            </SettingRow>
                        </template>
                    </ListBox>
                </template>

                <template v-if="sections.stop.length">
                    <ListBox sticky title="Shut down">
                        <SettingRow :title="stopRow.title" :text="stopRow.text">
                            <template #control>
                                <Btn kind="danger" small :disabled="stopping" @click="stop">{{ stopping ? "Stopping" : "Stop" }}</Btn>
                            </template>
                        </SettingRow>
                    </ListBox>
                </template>

                <template v-if="nothing">
                    <EmptyState class="settings-empty" title="No setting matches">
                        Try other words, or
                        <button type="button" class="settings-reset" @click="showAll">show every setting</button>
                        .
                    </EmptyState>
                </template>
            </template>
        </SwitchCase>

        <template v-if="feature">
            <FeaturePanel :feature="feature" @close="chosen = ''" />
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
    flex: 1 1 260px;
    max-width: 440px;
}

.settings-link {
    color: var(--accent-text);
    font-size: 12.5px;
    white-space: nowrap;
}

.settings-link:hover {
    color: var(--text);
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
</style>
