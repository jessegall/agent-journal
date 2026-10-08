<script setup>
import {computed, useId} from "vue";
import ChoiceList from "../kit/ChoiceList.vue";
import FormField from "../kit/FormField.vue";
import LineList from "../kit/LineList.vue";
import Switch from "../kit/Switch.vue";
import Segmented from "../kit/Segmented.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TextInput from "../kit/TextInput.vue";
import SecretPicker from "../kit/SecretPicker.vue";

const props = defineProps({setting: {type: Object, required: true}, children: {type: Array, default: () => []}, dim: Boolean});
const emit = defineEmits(["change"]);
const id = useId();
const flag = computed(() => props.setting.type === "flag");
const on = computed(() => props.setting.value === "true");
const segments = computed(() => props.setting.options.map((option) => ({key: String(option), label: String(option)})));
const short = computed(() => props.setting.options.length <= 4 && segments.value.reduce((n, o) => n + o.label.length, 0) <= 44);
const choices = computed(() =>
    props.setting.options.map((option) => ({value: String(option), label: String(option), current: props.setting.value === String(option)}))
);
</script>

<template>
    <div :class="['setting', {dim}]">
        <template v-if="flag">
            <div class="setting-flag">
                <div class="setting-names">
                    <span class="setting-title">{{ setting.title }}</span>
                    <template v-if="setting.help">
                        <span class="setting-help">{{ setting.help }}</span>
                    </template>
                </div>
                <Switch :on="on" :title="setting.title" @change="(next) => emit('change', setting.key, String(next))" />
            </div>
        </template>
        <template v-else>
            <FormField :label="setting.title" :for="id" :help="setting.help">
                <SwitchCase :value="setting.type">
                    <template #options>
                        <template v-if="short">
                            <Segmented :options="segments" :value="setting.value" @pick="(value) => emit('change', setting.key, value)" />
                        </template>
                        <template v-else>
                            <ChoiceList stacked :choices="choices" @pick="(value) => emit('change', setting.key, value)" />
                        </template>
                    </template>
                    <template #list>
                        <LineList :value="setting.value" @change="(value) => emit('change', setting.key, value)" />
                    </template>
                    <template #secret>
                        <SecretPicker :value="setting.value" @pick="(value) => emit('change', setting.key, value)" />
                    </template>
                    <template #textarea>
                        <textarea
                            :id="id"
                            class="setting-value"
                            rows="4"
                            :value="setting.value"
                            spellcheck="false"
                            @change="emit('change', setting.key, $event.target.value)"
                        />
                    </template>
                    <template #default>
                        <TextInput
                            :id="id"
                            :type="setting.type === 'number' ? 'number' : 'text'"
                            :value="setting.value"
                            @change="emit('change', setting.key, $event.target.value)"
                        />
                    </template>
                </SwitchCase>
            </FormField>
        </template>
    </div>
    <template v-if="children.length">
        <div class="setting-children">
            <template v-for="child in children" :key="child.key">
                <PluginSetting :setting="child" :dim="dim || (flag && !on)" @change="(key, value) => emit('change', key, value)" />
            </template>
        </div>
    </template>
</template>

<style scoped>
.setting {
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
    transition: opacity var(--fade);
}

.setting.dim {
    opacity: 0.5;
}

.setting-flag {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.setting-names {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.setting-title {
    color: var(--text);
    font-size: 12.5px;
}

.setting-help {
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 1.45;
}

.setting-value {
    width: 100%;
    padding: 6px 9px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    resize: vertical;
}

.setting-value:focus {
    outline: none;
    border-color: var(--accent);
}

.setting-children {
    padding-left: 22px;
}

.setting :deep(.choices.stacked) {
    align-self: flex-start;
}
</style>
