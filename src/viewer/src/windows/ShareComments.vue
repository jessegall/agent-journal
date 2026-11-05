<script setup>
import {onMounted, ref} from "vue";
import {transport} from "../api/transport.js";
import Btn from "../kit/Btn.vue";

const ROUTE = "/api/share/comments";

// what visitors wrote through this link, and a box to add a comment under a name of one's own
const rows = ref([]);
const name = ref("");
const text = ref("");
const failure = ref("");

async function take(answer) {
    const body = await answer.json();
    failure.value = answer.ok ? "" : body.error;
    if (answer.ok) rows.value = body.rows;
    return answer.ok;
}

async function send() {
    const sent = await take(await transport.raw(ROUTE, {method: "POST", body: JSON.stringify({name: name.value, text: text.value})}));
    if (sent) text.value = "";
}

onMounted(async () => take(await transport.raw(ROUTE)));
</script>

<template>
    <section class="share-comments" data-share-comments>
        <h2 class="share-comments-title">Comments</h2>
        <template v-for="row in rows" :key="row.id">
            <p class="share-comment" data-share-comment><strong>{{ row.visitor_name }}</strong> {{ row.text }}</p>
        </template>
        <form class="share-comment-form" data-share-comment-form @submit.prevent="send">
            <input v-model="name" maxlength="40" placeholder="Your name" aria-label="Your name" />
            <textarea v-model="text" maxlength="2000" placeholder="Write a comment" aria-label="Your comment"></textarea>
            <Btn variant="primary" type="submit" :disabled="!name.trim() || !text.trim()">Comment</Btn>
        </form>
        <template v-if="failure">
            <p class="share-comment-failure" role="alert" data-share-comment-failure>{{ failure }}</p>
        </template>
    </section>
</template>

<style scoped>
.share-comments {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
}

.share-comments-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
}

.share-comment {
    margin: 0;
    font-size: 13px;
    overflow-wrap: anywhere;
}

.share-comment-form {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
}

.share-comment-form input,
.share-comment-form textarea {
    width: 100%;
    max-width: 480px;
}

.share-comment-failure {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
