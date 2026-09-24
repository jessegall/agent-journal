<script setup>
import CountBadge from "../kit/CountBadge.vue";
import {computed, nextTick, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import {store} from "../state/store.js";
import Icon from "../kit/Icon.vue";
import TextDisplay from "../kit/TextDisplay.vue";

const props = defineProps({
    placeholder: {type: String, default: "Message the agent"},
    submit: {type: String, default: "Send"},
    send: Function,
    quote: {type: String, default: ""},
    quoteLabel: {type: String, default: "Commenting on"},
    preset: {type: String, default: ""},
    up: Function,
    down: Function,
    tools: {type: Array, default: () => []},
    note: {type: String, default: ""},
    many: {type: Object, default: null},
    idle: {type: Object, default: null},
});
const emit = defineEmits(["unquote"]);
const draft = reactive({text: "", files: [], sending: false, error: ""});
const writing = computed(() => !!draft.text.trim());
watch(writing, (is) => (store.drafting += is ? 1 : -1));
onUnmounted(() => writing.value && (store.drafting -= 1));
const area = ref(null);
const kept = ref(0);
const resting = computed(() => Boolean(props.idle) && !draft.text.trim() && !draft.files.length);
const ready = computed(() => !draft.sending && Boolean(draft.text.trim()));
const label = computed(() => (resting.value ? props.idle.label : props.submit));
const measures = ref(null);
const widths = reactive({idle: 0, submit: 0});

function measure() {
    const shown = measures.value ? [...measures.value.children] : [];
    widths.idle = shown[0]?.offsetWidth || 0;
    widths.submit = shown[shown.length - 1]?.offsetWidth || 0;
}

onMounted(() => nextTick(measure));
watch(
    () => [props.idle?.label, props.submit],
    () => nextTick(measure)
);
const faceWidth = computed(() => (resting.value ? widths.idle : widths.submit) || 0);

function pressed(e) {
    if (!resting.value) return;
    e.preventDefault();
    use(props.idle);
}

const offering = computed(() => Boolean(props.many && draft.files.length > 1 && kept.value !== draft.files.length));

async function handOver() {
    const files = draft.files;
    draft.files = [];
    draft.error = "";
    try {
        await props.many.take(files);
    } catch (e) {
        draft.error = e.message;
        draft.files = files;
    }
}

watch(
    () => props.quote,
    (text) => text && area.value && area.value.focus()
);

watch(
    () => props.preset,
    (text) => {
        draft.text = text;
        area.value && area.value.focus();
    }
);

function arrowUp(e) {
    if (props.up && !draft.text.trim()) {
        e.preventDefault();
        props.up();
    }
}

function arrowDown(e) {
    if (props.down && (!draft.text.trim() || draft.text === props.preset)) {
        e.preventDefault();
        draft.text = "";
        props.down();
    }
}

function escaped(e) {
    if (props.preset && props.down) {
        e.preventDefault();
        e.stopPropagation();
        draft.text = "";
        props.down();
    }
}

function pasted(e) {
    const files = Array.from(e.clipboardData?.files || []);
    if (!files.length) return;
    e.preventDefault();
    draft.files.push(...files);
}

function picked(e) {
    draft.files.push(...e.target.files);
    e.target.value = "";
    area.value && area.value.focus();
}

function unpick(i) {
    draft.files.splice(i, 1);
    area.value && area.value.focus();
}

async function go() {
    if (draft.sending || !draft.text.trim()) return;
    const text = draft.text.trim();
    const files = draft.files;
    draft.sending = true;
    draft.error = "";
    draft.text = "";
    draft.files = [];
    try {
        await props.send(text, files);
    } catch (e) {
        draft.error = e.message;
        draft.text = draft.text || text;
        draft.files = draft.files.length ? draft.files : files;
    } finally {
        draft.sending = false;
        area.value && area.value.focus();
    }
}

async function use(tool) {
    draft.error = "";
    try {
        await tool.go();
    } catch (e) {
        draft.error = e.message;
    }
}
</script>

<template>
    <form class="compose" @submit.prevent="go">
        <template v-if="quote">
            <div class="compose-quote">
                <span class="compose-quote-label">{{ quoteLabel }}</span>
                <TextDisplay class="compose-quote-text" :text="quote" />
                <button type="button" class="compose-quote-x" title="Not a reply after all" @click="emit('unquote')">×</button>
            </div>
        </template>
        <Transition name="note">
            <div v-if="offering" class="compose-many">
                <p class="compose-many-title">
                    <Icon :name="many.icon" :size="13" />
                    {{ many.title(draft.files.length) }}
                </p>
                <p class="compose-many-text">{{ many.text }}</p>
                <div class="compose-many-row">
                    <Btn kind="primary" small @click="handOver">{{ many.action }}</Btn>
                    <Btn small @click="kept = draft.files.length">Just send them</Btn>
                </div>
            </div>
        </Transition>
        <div class="compose-box floating">
            <template v-if="draft.files.length">
                <div class="compose-files">
                    <template v-for="(f, i) in draft.files" :key="i">
                        <span class="chip">
                            {{ f.name }}
                            <button type="button" class="chip-x" title="Remove" @click="unpick(i)">×</button>
                        </span>
                    </template>
                </div>
            </template>
            <textarea
                ref="area"
                v-model="draft.text"
                class="box-area"
                rows="3"
                :placeholder="placeholder"
                :aria-label="submit"
                @keydown.enter.exact="!$event.isComposing && ($event.preventDefault(), go())"
                @keydown.up="arrowUp"
                @keydown.down="arrowDown"
                @keydown.esc="escaped"
                @keydown.meta.enter.prevent="go"
                @keydown.ctrl.enter.prevent="go"
                @paste="pasted"
            />
            <div class="compose-foot">
                <label class="compose-attach" title="Attach files" aria-label="Attach files">
                    <Icon name="paperclip" />
                    <input type="file" multiple hidden @change="picked" />
                </label>
                <template v-for="action in tools" :key="action.icon">
                    <button type="button" class="compose-attach" :title="action.title" :aria-label="action.title" @click="use(action)">
                        <Icon :name="action.icon" />
                        <template v-if="action.badge">
                            <CountBadge :count="action.badge" />
                        </template>
                    </button>
                </template>
                <button
                    type="submit"
                    :class="['compose-send', {resting, ready}]"
                    :disabled="!resting && !ready"
                    :title="resting ? idle.title : ''"
                    @click="pressed"
                >
                    <span class="compose-send-face" :style="faceWidth ? {width: `${faceWidth}px`} : null">
                        <Transition name="swap" mode="out-in">
                            <span :key="label" class="compose-send-label">
                                <template v-if="resting">
                                    <Icon :name="idle.icon" :size="13" />
                                </template>
                                {{ label }}
                            </span>
                        </Transition>
                    </span>
                    <span ref="measures" class="compose-send-measure" aria-hidden="true">
                        <template v-if="idle">
                            <span class="compose-send-label">
                                <Icon :name="idle.icon" :size="13" />
                                {{ idle.label }}
                            </span>
                        </template>
                        <span class="compose-send-label">{{ submit }}</span>
                    </span>
                </button>
            </div>
        </div>
        <template v-if="draft.error">
            <p class="error">{{ draft.error }}</p>
        </template>
        <Transition name="note">
            <p v-if="!draft.error && note" class="compose-note">{{ note }}</p>
        </Transition>
    </form>
</template>

<style scoped>
.compose {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.compose-quote {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 8px 12px;
    border-left: 2px solid var(--accent);
    border-radius: 0 8px 8px 0;
    background: var(--raised);
}

.compose-quote-label {
    font-size: 10.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-3);
}

.compose-quote-x {
    position: absolute;
    top: 4px;
    right: 6px;
    padding: 0 4px;
    border: 0;
    background: none;
    color: var(--text-3);
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
}

.compose-quote-x:hover {
    color: var(--text);
}

.compose-quote-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font-size: 12.5px;
    color: var(--text-2);
    white-space: pre-wrap;
}

