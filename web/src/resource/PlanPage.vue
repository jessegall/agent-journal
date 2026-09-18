<script setup>
import { computed, ref } from "vue";
import { act } from "../api.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import { go, route } from "../route.js";
import { reload, rows } from "../store.js";
import Comments from "./Comments.vue";

const props = defineProps({ resource: Object });
const emit = defineEmits(["close"]);
const error = ref("");
const status = computed(() => props.resource.data.status);
const current = computed(() => props.resource.data.current || 1);
const phases = computed(() => props.resource.data.phases.map((p, i) => ({ ...p, i: i + 1, rows: p.todos.map((n) => rows("todo").find((t) => t.n === n)).filter(Boolean) })));
const done = (p) => p.rows.length > 0 && p.rows.every((t) => t.completed);
const button = computed(() => ({ draft: ["activate", "Start"], ready: ["activate", "Start"], waiting: ["continue", "Continue"], done: ["acknowledge", "Acknowledge"] }[status.value] || null));

async function run(action, body = {}) {
  error.value = "";
  try {
    await act(route.value.env, "plan", props.resource.n, action, body);
    await reload();
  } catch (e) {
    error.value = e.message;
  }
}
</script>

<template>
  <article class="body plan">
    <header class="top">
      <span class="kind"><Icon name="flag" :size="13" /> Plan {{ resource.n }}</span>
      <span :class="['status', status]">{{ status }}<template v-if="status === 'active' || status === 'waiting'"> · phase {{ current }} of {{ phases.length }}</template></span>
      <span class="grow" />
      <Btn kind="icon" @click="emit('close')"><Icon name="x" /></Btn>
    </header>
    <h2 class="title">{{ resource.title }}</h2>
    <p v-if="resource.data.goal" class="goal">{{ resource.data.goal }}</p>
    <div class="actions">
      <Btn v-if="button" kind="primary" @click="run(button[0])">{{ button[1] }}</Btn>
      <Btn v-if="!['done', 'abandoned'].includes(status)" kind="danger" @click="run('abandon', { why: 'stopped from the viewer' })">Abandon</Btn>
      <span class="error">{{ error }}</span>
    </div>
    <div v-if="resource.brief" class="brief">{{ resource.brief }}</div>
    <ol class="phases">
      <li v-for="p in phases" :key="p.i" :class="['phase', { current: p.i === current && (status === 'active' || status === 'waiting'), done: done(p) }]">
        <div class="phead">
          <span class="mark"><Icon :name="done(p) ? 'check' : 'circle'" :size="14" /></span>
          <span class="ptitle">{{ p.i }}. {{ p.title }}</span>
          <span v-if="p.checkpoint" class="cp">checkpoint</span>
          <span class="progress">{{ p.rows.filter((t) => t.completed).length }}/{{ p.rows.length }}</span>
        </div>
        <div v-if="p.when" class="when">complete when {{ p.when }}</div>
        <button v-for="t in p.rows" :key="t.n" type="button" :class="['row', { completed: t.completed }]" @click="go(route.env, 'todo', t.n)">
          <Icon :name="t.completed ? 'check' : 'circle'" :size="12" /><span class="rn">#{{ t.n }}</span><span class="rt">{{ t.title }}</span>
        </button>
      </li>
    </ol>
    <Comments :resource="resource" />
  </article>
</template>

<style scoped>
.top { display: flex; align-items: center; gap: 12px; color: var(--text-3); font-size: 11.5px; text-transform: uppercase; letter-spacing: .04em; }
.kind { display: inline-flex; align-items: center; gap: 6px; color: var(--accent-text); }
.status { color: var(--text-2); }
.status.active { color: var(--good); }
.status.waiting { color: var(--warn); }
.grow { flex: 1; }
.title { margin: 10px 0 4px; font-size: 22px; font-weight: 600; }
.goal { margin: 0 0 10px; color: var(--text-2); }
.actions { display: flex; align-items: center; gap: 8px; margin: 8px 0 16px; }
.error { color: var(--danger); font-size: 12px; }
.brief { margin: 0 0 20px; white-space: pre-wrap; color: var(--text-2); }
.phases { list-style: none; margin: 0; padding: 0; }
.phase { padding: 10px 14px; margin-bottom: 8px; border: 1px solid var(--border); border-radius: 10px; background: var(--raised); }
.phase.current { border-color: var(--accent); }
.phase.done { opacity: .7; }
.phead { display: flex; align-items: center; gap: 10px; }
.mark { color: var(--accent-text); display: inline-flex; }
.ptitle { flex: 1; font-weight: 500; }
.cp { color: var(--warn); font-size: 11.5px; }
.progress { color: var(--text-3); font-size: 12px; }
.when { margin: 2px 0 6px 24px; color: var(--text-3); font-size: 12.5px; }
.row { display: flex; align-items: center; gap: 8px; width: 100%; padding: 4px 0 4px 24px; border: 0; background: none; color: var(--text-2); text-align: left; cursor: pointer; }
.row:hover { color: var(--text); }
.row.completed .rt { text-decoration: line-through; color: var(--text-3); }
.rn { color: var(--text-3); font-size: 12px; }
</style>
