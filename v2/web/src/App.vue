<script setup>
import { onMounted, ref, watch } from "vue";
import { all, manifest, show } from "./api.js";
import { go, route } from "./route.js";
import Sidebar from "./components/Sidebar.vue";
import ResourceGrid from "./components/ResourceGrid.vue";
import Reader from "./components/Reader.vue";

const spec = ref(null);
const rows = ref([]);
const one = ref(null);
const error = ref("");

async function load() {
  error.value = "";
  const { env, type, n } = route.value;
  if (!spec.value || !type) return;
  try {
    rows.value = await all(env, type);
    one.value = n ? await show(env, type, n) : null;
  } catch (e) {
    error.value = e.message;
  }
}

onMounted(async () => {
  spec.value = await manifest();
  if (!route.value.type) go(route.value.env, spec.value.priority.find((t) => spec.value.types[t].nav));
  await load();
});
watch(route, load);
</script>

<template>
  <div class="app" v-if="spec">
    <Sidebar :spec="spec" :env="route.env" :current="route.type" />
    <main class="main">
      <ResourceGrid v-if="route.type" :spec="spec" :env="route.env" :type="route.type" :rows="rows" :selected="route.n" @changed="load" />
      <p v-if="error" class="error">{{ error }}</p>
    </main>
    <Reader v-if="one" :spec="spec" :env="route.env" :resource="one" @changed="load" @close="go(route.env, route.type)" />
  </div>
</template>

<style scoped>
.app { display: flex; height: 100%; }
.main { flex: 1; min-width: 0; overflow: auto; }
.error { margin: 16px 24px; color: var(--danger); }
</style>
