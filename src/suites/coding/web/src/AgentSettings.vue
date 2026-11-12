<script setup>
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {InnerTabs, SwitchCase, TabBody, WindowRoom, useWindow} from "@journal/window-kit";
import {ChangeFoot, FindBox, SettingPresetBand, currentPreset, useSettingsDraft} from "@journal/setting-components";
import AgentSettingsAgents from "./AgentSettingsAgents.vue";
import AgentSettingsPresets from "./AgentSettingsPresets.vue";
import AgentSettingsScreen from "./AgentSettingsScreen.vue";
import {CAP_SIZES, CONTEXT_PROFILES, CONTEXT_TOKENS, entryOf, fullCount, useHelperRows} from "./helperRows.js";

// the agent settings: the tabs under the environment, the long tabs drawn from the screens the settings declare,
// and one foot for the changes of all of them; a viewer who may only read sees a note that only a person changes them
const AUTO = "journal.suites.coding.auto-mode";
const DISPATCHES = "journal.suites.coding.workers.main-dispatches-workers";
const SCREEN_KEYS = {work: "work-screen", tests: "tests-screen", advanced: "advanced-screen", "helper-types": "helper-types-screen"};
const view = useWindow();
const tab = ref("work");
const tabs = [{key: "work", label: "Work"}, {key: "agents", label: "Helpers", count_field: "full"}, {key: "tests", label: "Tests"}, {key: "advanced", label: "Advanced"}];
const active = computed(() => tabs.find((entry) => entry.key === tab.value));

const loaded = () => Object.values(SCREEN_KEYS).map((key) => view.props[key].data.value);
const isLoaded = computed(() => loaded().every(Boolean));
const draft = useSettingsDraft({
    run: (line) => view.run(line),
    reload: async () => {
        const typeOpened = "type-screen.type" in view.state;
        await Promise.all([...Object.values(SCREEN_KEYS).map((key) => view.reload(key)), view.reload("limits"), ...(typeOpened ? [view.reload("type-screen")] : [])]);
        draft.load([...loaded(), ...(typeOpened ? [view.props["type-screen"].data.value] : [])]);
    },
});
watch(loaded, (screens) => { if (screens.every(Boolean)) draft.load(screens); }, {immediate: true});

// the Helpers tab says how many agent types are at a limit; the counts are read when the settings open
const {rows: helperTable} = useHelperRows(view, draft);
const full = computed(() => fullCount(helperTable.value));
const tabAnswer = computed(() => (full.value ? {full: `${full.value} full`} : {}));
onMounted(() => view.reload("limits"));

// the context caps by kind of agent: a row for each kind, the sizes to choose from, the size for every agent, and the types that have a cap of their own
const KIND_ROWS = [{key: "main", name: "Main agent"}, {key: "worker", name: "Workers"}, {key: "helper", name: "Read-only helpers"}];
const titleOf = (profile) => helperTable.value.find((entry) => entry.profile === profile)?.name ?? profile;
const ownCaps = computed(() => (draft.value(CONTEXT_PROFILES) ?? []).map(entryOf).map(({name, value}) => ({name: titleOf(name), value: value === "none" ? "no cap" : `${Number(value) / 1000}k`})));
const advancedExtras = computed(() => ({"keyed-cap-table": {rows: KIND_ROWS, sizes: CAP_SIZES, defaultCap: Number(draft.value(CONTEXT_TOKENS)) || CAP_SIZES[0], ownCaps: ownCaps.value}}));

const nodesOf = (name) => view.props[SCREEN_KEYS[name]].data.value?.nodes ?? [];
const nothingStarts = computed(() => draft.value(AUTO) === false && draft.value(DISPATCHES) === false);
const showsFoot = computed(() => !view.readOnly);

// the presets come with the work settings read: each gives a value to the eight switches, and the form matches one or none
const page = ref("main");
const presets = computed(() => view.props.work.data.value?.presets ?? []);
const switches = computed(() => view.props.work.data.value?.switches ?? []);
const form = computed(() => Object.fromEntries(switches.value.map((entry) => [entry.key, draft.value(entry.key)])));
const current = computed(() => currentPreset(form.value, presets.value));
const fill = (key) => draft.fill(presets.value.find((preset) => preset.key === key).values);

