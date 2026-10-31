<script setup>
import {nextTick} from "vue";
import Compose from "../chat/Compose.vue";
import {useCommenting} from "../composables/commenting.js";
import {withQuote} from "../format/quote.js";

const props = defineProps({resource: {type: Object, required: true}, quote: {type: String, default: ""}});
const emit = defineEmits(["sent"]);
const {notSaved, comment} = useCommenting(() => props.resource);

async function send(text) {
    const made = comment(withQuote(props.quote, text));
    emit("sent");
    await nextTick();
    document.querySelector(`[data-comment="${made.key}"]`)?.scrollIntoView({behavior: "smooth", block: "nearest"});
}
</script>

<template>
    <template v-if="notSaved">
        <p class="unsaved">Couldn't save the comment: {{ notSaved }}</p>
    </template>
    <div class="comment-write">
        <Compose
            :placeholder="quote ? 'Say something about this passage…' : 'Write a comment…'"
            submit="Comment"
            :quote="quote"
            :send="send"
            @unquote="emit('sent')"
        />
    </div>
</template>

<style scoped>
.unsaved {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}

.comment-write {
    position: sticky;
    bottom: 0;
    margin: 12px -16px 0;
    padding: 8px 16px 10px;
    background: var(--bg);
}

.comment-write :deep(textarea) {
    min-height: 34px;
    transition: min-height 0.15s ease-out;
}

.comment-write :deep(textarea:focus) {
    min-height: 74px;
}
</style>
