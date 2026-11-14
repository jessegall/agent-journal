<script setup>
import {ref} from "vue";
import {Icon} from "@journal/window-kit";

// the Settings page's frame: the section nav at the left headed by the search, a heading for each group and one icon for each section, and the open section at the right.
// The nav has no help sentences. A / outside a field puts the cursor in the search
const TYPING = "input,textarea,select,[contenteditable]";
defineProps({groups: {type: Array, required: true}, current: {type: String, default: ""}});
const query = defineModel("query", {type: String, default: ""});
const emit = defineEmits(["pick"]);
const field = ref(null);
function slash(event) {
    if (event.key !== "/" || event.target.closest?.(TYPING)) return;
    event.preventDefault();
    field.value?.focus();
}
</script>

<template>
    <div class="settings-layout" data-settings-layout @keydown="slash">
        <nav class="settings-nav" aria-label="Settings sections" data-settings-nav>
            <div class="settings-search" data-settings-search>
                <Icon name="search" :size="13" />
                <input ref="field" v-model="query" type="search" placeholder="Search settings" aria-label="Search settings" data-settings-search-field>
            </div>
            <template v-for="group in groups" :key="group.key">
                <p class="settings-group" data-settings-group>{{ group.title }}</p>
                <template v-for="section in group.sections" :key="section.key">
                    <button type="button" :class="['settings-nav-item', {current: !query && section.key === current}]" :data-section="section.key" @click="emit('pick', section.key)">
                        <Icon :name="section.icon" :size="14" data-section-icon />
                        <span>{{ section.label }}</span>
                    </button>
                </template>
            </template>
        </nav>
        <div class="settings-body" data-settings-sections>
            <slot />
        </div>
    </div>
</template>

<style scoped>
.settings-layout {
    display: flex;
    gap: 28px;
    align-items: flex-start;
}

.settings-nav {
    position: sticky;
    top: 0;
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 2px;
    width: 190px;
}

.settings-search {
    display: flex;
    gap: 6px;
    align-items: center;
    margin-bottom: 8px;
    padding: 4px 8px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    color: var(--text-3);
}

.settings-search input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 13px;
    outline: none;
}

.settings-group {
    margin: 12px 8px 4px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.settings-nav-item {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 5px 10px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.settings-nav-item:hover {
    background: var(--hover);
    color: var(--text);
}

.settings-nav-item.current {
    background: var(--hover);
    color: var(--text);
}

.settings-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
}
</style>
