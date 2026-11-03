<script setup>
import {computed} from "vue";
import {DropList} from "@journal/window-kit";
import {EXTRA_ACTIONS, doesOf} from "./triggerWords.js";
import TriggerExtraAction from "./TriggerExtraAction.vue";

// what a trigger does: its text to the agent first, then its extra actions in order
defineProps({choices: {type: Array, required: true}});
const action = defineModel("action", {type: String, required: true});
const text = defineModel("text", {type: String, required: true});
const extra = defineModel("extra", {type: Array, required: true});
const does = computed(() => doesOf(action.value));
const changed = (position, value) => (extra.value = extra.value.map((entry, place) => (place === position ? value : entry)));
const removed = (position) => (extra.value = extra.value.filter((_, place) => place !== position));
const added = (type) => (extra.value = [...extra.value, {type: type.value, target: ""}]);
</script>

<template>
    <div class="block">
        <DropList :label="does.label" :items="choices" :picked="action" data-trigger-action @pick="action = $event.value" />
        <label class="field"><span class="label">{{ does.ask }}</span><textarea v-model="text" rows="2" :placeholder="does.example" data-trigger-text /></label>
    </div>
    <template v-for="(entry, position) in extra" :key="position">
        <TriggerExtraAction :model-value="entry" :position="position + 2" @update:model-value="changed(position, $event)" @remove="removed(position)" />
    </template>
    <DropList label="Add another action" icon="plus" :items="EXTRA_ACTIONS" data-trigger-add-action @pick="added" />
</template>

<style scoped src="./triggerForm.css"></style>
