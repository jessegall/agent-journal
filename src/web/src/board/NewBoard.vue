<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import FocusStage from "../kit/FocusStage.vue";
import TextInput from "../kit/TextInput.vue";
import PresetCard from "./PresetCard.vue";
import {PRESETS, boardBody} from "./presets.js";

const props = defineProps({open: Boolean});
const emit = defineEmits(["close", "made"]);
const chosen = ref(-1);
const name = ref("");
const warning = ref("");
const making = ref(false);
const field = ref(null);
const preset = computed(() => PRESETS[chosen.value] || null);
const hint = `1 to ${PRESETS.length} picks a set · Enter makes the board · Esc goes back`;

watch(
    () => props.open,
    (open) => open && reset()
);

function reset() {
    chosen.value = -1;
    name.value = "";
    warning.value = "";
    making.value = false;
}

function pick(i) {
    chosen.value = i;
    warning.value = "";
    nextTick(() => field.value && field.value.focus());
}

function named(e) {
    name.value = e.target.value;
    warning.value = "";
}

async function create() {
    if (making.value) return;
    if (!preset.value) {
        warning.value = "Pick a set of stages first.";
        return;
    }
    making.value = true;
    try {
        const made = await api.create("board", boardBody(preset.value, name.value.trim() || preset.value.suggest));
        emit("made", made.n);
    } catch (e) {
        warning.value = e.message;
    } finally {
        making.value = false;
    }
}

function onKey(e) {
    if (!props.open || e.metaKey || e.ctrlKey || e.altKey) return;
    const shortcut = Number(e.key);
    if (!Number.isInteger(shortcut) || shortcut < 1 || shortcut > PRESETS.length) return;
    if (e.target.closest("input,textarea,[contenteditable]") && name.value) return;
    e.preventDefault();
    pick(shortcut - 1);
}

onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<template>
    <FocusStage :open="open" page leave="Back to the board" @close="emit('close')">
        <div class="new-board-head">
            <h1 class="new-board-title">New board</h1>
            <p class="new-board-lead">Pick a set of stages. You can rename, add or remove stages on the board later.</p>
        </div>
        <div class="new-board-presets">
            <template v-for="(p, i) in PRESETS" :key="p.key">
                <PresetCard :preset="p" :shortcut="String(i + 1)" :chosen="chosen === i" @choose="pick(i)" />
            </template>
        </div>
        <div class="new-board-name">
            <TextInput
                ref="field"
                class="new-board-field"
                label="Name"
                large
                :value="name"
                :placeholder="preset ? preset.suggest : 'What the board is for'"
                @input="named"
                @keydown.enter.prevent="create"
            />
            <Btn kind="primary" large :disabled="!preset || making" @click="create">
                {{ making ? "Making the board" : "Create board" }}
            </Btn>
        </div>
        <p class="new-board-hint">
            <template v-if="warning">
                <span class="new-board-warning">{{ warning }}</span>
            </template>
            <template v-else>
                {{ hint }}
            </template>
        </p>
    </FocusStage>
</template>

<style scoped>
.new-board-title {
    margin: 0;
    color: var(--text);
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.01em;
}

.new-board-lead {
    margin: 6px 0 0;
    color: var(--text-3);
}

.new-board-presets {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
}

.new-board-name {
    display: flex;
    align-items: center;
    gap: 10px;
}

.new-board-field {
    flex: 1;
}

.new-board-hint {
    min-height: 16px;
    margin: 0;
    color: var(--text-4);
    font-size: 12px;
}

.new-board-warning {
    color: var(--accent-text);
}

@media (max-width: 900px) {
    .new-board-presets {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 560px) {
    .new-board-presets {
        grid-template-columns: 1fr;
    }

    .new-board-name {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
