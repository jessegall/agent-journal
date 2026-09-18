<script setup>
import { computed } from "vue";

const props = defineProps({ spec: Object, env: String, current: String });
const items = computed(() => props.spec.priority.filter((t) => props.spec.types[t].nav));
</script>

<template>
  <nav class="side">
    <div class="env">{{ env }}</div>
    <a v-for="t in items" :key="t" :href="`#/${env}/${t}`" :class="['item', { on: t === current }]" :title="spec.types[t].abstract">
      {{ spec.types[t].title }}
    </a>
  </nav>
</template>

<style scoped>
.side { flex: none; width: 220px; padding: 14px 10px; background: var(--side); border-right: 1px solid var(--border); }
.env { padding: 6px 12px 14px; font-weight: 600; }
.item { display: block; padding: 6px 12px; border-radius: 7px; color: var(--text-2); }
.item:hover { background: var(--hover); color: var(--text); }
.item.on { background: var(--sel); color: var(--text); }
</style>