// Find a setting: opens the tab the setting lives on, brings its row into view and marks it for a moment
const MARK_MILLISECONDS = 1200;
const index = computed(() => view.props.find.data.value?.rows ?? []);
const found = ref("");
let marking = null;
const tabOf = (screen) => (screen.startsWith("helper-type") ? "agents" : screen);

function openFound(entry) {
    page.value = "main";
    pick({key: tabOf(entry.screen)});
    found.value = entry.key;
    clearTimeout(marking);
    marking = setTimeout(() => { found.value = ""; }, MARK_MILLISECONDS);
}

onBeforeUnmount(() => clearTimeout(marking));

function pick(entry) {
    tab.value = entry.key;
    view.state.tab = entry.key === "agents" ? "agents" : "";
}
</script>

<template>
    <WindowRoom padding="0">
        <div class="settings" data-agent-settings>
            <SwitchCase :value="page">
                <template #main>
                    <div class="head">
                        <span class="env" data-settings-environment>{{ view.environment }}</span>
                    </div>
                    <template v-if="presets.length">
                        <SettingPresetBand :presets="presets" :current="current" :disabled="view.readOnly" @pick="fill" @open-page="page = 'presets'">
                            <FindBox :index="index" @pick="openFound" />
                        </SettingPresetBand>
                    </template>
                    <div class="settings-bar"><InnerTabs :tabs="tabs" :active="active" :answer="tabAnswer" @choose="pick" /></div>
                    <template v-if="view.readOnly">
                        <p class="note lock" role="note" data-settings-lock>Only a person can change these settings. You can read every value, and ask a person for a change.</p>
                    </template>
                    <div :class="['settings-body', {flush: tab === 'agents'}]">
                        <TabBody :tab="active">
                            <SwitchCase :value="tab">
                                <template #work>
                                    <template v-if="isLoaded">
                                        <AgentSettingsScreen key="work" :nodes="nodesOf('work')" :draft="draft" :read-only="view.readOnly" :found="found" data-agent-settings-work>
                                            <template #before>
                                                <template v-if="nothingStarts">
                                                    <p class="hint" data-work-hint>With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.</p>
                                                </template>
                                            </template>
                                        </AgentSettingsScreen>
                                    </template>
                                </template>
                                <template #agents>
                                    <AgentSettingsAgents :draft="draft" />
                                </template>
                                <template #tests>
                                    <template v-if="isLoaded">
                                        <AgentSettingsScreen key="tests" :nodes="nodesOf('tests')" :draft="draft" :read-only="view.readOnly" :found="found" data-agent-settings-tests />
                                    </template>
                                </template>
                                <template #advanced>
                                    <template v-if="isLoaded">
                                        <AgentSettingsScreen key="advanced" :nodes="nodesOf('advanced')" :draft="draft" :read-only="view.readOnly" :found="found" :extras="advancedExtras" data-agent-settings-advanced />
                                    </template>
                                </template>
                            </SwitchCase>
                        </TabBody>
                    </div>
                </template>
                <template #presets>
                    <AgentSettingsPresets :presets="presets" :switches="switches" :now="form" :read-only="view.readOnly" @back="page = 'main'" @fill="fill" />
                </template>
            </SwitchCase>
            <template v-if="showsFoot">
                <ChangeFoot :changes="draft.changes()" :can-save="draft.canSave.value" :pending="draft.pending.value" :reason="draft.reason.value" :environment="view.environment" @save="draft.apply()" @cancel="draft.reset()" />
            </template>
        </div>
    </WindowRoom>
</template>

<style scoped>
.settings { --settings-bar-height: 32px; container-type: inline-size; display: flex; flex-direction: column; height: 100%; background: var(--raised, var(--bg)); }
.head { display: flex; align-items: center; gap: 12px; padding: 8px 18px 6px; }
.env { padding: 2px 8px; border: 1px solid var(--border-2); border-radius: 999px; color: var(--text-3); font-size: 11.5px; }
.settings-bar { position: sticky; top: 0; z-index: 2; background: var(--raised, var(--bg)); }
.settings-body { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.settings-body :deep([data-tab-body]), .settings-body :deep([data-tab-content]) { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.flush { padding: 0 0 22px; }
.note { margin: 14px 18px 0; padding: 8px 12px; border: 1px solid var(--accent); border-radius: 8px; background: var(--accent-dim, var(--hover)); color: var(--text); font-size: 12.5px; }
.hint { margin: 14px 0 0; color: var(--warn); font-size: 12px; text-wrap: pretty; }
</style>
