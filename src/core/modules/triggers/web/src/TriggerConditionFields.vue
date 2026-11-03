<script setup>
import {DropList} from "@journal/window-kit";
import {CONDITION_TYPES} from "./triggerWords.js";
import TriggerListedField from "./TriggerListedField.vue";

// the conditions a trigger must pass before it acts
const conditions = defineModel({type: Array, required: true});
const typeOf = (condition) => CONDITION_TYPES.find((type) => type.value === condition.type);
const changed = (position, value) => (conditions.value = conditions.value.map((condition, place) => (place === position ? {...condition, value} : condition)));
const removed = (position) => (conditions.value = conditions.value.filter((_, place) => place !== position));
const added = (type) => (conditions.value = [...conditions.value, {type: type.value, value: ""}]);
</script>

<template>
    <template v-for="(condition, position) in conditions" :key="position">
        <TriggerListedField :model-value="condition.value" :label="typeOf(condition).label" :example="typeOf(condition).example" :choices="typeOf(condition).choices" @update:model-value="changed(position, $event)" @remove="removed(position)" />
    </template>
    <DropList label="Add a condition" icon="plus" :items="CONDITION_TYPES" data-trigger-add-condition @pick="added" />
</template>
