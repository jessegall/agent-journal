<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import SidePanel from "../kit/SidePanel.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import Switch from "../kit/Switch.vue";
import {store} from "../state/store.js";
import UList from "./UList.vue";
import {every, flip, marks, on, unit} from "./featureSettings.js";

const props = defineProps({feature: Object});
const emit = defineEmits(["close"]);
const saved = (key) => (store.settings && store.settings[key]) || {};

const days = ref({});
const retention = computed(() => saved("keep"));
const permissions = computed(() => saved("permission_prompts"));
const relaunching = ref(false);

const pieces = (text) =>
    String(text || "")
        .split(/(\{\{\w+\}\})/)
        .filter(Boolean)
        .map((piece) => ({piece, slot: /^\{\{\w+\}\}$/.test(piece)}));

const valueOf = (setting) => saved(props.feature.name)[setting.name] ?? setting.default;

async function saveSetting(setting, value) {
    store.settings = await api.saveSettings({[props.feature.name]: {...saved(props.feature.name), [setting.name]: value}});
}

async function saveRetention(type) {
    await api.saveSettings({keep: {...retention.value, [type]: Number(days.value[type])}});
}

async function skipPrompts(skip) {
    relaunching.value = true;
    try {
        await api.relaunchAgent(permissions.value.session, skip);
        store.settings = await api.settings();
    } finally {
        relaunching.value = false;
    }
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
        <p class="help">{{ feature.help }}</p>
        <template v-if="feature.when">
            <section class="block">
                <h3>When it speaks</h3>
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
                    <div class="row">
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
                                <input
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
                <section class="block">
                    <h3>Keep</h3>
                    <p class="note">How long a finished row stays listed before it is archived; 0 keeps it</p>
                    <template v-for="type in ['report', 'todo']" :key="type">
                        <div class="row">
                            <span class="title">{{ type }}s</span>
                            <span class="amount">
                                <input
                                    v-model="days[type]"
                                    class="field"
                                    type="number"
                                    min="0"
                                    :placeholder="String(retention[type] ?? (type === 'report' ? 14 : 7))"
                                    @change="saveRetention(type)"
                                />
                                days
                            </span>
                        </div>
                    </template>
                </section>
            </template>
            <template #permission_prompts>
                <template v-if="permissions.possible">
                    <section class="block">
                        <div class="row">
                            <span class="text">
                                <span class="title">Skip permission prompts</span>
                                <span class="note">
                                    The agent is running {{ permissions.running ? "without" : "with" }} permission prompts. Changing this
                                    restarts the agent in the same conversation.
                                </span>
                            </span>
                            <template v-if="relaunching">
                                <span class="note">Restarting</span>
                            </template>
                            <template v-else>
                                <Switch :on="!!permissions.skip" @change="skipPrompts" />
                            </template>
                        </div>
                    </section>
                </template>
            </template>
        </SwitchCase>
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

.block {
    margin-bottom: 22px;
}

h3 {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    padding: 10px 0;
    border-top: 1px solid var(--line);
}

.row:first-of-type {
    border-top: 0;
}

.text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.title {
    font-size: 13px;
    font-weight: 500;
}

.note {
    color: var(--text-3);
    font-size: 12px;
    line-height: 1.45;
}

.field {
    width: 72px;
    padding: 6px 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--bg-2);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
}

.field.wide {
    width: 100%;
    margin-top: 6px;
}

.field:focus {
    border-color: var(--accent);
    outline: none;
}

.amount {
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
