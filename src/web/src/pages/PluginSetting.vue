<script setup>
import {computed, ref} from "vue";
import ChoiceList from "../kit/ChoiceList.vue";
import Icon from "../kit/Icon.vue";
import LineList from "../kit/LineList.vue";
import Switch from "../kit/Switch.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TextInput from "../kit/TextInput.vue";

const props = defineProps({setting: {type: Object, required: true}, children: {type: Array, default: () => []}});
const emit = defineEmits(["change"]);
const open = ref(false);
const choices = computed(() =>
    props.setting.options.map((option) => ({value: String(option), label: String(option), current: props.setting.value === String(option)}))
);
</script>

<template>
    <div :class="['setting', setting.type]">
        <template v-if="children.length">
            <button
                type="button"
                :class="['setting-open', {open}]"
                :title="open ? 'Hide its settings' : 'Show its settings'"
                @click="open = !open"
            >
                <Icon name="chevron" :size="11" />
            </button>
        </template>
        <div class="setting-names">
            <span class="setting-title">{{ setting.title }}</span>
            <template v-if="setting.help">
                <span class="setting-help">{{ setting.help }}</span>
            </template>
        </div>
        <SwitchCase :value="setting.type">
            <template #flag>
                <Switch :on="setting.value === 'true'" :title="setting.title" @change="(on) => emit('change', setting.key, String(on))" />
            </template>
            <template #options>
                <ChoiceList :choices="choices" @pick="(value) => emit('change', setting.key, value)" />
            </template>
            <template #list>
                <LineList :value="setting.value" @change="(value) => emit('change', setting.key, value)" />
            </template>
            <template #textarea>
                <textarea
                    class="setting-value"
                    rows="4"
                    :value="setting.value"
                    spellcheck="false"
                    @change="emit('change', setting.key, $event.target.value)"
                />
            </template>
            <template #default>
                <TextInput
                    :type="setting.type === 'number' ? 'number' : 'text'"
                    :value="setting.value"
                    @change="emit('change', setting.key, $event.target.value)"
                />
            </template>
        </SwitchCase>
    </div>
    <template v-if="children.length && open">
        <div :class="['setting-children', {off: setting.value !== 'true'}]">
            <template v-for="child in children" :key="child.key">
                <PluginSetting :setting="child" @change="(key, value) => emit('change', key, value)" />
            </template>
        </div>
    </template>
</template>

<style scoped>
.setting {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
}

.setting.flag {
    flex-direction: row;
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

.setting.flag:has(.setting-open) {
    justify-content: flex-start;
}

.setting.flag:has(.setting-open) .setting-names {
    flex: 1;
}

.setting-open {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
    transition: transform var(--move);
}

.setting-open.open {
    transform: rotate(90deg);
}

.setting-open:hover {
    background: var(--hover);
    color: var(--text);
}

.setting-children {
    padding-left: 22px;
    transition: opacity var(--fade);
}

.setting-children.off {
    opacity: 0.5;
}
</style>
