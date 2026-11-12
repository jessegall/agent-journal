<script setup>
import {computed} from "vue";
import {sectionKeyOf, sectionsOf} from "./sections.js";
import SettingSection from "./SettingSection.vue";
import SettingsNodeRow from "./SettingsNodeRow.vue";

// a screen of settings drawn from what the settings declare: a section for each section name, in the order the
// sections are first declared, and in it a row for each setting that sits under no other setting. A setting that
// needs another to be on shows only while the draft has it on. Nothing here names a setting.
const props = defineProps({
    nodes: {type: Array, required: true},
    draft: {type: Object, required: true},
    readOnly: {type: Boolean, default: false},
    extras: {type: Object, default: () => ({})},
    found: {type: String, default: ""},
});

const keys = computed(() => new Set(props.nodes.map((node) => node.key)));
const top = (node) => node.parent === null || !keys.value.has(node.parent);
const sections = computed(() => sectionsOf(props.nodes).map((section) => ({...section, nodes: props.nodes.filter((node) => sectionKeyOf(node.section) === section.key && top(node) && props.draft.visible(node.key))})));
</script>

<template>
    <div class="settings-screen">
        <template v-for="section in sections" :key="section.key">
            <SettingSection :section-key="section.key" :title="section.title">
                <template v-for="node in section.nodes" :key="node.key">
                    <SettingsNodeRow :node="node" :nodes="nodes" :draft="draft" :read-only="readOnly" :extras="extras" :found="found" />
                </template>
            </SettingSection>
        </template>
    </div>
</template>
