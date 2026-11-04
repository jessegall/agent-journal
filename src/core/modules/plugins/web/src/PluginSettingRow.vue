<script setup>
import {computed, useId} from "vue";
import {FormField, Segmented, Switch, SwitchCase, TextArea, TextInput} from "@journal/window-kit";
import {childrenOf, isOn, shownValue} from "./pluginSettingGroups.js";

// one setting of a plugin, with the control its type asks for, saved as it changes; the settings under a switch that is off are dimmed
const props = defineProps({setting: {type: Object, required: true}, settings: {type: Array, required: true}, dim: Boolean});
const emit = defineEmits(["configure"]);
const id = useId();
const value = computed(() => shownValue(props.setting));
const children = computed(() => childrenOf(props.settings, props.setting));
const choices = computed(() => props.setting.choices.map((choice) => ({key: choice, label: choice || "None"})));
const say = (text) => emit("configure", props.setting, String(text));
</script>

<template>
    <div :class="['plugin-setting', {dim}]" :data-plugin-setting="setting.key">
        <template v-if="setting.type === 'flag'">
            <div class="plugin-setting-flag">
                <div class="plugin-setting-names">
                    <span class="plugin-setting-title">{{ setting.title }}</span>
                    <template v-if="setting.help">
                        <span class="plugin-setting-help">{{ setting.help }}</span>
                    </template>
                </div>
                <Switch :on="isOn(setting)" :title="setting.title" @change="say" />
            </div>
        </template>
        <template v-else>
            <FormField :label="setting.title" :for="id" :help="setting.help">
                <SwitchCase :value="setting.type">
                    <template #choice>
                        <Segmented wrap :options="choices" :value="value" @pick="say" />
                    </template>
                    <template #list>
                        <TextArea :id="id" rows="4" :value="value" @change="say($event.target.value)" />
                    </template>
                    <template #secret>
                        <p class="plugin-setting-help">{{ value ? `Kept as ${value}.` : "A secret." }} Add the credential on the Secrets page and allow this plugin to use it.</p>
                    </template>
                    <template #default>
                        <TextInput :id="id" :type="setting.type === 'number' ? 'number' : 'text'" :value="value" @change="say($event.target.value)" />
                    </template>
                </SwitchCase>
            </FormField>
        </template>
    </div>
    <template v-if="children.length">
        <div class="plugin-setting-children">
            <template v-for="child in children" :key="child.key">
                <PluginSettingRow :setting="child" :settings="settings" :dim="dim || (setting.type === 'flag' && !isOn(setting))" @configure="(...saved) => emit('configure', ...saved)" />
            </template>
        </div>
    </template>
</template>

<style scoped>
.plugin-setting {
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
    transition: opacity 0.15s;
}

.plugin-setting.dim {
    opacity: 0.5;
}

.plugin-setting-flag {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
}

.plugin-setting-names {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.plugin-setting-title {
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
}

.plugin-setting-help {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
    line-height: 1.45;
}

.plugin-setting-children {
    padding-left: 22px;
}
</style>
