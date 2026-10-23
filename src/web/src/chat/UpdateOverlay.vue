<script setup>
import {computed, onMounted, watchEffect} from "vue";
import {closeUpdate, updateView} from "../state/overlays.js";
import {useEscape} from "../composables/windowEvent.js";
import TextDisplay from "../kit/TextDisplay.vue";
import CloseButton from "../kit/CloseButton.vue";
import {useScope} from "../composables/scope.js";
import {holding, rows} from "../sync/rows.js";
import {peek, route} from "../route.js";

// each section of an update in the order it is read, with the words it is shown under
const SECTIONS = [
    ["need", "Waits on you"],
    ["done", "Done"],
    ["doing", "Under way"],
    ["plans", "Plans under way"],
    ["commits", "Commits"],
    ["also", "Also written"],
];

const scope = useScope();
const id = updateView.id;
const report = computed(() => rows("reports").find((r) => r.id === id) || null);
const sections = computed(() =>
    SECTIONS.map(([key, words]) => ({key, words, items: (report.value?.items || []).filter((item) => item.section === key)})).filter((section) => section.items.length)
);

watchEffect(() => {
    if (!report.value) holding("reports", [id]).catch((error) => console.error(error));
});

function openRow(ref) {
    const [table, n] = ref.split(":");
    closeUpdate();
    peek(table, Number(n));
}

useEscape(closeUpdate, () => !route.value.open);
onMounted(() => scope.api.act("reports", id, "read").catch((error) => console.error(error)));
</script>

<template>
    <div class="update-layer">
        <div class="update-veil" @click="closeUpdate" />
        <section class="update-card" role="dialog" aria-label="Update report">
            <header class="update-head">
                <p class="update-label">Update report</p>
                <CloseButton title="Close the update" @click="closeUpdate" />
            </header>
            <template v-if="report">
                <h2 class="update-title">{{ report.title }}</h2>
                <TextDisplay class="update-summary" :text="report.abstract" />
                <template v-for="section in sections" :key="section.key">
                    <h3 class="update-section">{{ section.words }}</h3>
                    <ul class="update-items">
                        <template v-for="item in section.items" :key="item.ref">
                            <li>
                                <button type="button" class="update-item" @click="openRow(item.ref)">{{ item.title }}</button>
                                <template v-if="item.note">
                                    <span class="update-note">{{ item.note }}</span>
                                </template>
                            </li>
                        </template>
                    </ul>
                </template>
            </template>
        </section>
    </div>
</template>

<style scoped>
.update-layer {
    position: absolute;
    inset: 0;
    z-index: 21;
    display: grid;
    place-items: center;
    padding: 16px;
}

.update-veil {
    position: absolute;
    inset: 0;
    background: color-mix(in srgb, var(--bg) 55%, transparent);
    backdrop-filter: blur(6px) saturate(0.8);
}

.update-card {
    position: relative;
    box-sizing: border-box;
    width: min(560px, 100%);
    max-height: 100%;
    overflow-y: auto;
    padding: 14px 16px 16px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
    overflow-wrap: anywhere;
}

.update-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.update-label {
    margin: 0;
    color: var(--accent);
    font-size: 10.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.update-title {
    margin: 4px 0 6px;
    color: var(--text);
    font-size: 14.5px;
    font-weight: 600;
}

.update-summary {
    margin: 0 0 8px;
    color: var(--text-2);
    font-size: 13px;
}

.update-section {
    margin: 12px 0 4px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
}

.update-items {
    margin: 0;
    padding: 0;
    list-style: none;
}

.update-items li {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: baseline;
    padding: 2px 0;
}

.update-item {
    padding: 0;
    border: none;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.update-item:hover {
    color: var(--accent);
}

.update-note {
    color: var(--text-3);
    font-size: 12px;
}
</style>
