<script setup>
import {navGroups, navMark, untitled} from "../domain/settingsCatalog.js";
import Icon from "./Icon.vue";
import SwitchCase from "./SwitchCase.vue";

defineProps({
    sections: {type: Array, required: true},
    current: {type: String, default: ""},
    searching: Boolean,
    sheet: Boolean,
});
const emit = defineEmits(["pick"]);
</script>

<template>
    <nav :class="['setting-nav', {sheet}]" aria-label="Setting groups">
        <template v-for="section in sections" :key="section.title">
            <div class="setting-nav-section">{{ section.title }}</div>
            <div class="setting-nav-list">
                <template v-for="group in navGroups(section.groups.filter((g) => !untitled(g)))" :key="group.key">
                    <button type="button" :class="['setting-nav-item', {on: group.key === current}]" @click="emit('pick', group.key)">
                        <span class="setting-nav-name">{{ group.title }}</span>
                        <SwitchCase :value="navMark(group, searching).kind">
                            <template #count>
                                <span class="setting-nav-count" :title="group.markTitle">{{ navMark(group, searching).text }}</span>
                            </template>
                            <template #off>
                                <span class="setting-nav-off">Off</span>
                            </template>
                            <template #changed>
                                <span class="setting-nav-dot" title="Changed" />
                            </template>
                        </SwitchCase>
                        <template v-if="sheet">
                            <Icon name="chevron" :size="14" class="setting-nav-chevron" />
                        </template>
                    </button>
                </template>
            </div>
        </template>
    </nav>
</template>

<style scoped>
.setting-nav {
    display: flex;
    flex-direction: column;
}

.setting-nav-section {
    margin: 12px 0 4px;
    padding: 0 10px;
    color: var(--text-4);
    font-size: 11px;
    letter-spacing: 0.02em;
}

.setting-nav-section:first-child {
    margin-top: 0;
}

.setting-nav-list {
    display: flex;
    flex-direction: column;
}

.setting-nav-item {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 28px;
    padding: 0 10px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.setting-nav-item:hover {
    background: var(--hover);
    color: var(--text);
}

.setting-nav-item.on {
    background: var(--sel);
    color: var(--text);
}

.setting-nav-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.setting-nav-off {
    color: var(--text-4);
    font-size: 11px;
}

.setting-nav-count {
    color: var(--text-3);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}

.setting-nav-dot {
    width: 6px;
    height: 6px;
    flex: none;
    border-radius: 50%;
    background: var(--accent);
}

.setting-nav-chevron {
    color: var(--text-4);
}

.setting-nav.sheet .setting-nav-section {
    margin: 16px 0 6px 4px;
    color: var(--text-3);
    font-size: 12.5px;
}

.setting-nav.sheet .setting-nav-list {
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--raised);
}

.setting-nav.sheet .setting-nav-item {
    min-height: 48px;
    padding: 0 14px;
    border-top: 1px solid var(--line);
    border-radius: 0;
    font-size: 15px;
}

.setting-nav.sheet .setting-nav-item:first-child {
    border-top: 0;
}

.setting-nav.sheet .setting-nav-off {
    font-size: 13px;
}
</style>
