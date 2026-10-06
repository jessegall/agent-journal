<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import {pluginFrom} from "../../composables/plugins.js";
import {settingGroups} from "../../domain/pluginSettings.js";
import Switch from "../../kit/Switch.vue";
import SwitchCase from "../../kit/SwitchCase.vue";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import {toast} from "../kit/toast.js";
import PhonePage from "./PhonePage.vue";

const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
const plugin = ref(null);
const groups = computed(() => (plugin.value ? settingGroups(plugin.value) : []));
const childrenOf = (group, s) => group.visible.filter((child) => child.parent === s.key);
const withKids = (group) => group.settings.flatMap((s) => [s, ...childrenOf(group, s)]);
const kindOf = (s) => (s.type === "flag" ? "flag" : s.options.length ? "options" : "text");

async function load() {
    plugin.value = pluginFrom(await api.show("plugin", props.target));
}

async function change(setting, value) {
    try {
        await api.configurePlugin(plugin.value.n, setting.key, value);
        toast(`Saved: ${setting.title}`);
    } catch (error) {
        toast(error.message);
    }
    await load();
}

onMounted(load);
</script>

<template>
    <PhonePage :title="plugin ? `${plugin.title} settings` : 'Plugin settings'" line="Changes are saved as you make them." :back="back" @back="emit('back')">
        <template v-for="group in groups" :key="group.name">
            <CellGroup :head="group.name">
                <template v-for="setting in withKids(group)" :key="setting.key">
                    <SwitchCase :value="kindOf(setting)">
                        <template #flag>
                            <Cell :label="setting.title" :sub="setting.help" still>
                                <template #end>
                                    <Switch large :on="setting.value === 'true'" :title="setting.title" @change="change(setting, String($event))" />
                                </template>
                            </Cell>
                        </template>
                        <template #options>
                            <Cell :label="setting.title" :sub="setting.help" still />
                            <template v-for="option in setting.options" :key="option">
                                <Cell :label="String(option)" :chevron="false" @pick="change(setting, String(option))">
                                    <template #end>
                                        <template v-if="setting.value === String(option)">
                                            <span class="setting-picked">Chosen</span>
                                        </template>
                                    </template>
                                </Cell>
                            </template>
                        </template>
                        <template #text>
                            <label class="setting-field">
                                <span>{{ setting.title }}</span>
                                <input :type="setting.type === 'number' ? 'number' : 'text'" :value="setting.value" @change="change(setting, $event.target.value)" />
                                <template v-if="setting.help">
                                    <small>{{ setting.help }}</small>
                                </template>
                            </label>
                        </template>
                    </SwitchCase>
                </template>
            </CellGroup>
        </template>
    </PhonePage>
</template>

<style scoped>
.setting-picked {
    color: var(--accent-text);
    font-size: 0.875rem;
}

.setting-field {
    display: block;
    padding: 10px 14px 12px;
}

.setting-field span {
    display: block;
    font-size: 1.0625rem;
}

.setting-field input {
    width: 100%;
    min-height: 44px;
    margin-top: 6px;
    padding: 0 12px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
}

.setting-field small {
    display: block;
    margin-top: 6px;
    color: var(--text-3);
    font-size: 0.875rem;
}
</style>
