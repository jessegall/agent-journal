<script setup>
import {computed, reactive} from "vue";
import {Btn, Dialog, FoldGroup, Switch} from "@journal/window-kit";
import {isOn, settingGroups} from "./pluginSettingGroups.js";
import PluginSettingRow from "./PluginSettingRow.vue";

// a plugin's settings as version 4 drew them: its name, version, description and switch, then its settings in folding groups, with a way to turn a group's switches on or off together
const props = defineProps({plugin: {type: Object, required: true}, description: {type: String, default: ""}, settings: {type: Array, required: true}});
const emit = defineEmits(["close", "configure", "toggle"]);
const groups = computed(() => settingGroups(props.settings));
const closed = reactive({});
const onCount = (group) => (group.flags.length ? `${group.flags.filter(isOn).length} of ${group.flags.length} on` : String(group.settings.length));
const turnAll = (group, on) => group.flags.filter((setting) => isOn(setting) !== on).forEach((setting) => emit("configure", setting, String(on)));
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
            <template v-for="group in groups" :key="group.name">
                <FoldGroup class="plugin-settings-group" bar :label="group.name || 'Settings'" :count="onCount(group)" :open="!closed[group.name]" data-plugin-setting-group @toggle="closed[group.name] = !closed[group.name]">
                    <template v-if="group.flags.length > 1">
                        <div class="plugin-settings-all">
                            <Btn small bordered data-plugin-all-on @click="turnAll(group, true)">Turn all on</Btn>
                            <Btn small bordered data-plugin-all-off @click="turnAll(group, false)">Turn all off</Btn>
                        </div>
                    </template>
                    <template v-for="setting in group.settings" :key="setting.key">
                        <PluginSettingRow :setting="setting" :settings="settings" @configure="(...saved) => emit('configure', ...saved)" />
                    </template>
                </FoldGroup>
            </template>
        </div>
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

.plugin-settings-group {
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
}

.plugin-settings-all {
    display: flex;
    gap: 8px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
}
</style>
