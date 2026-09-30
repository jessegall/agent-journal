<script setup>
import {computed, nextTick, onMounted, ref} from "vue";
import PhoneSheet from "./PhoneSheet.vue";

defineProps({title: {type: String, required: true}});
const emit = defineEmits(["close", "send"]);
const words = ref("");
const box = ref(null);
const ready = computed(() => Boolean(words.value.trim()));

onMounted(() => nextTick(() => box.value?.focus({preventScroll: true})));

function send(close) {
    if (!ready.value) return;
    emit("send", words.value.trim());
    box.value?.blur();
    close();
}
</script>

<template>
    <PhoneSheet v-slot="{close}" label="Comment" @close="emit('close')">
        <h2 class="comment-title">Comment on “{{ title }}”</h2>
        <form class="comment-card" @submit.prevent="send(close)">
            <label class="phone-hidden" for="phone-comment">Your comment</label>
            <textarea id="phone-comment" ref="box" v-model="words" class="comment-words" rows="4" placeholder="Write a comment" />
            <div class="comment-controls">
                <button type="button" class="comment-cancel" @click="close">Cancel</button>
                <button type="submit" class="comment-send" :disabled="!ready">Comment</button>
            </div>
        </form>
    </PhoneSheet>
</template>

<style scoped>
.comment-title {
    margin: 4px 0 12px;
    overflow: hidden;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.comment-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 10px 10px;
    border: 1px solid var(--border-2);
    border-radius: 26px;
    background: var(--bg);
}

.comment-words {
    width: 100%;
    min-height: 96px;
    max-height: 40vh;
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

.comment-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.comment-cancel,
.comment-send {
    min-height: 44px;
    padding: 0 18px;
    border: 0;
    border-radius: 22px;
    font: inherit;
    font-weight: 600;
}

.comment-cancel {
    background: none;
    color: var(--text-2);
}

.comment-send {
    background: var(--accent);
    color: #fff;
}

.comment-send:disabled {
    opacity: 0.5;
}
</style>
