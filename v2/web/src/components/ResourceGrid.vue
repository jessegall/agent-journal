<script setup>
import { computed, ref } from "vue";
import { create } from "../api.js";
import { go } from "../route.js";
import ResourceRow from "./ResourceRow.vue";

const props = defineProps({ spec: Object, env: String, type: String, rows: Array, selected: Number });
const emit = defineEmits(["changed"]);
const meta = computed(() => props.spec.types[props.type]);
const title = ref("");
const error = ref("");
const open = computed(() => props.rows.filter((r) => !r.completed));
const done = computed(() => props.rows.filter((r) => r.completed));

async function add() {
  error.value = "";
  try {
    const made = await create(props.env, props.type, { title: title.value });
    title.value = "";
    emit("changed");
    go(props.env, props.type, made.n);
  } catch (e) {
    error.value = e.message;
  }
}
</script>

<template>
  <section class="grid">
    <header class="head">
      <h1>{{ meta.title }}</h1>
      <p class="abstract">{{ meta.abstract }}</p>
    </header>
    <form class="add" @submit.prevent="add">
      <input v-model="title" :placeholder="`New ${meta.title.toLowerCase()}`" maxlength="80">
      <button type="submit">{{ meta.names.create || "create" }}</button>
      <span v-if="error" class="error">{{ error }}</span>
    </form>
    <div class="list">
      <ResourceRow v-for="r in open" :key="r.n" :resource="r" :selected="r.n === selected" @click="go(env, type, r.n)" />
    </div>
    <details v-if="done.length" class="done">
      <summary>{{ done.length }} {{ meta.names.complete || "completed" }}</summary>
      <div class="list">
        <ResourceRow v-for="r in done" :key="r.n" :resource="r" :selected="r.n === selected" @click="go(env, type, r.n)" />
      </div>
    </details>
  </section>
</template>

<style scoped>
.grid { padding: 22px 28px; max-width: 900px; }
.head h1 { margin: 0; font-size: 20px; font-weight: 600; }
.abstract { margin: 4px 0 16px; color: var(--text-3); }
.add { display: flex; gap: 8px; margin-bottom: 14px; }
.add input { flex: 1; padding: 8px 11px; border: 1px solid var(--border-2); border-radius: 8px; background: var(--raised); }
.add button { padding: 0 14px; border: 0; border-radius: 8px; background: var(--accent); color: #fff; cursor: pointer; }
.error { align-self: center; color: var(--danger); font-size: 12px; }
.list { display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: var(--raised); }
.done { margin-top: 14px; color: var(--text-3); }
.done summary { cursor: pointer; margin-bottom: 8px; }
</style>
