<script setup>
import {computed, inject, nextTick, ref} from "vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import {fitLines} from "../composables/fitLines.js";
import {withQuote} from "../format/quote.js";
import {ended, flush, hold} from "./outbox.js";

const MOST_LINES = 5;
const props = defineProps({about: {type: String, default: ""}, quote: {type: String, default: ""}});
const emit = defineEmits(["sending", "sent", "unabout", "unquote"]);
const failed = inject("phoneFailed");
const words = ref("");
const files = ref([]);
const picker = ref(null);
const box = ref(null);
const sending = ref(false);
const said = computed(() => words.value.trim());
const ready = computed(() => Boolean(said.value || files.value.length));

function picked(event) {
    files.value = [...files.value, ...event.target.files];
    event.target.value = "";
}

const grow = () => fitLines(box.value, MOST_LINES);

async function send() {
    if (!ready.value || sending.value) return;
    sending.value = true;
    const text = said.value || `Sent ${files.value.map((file) => file.name).join(", ")}`;
    hold(withQuote(props.quote, text), props.about, files.value);
    emit("unquote");
    words.value = "";
    files.value = [];
    emit("sending");
    nextTick(grow);
    try {
        await flush();
        emit("sent");
    } catch (error) {
        if (ended(error)) failed(error);
    } finally {
        sending.value = false;
    }
}
</script>

<template>
    <form class="compose" @submit.prevent="send">
        <template v-if="about && !quote">
            <div class="compose-about">
                About {{ about.replace(":", " ") }}
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
                        {{ file.name }}
                        <CloseButton @click="files = files.filter((_, at) => at !== i)" />
                    </span>
                </template>
            </div>
        </template>
        <div class="compose-bar">
            <button type="button" class="compose-clip" aria-label="Attach files or photos" @click="picker.click()">
                <Icon name="paperclip" :size="18" />
            </button>
            <input ref="picker" type="file" multiple hidden @change="picked" />
            <textarea
                ref="box"
                v-model="words"
                class="compose-words"
                rows="1"
                placeholder="Message the agent"
                aria-label="Message the agent"
                @input="grow"
            />
            <template v-if="ready">
                <button type="submit" class="compose-send" :disabled="sending" aria-label="Send to the agent">
                    <Icon name="up" :size="18" />
                </button>
            </template>
        </div>
    </form>
</template>

<style scoped>
.compose {
    position: sticky;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0 -16px;
    padding: 6px 16px max(6px, calc(env(safe-area-inset-bottom) - 18px));
    max-width: none;
    border-top: 1px solid var(--line);
    background: var(--bg);
}

.compose-about {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--accent-text);
    font-size: 13.5px;
}

.compose-bar {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    padding: 5px 5px 5px 4px;
    border: 1px solid var(--border-2);
    border-radius: 22px;
    background: var(--raised);
}

.compose-clip {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 0;
    background: none;
    color: var(--text-3);
}

.compose-quote {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 6px 10px;
    border-left: 3px solid var(--accent);
    color: var(--text-2);
    font-size: 13.5px;
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
    gap: 6px;
}

.compose-file {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    padding: 2px 4px 2px 10px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    color: var(--text-2);
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.compose-words {
    flex: 1;
    min-height: 34px;
    padding: 7px 0;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--text);
    font: inherit;
    line-height: 1.35;
    resize: none;
}

.compose-send {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 50%;
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
