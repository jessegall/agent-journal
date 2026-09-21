<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {api} from "../api/client.js";
import Icon from "../kit/Icon.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import Switch from "../kit/Switch.vue";
import {store} from "../state/store.js";
import UList from "./UList.vue";
import {every, flip, marks, on, unit} from "./featureSettings.js";

const props = defineProps({feature: Object});
const emit = defineEmits(["close"]);
const saved = (key) => (store.settings && store.settings[key]) || {};

const tagNames = computed(() => saved("tags").names || []);
const hold = ref("");
const days = ref({});
const retention = computed(() => saved("keep"));
const permissions = computed(() => saved("permissions"));
const relaunching = ref(false);

const pieces = (text) =>
    String(text || "")
        .split(/(\{\{\w+\}\})/)
        .filter(Boolean)
        .map((piece) => ({piece, slot: /^\{\{\w+\}\}$/.test(piece)}));

async function saveTags(value) {
    const names = String(value)
        .split(",")
        .map((name) => name.trim().replace(/^\[!|\]$/g, ""))
        .filter(Boolean);
    if (names.length) await api.saveSettings({tags: {names}});
}

async function saveHold() {
    await api.saveSettings({questions: {hold: Number(hold.value)}});
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

const closeOnEscape = (event) => event.key === "Escape" && emit("close");
onMounted(() => window.addEventListener("keydown", closeOnEscape));
onUnmounted(() => window.removeEventListener("keydown", closeOnEscape));
</script>

<template>
    <div class="veil" @click.self="emit('close')">
        <aside class="panel" role="dialog" :aria-label="feature.title">
            <header class="head">
                <div class="names">
                    <h2>{{ feature.title }}</h2>
                    <p class="abstract">{{ feature.abstract }}</p>
                </div>
                <template v-if="feature.fixed">
                    <span class="note">Always on</span>
                </template>
                <template v-else>
                    <Switch :on="on(feature.name, feature.default)" @change="(v) => flip(feature.name, v)" />
                </template>
                <button type="button" class="close" title="Close" @click="emit('close')"><Icon name="close" /></button>
            </header>
            <div class="body">
                <p class="help">{{ feature.help }}</p>
                <template v-if="feature.when">
                    <section class="block">
                        <h3>When it speaks</h3>
                        <UList :f="feature" @marks="marks" @every="every" @unit="unit" />
                    </section>
                </template>
                <template v-if="feature.parts.length">
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
                <SwitchCase :value="feature.name">
                    <template #tags>
                        <section class="block">
                            <h3>Tag names</h3>
                            <p class="note">Written [!name] at the start of a message, separated by commas</p>
                            <input class="field wide" :value="tagNames.join(', ')" @change="saveTags($event.target.value)" />
                        </section>
                    </template>
                    <template #questions>
                        <section class="block">
                            <h3>Hold a picked answer</h3>
                            <p class="note">Click the same answer again within this time to cancel it</p>
                            <span class="amount">
                                <input
                                    v-model="hold"
                                    class="field"
                                    type="number"
                                    min="0"
                                    :placeholder="String(saved('questions').hold ?? 3)"
                                    @change="saveHold"
                                />
                                seconds
                            </span>
                        </section>
                    </template>
                    <template #retention>
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
                    <template #permissions>
                        <template v-if="permissions.possible">
                            <section class="block">
                                <div class="row">
                                    <span class="text">
                                        <span class="title">Skip permission prompts</span>
                                        <span class="note">
                                            The agent is running {{ permissions.running ? "without" : "with" }} permission prompts. Changing
                                            this restarts the agent in the same conversation.
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
                                <span class="said">
                                    <span v-for="(p, i) in pieces(line.title)" :key="i" :class="{slot: p.slot}">{{ p.piece }}</span>
                                </span>
                                <template v-if="line.brief">
                                    <span class="note">
                                        <span v-for="(p, i) in pieces(line.brief)" :key="i" :class="{slot: p.slot}">{{ p.piece }}</span>
                                    </span>
                                </template>
                            </div>
                        </template>
                    </section>
                </template>
            </div>
        </aside>
    </div>
</template>

<style scoped>
.veil {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: color-mix(in srgb, #000 35%, transparent);
    animation: fade 0.16s ease;
}

.panel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    width: min(520px, 100vw);
    border-left: 1px solid var(--border);
    background: var(--bg);
    box-shadow: -16px 0 40px color-mix(in srgb, #000 30%, transparent);
    animation: slide 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes fade {
    from {
        opacity: 0;
    }
}

@keyframes slide {
    from {
        transform: translateX(24px);
        opacity: 0;
    }
}

.head {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 18px 18px 14px 22px;
    border-bottom: 1px solid var(--border);
}

.names {
    flex: 1;
    min-width: 0;
}

h2 {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
}

.abstract {
    margin: 0;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.45;
}

.close {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.close:hover {
    background: var(--hover);
    color: var(--text);
}

.body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 22px 28px;
}

.help {
    margin: 0 0 18px;
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

.said {
    font-size: 12.5px;
}

.slot {
    color: var(--accent-text);
}
</style>
