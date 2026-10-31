<script setup>
import {computed, onMounted, ref, watchEffect} from "vue";
import {closeUpdate, updateView} from "../state/overlays.js";
import {useEscape} from "../composables/windowEvent.js";
import {useGrowFromCard} from "../composables/growFromCard.js";
import TextDisplay from "../kit/TextDisplay.vue";
import CloseButton from "../kit/CloseButton.vue";
import {useScope} from "../composables/scope.js";
import {holding, isWhole, rows, whole} from "../sync/rows.js";
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
    else if (!isWhole(report.value)) whole("reports", id).catch((error) => console.error(error));
});

const panel = ref(null);
const content = ref(null);
const ghost = ref(null);
const {grow, shrink} = useGrowFromCard(panel, content, ghost, () => updateView.card);
const close = () => shrink(closeUpdate);

function openRow(ref) {
    const [table, n] = ref.split(":");
    closeUpdate();
    peek(table, Number(n));
}

useEscape(close, () => !route.value.open);
onMounted(() => {
    grow();
    scope.api.act("reports", id, "read").catch((error) => console.error(error));
});
</script>

<template>
    <section ref="panel" class="update-layer" role="dialog" aria-label="Update report">
        <div ref="ghost" class="update-ghost" />
        <div ref="content" class="update-scroll">
            <header class="update-head">
                <p class="update-label">Update report</p>
                <CloseButton title="Close the update" @click="close" />
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
        </div>
    </section>
</template>

<style scoped>
.update-layer {
    position: absolute;
    inset: 0;
    z-index: 21;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    overflow-wrap: anywhere;
}

.update-ghost {
    position: absolute;
    pointer-events: none;
}

.update-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 14px 16px 32px;
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
