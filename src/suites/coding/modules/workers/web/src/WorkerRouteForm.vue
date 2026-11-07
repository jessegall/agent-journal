<script setup>
import {ref} from "vue";
import {Btn} from "@journal/window-kit";
defineProps({programs: {type: Array, required: true}, tags: {type: Array, required: true}, disabled: Boolean});
const emit = defineEmits(["submit"]);
const selected = ref([]);
const program = ref("");
const tier = ref("");
const minimum = ref("");
const maximum = ref("");
const strict = ref(false);
function submit() {
    const line = ["worker-route", "make"];
    if (selected.value.length) line.push("--tags", selected.value.join(","));
    if (program.value) line.push("--program", program.value);
    if (tier.value) line.push("--tier", tier.value);
    if (minimum.value !== "") line.push("--complexity-from", String(minimum.value));
    if (maximum.value !== "") line.push("--complexity-to", String(maximum.value));
    if (strict.value) line.push("--strict");
    emit("submit", line);
}
</script>

<template>
    <form class="route-form" data-split-route-form @submit.prevent="submit">
        <h4>Add a route</h4>
        <label>Tags <select v-model="selected" multiple aria-label="Route tags" :disabled="disabled"><template v-for="tag in tags" :key="tag.word"><option :value="tag.word">{{ tag.word }}</option></template></select></label>
        <label>Complexity from <input v-model="minimum" type="number" min="1" max="5" aria-label="Complexity from" :disabled="disabled" /></label>
        <label>Complexity to <input v-model="maximum" type="number" min="1" max="5" aria-label="Complexity to" :disabled="disabled" /></label>
        <label>Program <select v-model="program" aria-label="Route program" :disabled="disabled"><option value="">Any program</option><template v-for="row in programs" :key="row.id"><option :value="row.id">{{ row.title }}</option></template></select></label>
        <label>Tier <select v-model="tier" aria-label="Route tier" :disabled="disabled"><option value="">Profile tier</option><option value="fast">Fast</option><option value="general">General</option><option value="strongest">Strongest</option></select></label>
        <label><input v-model="strict" type="checkbox" :disabled="disabled || !program" /> Wait for this program when it is out</label>
        <Btn type="submit" :disabled="disabled">Add route</Btn>
    </form>
</template>

<style scoped>
.route-form {display: flex; flex-direction: column; gap: 8px; margin-top: 12px;}
h4 {margin: 0;}
label {display: flex; align-items: center; gap: 8px;}
select, input[type=number] {min-width: 0; flex: 1; background: var(--bg); color: var(--text); border: 1px solid var(--border); padding: 4px;}
</style>
