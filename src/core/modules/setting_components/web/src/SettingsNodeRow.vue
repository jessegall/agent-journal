<script setup>
import {computed} from "vue";
import {componentNameOf, hasComponent, isDrawn} from "./sections.js";
import {ruleOf} from "./numberRule.js";
import {settingComponents, wideSettingComponents} from "./registry.js";
import SettingNestedGroup from "./SettingNestedGroup.vue";
import SettingRow from "./SettingRow.vue";

// one declared setting in its row, drawn with the component the setting names, and the settings declared under it
// in a nested group. It knows what a node holds, never which setting it is.
defineOptions({name: "SettingsNodeRow"});
const props = defineProps({
    node: {type: Object, required: true},
    nodes: {type: Array, required: true},
    draft: {type: Object, required: true},
    readOnly: {type: Boolean, default: false},
    extras: {type: Object, default: () => ({})},
    found: {type: String, default: ""},
});

const name = computed(() => componentNameOf(props.node));
const known = computed(() => hasComponent(name.value));
const isWide = computed(() => wideSettingComponents.includes(name.value));
const children = computed(() => props.nodes.filter((child) => child.parent === props.node.key && isDrawn(child) && props.draft.visible(child.key)));
// what a component needs beyond the value, read from the node: the choices of a choice, the least of a number
const given = computed(() => ({
    ...(props.node.node_type === "choice" ? {choices: props.node.choices} : {}),
    ...(props.node.node_type === "number" ? {least: ruleOf(props.node.rule)?.minimum ?? 0} : {}),
    ...(props.extras[name.value] ?? {}),
}));
</script>

<template>
    <template v-if="known">
        <SettingRow :label="node.title" :help="node.description" :source="node.source" :changed="draft.isChanged(node.key)" :error="draft.errors(node.key)" :found="found === node.key" :wide="isWide" :data-setting="node.key">
            <component :is="settingComponents[name]" v-bind="given" :model-value="draft.value(node.key)" :disabled="readOnly" @update:model-value="draft.set(node.key, $event)" />
        </SettingRow>
    </template>
    <template v-else>
        <SettingRow :label="node.title" :help="node.description" :error="`No setting component is named ${name}.`" :data-setting="node.key" data-unknown-component />
    </template>
    <template v-if="children.length">
        <SettingNestedGroup :shown="draft.value(node.key) !== false">
            <template v-for="child in children" :key="child.key">
                <SettingsNodeRow :node="child" :nodes="nodes" :draft="draft" :read-only="readOnly" :extras="extras" :found="found" />
            </template>
        </SettingNestedGroup>
    </template>
</template>
