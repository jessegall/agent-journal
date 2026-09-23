<script setup>
import CountBadge from "../kit/CountBadge.vue";
import {computed, onUnmounted, reactive, ref, watch} from "vue";
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
});
const emit = defineEmits(["unquote"]);
const draft = reactive({text: "", files: [], sending: false, error: ""});
const writing = computed(() => !!draft.text.trim());
watch(writing, (is) => (store.drafting += is ? 1 : -1));
onUnmounted(() => writing.value && (store.drafting -= 1));
const area = ref(null);
const attachment = {attachment: true, icon: "paperclip"};
const actions = computed(() => [attachment, ...props.tools]);

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
                <template v-for="action in actions" :key="action.icon">
                    <template v-if="action.attachment">
                        <label class="compose-attach" title="Attach files" aria-label="Attach files">
                            <Icon name="paperclip" />
                            <input type="file" multiple hidden @change="picked" />
                        </label>
                    </template>
                    <template v-else>
                        <button type="button" class="compose-attach" :title="action.title" :aria-label="action.title" @click="use(action)">
                            <Icon :name="action.icon" />
                            <template v-if="action.badge">
                                <CountBadge :count="action.badge" />
                            </template>
                        </button>
                    </template>
                </template>
                <button type="submit" class="compose-send" :disabled="draft.sending || !draft.text.trim()">{{ submit }}</button>
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

.compose-send {
    margin-left: auto;
    height: 32px;
    padding: 0 16px;
    border: 0;
    border-radius: 8px;
    background: var(--accent);
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
}

.compose-send:hover {
    filter: brightness(1.08);
}

.compose-send:disabled {
    opacity: 0.45;
    cursor: default;
    filter: none;
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
