<script setup>
import {computed, ref, watch} from "vue";
import {InnerTabs, SwitchCase, TabBody, WindowRoom, useWindow} from "@journal/window-kit";
import {ChangeFoot, useSettingsDraft} from "@journal/setting-components";
import AgentSettingsAgents from "./AgentSettingsAgents.vue";
import AgentSettingsScreen from "./AgentSettingsScreen.vue";

// the agent settings: the tabs under the environment, the long tabs drawn from the screens the settings declare,
// and one foot for the changes of all of them; a viewer who may only read sees a note that only a person changes them
const AUTO = "journal.suites.coding.auto-mode";
const DISPATCHES = "journal.suites.coding.workers.main-dispatches-workers";
const SCREEN_KEYS = {work: "work-screen", tests: "tests-screen", advanced: "advanced-screen"};
const view = useWindow();
const tab = ref("work");
const tabs = [{key: "work", label: "Work"}, {key: "agents", label: "Helpers"}, {key: "tests", label: "Tests"}, {key: "advanced", label: "Advanced"}];
const active = computed(() => tabs.find((entry) => entry.key === tab.value));

const loaded = () => Object.values(SCREEN_KEYS).map((key) => view.props[key].data.value);
const isLoaded = computed(() => loaded().every(Boolean));
const draft = useSettingsDraft({
    run: (line) => view.run(line),
    reload: async () => {
        await Promise.all(Object.values(SCREEN_KEYS).map((key) => view.reload(key)));
        draft.load(loaded());
    },
});
watch(loaded, (screens) => { if (screens.every(Boolean)) draft.load(screens); }, {immediate: true});

const nodesOf = (name) => view.props[SCREEN_KEYS[name]].data.value?.nodes ?? [];
const nothingStarts = computed(() => draft.value(AUTO) === false && draft.value(DISPATCHES) === false);
const showsFoot = computed(() => tab.value !== "agents" && !view.readOnly);

function pick(entry) {
    tab.value = entry.key;
    view.state.tab = entry.key === "agents" ? "agents" : "";
}
</script>

<template>
    <WindowRoom padding="0">
        <div class="settings" data-agent-settings>
            <div class="head">
                <span class="env" data-settings-environment>{{ view.environment }}</span>
            </div>
            <div class="settings-bar"><InnerTabs :tabs="tabs" :active="active" @choose="pick" /></div>
            <template v-if="view.readOnly">
                <p class="note lock" role="note" data-settings-lock>Only a person can change these settings. You can read every value, and ask a person for a change.</p>
            </template>
            <div :class="['settings-body', {flush: tab === 'agents'}]">
                <TabBody :tab="active">
                    <SwitchCase :value="tab">
                        <template #work>
                            <template v-if="isLoaded">
                                <AgentSettingsScreen key="work" :nodes="nodesOf('work')" :draft="draft" :read-only="view.readOnly" data-agent-settings-work>
                                    <template #before>
                                        <template v-if="nothingStarts">
                                            <p class="hint" data-work-hint>With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.</p>
                                        </template>
                                    </template>
                                </AgentSettingsScreen>
                            </template>
                        </template>
                        <template #agents>
                            <AgentSettingsAgents />
                        </template>
                        <template #tests>
                            <template v-if="isLoaded">
                                <AgentSettingsScreen key="tests" :nodes="nodesOf('tests')" :draft="draft" :read-only="view.readOnly" data-agent-settings-tests />
                            </template>
                        </template>
                        <template #advanced>
                            <template v-if="isLoaded">
                                <AgentSettingsScreen key="advanced" :nodes="nodesOf('advanced')" :draft="draft" :read-only="view.readOnly" data-agent-settings-advanced />
                            </template>
                        </template>
                    </SwitchCase>
                </TabBody>
            </div>
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
.flush { padding: 0 0 22px; }
.note { margin: 14px 18px 0; padding: 8px 12px; border: 1px solid var(--accent); border-radius: 8px; background: var(--accent-dim, var(--hover)); color: var(--text); font-size: 12.5px; }
.hint { margin: 14px 0 0; color: var(--warn); font-size: 12px; text-wrap: pretty; }
</style>
