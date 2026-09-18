<script setup>
import { computed, ref } from "vue";
import { create } from "../api.js";
import Icon from "../kit/Icon.vue";
import { go, route } from "../route.js";
import { load, navTypes, open, rows, store } from "../store.js";

const envs = computed(() => rows("environment").filter((e) => !e.completed));
const adding = ref(false);
const name = ref("");

async function addEnv() {
  if (!name.value.trim()) return;
  await create(route.value.env, "environment", { title: name.value.trim() });
  name.value = "";
  adding.value = false;
  await load("environment");
}
</script>

<template>
  <nav class="side">
    <div class="project">
      <span class="mark">{{ route.env[0].toUpperCase() }}</span>
      <span class="name">{{ route.env }}</span>
    </div>
    <div class="section">Environment</div>
    <a :class="['item', { on: !route.page }]" :href="`#/${route.env}`"><Icon name="home" /><span>Home</span></a>
    <a v-for="t in navTypes('environment')" :key="t.name" :class="['item', { on: route.page === t.name }]" :href="`#/${route.env}/${t.name}`">
      <Icon :name="t.icon" /><span>{{ t.title }}s</span><b v-if="open(t.name).length">{{ open(t.name).length }}</b>
    </a>
    <a :class="['item', { on: route.page === 'settings' }]" :href="`#/${route.env}/settings`"><Icon name="settings" /><span>Settings</span></a>
    <div class="section">Project</div>
    <a v-for="t in navTypes('project')" :key="t.name" :class="['item', { on: route.page === t.name }]" :href="`#/${route.env}/${t.name}`">
      <Icon :name="t.icon" /><span>{{ t.title }}s</span><b v-if="open(t.name).length">{{ open(t.name).length }}</b>
    </a>
    <div class="section">Environments</div>
    <a v-for="e in envs" :key="e.n" :class="['item', { on: e.title === route.env }]" :href="`#/${e.title}`"><Icon name="dot" /><span>{{ e.title }}</span></a>
    <form v-if="adding" class="add" @submit.prevent="addEnv"><input v-model="name" placeholder="Name" autofocus @keydown.esc="adding = false"></form>
    <button v-else type="button" class="item plain" @click="adding = true"><Icon name="plus" /><span>New environment</span></button>
    <div class="foot">Agent journal v2</div>
  </nav>
</template>

<style scoped>
.side { flex: none; width: 236px; display: flex; flex-direction: column; padding: 14px 10px; overflow: auto; background: var(--side); border-right: 1px solid var(--border); }
.project { display: flex; align-items: center; gap: 10px; margin: 0 0 14px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--raised); font-weight: 600; }
.mark { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 6px; background: var(--sel); font-size: 11px; color: var(--text-2); }
.name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.section { margin: 14px 12px 6px; color: var(--text-3); font-size: 12px; }
.item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 6px 12px; border: 0; border-radius: 7px; background: none; color: var(--text-2); text-align: left; }
.item:hover { background: var(--hover); color: var(--text); }
.item.on { background: var(--sel); color: var(--text); }
.item span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.item b { font-weight: 500; color: var(--text-3); font-size: 12px; }
.plain { cursor: pointer; }
.add input { width: 100%; padding: 6px 10px; border: 1px solid var(--border-2); border-radius: 7px; background: var(--raised); }
.foot { margin-top: auto; padding: 14px 12px 0; color: var(--text-3); font-size: 11.5px; }
</style>
