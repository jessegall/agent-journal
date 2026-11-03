<script setup>
import {MATCHES, PLACES} from "./triggerWords.js";
import TriggerTiles from "./TriggerTiles.vue";
import WatchedWords from "./WatchedWords.vue";

// the words a trigger watches for, where it looks and how they match
const phrases = defineModel("phrases", {type: Array, required: true});
const places = defineModel("places", {type: Array, required: true});
const match = defineModel("match", {type: String, required: true});
const togglePlace = (key) => (places.value = places.value.includes(key) ? places.value.filter((place) => place !== key) : [...places.value, key]);
</script>

<template>
    <div class="field"><span class="label">When these words appear</span><WatchedWords :words="phrases" @words="phrases = $event" /></div>
    <div class="field">
        <span class="label">Where to look</span>
        <template v-for="place in PLACES" :key="place.key">
            <label class="check"><input type="checkbox" :checked="places.includes(place.key)" :data-trigger-place="place.key" @change="togglePlace(place.key)">{{ place.label }}</label>
        </template>
    </div>
    <div class="field">
        <span class="label">How words match</span>
        <TriggerTiles v-model="match" :options="MATCHES" mark="trigger-match" />
    </div>
</template>

<style scoped src="./triggerForm.css"></style>
