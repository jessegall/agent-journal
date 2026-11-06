<script setup>
import {computed} from "vue";
import {DropList} from "@journal/window-kit";
import {EXTRA_ACTIONS, doesOf} from "./triggerWords.js";
import TriggerExtraAction from "./TriggerExtraAction.vue";

// what a trigger does: its text to the agent first, then its extra actions in order
defineProps({choices: {type: Array, required: true}});
const emit = defineEmits(["change-extra"]);
const action = defineModel("action", {type: String, required: true});
const skill = defineModel("skill", {type: String, default: ""});
const text = defineModel("text", {type: String, required: true});
const extra = defineModel("extra", {type: Array, required: true});
const does = computed(() => doesOf(action.value));
const removed = (position) => (extra.value = extra.value.filter((_, place) => place !== position));
const added = (type) => (extra.value = [...extra.value, {type: type.value, target: ""}]);
</script>

<template>
    <div class="block">
        <DropList :label="does.label" :items="choices" :picked="action" data-trigger-action @pick="action = $event.value" />
        <template v-if="action === 'skill'"><label class="field"><span class="label">Which skill the agent must read</span><input v-model="skill" placeholder="journal-plans" data-trigger-skill></label></template>
        <template v-else><label class="field"><span class="label">{{ does.ask }}</span><textarea v-model="text" rows="2" :placeholder="does.example" data-trigger-text /></label></template>
    </div>
    <template v-for="(entry, position) in extra" :key="position">
        <TriggerExtraAction :entry="entry" :position="position + 2" @change="emit('change-extra', position, $event)" @remove="removed(position)" />
    </template>
    <DropList label="Add another action" icon="plus" :items="EXTRA_ACTIONS" data-trigger-add-action @pick="added" />
</template>

<style scoped src="./triggerForm.css"></style>
