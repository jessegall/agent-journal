<script setup>
import {saveSettings} from "../actions/settings.js";
import {api} from "../api/client.js";
import SidePanel from "../kit/SidePanel.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import Switch from "../kit/Switch.vue";
import TextInput from "../kit/TextInput.vue";
import FeaturePermissions from "./FeaturePermissions.vue";
import FeatureRetention from "./FeatureRetention.vue";
import {store} from "../state/store.js";
import UList from "./UList.vue";
import {every, flip, marks, on, unit} from "./featureSettings.js";

const props = defineProps({feature: Object});
const emit = defineEmits(["close"]);
const saved = (key) => (store.settings && store.settings[key]) || {};

const pieces = (text) =>
    String(text || "")
        .split(/(\{\{\w+\}\})/)
        .filter(Boolean)
        .map((piece) => ({piece, slot: /^\{\{\w+\}\}$/.test(piece)}));

const valueOf = (setting) => saved(props.feature.name)[setting.name] ?? setting.default;

async function saveSetting(setting, value) {
    await saveSettings({[props.feature.name]: {...saved(props.feature.name), [setting.name]: value}});
}
</script>

<template>
    <SidePanel :title="feature.title" :abstract="feature.abstract" @close="emit('close')">
        <template #actions>
            <template v-if="feature.fixed">
                <span class="note">Always on</span>
            </template>
            <template v-else>
                <Switch :on="on(feature.name, feature.default)" @change="(v) => flip(feature.name, v)" />
            </template>
        </template>
        <template v-if="feature.when">
            <section class="block">
                <h3>When it runs</h3>
                <UList :f="feature" @marks="marks" @every="every" @unit="unit" />
            </section>
        </template>
        <template v-if="feature.parts.length && (feature.fixed || on(feature.name, feature.default))">
            <section class="block">
                <h3>What it does</h3>
                <template v-for="part in feature.parts" :key="part.name">
                    <div class="row">
                        <span class="text">
                            <span class="title">{{ part.title }}</span>
                            <span class="note">{{ part.abstract }}</span>
                            <template v-if="part.when">
                                <UList :f="part" @marks="marks" @every="every" @unit="unit" />
                            </template>
                        </span>
                        <Switch :on="on(part.name, part.default)" @change="(v) => flip(part.name, v)" />
                    </div>
                </template>
            </section>
        </template>
        <template v-if="feature.settings.length && (feature.fixed || on(feature.name, feature.default))">
            <section class="block">
                <h3>Settings</h3>
                <template v-for="setting in feature.settings.filter((s) => s.kind !== 'map')" :key="setting.name">
                    <div :class="['row', {stacked: !['switch', 'number'].includes(setting.kind)}]">
                        <span class="text">
                            <span class="title">{{ setting.title }}</span>
                            <template v-if="setting.abstract">
                                <span class="note">{{ setting.abstract }}</span>
                            </template>
                        </span>
                        <template v-if="setting.kind === 'switch'">
                            <Switch :on="!!valueOf(setting)" @change="(v) => saveSetting(setting, v)" />
                        </template>
                        <template v-else>
                            <span class="amount">
                                <TextInput
                                    class="field"
                                    :type="setting.kind === 'number' ? 'number' : 'text'"
                                    :value="valueOf(setting)"
                                    @change="
                                        saveSetting(setting, setting.kind === 'number' ? Number($event.target.value) : $event.target.value)
                                    "
                                />
                                {{ setting.unit }}
                            </span>
                        </template>
                    </div>
                </template>
            </section>
        </template>
        <SwitchCase :value="feature.name">
            <template #auto_archive>
                <FeatureRetention />
            </template>
            <template #permission_prompts>
                <FeaturePermissions />
            </template>
        </SwitchCase>
        <template v-if="feature.help">
            <section class="block">
                <h3>How it works</h3>
                <p class="help">{{ feature.help }}</p>
            </section>
        </template>
        <template v-if="feature.lines.length">
            <section class="block">
                <h3>What it can say to the agent</h3>
                <template v-for="line in feature.lines" :key="line.key">
                    <div class="line">
                        <span class="line-title">
                            <template v-for="(p, i) in pieces(line.title)" :key="i">
                                <span :class="{slot: p.slot}">{{ p.piece }}</span>
                            </template>
                        </span>
                        <template v-if="line.brief">
                            <span class="note">
                                <template v-for="(p, i) in pieces(line.brief)" :key="i">
                                    <span :class="{slot: p.slot}">{{ p.piece }}</span>
                                </template>
                            </span>
                        </template>
                    </div>
                </template>
            </section>
        </template>
    </SidePanel>
</template>

<style scoped>
.help {
    margin: 0 0 18px;
    white-space: pre-line;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.55;
}

:deep(.block) {
    margin-bottom: 22px;
}

:deep(h3) {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

:deep(.row) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    padding: 10px 0;
    border-top: 1px solid var(--line);
}

:deep(.row:first-of-type) {
    border-top: 0;
}

:deep(.text) {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

:deep(.title) {
    font-size: 13px;
    font-weight: 500;
}

:deep(.note) {
    color: var(--text-3);
    font-size: 12px;
    line-height: 1.45;
}

:deep(.field) {
    width: 72px;
    padding: 6px 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--bg-2);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
}

:deep(.row.stacked) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
}

:deep(.row.stacked .amount),
:deep(.row.stacked .field) {
    width: 100%;
}

:deep(.field.wide) {
    width: 100%;
    margin-top: 6px;
}

:deep(.field:focus) {
    border-color: var(--accent);
    outline: none;
}

:deep(.amount) {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    color: var(--text-3);
    font-size: 12px;
}

.line {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 8px 0;
    border-top: 1px solid var(--line);
}

.line:first-of-type {
    border-top: 0;
}

.line-title {
    font-size: 12.5px;
}

.slot {
    color: var(--accent-text);
}
</style>
