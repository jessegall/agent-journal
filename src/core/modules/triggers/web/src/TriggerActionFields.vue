<script setup>
import {computed} from "vue";
import {DropList} from "@journal/window-kit";
import {EXTRA_ACTIONS, doesOf} from "./triggerWords.js";
import TriggerListedField from "./TriggerListedField.vue";

// what a trigger does: its text to the agent first, then its extra actions in order
defineProps({choices: {type: Array, required: true}});
const action = defineModel("action", {type: String, required: true});
const text = defineModel("text", {type: String, required: true});
const extra = defineModel("extra", {type: Array, required: true});
const does = computed(() => doesOf(action.value));
const typeOf = (entry) => EXTRA_ACTIONS.find((type) => type.value === entry.type);
const changed = (position, target) => (extra.value = extra.value.map((entry, place) => (place === position ? {...entry, target} : entry)));
const removed = (position) => (extra.value = extra.value.filter((_, place) => place !== position));
const added = (type) => (extra.value = [...extra.value, {type: type.value, target: ""}]);
</script>

<template>
    <div class="block">
        <DropList :label="does.label" :items="choices" :picked="action" data-trigger-action @pick="action = $event.value" />
        <label class="field"><span class="label">{{ does.ask }}</span><textarea v-model="text" rows="2" :placeholder="does.example" data-trigger-text /></label>
    </div>
    <template v-for="(entry, position) in extra" :key="position">
        <TriggerListedField :model-value="entry.target" :label="typeOf(entry).ask" :example="typeOf(entry).example" @update:model-value="changed(position, $event)" @remove="removed(position)" />
    </template>
    <DropList label="Add another action" icon="plus" :items="EXTRA_ACTIONS" data-trigger-add-action @pick="added" />
</template>

<style scoped src="./triggerForm.css"></style>
