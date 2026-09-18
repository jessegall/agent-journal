<script setup>
import {computed} from "vue";
import {act} from "../api.js";
import {route} from "../route.js";
import {age, quoted, rows, withQuote} from "../store.js";
import Compose from "../chat/Compose.vue";

const props = defineProps({resource: Object, quote: {type: String, default: ""}});
const emit = defineEmits(["sent"]);
const thread = computed(() =>
    rows("comment")
        .filter((c) => c.refs.includes(props.resource.ref) && !c.deleted)
        .map((c) => ({...c, ...quoted(c.brief)}))
);

async function send(text) {
    await act(route.value.env, props.resource.type, props.resource.n, "comment", {text: withQuote(props.quote, text)});
    emit("sent");
}
</script>

<template>
    <section class="comments">
        <template v-if="thread.length">
            <h3>Comments</h3>
        </template>
        <template v-else>
            <p class="none">No comments yet.</p>
        </template>
        <template v-for="c in thread" :key="c.n">
            <div :class="['comment', c.seen[0]]">
                <span class="who">
                    {{ c.seen[0] }} · {{ age(c.created) }}
                    <template v-if="c.completed">
                        <span class="done">· handled: {{ c.outcome }}</span>
                    </template>
                </span>
                <template v-if="c.quote">
                    <span class="quoted">{{ c.quote }}</span>
                </template>
                <span class="text">{{ c.text }}</span>
            </div>
        </template>
    </section>
    <div class="comment-write">
        <Compose placeholder="Comment…" submit="Comment" :quote="quote" :send="send" @unquote="emit('sent')" />
    </div>
</template>

<style scoped>
.comments {
    margin-top: 20px;
}

h3 {
    margin: 0 0 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.comment {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 12px;
    margin-bottom: 6px;
    border-radius: 8px;
    background: var(--raised);
}

.comment.agent {
    border-left: 2px solid var(--accent);
}

.who {
    color: var(--text-3);
    font-size: 11.5px;
}

.done {
    color: var(--good);
}

.text {
    white-space: pre-wrap;
    color: var(--text-2);
}

.quoted {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin: 2px 0 6px;
    padding: 2px 0 2px 9px;
    border-left: 2px solid var(--accent);
    white-space: pre-wrap;
    color: var(--text-3);
    font-size: 12px;
}

.comment-write {
    position: sticky;
    bottom: 0;
    margin: 12px -20px 0;
    padding: 10px 20px 14px;
    background: var(--bg);
}
</style>
