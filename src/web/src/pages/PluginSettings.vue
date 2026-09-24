<script setup>
import {computed, reactive} from "vue";
import FoldGroup from "../kit/FoldGroup.vue";
import SidePanel from "../kit/SidePanel.vue";
import PluginSetting from "./PluginSetting.vue";

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
    for (const s of shown.value.filter((setting) => !setting.parent)) {
        const group = s.group || UNGROUPED;
        if (!out.has(group)) out.set(group, []);
        out.get(group).push(s);
    }
    return [...out].map(([name, settings]) => {
        const folded = toggled[name] ?? settings.every((s) => s.detail);
        return {name, settings, folded};
    });
});

const childrenOf = (s) => shown.value.filter((child) => child.parent === s.key);
</script>

<template>
    <SidePanel :title="`${plugin.title} settings`" :abstract="plugin.description" @close="emit('close')">
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
                    <PluginSetting :setting="s" :children="childrenOf(s)" @change="(key, value) => emit('change', key, value)" />
                </template>
            </FoldGroup>
        </template>
    </SidePanel>
</template>

<style scoped>
.group {
    margin-bottom: 8px;
}
</style>
