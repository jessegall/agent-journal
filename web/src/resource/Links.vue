<script setup>
import { computed } from "vue";
import { go, route } from "../route.js";
import { byRef, linkedTo, meta } from "../store.js";

const props = defineProps({ resource: Object });
const shown = computed(() => props.resource.refs.filter((r) => !meta(r.split(":")[0]).mirror));
const back = computed(() => linkedTo(props.resource.ref).filter((r) => !meta(r.type).mirror).map((r) => r.ref));
const name = (ref) => {
  const [t, n] = ref.split(":");
  const r = byRef(ref);
  return `${meta(t).title} ${n}${r ? ` — ${r.title}` : ""}`;
};
const open = (ref) => {
  const [t, n] = ref.split(":");
  go(route.value.env, t, Number(n));
};
</script>

<template>
  <section v-if="shown.length || back.length" class="links">
    <h3>Links</h3>
    <button v-for="r in shown" :key="r" type="button" class="link" @click="open(r)">→ {{ name(r) }}</button>
    <button v-for="r in back" :key="`b${r}`" type="button" class="link" @click="open(r)">← {{ name(r) }}</button>
  </section>
</template>

<style scoped>
.links { margin-top: 16px; }
h3 { margin: 0 0 4px; font-size: 12px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: .04em; }
.link { display: block; padding: 2px 0; border: 0; background: none; color: var(--accent-text); text-align: left; cursor: pointer; }
</style>
