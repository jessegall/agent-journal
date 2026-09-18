<script setup>
import { computed, ref } from "vue";
import { act } from "../api.js";
import Btn from "../kit/Btn.vue";
import { route } from "../route.js";
import { reload, word } from "../store.js";

const props = defineProps({ resource: Object });
const own = ref("");
const options = computed(() => props.resource.data.options || []);
const pick = computed(() => props.resource.data.pick || 0);

async function answer(text) {
  await act(route.value.env, props.resource.type, props.resource.n, word(props.resource.type, "complete"), { how: text });
  await reload();
}
</script>

<template>
  <section class="options">
    <button v-for="(o, i) in options" :key="i" type="button" :class="['option', { picked: i + 1 === pick, chosen: resource.outcome === o.title }]" :disabled="!!resource.completed" @click="answer(o.title)">
      <span class="label">{{ o.title }}<span v-if="i + 1 === pick" class="pick">the agent's pick</span></span>
      <span v-if="o.description" class="desc">{{ o.description }}</span>
      <code v-if="o.code" class="code">{{ o.code }}</code>
    </button>
    <form v-if="!resource.completed" class="own" @submit.prevent="answer(own)">
      <input v-model="own" placeholder="Or answer in your own words…">
      <Btn kind="primary" small @click="answer(own)">{{ word(resource.type, "complete") }}</Btn>
    </form>
  </section>
</template>

<style scoped>
.options { display: flex; flex-direction: column; gap: 6px; margin: 12px 0; }
.option { display: flex; flex-direction: column; gap: 2px; padding: 9px 12px; border: 1px solid var(--border-2); border-radius: 8px; background: var(--raised); text-align: left; cursor: pointer; }
.option:hover:not(:disabled) { border-color: var(--accent); }
.option.picked { border-color: var(--accent-dim); }
.option.chosen { border-color: var(--good); }
.option:disabled { cursor: default; opacity: .7; }
.label { display: flex; justify-content: space-between; gap: 8px; }
.pick { color: var(--accent-text); font-size: 11.5px; }
.desc { color: var(--text-3); font-size: 12.5px; }
.code { font-family: ui-monospace, monospace; font-size: 12px; color: var(--text-2); white-space: pre-wrap; }
.own { display: flex; gap: 6px; }
.own input { flex: 1; padding: 6px 10px; border: 1px solid var(--border-2); border-radius: 7px; background: var(--bg); }
</style>
