<script setup>
import {computed, ref} from "vue";
import {sendComment} from "../api/shared.js";
import Btn from "../kit/Btn.vue";
import TextInput from "../kit/TextInput.vue";
import {remember, remembered} from "../composables/remembered.js";
import {age} from "../format/time.js";

const NAME_KEY = "shared-comment-name";
const props = defineProps({about: {type: String, required: true}, comments: {type: Array, default: () => []}});
const name = ref(remembered(NAME_KEY, ""));
const naming = ref(!name.value);
const draft = ref("");
const sending = ref(false);
const error = ref("");
const sent = ref([]);
const shown = computed(() =>
    [...props.comments, ...sent.value.filter((c) => !props.comments.some((known) => known.n === c.n))]
        .filter((c) => c.about === props.about)
        .sort((a, b) => a.created - b.created)
);

async function send() {
    const text = draft.value.trim();
    if (!text || !name.value.trim() || sending.value) return;
    error.value = "";
    sending.value = true;
    const waiting = {n: -Date.now(), about: props.about, name: name.value.trim(), text, created: Date.now() / 1000, waiting: true};
    sent.value = [...sent.value, waiting];
    draft.value = "";
    try {
        const made = await sendComment(props.about, name.value.trim(), text);
        remember(NAME_KEY, made.name);
        name.value = made.name;
        naming.value = false;
        sent.value = sent.value.map((c) => (c.n === waiting.n ? made : c));
    } catch (e) {
        sent.value = sent.value.filter((c) => c.n !== waiting.n);
        draft.value = text;
        error.value = e.message;
    } finally {
        sending.value = false;
    }
}
</script>

<template>
    <div class="body">
        <section class="share-comments" aria-label="Comments">
            <h2 class="heading">Comments</h2>
            <template v-for="c in shown" :key="c.n">
                <article :class="['comment', {waiting: c.waiting}]">
                    <header class="who">
                        <span class="mark">{{ c.name.slice(0, 1) }}</span>
                        <span class="name">{{ c.name }}</span>
                        <span class="when">{{ c.waiting ? "sending" : age(c.created) }}</span>
                    </header>
                    <p class="text">{{ c.text }}</p>
                </article>
            </template>
            <form class="write" @submit.prevent="send">
                <template v-if="naming">
                    <TextInput
                        :value="name"
                        label="Your name"
                        maxlength="40"
                        autocomplete="name"
                        placeholder="Shown with your comment"
                        @input="name = $event.target.value"
                    />
                </template>
                <template v-else>
                    <p class="as">
                        Commenting as {{ name }}
                        <button type="button" class="change" @click="naming = true">Change</button>
                    </p>
                </template>
                <textarea v-model="draft" rows="3" maxlength="2000" placeholder="Leave a comment" @keydown.meta.enter.prevent="send" />
                <div class="actions">
                    <span class="error">{{ error }}</span>
                    <Btn kind="primary" small :busy="sending" :disabled="!draft.trim() || !name.trim()" @click="send">Send</Btn>
                </div>
            </form>
        </section>
    </div>
</template>

<style scoped>
.share-comments {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
}

.heading {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
    font-weight: 600;
}

.comment {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.comment.waiting {
    opacity: 0.6;
}

.who {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
}

.mark {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--raised);
    color: var(--text-2);
    font-size: 11px;
    text-transform: uppercase;
}

.name {
    color: var(--text);
    font-weight: 500;
}

.when {
    color: var(--text-3);
}

.text {
    margin: 0 0 0 28px;
    color: var(--text);
    font-size: 14px;
    line-height: 1.55;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.write {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.as {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.change {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
}

textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    font-size: 14px;
    resize: vertical;
}

textarea:focus {
    border-color: var(--accent);
    outline: none;
}

.actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.error {
    flex: 1;
    color: var(--danger);
    font-size: 12px;
}
</style>
