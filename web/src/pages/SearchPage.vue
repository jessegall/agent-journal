<script setup>
import { ref, watch } from "vue";
import { search as find } from "../api.js";
import Icon from "../kit/Icon.vue";
import { go, route } from "../route.js";
import ResourceCard from "../resource/ResourceCard.vue";

const q = ref(route.value.q);
const hits = ref([]);

async function run() {
  go(route.value.env, "search", 0, q.value);
  hits.value = q.value.trim() ? await find(route.value.env, q.value.trim()) : [];
}
watch(() => route.value.q, (v) => { q.value = v; if (v) run(); }, { immediate: true });
</script>

<template>
  <section class="search">
    <form class="box" @submit.prevent="run">
      <Icon name="search" />
      <input v-model="q" placeholder="Search everything on this environment…" autofocus>
    </form>
    <p v-if="route.q && !hits.length" class="empty">Nothing matches “{{ route.q }}”.</p>
    <div class="cards"><ResourceCard v-for="r in hits" :key="r.ref" :resource="r" @click="go(route.env, r.type, r.n)" /></div>
  </section>
</template>

<style scoped>
.search { padding: 18px 22px; }
.box { display: flex; align-items: center; gap: 10px; max-width: 720px; padding: 10px 14px; border: 1px solid var(--border-2); border-radius: 10px; background: var(--raised); color: var(--text-3); }
.box input { flex: 1; border: 0; background: none; outline: none; color: var(--text); }
.empty { margin: 16px 0; color: var(--text-3); }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; margin-top: 18px; }
</style>
