<script setup>
import {computed} from "vue";
import {act} from "../api.js";
import {route} from "../route.js";
import {age, reload, rows} from "../store.js";
import Compose from "../chat/Compose.vue";

const props = defineProps({resource: Object, quote: {type: String, default: ""}});
const emit = defineEmits(["sent"]);
const thread = computed(() => rows("comment").filter((c) => c.refs.includes(props.resource.ref) && !c.deleted));

async function send(text) {
    const body = props.quote ? `> ${props.quote.replace(/\n/g, "\n> ")}\n\n${text}` : text;
    await act(route.value.env, props.resource.type, props.resource.n, "comment", {text: body});
    emit("sent");
    await reload();
}
</script>

<template>
    <section class="comments">
        <h3>Comments</h3>
        <template v-for="c in thread" :key="c.n">
            <div :class="['comment', c.seen[0]]">
                <span class="who">
                    {{ c.seen[0] }} · {{ age(c.created) }}
                    <template v-if="c.completed">
                        <span class="done">· handled: {{ c.outcome }}</span>
                    </template>
                </span>
                <span class="text">{{ c.brief }}</span>
            </div>
        </template>
    </section>
    <div class="comment-write">
        <Compose placeholder="Comment…" submit="Comment" :quote="quote" :send="send" />
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

.comment-write {
    position: sticky;
    bottom: 0;
    margin: 12px -20px 0;
    padding: 10px 20px 14px;
    background: var(--bg);
}
</style>
