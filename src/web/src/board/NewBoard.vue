<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import FocusStage from "../kit/FocusStage.vue";
import TextInput from "../kit/TextInput.vue";
import DocumentChoice from "./DocumentChoice.vue";
import PresetCard from "./PresetCard.vue";
import {PRESETS, boardBody} from "./presets.js";

const props = defineProps({open: Boolean});
const emit = defineEmits(["close", "made"]);
const chosen = ref(-1);
const name = ref("");
const warning = ref("");
const making = ref(false);
const field = ref(null);
const DOCUMENT = PRESETS.length;
const document = ref(null);
const steer = ref("");
const choice = ref(null);
const fromDocument = computed(() => chosen.value === DOCUMENT && Boolean(document.value));
const preset = computed(() => PRESETS[chosen.value] || null);
const ready = computed(() => Boolean(preset.value) || fromDocument.value);
const hint = `1 to ${DOCUMENT + 1} picks · a dropped or pasted document picks ${DOCUMENT + 1} · Enter makes the board · Esc goes back`;
const stem = (file) => file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");

watch(
    () => props.open,
    (open) => open && reset()
);

function reset() {
    chosen.value = -1;
    document.value = null;
    steer.value = "";
    name.value = "";
    warning.value = "";
    making.value = false;
}

function pick(i) {
    if (i === DOCUMENT && !document.value) return choice.value.browse();
    chosen.value = i;
    warning.value = "";
    nextTick(() => field.value && field.value.focus());
}

function named(e) {
    name.value = e.target.value;
    warning.value = "";
}

function take(file) {
    document.value = file;
    pick(DOCUMENT);
}

function clear() {
    document.value = null;
    chosen.value = -1;
}

async function build() {
    const made = await api.create("board", {title: name.value.trim() || stem(document.value), stages: []});
    await api.upload("board", made.n, document.value);
    await api.act("board", made.n, "build", {name: name.value.trim(), steer: steer.value.trim()});
    return made;
}

async function create() {
    if (making.value) return;
    if (!ready.value) {
        warning.value = "Pick a set of stages or a document first.";
        return;
    }
    making.value = true;
    try {
        const made = fromDocument.value
            ? await build()
            : await api.create("board", boardBody(preset.value, name.value.trim() || preset.value.suggest));
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
    if (!Number.isInteger(shortcut) || shortcut < 1 || shortcut > DOCUMENT + 1) return;
    if (e.target.closest("input,textarea,[contenteditable]") && name.value) return;
    e.preventDefault();
    pick(shortcut - 1);
}

function dropped(e) {
    const file = e.dataTransfer && e.dataTransfer.files[0];
    if (!props.open || !file) return;
    e.preventDefault();
    take(file);
}

function pasted(e) {
    if (!props.open || !e.clipboardData) return;
    const file = e.clipboardData.files[0];
    const text = e.clipboardData.getData("text");
    if (!file && (e.target.closest("input,textarea,[contenteditable]") || !text.trim())) return;
    e.preventDefault();
    take(file || new File([text], "Pasted document.md", {type: "text/markdown"}));
}

const hovering = (e) => props.open && e.preventDefault();
const LISTENERS = {keydown: onKey, dragover: hovering, drop: dropped, paste: pasted};
onMounted(() => Object.entries(LISTENERS).forEach(([event, listener]) => window.addEventListener(event, listener)));
onUnmounted(() => Object.entries(LISTENERS).forEach(([event, listener]) => window.removeEventListener(event, listener)));
</script>

<template>
    <FocusStage :open="open" page leave="Back to the board" @close="emit('close')">
        <div class="new-board-head">
            <h1 class="new-board-title">New board</h1>
            <p class="new-board-lead">Pick a set of stages, or hand me a document and I set the board up from it.</p>
        </div>
        <div :class="['new-board-presets', {dim: fromDocument}]">
            <template v-for="(p, i) in PRESETS" :key="p.key">
                <PresetCard :preset="p" :shortcut="String(i + 1)" :chosen="chosen === i" @choose="pick(i)" />
            </template>
        </div>
        <DocumentChoice
            ref="choice"
            v-model:steer="steer"
            :chosen="chosen === DOCUMENT"
            :file="document"
            :shortcut="String(DOCUMENT + 1)"
            @choose="pick(DOCUMENT)"
            @file="take"
            @clear="clear"
        />
        <div class="new-board-name">
            <TextInput
                ref="field"
                class="new-board-field"
                label="Name"
                large
                :value="name"
                :placeholder="
                    fromDocument ? 'I name it from the document, or type your own' : preset ? preset.suggest : 'What the board is for'
                "
                @input="named"
                @keydown.enter.prevent="create"
            />
            <Btn kind="primary" large :disabled="!ready || making" @click="create">
                {{ making ? "Making the board" : fromDocument ? "Build the board" : "Create board" }}
            </Btn>
        </div>
        <p class="new-board-hint">
            <template v-if="warning">
                <span class="new-board-warning">{{ warning }}</span>
            </template>
            <template v-else-if="fromDocument">
                The board opens straight away and fills while you watch. You can leave; I carry on.
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

.new-board-presets.dim {
    opacity: 0.38;
    transition: opacity 0.2s;
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