.compose-quote-text :deep(p) {
    margin: 0;
}

.compose-box {
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid #3b3e46;
    border-radius: 12px;
    background: #141518;
}

.compose-box:focus-within {
    border-color: #4a4e58;
}

.compose-files {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 10px 10px 4px;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 1px 6px 1px 8px;
    border: 1px solid var(--border);
    border-radius: 5px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 12px;
}

.chip-x {
    border: 0;
    background: none;
    color: var(--text-3);
    padding: 0 2px;
}

.box-area {
    display: block;
    width: 100%;
    min-height: 74px;
    padding: 11px 12px 4px;
    border: 0;
    background: none;
    resize: none;
    outline: none;
    line-height: 1.45;
}

.compose-foot {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px 8px 10px;
}

.compose-attach {
    position: relative;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 6px;
    color: var(--text-2);
    background: transparent;
    cursor: pointer;
}

.compose-attach:hover {
    background: var(--hover);
    color: var(--text);
}

.compose-attach .ico {
    width: 18px;
    height: 18px;
    color: inherit;
}

.compose-many {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 8px;
    padding: 12px 14px;
    border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
    border-radius: 12px;
    background: color-mix(in srgb, var(--accent) 8%, var(--bg));
}

.compose-many-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text);
}

.compose-many-title .ico {
    color: var(--accent-text);
}

.compose-many-text {
    margin: 0;
    font-size: 12.5px;
    color: var(--text-3);
    text-wrap: pretty;
}

.compose-many-row {
    display: flex;
    gap: 6px;
}

.compose-send {
    position: relative;
    margin-left: auto;
    height: 28px;
    padding: 0 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: transparent;
    color: var(--text-3);
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    transition:
        background 0.25s,
        border-color 0.25s,
        color 0.25s;
}

.compose-send.resting:hover,
.compose-send.resting:focus-visible {
    border-color: color-mix(in srgb, var(--accent) 60%, var(--border-2));
    background: var(--accent-dim);
    color: var(--accent-text);
}

.compose-send.ready {
    border-color: var(--accent);
    background: var(--accent);
    color: #fff;
}

.compose-send.ready:hover {
    filter: brightness(1.08);
}

.compose-send:disabled {
    cursor: default;
}

.compose-send-face {
    display: inline-flex;
    justify-content: center;
    overflow: hidden;
    transition: width 0.28s var(--ease);
}

.compose-send-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
}

.compose-send-measure {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    visibility: hidden;
    pointer-events: none;
}

.swap-enter-active,
.swap-leave-active {
    transition:
        opacity 0.14s,
        translate 0.18s var(--ease);
}

.swap-enter-from {
    opacity: 0;
    translate: 0 4px;
}

.swap-leave-to {
    opacity: 0;
    translate: 0 -4px;
}

@media (prefers-reduced-motion: reduce) {
    .compose-send-face,
    .swap-enter-active,
    .swap-leave-active {
        transition: none;
    }
}

.error {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}

.compose-note {
    position: absolute;
    bottom: calc(100% + 6px);
    left: 4px;
    margin: 0;
    color: var(--text-4);
    font-size: 12px;
    pointer-events: none;
}

.note-enter-active,
.note-leave-active {
    transition: opacity 0.2s ease;
}

.note-enter-from,
.note-leave-to {
    opacity: 0;
}
</style>
