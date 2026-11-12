<script setup>
import {computed, nextTick, ref, watch} from "vue";
import {SettingSectionList, SettingsScreen, sectionsOf} from "@journal/setting-components";

// one long tab of the agent settings: the sections of the screen in a list on its left, and the screen drawn from
// the settings that declare it
const props = defineProps({nodes: {type: Array, required: true}, draft: {type: Object, required: true}, readOnly: {type: Boolean, default: false}, extras: {type: Object, default: () => ({})}, found: {type: String, default: ""}});

const scroll = ref(null);
const sections = computed(() => sectionsOf(props.nodes));
// a setting that was found is brought into view in the middle of the screen
watch(() => props.found, (key) => key && nextTick(() => scroll.value?.querySelector(`[data-setting="${key}"]`)?.scrollIntoView({block: "center"})), {immediate: true, flush: "post"});
const jump = (key) => scroll.value?.querySelector(`[data-section="${key}"]`)?.scrollIntoView({block: "start", behavior: "smooth"});
</script>

<template>
    <div class="screen">
        <nav class="rail">
            <SettingSectionList :sections="sections" :scope="scroll" @choose="jump" />
        </nav>
        <div ref="scroll" class="content">
            <slot name="before" />
            <SettingsScreen :nodes="nodes" :draft="draft" :read-only="readOnly" :extras="extras" :found="found" />
        </div>
    </div>
</template>

<style scoped>
.screen { display: grid; grid-template-columns: 200px minmax(0, 1fr); min-height: 0; flex: 1; overflow: hidden; }
.rail { padding: 16px 10px; border-right: 1px solid var(--border); background: var(--bg-2); overflow-y: auto; }
.content { padding: 4px 28px 24px; overflow-y: auto; }
</style>
