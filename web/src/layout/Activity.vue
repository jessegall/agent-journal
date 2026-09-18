<script setup>
import { computed } from "vue";
import { go, route } from "../route.js";
import { age, byRef, meta, store, word } from "../store.js";

const quiet = ["agent", "nudge", "notification"];
const shown = computed(() => [...store.events].reverse().filter((e) => !quiet.includes(e.type)).slice(0, 80));
const verbs = { created: "New", updated: "Updated", deleted: "Deleted", linked: "Linked", commented: "Commented on" };
const verb = (e) => (e.action === "completed" ? `${meta(e.type).title} ${word(e.type, "complete")}` : `${verbs[e.action]} ${meta(e.type).title.toLowerCase()}`);
const title = (e) => (byRef(`${e.type}:${e.n}`) || {}).title || "";
</script>

<template>
  <aside class="activity">
    <header class="head">Activity</header>
    <div class="list">
      <button v-for="e in shown" :key="e.id" type="button" class="event" @click="go(route.env, e.type, e.n)">
        <span class="line"><span class="verb">{{ verb(e) }}</span><span class="n">· {{ e.n }}</span></span>
        <span v-if="title(e)" class="title">{{ title(e) }}</span>
        <span class="who">{{ e.actor[0].toUpperCase() + e.actor.slice(1) }} · {{ age(e.at) }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.activity { flex: none; width: 290px; display: flex; flex-direction: column; border-left: 1px solid var(--border); background: var(--side); }
.head { flex: none; height: 52px; padding: 0 18px; line-height: 52px; border-bottom: 1px solid var(--border); font-weight: 500; }
.list { flex: 1; overflow: auto; padding: 8px 0; }
.event { display: flex; flex-direction: column; gap: 2px; width: 100%; padding: 8px 18px; border: 0; background: none; color: var(--text-2); text-align: left; cursor: pointer; }
.event:hover { background: var(--hover); }
.line { display: flex; gap: 6px; }
.verb { color: var(--text); }
.n { color: var(--text-3); }
.title { color: var(--text-2); }
.who { color: var(--text-3); font-size: 12px; }
</style>
