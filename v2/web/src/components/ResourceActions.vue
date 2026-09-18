<script setup>
import { computed, ref } from "vue";
import { act } from "../api.js";

const props = defineProps({ spec: Object, env: String, resource: Object });
const emit = defineEmits(["changed"]);
const meta = computed(() => props.spec.types[props.resource.type]);
const error = ref("");
const named = (method) => meta.value.names[method] || method;
const offered = computed(() => (props.resource.completed ? ["delete"] : ["complete", "delete"]));

async function run(method) {
  error.value = "";
  try {
    await act(props.env, props.resource.type, props.resource.n, named(method));
    emit("changed");
  } catch (e) {
    error.value = e.message;
  }
}
</script>

<template>
  <div class="actions">
    <button v-for="m in offered" :key="m" type="button" :class="['btn', m]" @click="run(m)">{{ named(m) }}</button>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<style scoped>
.actions { display: flex; align-items: center; gap: 6px; margin: 8px 0; }
.btn { padding: 4px 11px; border: 1px solid var(--border-2); border-radius: 7px; background: transparent; color: var(--text-2); cursor: pointer; }
.btn:hover { background: var(--hover); color: var(--text); }
.btn.complete { border-color: var(--accent); color: var(--accent-text); }
.btn.delete:hover { color: var(--danger); }
.error { color: var(--danger); font-size: 12px; }
</style>
