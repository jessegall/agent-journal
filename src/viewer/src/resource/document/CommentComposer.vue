<script setup>
import {computed, nextTick, ref} from "vue";
import Btn from "../../kit/Btn.vue";
import CloseButton from "../../kit/CloseButton.vue";
import {submitOnEnter} from "../../platform/keys.js";

// the comment box at the foot of a document, always open: with the selection it is on above it, and growing with what is written; a failed send keeps the words
const props = defineProps({selection: {type: Object, default: null}, send: {type: Function, required: true}, narrow: Boolean});
const emit = defineEmits(["clear"]);
const draft = defineModel("draft", {type: String, default: ""});
const failure = ref("");
const sending = ref(false);
const box = ref(null);
const isCode = computed(() => props.selection?.selection_type === "code");
const placeholder = computed(() => (props.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection"));

function grow() {
    box.value.style.height = "auto";
    box.value.style.height = `${box.value.scrollHeight + 2}px`;
}

async function submit() {
    const words = draft.value.trim();
    if (!words || sending.value) return;
    failure.value = "";
    sending.value = true;
    try {
        await props.send(words);
        draft.value = "";
        await nextTick();
        grow();
    } catch (error) {
        failure.value = error.message;
    } finally {
        sending.value = false;
    }
}

defineExpose({focus: () => box.value.focus()});
</script>

<template>
    <div class="comment-box" data-comment-box>
        <template v-if="selection">
            <div class="comment-on" data-comment-on>
                <span class="comment-on-label">On this selection</span>
                <span :class="['comment-on-words', {mono: isCode}]">{{ selection.quote }}</span>
                <CloseButton title="Comment on the whole document instead" @click="emit('clear')" />
            </div>
        </template>
        <template v-if="failure">
            <p class="comment-failure" role="alert">{{ failure }}</p>
        </template>
        <div class="comment-row">
            <textarea ref="box" v-model="draft" rows="1" maxlength="2000" :class="{on: draft}" :placeholder="placeholder" aria-label="Write a comment" data-comment-input @input="grow" @keydown.enter="submitOnEnter($event, submit)" />
            <Btn variant="primary" :busy="sending" :disabled="!draft.trim()" data-comment-send @click="submit">Comment</Btn>
        </div>
    </div>
</template>

<style scoped>
.comment-box {
    flex: none;
    padding: 10px 16px 10px 24px;
    border-top: 1px solid var(--border);
    background: var(--bg);
}

.comment-on {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    margin: 0 0 8px;
    padding: 7px 8px 7px 10px;
    border-radius: 8px;
    background: var(--accent-dim);
    font-size: 12px;
    line-height: 1.45;
}

.comment-on-label {
    flex: none;
    color: var(--accent-text);
    font-weight: 600;
}

.comment-on-words {
    display: -webkit-box;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.comment-on-words.mono {
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
    overflow-wrap: anywhere;
}

.comment-failure {
    margin: 0 0 8px;
    color: var(--danger);
    font-size: 12.5px;
}

.comment-row {
    display: flex;
    gap: 8px;
    align-items: flex-end;
}

textarea {
    flex: 1;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    min-height: 34px;
    max-height: 180px;
    padding: 7px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg-2);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    line-height: 1.45;
    resize: none;
    outline: none;
}

textarea.on,
textarea:focus {
    border-color: var(--accent);
}

@media (max-width: 760px) {
    .comment-box {
        padding: 8px 12px;
    }
}
</style>
