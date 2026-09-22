<script setup>
import {computed, reactive} from "vue";
import Icon from "../kit/Icon.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import SidePanel from "../kit/SidePanel.vue";
import Switch from "../kit/Switch.vue";

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
            <section class="group">
                <template v-if="group.name">
                    <button type="button" class="group-name" :aria-expanded="!group.folded" @click="toggled[group.name] = !group.folded">
                        <Icon name="chevron" :size="11" :class="['group-chevron', {open: !group.folded}]" />
                        <span>{{ group.name }}</span>
                        <span class="group-count">{{ group.settings.length }}</span>
                    </button>
                </template>
                <template v-for="s in group.folded ? [] : group.settings" :key="s.key">
                    <div :class="['setting', s.type]">
                        <div class="setting-names">
                            <span class="setting-title">{{ s.title }}</span>
                            <template v-if="s.help">
                                <span class="setting-help">{{ s.help }}</span>
                            </template>
                        </div>
                        <template v-if="s.type === 'flag'">
                            <Switch :on="s.value === 'true'" :title="s.title" @change="(on) => emit('change', s.key, String(on))" />
                        </template>
                        <template v-else-if="s.type === 'options'">
                            <ChoiceList :choices="choices(s)" @pick="(value) => emit('change', s.key, value)" />
                        </template>
                        <template v-else-if="s.type === 'textarea'">
                            <textarea
                                class="setting-value"
                                rows="4"
                                :value="s.value"
                                spellcheck="false"
                                @change="emit('change', s.key, $event.target.value)"
                            />
                        </template>
                        <template v-else>
                            <input
                                class="setting-value"
                                :type="s.type === 'number' ? 'number' : 'text'"
                                :value="s.value"
                                spellcheck="false"
                                @change="emit('change', s.key, $event.target.value)"
                            />
                        </template>
                    </div>
                </template>
            </section>
        </template>
    </SidePanel>
</template>

<style scoped>
.group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 8px;
}

.group-name {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 0 6px;
    padding: 4px 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-align: left;
    text-transform: uppercase;
    cursor: pointer;
}

.group-name:hover {
    color: var(--text);
}

.group-chevron {
    transform: rotate(-90deg);
    transition: transform 0.15s ease;
}

.group-chevron.open {
    transform: none;
}

.group-count {
    color: var(--text-4);
    font-weight: 500;
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
