<script setup>
import {computed, reactive} from "vue";
import FoldGroup from "../kit/FoldGroup.vue";
import LineList from "../kit/LineList.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import SidePanel from "../kit/SidePanel.vue";
import Switch from "../kit/Switch.vue";
import SwitchCase from "../kit/SwitchCase.vue";

const props = defineProps({plugin: {type: Object, required: true}});
const emit = defineEmits(["close", "change"]);
const UNGROUPED = "";

const values = computed(() => Object.fromEntries(props.plugin.settings.map((s) => [s.key, s.value])));
const shown = computed(() =>
    props.plugin.settings.filter(
        (s) => !s.when.length || s.when.some((choice) => choice.every(([other, value]) => values.value[other] === value))
    )
);
const toggled = reactive({});

const groups = computed(() => {
    const out = new Map();
    for (const s of shown.value) {
        const group = s.group || UNGROUPED;
        if (!out.has(group)) out.set(group, []);
        out.get(group).push(s);
    }
    return [...out].map(([name, settings]) => {
        const folded = toggled[name] ?? settings.every((s) => s.detail);
        return {name, settings, folded};
    });
});

const choices = (s) => s.options.map((option) => ({value: String(option), label: String(option), current: s.value === String(option)}));
</script>

<template>
    <SidePanel :title="`${plugin.title} settings`" :abstract="plugin.what" @close="emit('close')">
        <template v-for="group in groups" :key="group.name">
            <FoldGroup
                flush
                class="group"
                :label="group.name || 'Settings'"
                :count="group.settings.length"
                :open="!group.folded"
                @toggle="toggled[group.name] = !group.folded"
            >
                <template v-for="s in group.settings" :key="s.key">
                    <div :class="['setting', s.type]">
                        <div class="setting-names">
                            <span class="setting-title">{{ s.title }}</span>
                            <template v-if="s.help">
                                <span class="setting-help">{{ s.help }}</span>
                            </template>
                        </div>
                        <SwitchCase :value="s.type">
                            <template #flag>
                                <Switch :on="s.value === 'true'" :title="s.title" @change="(on) => emit('change', s.key, String(on))" />
                            </template>
                            <template #options>
                                <ChoiceList :choices="choices(s)" @pick="(value) => emit('change', s.key, value)" />
                            </template>
                            <template #list>
                                <LineList :value="s.value" @change="(value) => emit('change', s.key, value)" />
                            </template>
                            <template #textarea>
                                <textarea
                                    class="setting-value"
                                    rows="4"
                                    :value="s.value"
                                    spellcheck="false"
                                    @change="emit('change', s.key, $event.target.value)"
                                />
                            </template>
                            <template #default>
                                <input
                                    class="setting-value"
                                    :type="s.type === 'number' ? 'number' : 'text'"
                                    :value="s.value"
                                    spellcheck="false"
                                    @change="emit('change', s.key, $event.target.value)"
                                />
                            </template>
                        </SwitchCase>
                    </div>
                </template>
            </FoldGroup>
        </template>
    </SidePanel>
</template>

<style scoped>
.group {
    margin-bottom: 8px;
}

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
</style>
