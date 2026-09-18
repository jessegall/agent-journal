<script setup>
import { computed, ref } from "vue";
import { act } from "../api.js";
import Btn from "../kit/Btn.vue";
import { route } from "../route.js";
import { age, reload, rows } from "../store.js";

const props = defineProps({ resource: Object });
const text = ref("");
const thread = computed(() => rows("comment").filter((c) => c.refs.includes(props.resource.ref) && !c.deleted));

async function send() {
  if (!text.value.trim()) return;
  await act(route.value.env, props.resource.type, props.resource.n, "comment", { text: text.value });
  text.value = "";
  await reload();
}
</script>

<template>
  <section class="comments">
    <h3>Comments</h3>
    <div v-for="c in thread" :key="c.n" :class="['comment', c.seen[0]]">
      <span class="who">{{ c.seen[0] }} · {{ age(c.created) }}<span v-if="c.completed" class="done"> · handled: {{ c.outcome }}</span></span>
      <span class="text">{{ c.brief }}</span>
    </div>
    <form class="write" @submit.prevent="send">
      <textarea v-model="text" rows="2" placeholder="Comment…" @keydown.meta.enter="send" />
      <Btn kind="primary" small @click="send">Comment</Btn>
    </form>
  </section>
</template>

<style scoped>
.comments { margin-top: 20px; }
h3 { margin: 0 0 6px; font-size: 12px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: .04em; }
.comment { display: flex; flex-direction: column; gap: 2px; padding: 8px 12px; margin-bottom: 6px; border-radius: 8px; background: var(--raised); }
.comment.agent { border-left: 2px solid var(--accent); }
.who { color: var(--text-3); font-size: 11.5px; }
.done { color: var(--good); }
.text { white-space: pre-wrap; color: var(--text-2); }
.write { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
textarea { width: 100%; padding: 8px 11px; border: 1px solid var(--border-2); border-radius: 8px; background: var(--raised); resize: vertical; }
</style>
