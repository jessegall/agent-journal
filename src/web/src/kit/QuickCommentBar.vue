<script setup>
import {nextTick, ref} from "vue";
import Btn from "./Btn.vue";
import Icon from "./Icon.vue";
import {counted} from "../format/number.js";

const props = defineProps({
    send: {type: Function, required: true},
    count: {type: Number, default: 0},
    ready: {type: Boolean, default: true},
    placeholder: {type: String, default: "Write a comment…"},
});
const emit = defineEmits(["show"]);
const draft = defineModel("draft", {type: String, default: ""});
const error = defineModel("error", {type: String, default: ""});
const open = ref(Boolean(error.value));
const done = ref(false);
const sending = ref(false);
const box = ref(null);

async function expand() {
    open.value = true;
    done.value = false;
    await nextTick();
    (box.value?.querySelector("input") || box.value)?.focus();
}

function collapse() {
    open.value = false;
    error.value = "";
}

function enter(event) {
    if (event.shiftKey || event.isComposing) return;
    event.preventDefault();
    submit();
}

async function submit() {
    const text = draft.value.trim();
    if (!text || !props.ready || sending.value) return;
    error.value = "";
    sending.value = true;
    draft.value = "";
    try {
        await props.send(text);
        open.value = false;
        done.value = true;
    } catch (e) {
        draft.value = text;
        error.value = e.message;
    } finally {
        sending.value = false;
    }
}

defineExpose({expand});
</script>

<template>
    <div :class="['comment-bar', {open}]">
        <template v-if="open">
            <form class="card compose" @submit.prevent="submit" @keydown.esc="collapse">
                <slot name="who" />
                <textarea ref="box" v-model="draft" rows="3" maxlength="2000" :placeholder="placeholder" @keydown.enter="enter" />
                <div class="actions">
                    <span class="error">{{ error }}</span>
                    <Btn small @click="collapse">Cancel</Btn>
                    <Btn kind="primary" small :busy="sending" :disabled="!draft.trim() || !ready" @click="submit">Send</Btn>
                </div>
            </form>
        </template>
        <template v-else>
            <div class="card closed">
                <button type="button" class="comment-bar-open" @click="expand">
                    <span class="mark"><Icon :name="done ? 'check' : 'chat'" :size="14" /></span>
                    <span class="prompt">{{ done ? "Sent. Leave another" : "Leave a comment" }}</span>
                    <template v-if="draft.trim()">
                        <span class="draft">Draft kept</span>
                    </template>
                </button>
                <template v-if="count">
                    <button type="button" class="count" @click="emit('show')">
                        <span>{{ counted(count, "comment") }}</span>
                        <Icon name="down" :size="12" />
                    </button>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.comment-bar {
    position: relative;
    z-index: 3;
    flex: none;
    padding: 0 32px 16px;
    background: var(--bg);
}

.comment-bar::before {
    position: absolute;
    right: 0;
    bottom: 100%;
    left: 0;
    height: 28px;
    background: linear-gradient(to bottom, transparent, var(--bg));
    content: "";
    pointer-events: none;
}

.card {
    max-width: 736px;
    margin: 0 auto;
    border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border-2));
    border-radius: 12px;
    background: var(--raised);
    box-shadow:
        0 0 0 3px color-mix(in srgb, var(--accent) 10%, transparent),
        0 10px 30px rgb(0 0 0 / 0.3);
}

.closed {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px;
}

.comment-bar-open {
    display: flex;
    flex: 1;
    min-width: 0;
    align-items: center;
    gap: 10px;
    height: 40px;
    padding: 0 12px 0 5px;
    border: 0;
    border-radius: 8px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 14px;
    text-align: left;
    cursor: text;
}

.comment-bar-open:hover {
    background: var(--hover);
    color: var(--text);
}

.mark {
    display: grid;
    flex: none;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
}

.mark .ico {
    color: inherit;
}

.prompt {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.draft {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}

.count {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 6px;
    height: 40px;
    padding: 0 12px;
    border: 0;
    border-left: 1px solid var(--border-2);
    border-radius: 0 8px 8px 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}

.count:hover {
    color: var(--text);
}

.compose {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    animation: rise 0.18s var(--ease);
}

@keyframes rise {
    from {
        opacity: 0;
        transform: translateY(6px);
    }

    to {
        opacity: 1;
        transform: none;
    }
}

textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 14px;
    line-height: 1.5;
    resize: none;
}

textarea:focus {
    border-color: var(--accent);
    outline: none;
}

.actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.error {
    flex: 1;
    color: var(--danger);
    font-size: 12px;
}

@media (max-width: 700px) {
    .comment-bar {
        padding: 0 10px 10px;
    }
}
</style>
