<script setup>
import { go, route } from "../route.js";
import ResourceRow from "./ResourceRow.vue";
defineProps({ groups: Array, type: String });
</script>

<template>
  <div v-for="g in groups" :key="g.key" class="group">
    <div class="ghead"><span class="gtitle">{{ g.title }}</span><span class="gcount">{{ g.list.length }}</span></div>
    <ResourceRow v-for="r in g.list" :key="r.n" :resource="r" :selected="r.n === route.n" @click="go(route.env, type, r.n)" />
  </div>
</template>

<style scoped>
.group { border-bottom: 1px solid var(--border); }
.ghead { display: flex; gap: 8px; padding: 10px 22px; color: var(--text-2); font-size: 13px; }
.gcount { color: var(--text-3); }
</style>
