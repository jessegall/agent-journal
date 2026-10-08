<script setup>
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import SettingNav from "../kit/SettingNav.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import PluginSettings from "./PluginSettings.vue";
import ServicesList from "./ServicesList.vue";
import SettingsEnvironments from "./SettingsEnvironments.vue";
import SettingsRegion from "./SettingsRegion.vue";
import {tabLine} from "../domain/settingsCatalog.js";

const FLUSH = ["plugins", "environments"];
defineProps({
    tab: {type: String, required: true},
    listed: Boolean,
    narrow: Boolean,
    navSections: {type: Array, required: true},
    current: {type: String, default: ""},
    searching: Boolean,
    query: {type: String, default: ""},
    regions: {type: Array, required: true},
    across: Boolean,
    empty: Boolean,
});
const emit = defineEmits(["pick", "saved", "change", "timing", "act", "show-all"]);
</script>

<template>
    <div :class="['settings-body', {plain: !listed, narrow}]">
        <template v-if="!narrow && listed">
            <SettingNav
                class="settings-nav"
                :sections="navSections"
                :current="current"
                :searching="searching"
                @pick="(key) => emit('pick', key)"
            />
        </template>
        <div :class="['settings-content', {flush: FLUSH.includes(tab)}]">
            <SwitchCase :value="tab">
                <template #environments>
                    <p class="settings-line">{{ tabLine("environments") }}</p>
                    <SettingsEnvironments :query="query" />
                </template>
                <template #services>
                    <p class="settings-line">{{ tabLine("services") }}</p>
                    <ServicesList />
                </template>
                <template #plugins>
                    <PluginSettings :query="query" @saved="(label) => emit('saved', label)" />
                </template>
                <template #default>
                    <div class="settings-column">
                        <template v-for="region in regions" :key="region.key">
                            <SettingsRegion
                                :region="region"
                                :across="across"
                                :sheet="narrow"
                                @change="(row, value) => emit('change', row, value)"
                                @timing="(row, next) => emit('timing', row, next)"
                                @act="(row, key) => emit('act', row, key)"
                            />
                        </template>
                        <template v-if="empty">
                            <EmptyState class="settings-empty" title="No setting matches">
                                Try other words, or
                                <Btn class="settings-reset" @click="emit('show-all')">show every setting</Btn>
                                .
                            </EmptyState>
                        </template>
                    </div>
                </template>
            </SwitchCase>
        </div>
    </div>
</template>

<style scoped>
.settings-line {
    margin: 0 0 18px;
    color: var(--text-2);
    font-size: 13px;
}

.settings-body {
    display: grid;
    grid-template-columns: 216px minmax(0, 1fr);
    align-items: start;
}

.settings-body.plain,
.settings-body.narrow {
    display: block;
}

.settings-nav {
    position: sticky;
    top: var(--page-bar-height, 52px);
    max-height: calc(100vh - var(--page-bar-height, 52px) - 48px);
    overflow-y: auto;
    padding: 14px 10px;
}

.settings-content {
    min-width: 0;
    min-height: 100%;
    padding: 26px 40px 40px;
    border-left: 1px solid var(--border);
}

.settings-content.flush {
    padding: 0;
}

.settings-content.flush > .settings-line {
    margin: 0;
    padding: 20px 16px 14px;
}

.settings-body.plain .settings-content {
    border-left: 0;
}

.settings-body.narrow .settings-content {
    padding: 16px;
    border-left: 0;
}

.settings-column {
    display: flex;
    flex-direction: column;
    gap: 30px;
    max-width: 760px;
}

.settings-empty {
    padding: 32px 16px;
}

.settings-reset {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
}

.settings-reset:hover {
    color: var(--text);
}
</style>
