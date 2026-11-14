<script setup>
import {nextTick, ref, watch} from "vue";
import Btn from "../src/kit/Btn.vue";
import Icon from "../src/kit/Icon.vue";

// the box that floats under a text and takes a comment on it: closed it is one line that says what it comments on, opened it is a field with Cancel and Send.
// A quote says what part of the text the comment is about; its cross makes the comment about the whole text. The count beside it brings the comments back.
const props = defineProps({count: {type: Number, default: 0}, quote: {type: String, default: ""}, placeholder: {type: String, default: "Comment on this file, or pick lines first"}, sending: Boolean});
const emit = defineEmits(["send", "show", "clear-quote"]);
const open = ref(false);
const draft = ref("");
const field = ref(null);

watch(() => props.quote, (quote) => quote && openBox());

async function openBox() {
    open.value = true;
    await nextTick();
    field.value?.focus();
}

defineExpose({openBox});

function send() {
    const words = draft.value.trim();
    if (!words || props.sending) return;
    emit("send", words);
    draft.value = "";
    open.value = false;
}
</script>

<template>
    <div class="comment-dock" data-comment-box>
        <div class="comment-box">
            <template v-if="open">
                <form class="box-form" @submit.prevent="send" @keydown.esc.stop="open = false" @keydown.enter.meta.prevent="send" @keydown.enter.ctrl.prevent="send">
                    <template v-if="quote">
                        <div class="box-quote" data-box-quote>
                            <b>On</b><span class="box-quote-words">{{ quote }}</span>
                            <button type="button" class="box-quote-clear" title="Whole file" aria-label="Whole file" @click="emit('clear-quote')"><Icon name="close" :size="10" /></button>
                        </div>
                    </template>
                    <textarea ref="field" v-model="draft" placeholder="Comment" aria-label="Comment" data-box-field />
                    <div class="box-actions">
                        <Btn small @click="open = false">Cancel</Btn>
                        <Btn small variant="primary" :disabled="!draft.trim() || sending" data-box-send @click="send">Send</Btn>
                    </div>
                </form>
            </template>
            <template v-else>
                <div class="box-closed">
                    <button type="button" class="box-open" data-box-open @click="openBox"><Icon name="chat" :size="13" /><span>{{ placeholder }}</span></button>
                    <template v-if="count > 0">
                        <Btn small title="Comments" aria-label="Show the comments" data-box-count @click="emit('show')"><Icon name="chat" :size="13" />{{ count }}</Btn>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.comment-dock {
    flex: none;
    padding: 0 var(--inset) var(--s3);
}

.comment-box {
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
    border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border-2));
    border-radius: 12px;
    background: var(--raised);
}

.box-closed {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 5px;
}

.box-open {
    display: flex;
    flex: 1;
    gap: 10px;
    align-items: center;
    height: 36px;
    padding: 0 10px 0 8px;
    border: 0;
    border-radius: 8px;
    background: none;
    color: var(--text-2);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.box-open:hover {
    background: var(--hover);
    color: var(--text);
}

.box-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
}

.box-form textarea {
    width: 100%;
    min-height: 64px;
    padding: 4px;
    border: 0;
    outline: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 13px;
    resize: none;
}

.box-quote {
    display: flex;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 6px;
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    color: var(--text-2);
    font-size: 12px;
}

.box-quote b {
    color: var(--accent-text);
    font-weight: 600;
}

.box-quote-words {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.box-quote-clear {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.box-actions {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
}
</style>
