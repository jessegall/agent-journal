<script setup>
import {computed} from "vue";
import {saveSettings} from "../actions/settings.js";
import Chip from "../kit/Chip.vue";
import {store} from "../state/store.js";

// The kinds of shell command workers may run, as the journal classifies each command; a test or a build is always queued with the journal instead.
const emit = defineEmits(["back"]);
const spec = computed(() => (store.spec?.features || []).flatMap((feature) => feature.settings || []).find((setting) => setting.name === "command_kinds"));
const allowed = computed(() => String(store.settings?.workers?.command_kinds ?? spec.value?.default ?? "").split(",").map((kind) => kind.trim()).filter(Boolean));
const kinds = computed(() => spec.value?.choices || []);

function toggle(kind) {
    const next = allowed.value.includes(kind) ? allowed.value.filter((one) => one !== kind) : [...allowed.value, kind];
    saveSettings({workers: {command_kinds: kinds.value.filter((one) => next.includes(one)).join(", ")}});
}
</script>

<template>
    <div class="command-kinds">
        <button type="button" class="command-kinds-back" @click="emit('back')">
            <svg viewBox="0 0 12 12"><path d="M7.5 2.5 4 6l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            Workers
        </button>
        <h5 class="command-kinds-title">Commands workers may run</h5>
        <p class="command-kinds-line">Journal commands always run. A test or a build a worker runs itself is refused and queued with the journal instead.</p>
        <div class="command-kinds-list">
            <template v-for="kind in kinds" :key="kind">
                <button type="button" class="command-kinds-pick" :data-kind="kind" :aria-pressed="allowed.includes(kind)" @click="toggle(kind)">
                    <Chip :class="{on: allowed.includes(kind)}">{{ kind }}</Chip>
                </button>
            </template>
        </div>
    </div>
</template>

<style scoped>
.command-kinds {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 12px 12px;
}

.command-kinds-back {
    display: inline-flex;
    align-self: flex-start;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.command-kinds-back:hover {
    background: var(--hover);
    color: var(--text);
}

.command-kinds-back svg {
    width: 12px;
    height: 12px;
}

.command-kinds-title {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
}

.command-kinds-line {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.command-kinds-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.command-kinds-pick {
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
}
</style>
