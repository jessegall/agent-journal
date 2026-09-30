<script setup>
import {computed, inject, nextTick, reactive, ref, watch} from "vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import {ended, flush, hold} from "./outbox.js";
import {announce} from "./announce.js";

const MOST_LINES = 5;
const props = defineProps({about: {type: String, default: ""}, quote: {type: String, default: ""}, draft: {type: String, default: ""}});
const emit = defineEmits(["sending", "sent", "unabout", "unquote"]);
const failed = inject("phoneFailed");
const words = ref("");
const files = ref([]);
const picker = ref(null);
const box = ref(null);
const sending = ref(false);
const said = computed(() => words.value.trim());
const ready = computed(() => Boolean(said.value || files.value.length));

const focus = () => box.value && box.value.focus();
const tapped = (event) => !event.target.closest("button, textarea") && focus();

defineExpose({focus});

watch(
    () => props.draft,
    (start) => {
        if (!start) return;
        words.value = start;
        nextTick(() => {
            grow();
            focus();
        });
    },
    {immediate: true},
);

const previews = reactive(new Map());
const pictured = (file) => file.type.startsWith("image/");

function previewed(file) {
    const reader = new FileReader();
    reader.onload = () => files.value.includes(file) && previews.set(file, reader.result);
    reader.readAsDataURL(file);
}

watch(files, (now) => {
    now.filter((file) => pictured(file) && !previews.has(file)).forEach(previewed);
    [...previews.keys()].filter((file) => !now.includes(file)).forEach((file) => previews.delete(file));
});

function picked(event) {
    files.value = [...files.value, ...event.target.files];
    event.target.value = "";
}

function grow() {
    const el = box.value;
    if (!el) return;
    el.style.height = "auto";
    const style = getComputedStyle(el);
    const cap = MOST_LINES * parseFloat(style.lineHeight) + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    el.style.height = `${Math.min(el.scrollHeight, cap)}px`;
    if (el.selectionEnd === el.value.length) el.scrollTop = el.scrollHeight;
}

async function send() {
    if (!ready.value || sending.value) return;
    sending.value = true;
    const text = said.value || `Sent ${files.value.map((file) => file.name).join(", ")}`;
    hold(text, props.about, files.value);
    emit("unquote");
    words.value = "";
    files.value = [];
    emit("sending");
    focus();
    nextTick(grow);
    try {
        await flush();
        announce("Message sent");
        emit("sent");
    } catch (error) {
        if (ended(error)) failed(error);
        else announce("Message waits to send");
    } finally {
        sending.value = false;
    }
}
</script>

<template>
    <form class="compose" @submit.prevent="send" @click="tapped">
        <template v-if="about && !quote">
            <div class="compose-about">
                <span>About {{ about.replace(":", " ") }}</span>
                <CloseButton @click="emit('unabout')" />
            </div>
        </template>
        <template v-if="quote">
            <div class="compose-quote">
                <span>{{ quote }}</span>
                <CloseButton @click="emit('unquote')" />
            </div>
        </template>
        <template v-if="files.length">
            <div class="compose-files">
                <template v-for="(file, i) in files" :key="file.name + file.size + file.lastModified">
                    <span class="compose-file">
                        <template v-if="pictured(file)">
                            <img class="compose-thumb" :src="previews.get(file)" :alt="file.name" />
                        </template>
                        <template v-else>
                            <span class="compose-file-name">{{ file.name }}</span>
                        </template>
                        <CloseButton @click="files = files.filter((_, at) => at !== i)" />
                    </span>
                </template>
            </div>
        </template>
        <textarea
            ref="box"
            v-model="words"
            class="compose-words"
            rows="1"
            placeholder="Message the agent"
            aria-label="Message the agent"
            @input="grow"
        />
        <div class="compose-controls">
            <button type="button" class="compose-clip" aria-label="Attach files or photos" @mousedown.prevent @click="picker.click()">
                <Icon name="paperclip" :size="20" />
            </button>
            <input ref="picker" type="file" multiple hidden @change="picked" />
            <template v-if="ready">
                <button type="submit" class="compose-send" :disabled="sending" aria-label="Send to the agent" @mousedown.prevent>
                    <Icon name="up" :size="20" />
                </button>
            </template>
        </div>
    </form>
</template>

<style scoped>
.compose {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 10px 10px;
    border: 1px solid var(--border-2);
    border-radius: 26px;
    background: var(--raised);
    box-shadow: var(--card-shadow);
    pointer-events: auto;
}

.compose-about,
.compose-quote {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 40px;
    padding: 4px 4px 4px 14px;
    border-radius: 16px;
    background: var(--hover);
    color: var(--text-2);
    font-size: 0.824rem;
}

.compose-about {
    color: var(--accent-text);
}

.compose-quote {
    box-shadow: inset 3px 0 0 var(--accent);
}

.compose-quote span {
    flex: 1;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.compose-files {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 4px;
}

.compose-file {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    padding: 4px 4px 4px 4px;
    border-radius: 14px;
    background: var(--hover);
    color: var(--text-2);
    font-size: 0.765rem;
}

.compose-file-name {
    max-width: 180px;
    padding-left: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.compose-thumb {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    object-fit: cover;
}

.compose-words {
    width: 100%;
    min-height: 34px;
    padding: 6px 8px;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: max(16px, 1rem);
    line-height: 1.35;
    resize: none;
}

.compose-words::placeholder {
    color: var(--text-3);
}

.compose-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 44px;
}

.compose-clip,
.compose-send {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border-radius: 50%;
}

.compose-clip {
    border: 1px solid var(--border-2);
    background: var(--bg);
    color: var(--text-2);
}

.compose-send {
    margin-left: auto;
    border: 0;
    background: var(--accent);
    color: #fff;
}

.compose-send :deep(svg) {
    color: #fff;
    stroke-width: 2.2;
    opacity: 1;
}

.compose-send:disabled {
    opacity: 0.6;
}
</style>
