<script setup>
import {nextTick, ref} from "vue";
import {sendComment} from "../api/shared.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import TextInput from "../kit/TextInput.vue";
import {remember, remembered} from "../composables/remembered.js";
import {counted} from "../format/number.js";

const NAME_KEY = "shared-comment-name";
const props = defineProps({about: {type: String, required: true}, sent: {type: Array, required: true}, count: {type: Number, default: 0}});
const emit = defineEmits(["update:sent", "show"]);
const name = ref(remembered(NAME_KEY, ""));
const naming = ref(!name.value);
const open = ref(false);
const done = ref(false);
const draft = ref("");
const sending = ref(false);
const error = ref("");
const nameBox = ref(null);
const box = ref(null);

async function expand() {
    open.value = true;
    done.value = false;
    await nextTick();
    (naming.value ? nameBox.value : box.value)?.focus();
}

function collapse() {
    open.value = false;
    error.value = "";
}

async function send() {
    const text = draft.value.trim();
    if (!text || !name.value.trim() || sending.value) return;
    error.value = "";
    sending.value = true;
    const waiting = {n: -Date.now(), about: props.about, name: name.value.trim(), text, created: Date.now() / 1000, waiting: true};
    emit("update:sent", [...props.sent, waiting]);
    draft.value = "";
    try {
        const made = await sendComment(props.about, name.value.trim(), text);
        remember(NAME_KEY, made.name);
        name.value = made.name;
        naming.value = false;
        emit("update:sent", [...props.sent.filter((c) => c.n !== waiting.n), made]);
        open.value = false;
        done.value = true;
    } catch (e) {
        emit(
            "update:sent",
            props.sent.filter((c) => c.n !== waiting.n)
        );
        draft.value = text;
        error.value = e.message;
    } finally {
        sending.value = false;
    }
}
</script>

<template>
    <div :class="['comment-bar', {open}]">
        <template v-if="open">
            <form class="card compose" @submit.prevent="send" @keydown.esc="collapse">
                <div class="who">
                    <template v-if="naming">
                        <TextInput
                            ref="nameBox"
                            class="name"
                            :value="name"
                            label="Your name"
                            maxlength="40"
                            autocomplete="name"
                            placeholder="Shown with your comment"
                            @input="name = $event.target.value"
                        />
                    </template>
                    <template v-else>
                        <span class="as">
                            Commenting as
                            <b>{{ name }}</b>
                        </span>
                        <button type="button" class="change" @click="naming = true">Change name</button>
                    </template>
                </div>
                <textarea
                    ref="box"
                    v-model="draft"
                    rows="3"
                    maxlength="2000"
                    placeholder="Write a comment. Everyone with this link can read it."
                    @keydown.meta.enter.prevent="send"
                    @keydown.ctrl.enter.prevent="send"
                />
                <div class="actions">
                    <span class="error">{{ error }}</span>
                    <Btn small @click="collapse">Cancel</Btn>
                    <Btn kind="primary" small :busy="sending" :disabled="!draft.trim() || !name.trim()" @click="send">Send</Btn>
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

.who {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 20px;
}

.name {
    flex: 1;
}

.as {
    color: var(--text-3);
    font-size: 12.5px;
}

.as b {
    color: var(--text);
    font-weight: 500;
}

.change {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
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
