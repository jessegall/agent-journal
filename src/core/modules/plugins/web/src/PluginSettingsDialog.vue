<script setup>
import {computed, watch} from "vue";
import {Dialog, Switch} from "@journal/window-kit";
import {ChangeFoot, SettingsScreen, useSettingsDraft} from "@journal/setting-components";
import {configureChanges, secretsOf, settingScreens} from "./pluginSettingScreen.js";

// a plugin's settings drawn from the shared setting components, as the agent settings are: its name, version, description and switch, then its settings in sections, saved together with Save
const props = defineProps({plugin: {type: Object, required: true}, description: {type: String, default: ""}, settings: {type: Array, required: true}, save: {type: Function, required: true}});
const emit = defineEmits(["close", "toggle"]);
const draft = useSettingsDraft({run: (line) => props.save(configureChanges(line, props.settings)), reload: async () => {}});
const nodes = computed(() => settingScreens(props.plugin.name, props.settings).flatMap((screen) => screen.nodes));
const secrets = computed(() => secretsOf(props.settings));
watch(() => props.settings, (settings) => draft.load(settingScreens(props.plugin.name, settings)), {immediate: true});
</script>

<template>
    <Dialog padded wide :title="plugin.title" @close="emit('close')">
        <div class="plugin-settings" data-plugin-setting-list>
            <div class="plugin-settings-head">
                <span class="plugin-settings-version">{{ plugin.version }}</span>
                <span class="plugin-settings-on">{{ plugin.enabled ? "On" : "Off" }}<Switch :on="plugin.enabled" :title="`Turn ${plugin.title} on or off`" @change="emit('toggle')" /></span>
            </div>
            <template v-if="description">
                <p class="plugin-settings-line">{{ description }}</p>
            </template>
            <template v-if="!settings.length">
                <p class="plugin-settings-line">This plugin has no settings</p>
            </template>
            <SettingsScreen :nodes="nodes" :draft="draft" />
            <template v-for="secret in secrets" :key="secret.key">
                <p class="plugin-settings-line" :data-plugin-setting="secret.key">{{ secret.title }}: {{ secret.value ? `kept as ${secret.value}.` : "a secret." }} Add the credential on the Secrets page and allow this plugin to use it.</p>
            </template>
        </div>
        <template #foot>
            <ChangeFoot :changes="draft.changes()" :can-save="draft.canSave.value" :pending="draft.pending.value" :reason="draft.reason.value" @save="draft.apply()" @cancel="emit('close')" />
        </template>
    </Dialog>
</template>

<style scoped>
.plugin-settings {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.plugin-settings-head {
    display: flex;
    gap: 10px;
    align-items: center;
}

.plugin-settings-version {
    padding: 1px 7px;
    border-radius: 6px;
    background: var(--chip);
    color: var(--text-2);
    font-size: 11.5px;
}

.plugin-settings-on {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    margin-left: auto;
    color: var(--text-3);
    font-size: 12.5px;
}

.plugin-settings-line {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.5;
}
</style>
