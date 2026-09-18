<script setup>
import { computed, ref } from "vue";
import { act } from "../api.js";
import Icon from "../kit/Icon.vue";
import { route } from "../route.js";
import { age, reload, rows } from "../store.js";

const FACES = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠"];
const props = defineProps({ message: Object });
const picking = ref(false);
const by = computed(() => props.message.seen[0]);
const replies = computed(() => rows("comment").filter((c) => c.refs.includes(props.message.ref) && !c.deleted));
const reactions = computed(() => {
  const faces = {};
  for (const r of rows("reaction").filter((r) => r.refs.includes(props.message.ref) && !r.deleted)) (faces[r.data.face] ||= []).push(r.seen[0]);
  return Object.entries(faces);
});

async function react(face) {
  picking.value = false;
  await act(route.value.env, "message", props.message.n, "react", { face });
  await reload();
}
</script>

<template>
  <article :class="['message', by]">
    <header class="head">
      <span class="who">{{ by === "agent" ? "Agent" : "You" }}</span>
      <span class="when">{{ age(message.created) }}</span>
      <span v-if="message.data.kind === 'transcript'" class="kind">transcript</span>
      <span v-if="message.completed" class="state"><Icon name="check" :size="12" /> processed</span>
    </header>
    <div class="text">{{ message.brief || message.title }}</div>
    <div v-for="s in message.sections" :key="s.title" class="part">
      <span class="pwords">“{{ s.title }}”</span><span class="became">→ {{ s.body }}</span>
    </div>
    <div v-for="r in replies" :key="r.n" class="reply">
      <span class="rwho">{{ r.seen[0] === "agent" ? "Agent" : "You" }} · {{ age(r.created) }}</span>
      <span class="rtext">{{ r.brief }}</span>
    </div>
    <footer class="foot">
      <button v-for="[face, who] in reactions" :key="face" type="button" :class="['face', { mine: who.includes('user') }]" :title="who.join(', ')" @click="react(face)">{{ face }} {{ who.length }}</button>
      <button type="button" class="add" @click="picking = !picking"><Icon name="smile" :size="14" /></button>
      <span v-if="picking" class="picker"><button v-for="f in FACES" :key="f" type="button" class="pick" @click="react(f)">{{ f }}</button></span>
    </footer>
  </article>
</template>

<style scoped>
.message { max-width: 760px; margin: 0 0 14px; padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; background: var(--raised); }
.message.agent { border-left: 2px solid var(--accent); }
.head { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; color: var(--text-3); font-size: 12px; }
.who { color: var(--text-2); font-weight: 500; }
.kind { color: var(--accent-text); }
.state { display: inline-flex; align-items: center; gap: 4px; color: var(--good); }
.text { white-space: pre-wrap; }
.part { display: flex; gap: 8px; margin-top: 6px; padding-left: 10px; border-left: 2px solid var(--border-2); color: var(--text-3); font-size: 12.5px; }
.pwords { color: var(--text-2); }
.reply { display: flex; flex-direction: column; margin-top: 8px; padding: 8px 10px; border-radius: 8px; background: var(--bg); }
.rwho { color: var(--text-3); font-size: 11.5px; }
.rtext { white-space: pre-wrap; color: var(--text-2); }
.foot { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
.face { padding: 1px 7px; border: 1px solid var(--border-2); border-radius: 999px; background: none; font-size: 12px; cursor: pointer; }
.face.mine { border-color: var(--accent); }
.add { border: 0; background: none; color: var(--text-3); cursor: pointer; display: inline-flex; }
.picker { display: inline-flex; gap: 2px; padding: 2px 6px; border: 1px solid var(--border-2); border-radius: 999px; background: var(--bg); }
.pick { border: 0; background: none; cursor: pointer; font-size: 14px; }
</style>
