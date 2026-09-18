<script setup>
import { computed } from "vue";
import ResourceActions from "./ResourceActions.vue";
import Sections from "./Sections.vue";

const props = defineProps({ spec: Object, env: String, resource: Object, document: Boolean });
const emit = defineEmits(["changed", "close"]);
const meta = computed(() => props.spec.types[props.resource.type]);
</script>

<template>
  <article class="body">
    <header class="top">
      <span class="kind">{{ meta.title }} {{ resource.n }}</span>
      <button type="button" class="close" @click="emit('close')" title="Close">×</button>
    </header>
    <h2 class="title">{{ resource.title }}</h2>
    <p v-if="resource.abstract" class="abstract">{{ resource.abstract }}</p>
    <ResourceActions :spec="spec" :env="env" :resource="resource" @changed="emit('changed')" />
    <div v-if="resource.brief" class="brief">{{ resource.brief }}</div>
    <Sections :sections="resource.sections" />
    <footer class="foot">
      <span>seen by {{ resource.seen.join(", ") || "nobody" }}</span>
      <span v-if="resource.refs.length">links: {{ resource.refs.join(", ") }}</span>
      <span v-if="resource.completed">{{ meta.names.complete || "completed" }}</span>
    </footer>
  </article>
</template>

<style scoped>
.body { padding: 18px 20px 30px; }
.top { display: flex; align-items: center; justify-content: space-between; color: var(--text-3); font-size: 11.5px; text-transform: uppercase; letter-spacing: .04em; }
.close { border: 0; background: none; color: var(--text-3); font-size: 18px; cursor: pointer; }
.close:hover { color: var(--text); }
.title { margin: 8px 0 4px; font-size: 18px; font-weight: 600; }
.abstract { margin: 0 0 12px; color: var(--text-2); }
.brief { margin: 14px 0; white-space: pre-wrap; color: var(--text-2); }
.foot { display: flex; gap: 14px; margin-top: 18px; color: var(--text-3); font-size: 11.5px; }
</style>
